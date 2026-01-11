const User = require('../models/User');
const Course = require('../models/Course');
const Grade = require('../models/Grade');

// @desc    Get student's enrolled courses
// @route   GET /api/students/:studentId/courses
// @access  Private/Student
const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Get student with populated courses
    const student = await User.findById(studentId)
      .populate({
        path: 'registeredCourses',
        populate: {
          path: 'lecturerId',
          select: 'fullName email'
        }
      });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({
      success: true,
      data: student.registeredCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student's grades
// @route   GET /api/students/:studentId/grades
// @access  Private/Student
const getStudentGrades = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Get student's grades with course details
    const grades = await Grade.find({ studentId })
      .populate({
        path: 'courseId',
        select: 'courseCode title lecturerId',
        populate: {
          path: 'lecturerId',
          select: 'fullName email'
        }
      })
      .populate('assignmentId', 'title type');

    // Group grades by course
    const courseGrades = {};
    grades.forEach(grade => {
      const courseId = grade.courseId._id.toString();
      if (!courseGrades[courseId]) {
        courseGrades[courseId] = {
          courseId: grade.courseId._id,
          courseCode: grade.courseId.courseCode,
          courseTitle: grade.courseId.title,
          lecturerName: grade.courseId.lecturerId.fullName,
          assignments: [],
          finalGrade: 0
        };
      }

      courseGrades[courseId].assignments.push({
        title: grade.assignmentId.title,
        type: grade.assignmentId.type,
        score: grade.score,
        totalMarks: grade.totalMarks,
        percentage: Math.round((grade.score / grade.totalMarks) * 100),
        dueDate: grade.dueDate
      });
    });

    // Calculate final grades for each course
    Object.keys(courseGrades).forEach(courseId => {
      const course = courseGrades[courseId];
      const totalScore = course.assignments.reduce((sum, assignment) => sum + assignment.score, 0);
      const totalMarks = course.assignments.reduce((sum, assignment) => sum + assignment.totalMarks, 0);
      course.finalGrade = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 100) : 0;
    });

    res.status(200).json({
      success: true,
      data: {
        courseGrades: Object.values(courseGrades)
      }
    });
  } catch (error) {
    console.error('Get student grades error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getEnrolledCourses,
  getStudentGrades
};
