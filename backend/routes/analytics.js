const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getOverviewAnalytics,
  getLecturerAnalytics,
  getStudentAnalytics,
  generateReport,
  getAnalytics
} = require('../controllers/analyticsController');
const { body } = require('express-validator');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get comprehensive analytics
// @access  Private (Admin)
router.get('/overview', protect, authorize('admin'), getOverviewAnalytics);

// @route   GET /api/analytics
// @desc    Get simple analytics for frontend
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), getAnalytics);

// @route   GET /api/analytics/lecturer
// @desc    Get lecturer-specific analytics
// @access  Private (Lecturer)
router.get('/lecturer', protect, authorize('lecturer'), getLecturerAnalytics);

// @route   GET /api/analytics/student
// @desc    Get student-specific analytics
// @access  Private (Student)
router.get('/student', protect, authorize('student'), getStudentAnalytics);

// @route   POST /api/analytics/generate-report
// @desc    Generate system report
// @access  Private (Admin)
router.post('/generate-report', protect, authorize('admin'), [
  body('type').isIn(['user_report', 'course_report', 'grade_report', 'system_report']).withMessage('Valid report type is required'),
  body('period').optional().isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Valid period is required'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required')
], generateReport);

module.exports = router;
