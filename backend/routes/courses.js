const express = require('express');
const router = express.Router();
const { protect, admin, lecturer, authorize } = require('../middleware/auth');
const courseController = require('../controllers/courseController');

// Public routes (none for courses - all require authentication)

// Protected routes
router.use(protect);

// @route   GET /api/courses
// @desc    Get all courses (role-based access)
// @access  Private
router.get('/', courseController.getCourses);

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Private
router.get('/:id', courseController.getCourse);

// @route   POST /api/courses/:id/enroll
// @desc    Enroll a student in a course
// @access  Private/Student
router.post('/:id/enroll', authorize('student'), courseController.enrollStudent);

// @route   DELETE /api/courses/:id/unenroll/:studentId
// @desc    Unenroll a student from a course
// @access  Private/Student/Admin
router.delete('/:id/unenroll/:studentId', authorize('student', 'admin'), courseController.unenrollStudent);

// @route   GET /api/courses/:id/students
// @desc    Get students registered for a course
// @access  Private/Lecturer/Admin
router.get('/:id/students', authorize('admin', 'lecturer'), courseController.getCourseStudents);

// Admin only routes
router.use(admin);

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private/Admin
router.post('/', courseController.createCourse);

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private/Admin
router.put('/:id', courseController.updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private/Admin
router.delete('/:id', courseController.deleteCourse);

// @route   GET /api/courses/stats
// @desc    Get course statistics
// @access  Private/Admin
router.get('/stats', courseController.getCourseStats);

module.exports = router;
