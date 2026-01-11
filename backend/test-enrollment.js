const http = require('http');

// Test student login and enroll in a new course
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
        console.log('✅ Testing Enrollment in Course 69638bd05e906b0cbf32f9f8...');
        
        const enrollData = JSON.stringify({
          studentId: loginResp.user.id
        });
        
        const enrollOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/courses/69638bd05e906b0cbf32f9f8/enroll',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + loginResp.token,
            'Content-Type': 'application/json',
            'Content-Length': enrollData.length
          }
        };
        
        const enrollReq = http.request(enrollOptions, (enrollRes) => {
          console.log('📝 Enrollment Status:', enrollRes.statusCode);
          let enrollBody = '';
          enrollRes.on('data', chunk => {
            enrollBody += chunk;
          });
          enrollRes.on('end', () => {
            console.log('📝 Enrollment Response:', enrollBody);
          });
        });
        
        enrollReq.on('error', (e) => {
          console.error('❌ Enrollment Error:', e);
        });
        
        enrollReq.write(enrollData);
        enrollReq.end();
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
