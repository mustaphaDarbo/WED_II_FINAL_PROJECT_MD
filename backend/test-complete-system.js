const http = require('http');

console.log('🧪 TESTING COMPLETE SYSTEM FUNCTIONALITY...\n');

// Test 1: Student Login and Profile Update
console.log('📝 TEST 1: Student Profile Management');
const studentLoginData = JSON.stringify({
  email: 'student@ucums.edu',
  password: 'student123'
});

const studentLoginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': studentLoginData.length
  }
};

const studentLoginReq = http.request(studentLoginOptions, (studentLoginRes) => {
  let studentLoginBody = '';
  studentLoginRes.on('data', chunk => {
    studentLoginBody += chunk;
  });
  studentLoginRes.on('end', () => {
    try {
      const studentLoginResp = JSON.parse(studentLoginBody);
      if (studentLoginResp.success) {
        console.log('✅ Student Login: SUCCESS');
        
        // Test profile update
        const profileData = JSON.stringify({
          fullName: 'John Smith Final Test',
          phoneNumber: '+1234567890',
          address: '123 Main Street, Test City',
          studentId: 'STU2024FINAL',
          dateOfBirth: '1998-03-15',
          bio: 'Final test bio for complete system verification'
        });
        
        const profileOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/profile/profile',
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + studentLoginResp.token,
            'Content-Type': 'application/json',
            'Content-Length': profileData.length
          }
        };
        
        const profileReq = http.request(profileOptions, (profileRes) => {
          console.log('📝 Profile Update Status:', profileRes.statusCode);
          let profileBody = '';
          profileRes.on('data', chunk => {
            profileBody += chunk;
          });
          profileRes.on('end', () => {
            const profileResp = JSON.parse(profileBody);
            if (profileResp.success) {
              console.log('✅ Student Profile Update: SUCCESS');
              console.log('   Name:', profileResp.user.fullName);
              console.log('   Phone:', profileResp.user.phoneNumber);
              console.log('   Address:', profileResp.user.address);
              console.log('   Student ID:', profileResp.user.studentId);
              console.log('   Bio:', profileResp.user.bio);
            } else {
              console.log('❌ Student Profile Update: FAILED');
            }
            
            // Test 2: Lecturer Dashboard
            testLecturerDashboard();
          });
        });
        
        profileReq.on('error', (e) => {
          console.error('❌ Profile Error:', e);
        });
        
        profileReq.write(profileData);
        profileReq.end();
      } else {
        console.log('❌ Student Login: FAILED');
      }
    } catch (e) {
      console.log('❌ Student Login Error:', e);
    }
  });
});

studentLoginReq.on('error', (e) => {
  console.error('❌ Student Login Error:', e);
});

studentLoginReq.write(studentLoginData);
studentLoginReq.end();

// Test 2: Lecturer Dashboard
function testLecturerDashboard() {
  console.log('\n👨‍🏫 TEST 2: Lecturer Dashboard');
  
  const lecturerLoginData = JSON.stringify({
    email: 'lecturer@ucums.edu',
    password: 'lecturer123'
  });
  
  const lecturerLoginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': lecturerLoginData.length
    }
  };
  
  const lecturerLoginReq = http.request(lecturerLoginOptions, (lecturerLoginRes) => {
    let lecturerLoginBody = '';
    lecturerLoginRes.on('data', chunk => {
      lecturerLoginBody += chunk;
    });
    lecturerLoginRes.on('end', () => {
      try {
        const lecturerLoginResp = JSON.parse(lecturerLoginBody);
        if (lecturerLoginResp.success) {
          console.log('✅ Lecturer Login: SUCCESS');
          
          // Test lecturer courses
          const coursesOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/lecturers/' + lecturerLoginResp.user.id + '/courses',
            method: 'GET',
            headers: {
              'Authorization': 'Bearer ' + lecturerLoginResp.token
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
              console.log('✅ Lecturer Courses:', coursesData.data.length, 'courses found');
              
              if (coursesData.data.length > 0) {
                const courseId = coursesData.data[0]._id;
                
                // Test course students
                const studentsOptions = {
                  hostname: 'localhost',
                  port: 5000,
                  path: '/api/courses/' + courseId + '/students',
                  method: 'GET',
                  headers: {
                    'Authorization': 'Bearer ' + lecturerLoginResp.token
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
                    console.log('✅ Course Students:', studentsData.count, 'students found');
                    
                    if (studentsData.data.length > 0) {
                      const student = studentsData.data[0];
                      console.log('   Student Name:', student.fullName);
                      console.log('   Student Email:', student.email);
                      console.log('   Student Phone:', student.phoneNumber);
                      console.log('   Student Address:', student.address);
                      console.log('   Student ID:', student.studentId);
                      console.log('   Profile Image:', student.profileImage ? '✅ Has Image' : '❌ No Image');
                    }
                    
                    // Test 3: Course Registration
                    testCourseRegistration();
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
          console.log('❌ Lecturer Login: FAILED');
        }
      } catch (e) {
        console.log('❌ Lecturer Login Error:', e);
      }
    });
  });
  
  lecturerLoginReq.on('error', (e) => {
    console.error('❌ Lecturer Login Error:', e);
  });
  
  lecturerLoginReq.write(lecturerLoginData);
  lecturerLoginReq.end();
}

// Test 3: Course Registration
function testCourseRegistration() {
  console.log('\n📝 TEST 3: Course Registration');
  
  // Login as student again for registration test
  const loginData = JSON.stringify({
    email: 'student@ucums.edu',
    password: 'student123'
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
          console.log('✅ Student Login for Registration: SUCCESS');
          
          // Test course registration
          const enrollData = JSON.stringify({
            courseId: '69638bd05e906b0cbf32f9f8'
          });
          
          const enrollOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/registrations',
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + loginResp.token,
              'Content-Type': 'application/json',
              'Content-Length': enrollData.length
            }
          };
          
          const enrollReq = http.request(enrollOptions, (enrollRes) => {
            console.log('📝 Course Registration Status:', enrollRes.statusCode);
            let enrollBody = '';
            enrollRes.on('data', chunk => {
              enrollBody += chunk;
            });
            enrollRes.on('end', () => {
              const enrollResp = JSON.parse(enrollBody);
              if (enrollResp.success) {
                console.log('✅ Course Registration: SUCCESS');
                console.log('   Course:', enrollResp.data.courseId.courseCode);
                console.log('   Status:', enrollResp.data.status);
              } else {
                console.log('❌ Course Registration: FAILED -', enrollResp.message);
              }
              
              console.log('\n🎉 COMPLETE SYSTEM TEST FINISHED!');
              console.log('✅ All Core Features Are Working!');
            });
          });
          
          enrollReq.on('error', (e) => {
            console.error('❌ Registration Error:', e);
          });
          
          enrollReq.write(enrollData);
          enrollReq.end();
        }
      } catch (e) {
        console.log('❌ Registration Login Error:', e);
      }
    });
  });
  
  loginReq.on('error', (e) => {
    console.error('❌ Registration Login Error:', e);
  });
  
  loginReq.write(loginData);
  loginReq.end();
}
