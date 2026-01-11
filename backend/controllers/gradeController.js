const Grade = require('../models/Grade');
const Registration = require('../models/Registration');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create or update grade (Lecturer only)
// @route   POST /api/grades
// @access  Private/Lecturer
const createGrade = async (req, res) => {
  try {
    const { studentId, courseId, assignment, exam, semester, academicYear, remarks } = req.body;
    const lecturerId = req.user._id;

    // Verify course exists and lecturer is assigned
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.lecturerId.toString() !== lecturerId.toString()) {
      return res.status(403).json({ message: 'Not authorized to grade this course' });
    }

    // Verify student is registered for the course
    const registration = await Registration.findOne({
      studentId,
      courseId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(400).json({ message: 'Student is not registered for this course' });
    }

    // Check if grade already exists for this student/course/semester
    const existingGrade = await Grade.findOne({
      studentId,
      courseId,
      semester,
      academicYear
    });

    let grade;
    if (existingGrade) {
      // Update existing grade
      grade = await Grade.findByIdAndUpdate(
        existingGrade._id,
        {
          assignment,
          exam,
          lecturerId,
          remarks
        },
        { new: true, runValidators: true }
      ).populate('studentId', 'fullName email')
       .populate('courseId', 'courseCode title');
    } else {
      // Create new grade
      grade = await Grade.create({
        studentId,
        courseId,
        lecturerId,
        assignment,
        exam,
        semester,
        academicYear,
        remarks
      });

      // Populate details
      await grade.populate('studentId', 'fullName email');
      await grade.populate('courseId', 'courseCode title');
    }

    res.status(201).json({
      success: true,
      data: grade,
      message: existingGrade ? 'Grade updated successfully' : 'Grade created successfully'
    });
  } catch (error) {
    console.error('Create grade error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get grades for a course (Lecturer/Admin only)
// @route   GET /api/grades/course/:courseId
// @access  Private/Lecturer/Admin
const getCourseGrades = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { semester, academicYear } = req.query;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer' && course.lecturerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view grades for this course' });
    }

    // Build query
    const query = { courseId };
    if (semester) query.semester = semester;
    if (academicYear) query.academicYear = academicYear;

    const grades = await Grade.find(query)
      .populate('studentId', 'fullName email profileImage')
      .populate('lecturerId', 'fullName email')
      .sort({ 'studentId.fullName': 1 });

    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('Get course grades error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's grades (Student/Admin only)
// @route   GET /api/grades/student/:studentId
// @access  Private/Student/Admin
const getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check permissions
    if (req.user.role === 'student' && req.user._id.toString() !== studentId) {
      return res.status(403).json({ message: 'Not authorized to view other students\' grades' });
    }

    const grades = await Grade.find({ studentId })
      .populate('courseId', 'courseCode title creditUnits')
      .populate('lecturerId', 'fullName email')
      .sort({ academicYear: -1, semester: -1 });

    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my grades (Student only)
// @route   GET /api/grades/my-grades
// @access  Private/Student
const getMyGrades = async (req, res) => {
  try {
    const studentId = req.user._id;

    const grades = await Grade.find({ studentId })
      .populate('courseId', 'courseCode title creditUnits')
      .populate('lecturerId', 'fullName email')
      .sort({ academicYear: -1, semester: -1 });

    res.status(200).json({
      success: true,
      count: grades.length,
      data: grades
    });
  } catch (error) {
    console.error('Get my grades error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get grade statistics (Admin only)
// @route   GET /api/grades/stats
// @access  Private/Admin
const getGradeStats = async (req, res) => {
  try {
    const { semester, academicYear } = req.query;

    // Build query
    const matchQuery = {};
    if (semester) matchQuery.semester = semester;
    if (academicYear) matchQuery.academicYear = academicYear;

    // Grade distribution
    const gradeDistribution = await Grade.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$grade',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Average scores by course
    const averageScoresByCourse = await Grade.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$courseId',
          avgAssignment: { $avg: '$assignment' },
          avgExam: { $avg: '$exam' },
          avgTotal: { $avg: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseCode: '$course.courseCode',
          title: '$course.title',
          avgAssignment: { $round: ['$avgAssignment', 2] },
          avgExam: { $round: ['$avgExam', 2] },
          avgTotal: { $round: ['$avgTotal', 2] },
          count: 1
        }
      },
      {
        $sort: { avgTotal: -1 }
      }
    ]);

    // Pass/Fail statistics
    const passFailStats = await Grade.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          passed: {
            $sum: {
              $cond: [{ $gte: ['$total', 40] }, 1, 0]
            }
          },
          failed: {
            $sum: {
              $cond: [{ $lt: ['$total', 40] }, 1, 0]
            }
          }
        }
      }
    ]);

    const stats = passFailStats[0] || { total: 0, passed: 0, failed: 0 };
    stats.passRate = stats.total > 0 ? ((stats.passed / stats.total) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        gradeDistribution,
        averageScoresByCourse,
        passFailStats: stats
      }
    });
  } catch (error) {
    console.error('Get grade stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete grade (Admin only)
// @route   DELETE /api/grades/:id
// @access  Private/Admin
const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await Grade.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    console.error('Delete grade error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createGrade,
  getCourseGrades,
  getStudentGrades,
  getMyGrades,
  getGradeStats,
  deleteGrade
};
