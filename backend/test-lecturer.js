const http = require('http');

// Test lecturer dashboard functionality
const loginData = JSON.stringify({
  email: 'lecturer@ucums.edu',
  password: 'lecturer123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let loginBody = '';
  loginRes.on('data', chunk => {
    loginBody += chunk;
  });
  loginRes.on('end', () => {
    try {
      const loginResp = JSON.parse(loginBody);
      if (loginResp.success) {
        console.log('✅ Lecturer Login: SUCCESS');
        console.log('✅ Testing Lecturer Dashboard...');
        
        // Test lecturer courses
        const coursesOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/lecturers/' + loginResp.user.id + '/courses',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + loginResp.token
          }
        };
        
        const coursesReq = http.request(coursesOptions, (coursesRes) => {
          console.log('📚 Lecturer Courses Status:', coursesRes.statusCode);
          let coursesBody = '';
          coursesRes.on('data', chunk => {
            coursesBody += chunk;
          });
          coursesRes.on('end', () => {
            const coursesData = JSON.parse(coursesBody);
            console.log('📚 Lecturer Courses Count:', coursesData.data.length);
            
            if (coursesData.data.length > 0) {
              coursesData.data.forEach((course, index) => {
                console.log(`${index + 1}. ${course.courseCode} - ${course.title}`);
                console.log(`   Students: ${course.enrolledStudents ? course.enrolledStudents.length : 0}`);
              });
              
              // Test course students for first course
              const courseId = coursesData.data[0]._id;
              console.log(`\n✅ Testing Students for Course: ${courseId}`);
              
              const studentsOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/courses/' + courseId + '/students',
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + loginResp.token
                }
              };
              
              const studentsReq = http.request(studentsOptions, (studentsRes) => {
                console.log('👥 Course Students Status:', studentsRes.statusCode);
                let studentsBody = '';
                studentsRes.on('data', chunk => {
                  studentsBody += chunk;
                });
                studentsRes.on('end', () => {
                  const studentsData = JSON.parse(studentsBody);
                  console.log('👥 Students Count:', studentsData.count);
                  
                  if (studentsData.data.length > 0) {
                    studentsData.data.forEach((student, index) => {
                      console.log(`${index + 1}. ${student.fullName} (${student.email})`);
                      console.log(`   Phone: ${student.phoneNumber || 'N/A'}`);
                      console.log(`   Address: ${student.address || 'N/A'}`);
                      console.log(`   Student ID: ${student.studentId || 'N/A'}`);
                    });
                  } else {
                    console.log('⚠️ No students found in this course');
                  }
                });
              });
              
              studentsReq.on('error', (e) => {
                console.error('❌ Students Error:', e);
              });
              
              studentsReq.end();
            }
          });
        });
        
        coursesReq.on('error', (e) => {
          console.error('❌ Courses Error:', e);
        });
        
        coursesReq.end();
      } else {
        console.log('❌ Login failed');
      }
    } catch (e) {
      console.log('❌ Login Response:', loginBody);
    }
  });
});

loginReq.on('error', (e) => {
  console.error('❌ Login Error:', e);
});

loginReq.write(loginData);
loginReq.end();
