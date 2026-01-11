const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const lecturerController = require('../controllers/lecturerController');

// All routes require authentication
router.use(protect);

// @route   GET /api/lecturers/:lecturerId/courses
// @desc    Get lecturer's courses
// @access  Private/Lecturer
router.get('/:lecturerId/courses', authorize('lecturer'), lecturerController.getLecturerCourses);

module.exports = router;
