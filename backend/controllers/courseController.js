const Course = require('../models/Course');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Grade = require('../models/Grade');

// @desc    Create a new course (Admin only)
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  try {
    const { courseCode, title, description, creditUnits, lecturerId, semester, academicYear, maxStudents } = req.body;

    // Check if course code already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(400).json({ message: 'Course code already exists' });
    }

    // Verify lecturer exists and is a lecturer
    const lecturer = await User.findById(lecturerId);
    if (!lecturer || lecturer.role !== 'lecturer') {
      return res.status(400).json({ message: 'Invalid lecturer assignment' });
    }

    const course = await Course.create({
      courseCode,
      title,
      description,
      creditUnits,
      lecturerId,
      semester,
      academicYear,
      maxStudents
    });

    // Populate lecturer details
    await course.populate('lecturerId', 'fullName email');

    res.status(201).json({
      success: true,
      data: course,
      message: 'Course created successfully'
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all courses (Admin: all, Lecturer: assigned, Student: available)
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    let courses;

    if (req.user.role === 'admin') {
      // Admin can see all courses
      courses = await Course.find().populate('lecturerId', 'fullName email');
    } else if (req.user.role === 'lecturer') {
      // Lecturer can only see their assigned courses
      courses = await Course.find({ lecturerId: req.user._id }).populate('lecturerId', 'fullName email');
    } else {
      // Student can only see active courses
      courses = await Course.find({ isActive: true }).populate('lecturerId', 'fullName email');
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('lecturerId', 'fullName email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer' && course.lecturerId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this course' });
    }

    // Get registered students count
    const registeredCount = await Registration.countDocuments({ courseId: course._id, status: 'registered' });
    
    // Add registered students count to course object
    const courseData = course.toObject();
    courseData.registeredStudents = registeredCount;

    res.status(200).json({
      success: true,
      data: courseData
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update course (Admin only)
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // If updating lecturer, verify new lecturer exists
    if (req.body.lecturerId) {
      const lecturer = await User.findById(req.body.lecturerId);
      if (!lecturer || lecturer.role !== 'lecturer') {
        return res.status(400).json({ message: 'Invalid lecturer assignment' });
      }
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('lecturerId', 'fullName email');

    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: 'Course updated successfully'
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete course (Admin only)
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if there are any registrations
    const registrations = await Registration.countDocuments({ courseId: course._id });
    if (registrations > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete course with registered students. Deactivate course instead.' 
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get course statistics (Admin only)
// @route   GET /api/courses/stats
// @access  Private/Admin
const getCourseStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const activeCourses = await Course.countDocuments({ isActive: true });
    const inactiveCourses = totalCourses - activeCourses;

    // Get courses by semester
    const coursesBySemester = await Course.aggregate([
      {
        $group: {
          _id: '$semester',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get courses by credit units
    const coursesByCredits = await Course.aggregate([
      {
        $group: {
          _id: '$creditUnits',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        activeCourses,
        inactiveCourses,
        coursesBySemester,
        coursesByCredits
      }
    });
  } catch (error) {
    console.error('Get course stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students registered for a course (Lecturer/Admin only)
// @route   GET /api/courses/:id/students
// @access  Private/Lecturer/Admin
const getCourseStudents = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrolledStudents.student', 'fullName email profileImage phoneNumber address studentId dateOfBirth bio');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check permissions
    if (req.user.role === 'lecturer' && course.lecturerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view students for this course' });
    }

    // Extract student data from enrolledStudents array
    const students = course.enrolledStudents
      .filter(enrollment => enrollment.student) // Filter out any enrollments without student data
      .map(enrollment => ({
        ...enrollment.student.toObject(),
        enrolledAt: enrollment.enrolledAt,
        status: enrollment.status
      }));

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
const enrollStudent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { studentId } = req.body;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ message: 'Invalid student' });
    }

    // Check if student is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === studentId
    );
    if (isEnrolled) {
      return res.status(400).json({ message: 'Student already enrolled' });
    }

    // Check max capacity
    if (course.enrolledStudents.length >= course.maxStudents) {
      return res.status(400).json({ message: 'Course is full' });
    }

    // Enroll student
    course.enrolledStudents.push({
      student: studentId,
      enrolledAt: new Date(),
      status: 'active'
    });
    await course.save();

    // Add course to student's registered courses
    student.registeredCourses.push(courseId);
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student enrolled successfully'
    });
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Unenroll a student from a course
// @route   DELETE /api/courses/:id/unenroll/:studentId
// @access  Private/Student/Admin
const unenrollStudent = async (req, res) => {
  try {
    const courseId = req.params.id;
    const studentId = req.params.studentId;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Remove student from course
    course.enrolledStudents = course.enrolledStudents.filter(
      enrollment => enrollment.student.toString() !== studentId
    );
    await course.save();

    // Remove course from student's registered courses
    const student = await User.findById(studentId);
    if (student) {
      student.registeredCourses = student.registeredCourses.filter(id => id.toString() !== courseId);
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: 'Student unenrolled successfully'
    });
  } catch (error) {
    console.error('Unenroll student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  getCourseStats,
  getCourseStudents,
  enrollStudent,
  unenrollStudent
};
