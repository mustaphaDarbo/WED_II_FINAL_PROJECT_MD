const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: [true, 'Please provide course code'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [10, 'Course code cannot be more than 10 characters']
  },
  title: {
    type: String,
    required: [true, 'Please provide course title'],
    trim: true,
    maxlength: [200, 'Course title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide course description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  creditUnits: {
    type: Number,
    required: [true, 'Please provide credit units'],
    min: [1, 'Credit units must be at least 1'],
    max: [10, 'Credit units cannot be more than 10']
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please assign a lecturer to this course']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  semester: {
    type: String,
    required: [true, 'Please specify semester'],
    enum: ['first', 'second', 'summer']
  },
  academicYear: {
    type: String,
    required: [true, 'Please specify academic year'],
    match: [/^\d{4}\/\d{4}$/, 'Academic year must be in format YYYY/YYYY']
  },
  maxStudents: {
    type: Number,
    default: 50,
    min: [1, 'Maximum students must be at least 1']
  },
  // Track enrolled students with registration details
  enrolledStudents: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'dropped', 'completed'],
      default: 'active'
    }
  }],
  courseImage: {
    type: String,
    default: ''
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    startTime: String,
    endTime: String,
    room: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Virtual for enrolled students count
CourseSchema.virtual('enrolledCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for available spots
CourseSchema.virtual('availableSpots').get(function() {
  return this.maxStudents - this.enrolledStudents.length;
});

// Index for better performance
CourseSchema.index({ courseCode: 1 });
CourseSchema.index({ lecturerId: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ 'enrolledStudents.student': 1 });

module.exports = mongoose.model('Course', CourseSchema);
