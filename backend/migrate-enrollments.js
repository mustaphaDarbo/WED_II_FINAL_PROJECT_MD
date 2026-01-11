const mongoose = require('mongoose');
const Course = require('./models/Course');

// Connect to MongoDB
mongoose.connect('mongodb+srv://mdarboe0708_db_user:mdarboe123@mdarboe.k6ypmim.mongodb.net/ucums_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log('✅ Connected to MongoDB');
  
  try {
    // Find all courses with old enrollment format
    const courses = await Course.find({
      'enrolledStudents.0': { $exists: true }
    });
    
    console.log(`📚 Found ${courses.length} courses to migrate`);
    
    for (const course of courses) {
      console.log(`🔄 Migrating course: ${course.courseCode}`);
      
      // Check if enrollment is in old format (student ID as _id)
      const needsMigration = course.enrolledStudents.some(enrollment => 
        enrollment._id && !enrollment.student
      );
      
      if (needsMigration) {
        // Convert old format to new format
        const newEnrolledStudents = course.enrolledStudents.map(enrollment => {
          if (enrollment._id && !enrollment.student) {
            return {
              student: enrollment._id,
              enrolledAt: enrollment.enrolledAt || new Date(),
              status: enrollment.status || 'active'
            };
          }
          return enrollment;
        });
        
        course.enrolledStudents = newEnrolledStudents;
        await course.save();
        console.log(`✅ Migrated course: ${course.courseCode}`);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});
