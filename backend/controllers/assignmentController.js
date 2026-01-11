const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create assignment (Lecturer only)
// @route   POST /api/assignments
// @access  Private (Lecturer/Admin)
const createAssignment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      description,
      courseId,
      type,
      totalMarks,
      dueDate,
      instructions
    } = req.body;

    // Check if course exists and user is the lecturer
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is lecturer of this course or admin
    if (req.user.role !== 'admin' && course.lecturerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create assignment for this course'
      });
    }

    const assignment = await Assignment.create({
      title,
      description,
      courseId,
      lecturerId: req.user.id,
      type,
      totalMarks,
      dueDate,
      instructions,
      attachments: req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      })) : []
    });

    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('courseId', 'courseCode title')
      .populate('lecturerId', 'fullName email');

    res.status(201).json({
      success: true,
      assignment: populatedAssignment,
      message: 'Assignment created successfully'
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getCourseAssignments = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user has access to this course
    const hasAccess = req.user.role === 'admin' ||
      (req.user.role === 'lecturer' && course.lecturerId.toString() === req.user.id) ||
      (req.user.role === 'student' && course.enrolledStudents.some(enrollment => 
        enrollment.student.toString() === req.user.id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view assignments for this course'
      });
    }

    const assignments = await Assignment.find({ courseId, isActive: true })
      .populate('lecturerId', 'fullName email')
      .populate('submissions.student', 'fullName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      assignments,
      count: assignments.length
    });
  } catch (error) {
    console.error('Get course assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get assignments for student
// @route   GET /api/assignments/student
// @access  Private (Student)
const getStudentAssignments = async (req, res) => {
  try {
    // Get student's registered courses
    const student = await User.findById(req.user.id).populate('registeredCourses');
    
    const assignments = await Assignment.find({
      courseId: { $in: student.registeredCourses },
      isActive: true
    })
      .populate('courseId', 'courseCode title')
      .populate('lecturerId', 'fullName email')
      .sort({ dueDate: 1 });

    // Add submission status for each assignment
    const assignmentsWithStatus = assignments.map(assignment => {
      const submission = assignment.submissions.find(sub => 
        sub.student.toString() === req.user.id
      );
      
      return {
        ...assignment.toObject(),
        submissionStatus: submission ? submission.status : 'not_submitted',
        submittedAt: submission ? submission.submittedAt : null,
        grade: submission ? submission.grade : null
      };
    });

    res.status(200).json({
      success: true,
      assignments: assignmentsWithStatus,
      count: assignmentsWithStatus.length
    });
  } catch (error) {
    console.error('Get student assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Submit assignment
// @route   POST /api/assignments/:assignmentId/submit
// @access  Private (Student)
const submitAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { text } = req.body;

    const assignment = await Assignment.findById(assignmentId)
      .populate('courseId');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if student is enrolled in the course
    const isEnrolled = assignment.courseId.enrolledStudents.some(enrollment => 
      enrollment.student.toString() === req.user.id);

    if (!isEnrolled) {
      return res.status(403).json({
        success: false,
        message: 'Not enrolled in this course'
      });
    }

    // Check if already submitted
    const existingSubmission = assignment.submissions.find(sub => 
      sub.student.toString() === req.user.id
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'Assignment already submitted'
      });
    }

    // Check if deadline has passed
    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({
        success: false,
        message: 'Assignment deadline has passed'
      });
    }

    // Create submission
    const submission = {
      student: req.user.id,
      text,
      attachments: req.files ? req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype
      })) : [],
      lateSubmission: new Date() > new Date(assignment.dueDate)
    };

    assignment.submissions.push(submission);
    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignmentId)
      .populate('submissions.student', 'fullName email');

    res.status(200).json({
      success: true,
      assignment: updatedAssignment,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Grade assignment
// @route   PUT /api/assignments/:assignmentId/grade/:studentId
// @access  Private (Lecturer/Admin)
const gradeAssignment = async (req, res) => {
  try {
    const { assignmentId, studentId } = req.params;
    const { marks, feedback } = req.body;

    const assignment = await Assignment.findById(assignmentId)
      .populate('courseId');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is lecturer of this course or admin
    if (req.user.role !== 'admin' && assignment.courseId.lecturerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to grade this assignment'
      });
    }

    // Find the submission
    const submission = assignment.submissions.find(sub => 
      sub.student.toString() === studentId
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Update grade
    submission.grade = {
      marks,
      feedback,
      gradedBy: req.user.id,
      gradedAt: new Date()
    };
    submission.status = 'graded';

    await assignment.save();

    const updatedAssignment = await Assignment.findById(assignmentId)
      .populate('submissions.student', 'fullName email')
      .populate('submissions.grade.gradedBy', 'fullName email');

    res.status(200).json({
      success: true,
      assignment: updatedAssignment,
      message: 'Assignment graded successfully'
    });
  } catch (error) {
    console.error('Grade assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:assignmentId
// @access  Private (Lecturer/Admin)
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId)
      .populate('courseId');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check if user is lecturer of this course or admin
    if (req.user.role !== 'admin' && assignment.courseId.lecturerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this assignment'
      });
    }

    // Soft delete (set isActive to false)
    assignment.isActive = false;
    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  createAssignment,
  getCourseAssignments,
  getStudentAssignments,
  submitAssignment,
  gradeAssignment,
  deleteAssignment
};
