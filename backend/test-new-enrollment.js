const http = require('http');

// Create a new student for testing enrollment
const studentData = JSON.stringify({
  fullName: 'Test Student New',
  email: 'teststudent@ucums.edu',
  password: 'student123',
  role: 'student'
});

const createOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/users',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': studentData.length
  }
};

const createReq = http.request(createOptions, (createRes) => {
  console.log('👤 Create Student Status:', createRes.statusCode);
  let createBody = '';
  createRes.on('data', chunk => {
    createBody += chunk;
  });
  createRes.on('end', () => {
    console.log('👤 Create Student Response:', createBody);
    
    if (createRes.statusCode === 201) {
      // Now test enrollment with new student
      const loginData = JSON.stringify({
        email: 'teststudent@ucums.edu',
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
        console.log('🔑 New Student Login Status:', loginRes.statusCode);
        let loginBody = '';
        loginRes.on('data', chunk => {
          loginBody += chunk;
        });
        loginRes.on('end', () => {
          try {
            const loginResp = JSON.parse(loginBody);
            if (loginResp.success) {
              console.log('✅ New Student Login: SUCCESS');
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
            }
          } catch (e) {
            console.log('❌ Login Response Error:', e);
          }
        });
      });
      
      loginReq.on('error', (e) => {
        console.error('❌ Login Error:', e);
      });
      
      loginReq.write(loginData);
      loginReq.end();
    }
  });
});

createReq.on('error', (e) => {
  console.error('❌ Create Student Error:', e);
});

createReq.write(studentData);
createReq.end();
