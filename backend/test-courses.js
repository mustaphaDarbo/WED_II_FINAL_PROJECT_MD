const http = require('http');

// Test student login and get available courses
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
        console.log('✅ Student Login: SUCCESS');
        console.log('✅ Getting Available Courses...');
        
        const coursesOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/courses',
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + loginResp.token
          }
        };
        
        const coursesReq = http.request(coursesOptions, (coursesRes) => {
          console.log('📚 Courses Status:', coursesRes.statusCode);
          let coursesBody = '';
          coursesRes.on('data', chunk => {
            coursesBody += chunk;
          });
          coursesRes.on('end', () => {
            const coursesData = JSON.parse(coursesBody);
            console.log('📚 Available Courses:');
            coursesData.data.forEach((course, index) => {
              console.log(`${index + 1}. ${course.courseCode} - ${course.title} (ID: ${course._id})`);
            });
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
