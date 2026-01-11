const express = require('express');
const router = express.Router();
const { protect, admin, student, authorize } = require('../middleware/auth');
const registrationController = require('../controllers/registrationController');

// Public routes (none for registrations - all require authentication)

// Protected routes
router.use(protect);

// Student routes
router.use(student);

// @route   POST /api/registrations
// @desc    Register for a course
// @access  Private/Student
router.post('/', registrationController.registerCourse);

// @route   DELETE /api/registrations/:courseId
// @desc    Drop a course
// @access  Private/Student
router.delete('/:courseId', registrationController.dropCourse);

// @route   GET /api/registrations/my-courses
// @desc    Get student's registered courses
// @access  Private/Student
router.get('/my-courses', registrationController.getMyCourses);

// Admin only routes
router.use(admin);

// @route   GET /api/registrations
// @desc    Get all registrations
// @access  Private/Admin
router.get('/', registrationController.getAllRegistrations);

// @route   GET /api/registrations/stats
// @desc    Get registration statistics
// @access  Private/Admin
router.get('/stats', registrationController.getRegistrationStats);

// @route   GET /api/registrations/course/:courseId/students
// @desc    Get students in a specific course
// @access  Private/Lecturer/Admin
router.get('/course/:courseId/students', authorize('admin', 'lecturer'), registrationController.getCourseStudents);

module.exports = router;
