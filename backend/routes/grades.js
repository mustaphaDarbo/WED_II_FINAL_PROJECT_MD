const express = require('express');
const router = express.Router();
const { protect, admin, lecturer, student, authorize } = require('../middleware/auth');
const gradeController = require('../controllers/gradeController');

// Public routes (none for grades - all require authentication)

// Protected routes
router.use(protect);

// Lecturer routes
router.use(lecturer);

// @route   POST /api/grades
// @desc    Create or update grade
// @access  Private/Lecturer
router.post('/', gradeController.createGrade);

// @route   GET /api/grades/course/:courseId
// @desc    Get grades for a course
// @access  Private/Lecturer/Admin
router.get('/course/:courseId', authorize('admin', 'lecturer'), gradeController.getCourseGrades);

// Student routes
router.use(student);

// @route   GET /api/grades/my-grades
// @desc    Get my grades
// @access  Private/Student
router.get('/my-grades', gradeController.getMyGrades);

// @route   GET /api/grades/student/:studentId
// @desc    Get student's grades
// @access  Private/Student/Admin
router.get('/student/:studentId', authorize('admin', 'student'), gradeController.getStudentGrades);

// Admin only routes
router.use(admin);

// @route   GET /api/grades/stats
// @desc    Get grade statistics
// @access  Private/Admin
router.get('/stats', gradeController.getGradeStats);

// @route   DELETE /api/grades/:id
// @desc    Delete grade
// @access  Private/Admin
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;
