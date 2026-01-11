const User = require('../models/User');
const Course = require('../models/Course');
const Grade = require('../models/Grade');

// @desc    Get lecturer's courses
// @route   GET /api/lecturers/:lecturerId/courses
// @access  Private/Lecturer
const getLecturerCourses = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;

    // Get courses assigned to this lecturer
    const courses = await Course.find({ lecturerId })
      .populate('enrolledStudents', 'fullName email')
      .populate('lecturerId', 'fullName email');

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Get lecturer courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getLecturerCourses
};
