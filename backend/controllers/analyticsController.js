const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Grade = require('../models/Grade');
const Article = require('../models/Article');
const Analytics = require('../models/Analytics');
const { validationResult } = require('express-validator');

// @desc    Generate comprehensive analytics
// @route   GET /api/analytics/overview
// @access  Private (Admin)
const getOverviewAnalytics = async (req, res) => {
  try {
    const period = req.query.period || 'monthly';
    
    // Get user statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const activeUsers = await User.countDocuments({ 
      isActive: true, 
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Get course statistics
    const totalCourses = await Course.countDocuments({ isActive: true });
    const activeCourses = await Course.countDocuments({ 
      isActive: true,
      semester: req.query.semester || 'first'
    });
    
    const courseStats = await Course.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        totalEnrollments: { $sum: { $size: '$enrolledStudents' } },
        averageEnrollment: { $avg: { $size: '$enrolledStudents' } },
        maxEnrollment: { $max: { $size: '$enrolledStudents' } }
      }}
    ]);

    // Get grade statistics
    const gradeStats = await Grade.aggregate([
      { $group: {
        _id: null,
        averageGrade: { $avg: '$total' },
        gradeDistribution: {
          $push: '$grade'
        }
      }}
    ]);

    // Get assignment statistics
    const assignmentStats = await Assignment.aggregate([
      { $match: { isActive: true } },
      { $group: {
        _id: null,
        totalAssignments: { $sum: 1 },
        totalSubmissions: { $sum: { $size: '$submissions' } },
        averageSubmissions: { $avg: { $size: '$submissions' } }
      }}
    ]);

    // Calculate grade distribution
    const gradeDistribution = gradeStats.length > 0 ? 
      gradeStats[0].gradeDistribution.reduce((acc, grade) => {
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
      }, {}) : {};

    // Get recent activity
    const recentLogins = await User.find({ lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      .sort({ lastLogin: -1 })
      .limit(10)
      .select('fullName email role lastLogin');

    const recentRegistrations = await User.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('fullName email role createdAt');

    const recentAssignments = await Assignment.find({ createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('courseId', 'courseCode title')
      .populate('lecturerId', 'fullName');

    res.status(200).json({
      success: true,
      analytics: {
        userStats: {
          total: totalUsers,
          active: activeUsers,
          byRole: usersByRole.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        courseStats: {
          total: totalCourses,
          active: activeCourses,
          enrollments: courseStats[0] || { totalEnrollments: 0, averageEnrollment: 0, maxEnrollment: 0 }
        },
        gradeStats: {
          average: gradeStats[0]?.averageGrade || 0,
          distribution: gradeDistribution
        },
        assignmentStats: assignmentStats[0] || { totalAssignments: 0, totalSubmissions: 0, averageSubmissions: 0 },
        recentActivity: {
          logins: recentLogins,
          registrations: recentRegistrations,
          assignments: recentAssignments
        }
      }
    });
  } catch (error) {
    console.error('Get overview analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get lecturer-specific analytics
// @route   GET /api/analytics/lecturer
// @access  Private (Lecturer)
const getLecturerAnalytics = async (req, res) => {
  try {
    const lecturerId = req.user.id;

    // Get lecturer's courses
    const courses = await Course.find({ lecturerId, isActive: true })
      .populate('enrolledStudents.student', 'fullName email');

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0);

    // Get assignments for lecturer's courses
    const assignments = await Assignment.find({ 
      lecturerId, 
      isActive: true 
    })
      .populate('courseId', 'courseCode title')
      .populate('submissions.student', 'fullName email');

    const totalAssignments = assignments.length;
    const totalSubmissions = assignments.reduce((acc, assignment) => acc + assignment.submissions.length, 0);
    const gradedSubmissions = assignments.reduce((acc, assignment) => 
      acc + assignment.submissions.filter(sub => sub.status === 'graded').length, 0);

    // Get grades for lecturer's courses
    const grades = await Grade.find({ 
      lecturerId,
      semester: req.query.semester || 'first'
    });

    const averageGrade = grades.length > 0 ? 
      grades.reduce((acc, grade) => acc + grade.total, 0) / grades.length : 0;

    const gradeDistribution = grades.reduce((acc, grade) => {
      acc[grade.grade] = (acc[grade.grade] || 0) + 1;
      return acc;
    }, {});

    // Course performance
    const coursePerformance = courses.map(course => {
      const courseGrades = grades.filter(grade => grade.courseId.toString() === course._id.toString());
      const courseAverage = courseGrades.length > 0 ? 
        courseGrades.reduce((acc, grade) => acc + grade.total, 0) / courseGrades.length : 0;
      
      return {
        course: {
          id: course._id,
          code: course.courseCode,
          title: course.title
        },
        enrolledStudents: course.enrolledStudents.length,
        averageGrade: courseAverage,
        gradeDistribution: courseGrades.reduce((acc, grade) => {
          acc[grade.grade] = (acc[grade.grade] || 0) + 1;
          return acc;
        }, {})
      };
    });

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalCourses,
          totalStudents,
          totalAssignments,
          totalSubmissions,
          gradedSubmissions,
          gradingRate: totalSubmissions > 0 ? (gradedSubmissions / totalSubmissions) * 100 : 0
        },
        performance: {
          averageGrade,
          gradeDistribution
        },
        courses: coursePerformance
      }
    });
  } catch (error) {
    console.error('Get lecturer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get student-specific analytics
// @route   GET /api/analytics/student
// @access  Private (Student)
const getStudentAnalytics = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Get student's registered courses
    const student = await User.findById(studentId).populate('registeredCourses');
    const courses = student.registerCourses;

    // Get student's grades
    const grades = await Grade.find({ 
      studentId,
      semester: req.query.semester || 'first'
    })
      .populate('courseId', 'courseCode title')
      .populate('lecturerId', 'fullName');

    // Calculate GPA
    const totalGradePoints = grades.reduce((acc, grade) => {
      const gradePoints = { A: 4.0, B: 3.0, C: 2.0, D: 1.0, E: 0.5, F: 0.0 };
      return acc + (gradePoints[grade.grade] || 0);
    }, 0);
    const gpa = grades.length > 0 ? totalGradePoints / grades.length : 0;

    // Get assignments and submissions
    const assignments = await Assignment.find({
      courseId: { $in: courses },
      isActive: true
    })
      .populate('courseId', 'courseCode title')
      .populate('submissions.student', 'fullName email');

    const studentSubmissions = assignments.map(assignment => {
      const submission = assignment.submissions.find(sub => 
        sub.student.toString() === studentId
      );
      
      return {
        assignment: {
          id: assignment._id,
          title: assignment.title,
          type: assignment.type,
          totalMarks: assignment.totalMarks,
          dueDate: assignment.dueDate,
          course: assignment.courseId
        },
        submission: submission ? {
          submittedAt: submission.submittedAt,
          status: submission.status,
          grade: submission.grade,
          lateSubmission: submission.lateSubmission
        } : null
      };
    });

    const submittedCount = studentSubmissions.filter(item => item.submission).length;
    const gradedCount = studentSubmissions.filter(item => 
      item.submission && item.submission.status === 'graded'
    ).length;

    // Course performance
    const coursePerformance = courses.map(course => {
      const courseGrades = grades.filter(grade => grade.courseId.toString() === course._id.toString());
      const courseAverage = courseGrades.length > 0 ? 
        courseGrades.reduce((acc, grade) => acc + grade.total, 0) / courseGrades.length : 0;
      
      return {
        course: {
          id: course._id,
          code: course.courseCode,
          title: course.title
        },
        grades: courseGrades.map(grade => ({
          assignment: grade.assignment || 0,
          exam: grade.exam || 0,
          total: grade.total,
          grade: grade.grade
        })),
        averageGrade: courseAverage
      };
    });

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalCourses: courses.length,
          totalAssignments: assignments.length,
          submittedAssignments: submittedCount,
          gradedAssignments: gradedCount,
          submissionRate: assignments.length > 0 ? (submittedCount / assignments.length) * 100 : 0
        },
        academic: {
          gpa: gpa.toFixed(2),
          totalGrades: grades.length,
          gradeDistribution: grades.reduce((acc, grade) => {
            acc[grade.grade] = (acc[grade.grade] || 0) + 1;
            return acc;
          }, {})
        },
        courses: coursePerformance,
        assignments: studentSubmissions
      }
    });
  } catch (error) {
    console.error('Get student analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Generate system report
// @route   POST /api/analytics/generate-report
// @access  Private (Admin)
const generateReport = async (req, res) => {
  try {
    const { type, period, startDate, endDate } = req.body;

    let reportData = {};

    switch (type) {
      case 'user_report':
        reportData = await generateUserReport(startDate, endDate);
        break;
      case 'course_report':
        reportData = await generateCourseReport(startDate, endDate);
        break;
      case 'grade_report':
        reportData = await generateGradeReport(startDate, endDate);
        break;
      case 'system_report':
        reportData = await generateSystemReport(startDate, endDate);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    // Save analytics to database
    const analytics = new Analytics({
      type: 'system_stats',
      period,
      date: new Date(),
      data: reportData,
      metadata: {
        generatedBy: req.user.id,
        generatedAt: new Date()
      }
    });

    await analytics.save();

    res.status(200).json({
      success: true,
      report: reportData,
      message: 'Report generated successfully'
    });
  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Helper functions for report generation
const generateUserReport = async (startDate, endDate) => {
  const dateFilter = startDate && endDate ? 
    { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};

  const totalUsers = await User.countDocuments(dateFilter);
  const newUsers = await User.countDocuments(dateFilter);
  const activeUsers = await User.countDocuments({
    ...dateFilter,
    lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  const usersByRole = await User.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ]);

  return {
    totalUsers,
    newUsers,
    activeUsers,
    usersByRole: usersByRole.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

const generateCourseReport = async (startDate, endDate) => {
  const dateFilter = startDate && endDate ? 
    { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};

  const courses = await Course.find(dateFilter);
  const totalCourses = courses.length;
  const totalEnrollments = courses.reduce((acc, course) => acc + course.enrolledStudents.length, 0);

  return {
    totalCourses,
    totalEnrollments,
    averageEnrollment: totalCourses > 0 ? totalEnrollments / totalCourses : 0
  };
};

const generateGradeReport = async (startDate, endDate) => {
  const dateFilter = startDate && endDate ? 
    { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {};

  const grades = await Grade.find(dateFilter);
  const averageGrade = grades.length > 0 ? 
    grades.reduce((acc, grade) => acc + grade.total, 0) / grades.length : 0;

  const gradeDistribution = grades.reduce((acc, grade) => {
    acc[grade.grade] = (acc[grade.grade] || 0) + 1;
    return acc;
  }, {});

  return {
    totalGrades: grades.length,
    averageGrade,
    gradeDistribution
  };
};

const generateSystemReport = async (startDate, endDate) => {
  const userReport = await generateUserReport(startDate, endDate);
  const courseReport = await generateCourseReport(startDate, endDate);
  const gradeReport = await generateGradeReport(startDate, endDate);

  return {
    userStats: userReport,
    courseStats: courseReport,
    gradeStats: gradeReport,
    generatedAt: new Date()
  };
};

module.exports = {
  getOverviewAnalytics,
  getLecturerAnalytics,
  getStudentAnalytics,
  generateReport,
  // Simple analytics endpoint for frontend
  getAnalytics: async (req, res) => {
    try {
      // Get user statistics
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ isActive: true });
      const usersByRole = await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);

      // Get course statistics
      const totalCourses = await Course.countDocuments();
      const activeCourses = await Course.countDocuments({ isActive: true });
      const coursesBySemester = await Course.aggregate([
        { $group: { _id: '$semester', count: { $sum: 1 } } }
      ]);

      // Get article statistics
      const totalArticles = await Article.countDocuments();
      const publishedArticles = await Article.countDocuments({ status: 'published' });
      const articlesByCategory = await Article.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } }
      ]);

      // Get recent activity
      const recentActivity = await getRecentActivity();

      // Format response
      const analytics = {
        users: {
          total: totalUsers,
          active: activeUsers,
          roles: {
            admin: usersByRole.find(r => r._id === 'admin')?.count || 0,
            lecturer: usersByRole.find(r => r._id === 'lecturer')?.count || 0,
            student: usersByRole.find(r => r._id === 'student')?.count || 0
          }
        },
        courses: {
          total: totalCourses,
          active: activeCourses,
          bySemester: {
            first: coursesBySemester.find(s => s._id === 'first')?.count || 0,
            second: coursesBySemester.find(s => s._id === 'second')?.count || 0,
            summer: coursesBySemester.find(s => s._id === 'summer')?.count || 0
          }
        },
        articles: {
          total: totalArticles,
          published: publishedArticles,
          categories: articlesByCategory
        },
        recentActivity,
        system: {
          uptime: '99.9%',
          lastCalculated: new Date()
        }
      };

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      console.error('Get analytics error:', error);
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
};

// Helper function to get recent activity
async function getRecentActivity() {
  const activities = [];
  
  try {
    // Get recent users
    const recentUsers = await User.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('fullName email role createdAt');
    
    recentUsers.forEach(user => {
      activities.push({
        type: 'user_created',
        description: `New user ${user.fullName} (${user.role}) registered`,
        timestamp: user.createdAt
      });
    });

    // Get recent courses
    const recentCourses = await Course.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('courseCode title createdAt');
    
    recentCourses.forEach(course => {
      activities.push({
        type: 'course_created',
        description: `New course ${course.courseCode} - ${course.title} created`,
        timestamp: course.createdAt
      });
    });

    // Get recent articles
    const recentArticles = await Article.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select('title status createdAt');
    
    recentArticles.forEach(article => {
      activities.push({
        type: 'article_created',
        description: `New article "${article.title}" published`,
        timestamp: article.createdAt
      });
    });

  } catch (error) {
    console.error('Error getting recent activity:', error);
  }

  // Sort by timestamp and limit to 10
  return activities
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);
}
