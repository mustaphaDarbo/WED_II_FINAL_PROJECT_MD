const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
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
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'dropped', 'completed'],
    default: 'registered'
  },
  grade: {
    type: Number,
    min: [0, 'Grade cannot be less than 0'],
    max: [100, 'Grade cannot be more than 100']
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate registrations
RegistrationSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

// Additional indexes for performance
RegistrationSchema.index({ studentId: 1 });
RegistrationSchema.index({ courseId: 1 });
RegistrationSchema.index({ status: 1 });

module.exports = mongoose.model('Registration', RegistrationSchema);
