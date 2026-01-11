const Registration = require('../models/Registration');
const Course = require('../models/Course');
const User = require('../models/User');
const Grade = require('../models/Grade');

// @desc    Register for a course (Student only)
// @route   POST /api/registrations
// @access  Private/Student
const registerCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user._id;

    // Check if course exists and is active
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: 'Course is not available for registration' });
    }

    // Check if student is already registered
    const existingRegistration = await Registration.findOne({
      studentId,
      courseId,
      status: 'registered'
    });

    if (existingRegistration) {
      return res.status(400).json({ message: 'Already registered for this course' });
    }

    // Check if course has reached maximum capacity
    const currentRegistrations = await Registration.countDocuments({
      courseId,
      status: 'registered'
    });

    if (currentRegistrations >= course.maxStudents) {
      return res.status(400).json({ message: 'Course has reached maximum capacity' });
    }

    // Create registration
    const registration = await Registration.create({
      studentId,
      courseId,
      status: 'registered'
    });

    // Update course registered students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { registeredStudents: 1 }
    });

    // Populate course details
    await registration.populate('courseId', 'courseCode title creditUnits lecturerId');
    await registration.populate('courseId.lecturerId', 'fullName email');

    res.status(201).json({
      success: true,
      data: registration,
      message: 'Course registration successful'
    });
  } catch (error) {
    console.error('Register course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Drop a course (Student only)
// @route   DELETE /api/registrations/:courseId
// @access  Private/Student
const dropCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    const registration = await Registration.findOne({
      studentId,
      courseId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Update registration status to dropped
    await Registration.findByIdAndUpdate(registration._id, {
      status: 'dropped'
    });

    // Update course registered students count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { registeredStudents: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Course dropped successfully'
    });
  } catch (error) {
    console.error('Drop course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's registered courses
// @route   GET /api/registrations/my-courses
// @access  Private/Student
const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const registrations = await Registration.find({
      studentId,
      status: 'registered'
    }).populate({
      path: 'courseId',
      populate: {
        path: 'lecturerId',
        select: 'fullName email'
      }
    });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all registrations (Admin only)
// @route   GET /api/registrations
// @access  Private/Admin
const getAllRegistrations = async (req, res) => {
  try {
    const { status, courseId, studentId } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (courseId) query.courseId = courseId;
    if (studentId) query.studentId = studentId;

    const registrations = await Registration.find(query)
      .populate('studentId', 'fullName email')
      .populate('courseId', 'courseCode title creditUnits');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get all registrations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get registration statistics (Admin only)
// @route   GET /api/registrations/stats
// @access  Private/Admin
const getRegistrationStats = async (req, res) => {
  try {
    const totalRegistrations = await Registration.countDocuments();
    const activeRegistrations = await Registration.countDocuments({ status: 'registered' });
    const droppedRegistrations = await Registration.countDocuments({ status: 'dropped' });
    const completedRegistrations = await Registration.countDocuments({ status: 'completed' });

    // Get registrations by course
    const registrationsByCourse = await Registration.aggregate([
      {
        $match: { status: 'registered' }
      },
      {
        $group: {
          _id: '$courseId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseCode: '$course.courseCode',
          title: '$course.title',
          count: 1
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get registrations by semester
    const registrationsBySemester = await Registration.aggregate([
      {
        $match: { status: 'registered' }
      },
      {
        $lookup: {
          from: 'courses',
          localField: 'courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $group: {
          _id: '$course.semester',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        activeRegistrations,
        droppedRegistrations,
        completedRegistrations,
        registrationsByCourse,
        registrationsBySemester
      }
    });
  } catch (error) {
    console.error('Get registration stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students in a specific course (Lecturer/Admin only)
// @route   GET /api/registrations/course/:courseId/students
// @access  Private/Lecturer/Admin
const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer' && course.lecturerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view students for this course' });
    }

    const registrations = await Registration.find({
      courseId,
      status: 'registered'
    }).populate('studentId', 'fullName email profileImage');

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations
    });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerCourse,
  dropCourse,
  getMyCourses,
  getAllRegistrations,
  getRegistrationStats,
  getCourseStudents
};
