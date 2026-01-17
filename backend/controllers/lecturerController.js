const User = require('../models/User');
const Course = require('../models/Course');
const Grade = require('../models/Grade');
const Assignment = require('../models/Assignment');

// @desc    Get lecturer's courses
// @route   GET /api/lecturers/:lecturerId/courses
// @access  Private/Lecturer
const getLecturerCourses = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;

    // Verify the requested lecturerId matches the authenticated user
    if (req.user.role !== 'admin' && req.user._id.toString() !== lecturerId) {
      return res.status(403).json({ message: 'Not authorized to view these courses' });
    }

    // Get courses assigned to this lecturer with full population
    const courses = await Course.find({ lecturerId })
      .populate('enrolledStudents.student', 'fullName email profileImage')
      .populate('lecturerId', 'fullName email')
      .lean(); // Convert to plain JavaScript objects

    // Add computed statistics for each course
    const coursesWithStats = courses.map(course => ({
      ...course,
      enrolledCount: course.enrolledStudents?.length || 0,
      activeStudents: course.enrolledStudents?.filter(s => s.status === 'active').length || 0
    }));

    res.status(200).json({
      success: true,
      data: coursesWithStats,
      count: coursesWithStats.length
    });
  } catch (error) {
    console.error('Get lecturer courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get lecturer's dashboard statistics
// @route   GET /api/lecturers/:lecturerId/dashboard
// @access  Private/Lecturer
const getLecturerDashboard = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;

    // Verify authorization
    if (req.user.role !== 'admin' && req.user._id.toString() !== lecturerId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get courses
    const courses = await Course.find({ lecturerId });
    
    // Calculate statistics
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => 
      sum + (course.enrolledStudents?.length || 0), 0
    );
    
    // Get assignments count
    const assignments = await Assignment.find({ 
      courseId: { $in: courses.map(c => c._id) }
    });
    const totalAssignments = assignments.length;

    // Get grades for average calculation
    const grades = await Grade.find({
      courseId: { $in: courses.map(c => c._id) }
    });
    
    const averageGrade = grades.length > 0 
      ? Math.round(grades.reduce((sum, grade) => sum + (grade.total || 0), 0) / grades.length)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalStudents,
        totalAssignments,
        averageGrade
      }
    });
  } catch (error) {
    console.error('Get lecturer dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLecturerCourses,
  getLecturerDashboard
};
