const mongoose = require('mongoose');

// User Schema - Supports Admin, Student, and Lecturer roles
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'student', 'lecturer'],
    required: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  // Student specific fields
  studentId: {
    type: String,
    sparse: true
  },
  // Lecturer specific fields
  lecturerId: {
    type: String,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Course Schema
const CourseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  credits: {
    type: Number,
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  maxStudents: {
    type: Number,
    default: 50
  },
  semester: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enrollment Schema - Tracks which students are registered for which courses
const EnrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  enrollmentDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'dropped'],
    default: 'active'
  },
  grade: {
    type: String,
    default: null
  }
});

// Article Schema - For admin to create and manage articles
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Assignment Schema - For lecturers to create assignments
const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  maxScore: {
    type: Number,
    default: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Grade Schema - For tracking student grades
const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  lecturer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  maxScore: {
    type: Number,
    required: true
  },
  feedback: {
    type: String,
    default: ''
  },
  gradedDate: {
    type: Date,
    default: Date.now
  }
});

// System Analytics Schema
const AnalyticsSchema = new mongoose.Schema({
  totalUsers: {
    type: Number,
    default: 0
  },
  totalCourses: {
    type: Number,
    default: 0
  },
  totalArticles: {
    type: Number,
    default: 0
  },
  activeEnrollments: {
    type: Number,
    default: 0
  },
  totalGrades: {
    type: Number,
    default: 0
  },
  averageGrade: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Export all models
const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);
const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);
const Article = mongoose.model('Article', ArticleSchema);
const Assignment = mongoose.model('Assignment', AssignmentSchema);
const Grade = mongoose.model('Grade', GradeSchema);
const Analytics = mongoose.model('Analytics', AnalyticsSchema);

module.exports = {
  User,
  Course,
  Enrollment,
  Article,
  Assignment,
  Grade,
  Analytics
};
