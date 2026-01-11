const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  // General Settings
  institutionName: {
    type: String,
    default: 'University Course Management System',
    required: true
  },
  institutionLogo: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    required: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  contactPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  
  // Academic Settings
  currentSemester: {
    type: String,
    enum: ['first', 'second', 'summer'],
    required: true
  },
  currentAcademicYear: {
    type: String,
    required: true,
    match: [/^\d{4}\/\d{4}$/, 'Academic year must be in format YYYY/YYYY']
  },
  maxCoursesPerStudent: {
    type: Number,
    default: 8,
    min: 1,
    max: 15
  },
  maxStudentsPerCourse: {
    type: Number,
    default: 50,
    min: 1,
    max: 200
  },
  
  // Grade Settings
  gradeScale: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      A: { min: 70, max: 100, points: 4.0 },
      B: { min: 60, max: 69, points: 3.0 },
      C: { min: 50, max: 59, points: 2.0 },
      D: { min: 45, max: 49, points: 1.0 },
      E: { min: 40, max: 44, points: 0.5 },
      F: { min: 0, max: 39, points: 0.0 }
    }
  },
  
  // System Settings
  allowStudentRegistration: {
    type: Boolean,
    default: true
  },
  allowLecturerCourseCreation: {
    type: Boolean,
    default: false
  },
  requireEmailVerification: {
    type: Boolean,
    default: false
  },
  sessionTimeout: {
    type: Number,
    default: 30, // minutes
    min: 5
  },
  
  // File Upload Settings
  maxFileSize: {
    type: Number,
    default: 10485760, // 10MB in bytes
    min: 1024
  },
  allowedFileTypes: {
    type: [String],
    default: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'txt', 'zip']
  },
  
  // Notification Settings
  emailNotifications: {
    type: Boolean,
    default: true
  },
  smsNotifications: {
    type: Boolean,
    default: false
  },
  
  // Security Settings
  passwordMinLength: {
    type: Number,
    default: 6,
    min: 4
  },
  maxLoginAttempts: {
    type: Number,
    default: 5,
    min: 3
  },
  lockoutDuration: {
    type: Number,
    default: 15, // minutes
    min: 5
  },
  
  // Maintenance Settings
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  maintenanceMessage: {
    type: String,
    default: 'System is under maintenance. Please try again later.'
  },
  
  // Backup Settings
  autoBackup: {
    type: Boolean,
    default: true
  },
  backupFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily'
  },
  
  // Theme Settings
  primaryColor: {
    type: String,
    default: '#667eea'
  },
  secondaryColor: {
    type: String,
    default: '#764ba2'
  },
  
  // Audit Settings
  enableAuditLog: {
    type: Boolean,
    default: true
  },
  auditLogRetention: {
    type: Number,
    default: 90, // days
    min: 7
  },
  
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
SystemSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
