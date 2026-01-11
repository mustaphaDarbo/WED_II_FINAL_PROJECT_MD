const mongoose = require('mongoose');

const GradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide student ID']
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please provide course ID']
  },
  lecturerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide lecturer ID']
  },
  assignment: {
    type: Number,
    min: [0, 'Assignment score cannot be less than 0'],
    max: [100, 'Assignment score cannot be more than 100'],
    required: [true, 'Please provide assignment score']
  },
  exam: {
    type: Number,
    min: [0, 'Exam score cannot be less than 0'],
    max: [100, 'Exam score cannot be more than 100'],
    required: [true, 'Please provide exam score']
  },
  total: {
    type: Number,
    min: [0, 'Total score cannot be less than 0'],
    max: [100, 'Total score cannot be more than 100']
  },
  grade: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    required: [true, 'Please provide grade']
  },
  remarks: {
    type: String,
    maxlength: [500, 'Remarks cannot be more than 500 characters']
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
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate grades for same student/course/semester
GradeSchema.index({ studentId: 1, courseId: 1, semester: 1, academicYear: 1 }, { unique: true });

// Additional indexes for performance
GradeSchema.index({ studentId: 1 });
GradeSchema.index({ courseId: 1 });
GradeSchema.index({ lecturerId: 1 });
GradeSchema.index({ grade: 1 });

// Calculate total and grade before saving
GradeSchema.pre('save', function(next) {
  // Calculate total if not provided
  if (this.total === undefined) {
    this.total = (this.assignment * 0.3) + (this.exam * 0.7);
  }
  
  // Calculate grade based on total
  if (this.total >= 70) {
    this.grade = 'A';
  } else if (this.total >= 60) {
    this.grade = 'B';
  } else if (this.total >= 50) {
    this.grade = 'C';
  } else if (this.total >= 45) {
    this.grade = 'D';
  } else if (this.total >= 40) {
    this.grade = 'E';
  } else {
    this.grade = 'F';
  }
  
  next();
});

module.exports = mongoose.model('Grade', GradeSchema);
