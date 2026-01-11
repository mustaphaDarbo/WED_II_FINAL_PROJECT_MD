const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const studentController = require('../controllers/studentController');

// All routes require authentication
router.use(protect);

// @route   GET /api/students/:studentId/courses
// @desc    Get student's enrolled courses
// @access  Private/Student
router.get('/:studentId/courses', authorize('student'), studentController.getEnrolledCourses);

// @route   GET /api/students/:studentId/grades
// @desc    Get student's grades
// @access  Private/Student
router.get('/:studentId/grades', authorize('student'), studentController.getStudentGrades);

module.exports = router;
