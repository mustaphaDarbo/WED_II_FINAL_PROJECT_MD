const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Assignment must belong to a course']
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Assignment must have a lecturer']
  },
  type: {
    type: String,
    enum: ['assignment', 'quiz', 'exam', 'project'],
    required: [true, 'Assignment type is required']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Total marks is required'],
    min: [1, 'Total marks must be at least 1']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  instructions: {
    type: String,
    required: [true, 'Instructions are required']
  },
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date
  },
  submissions: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimeType: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    status: {
      type: String,
      enum: ['submitted', 'graded', 'returned'],
      default: 'submitted'
    },
    grade: {
      marks: Number,
      feedback: String,
      gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      gradedAt: Date
    },
    lateSubmission: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

// Virtual for submission count
AssignmentSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for graded submissions count
AssignmentSchema.virtual('gradedCount').get(function() {
  return this.submissions.filter(sub => sub.status === 'graded').length;
});

// Index for better performance
AssignmentSchema.index({ courseId: 1 });
AssignmentSchema.index({ lecturerId: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ 'submissions.student': 1 });

module.exports = mongoose.model('Assignment', AssignmentSchema);
