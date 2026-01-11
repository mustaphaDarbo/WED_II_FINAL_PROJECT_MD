const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user_stats', 'course_stats', 'grade_stats', 'system_stats'],
    required: [true, 'Analytics type is required']
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: [true, 'Period is required']
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  data: {
    // User statistics
    totalUsers: Number,
    activeUsers: Number,
    newUsers: Number,
    usersByRole: {
      admin: Number,
      lecturer: Number,
      student: Number
    },
    
    // Course statistics
    totalCourses: Number,
    activeCourses: Number,
    totalEnrollments: Number,
    averageEnrollmentPerCourse: Number,
    
    // Grade statistics
    averageGrades: Number,
    gradeDistribution: {
      A: Number,
      B: Number,
      C: Number,
      D: Number,
      E: Number,
      F: Number
    },
    
    // System statistics
    totalLogins: Number,
    totalPageViews: Number,
    averageSessionDuration: Number,
    errorRate: Number,
    
    // Performance metrics
    courseCompletionRate: Number,
    studentSatisfactionRate: Number,
    lecturerPerformanceScore: Number
  },
  metadata: {
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    generatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
});

// Compound index for unique analytics records
AnalyticsSchema.index({ type: 1, period: 1, date: 1 }, { unique: true });

// Additional indexes for performance
AnalyticsSchema.index({ type: 1 });
AnalyticsSchema.index({ period: 1 });
AnalyticsSchema.index({ date: -1 });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
