const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createAssignment,
  getCourseAssignments,
  getStudentAssignments,
  submitAssignment,
  gradeAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { body } = require('express-validator');

const router = express.Router();

// Middleware for validation
const assignmentValidation = [
  body('title').notEmpty().withMessage('Assignment title is required'),
  body('description').notEmpty().withMessage('Assignment description is required'),
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('type').isIn(['assignment', 'quiz', 'exam', 'project']).withMessage('Valid assignment type is required'),
  body('totalMarks').isNumeric().withMessage('Total marks must be a number'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('instructions').notEmpty().withMessage('Instructions are required')
];

const gradeValidation = [
  body('marks').isNumeric().withMessage('Marks must be a number'),
  body('feedback').optional().isString().withMessage('Feedback must be a string')
];

// @route   POST /api/assignments
// @desc    Create assignment
// @access  Private (Lecturer/Admin)
router.post('/', protect, authorize('lecturer', 'admin'), assignmentValidation, createAssignment);

// @route   GET /api/assignments/course/:courseId
// @desc    Get all assignments for a course
// @access  Private
router.get('/course/:courseId', protect, getCourseAssignments);

// @route   GET /api/assignments/student
// @desc    Get assignments for student
// @access  Private (Student)
router.get('/student', protect, authorize('student'), getStudentAssignments);

// @route   POST /api/assignments/:assignmentId/submit
// @desc    Submit assignment
// @access  Private (Student)
router.post('/:assignmentId/submit', protect, authorize('student'), submitAssignment);

// @route   PUT /api/assignments/:assignmentId/grade/:studentId
// @desc    Grade assignment
// @access  Private (Lecturer/Admin)
router.put('/:assignmentId/grade/:studentId', protect, authorize('lecturer', 'admin'), gradeValidation, gradeAssignment);

// @route   DELETE /api/assignments/:assignmentId
// @desc    Delete assignment
// @access  Private (Lecturer/Admin)
router.delete('/:assignmentId', protect, authorize('lecturer', 'admin'), deleteAssignment);

module.exports = router;
