const http = require('http');

// Test user creation
const userData = JSON.stringify({
  fullName: 'Test User',
  email: 'testuser@ucums.edu',
  password: 'password123',
  role: 'student'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': userData.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
  }
};

const req = http.request(options, (res) => {
  console.log(`User Creation Status: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`User Creation Response: ${body}`);
    
    // Test user deletion if we got a user ID
    if (res.statusCode === 201) {
      const response = JSON.parse(body);
      if (response.user && response.user.id) {
        const userId = response.user.id;
        
        // Test user deletion
        const deleteOptions = {
          hostname: 'localhost',
          port: 5000,
          path: `/api/users/${userId}`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
          }
        };

        const deleteReq = http.request(deleteOptions, (deleteRes) => {
          console.log(`User Deletion Status: ${deleteRes.statusCode}`);
          
          deleteRes.setEncoding('utf8');
          let deleteBody = '';
          deleteRes.on('data', (chunk) => {
            deleteBody += chunk;
          });
          deleteRes.on('end', () => {
            console.log(`User Deletion Response: ${deleteBody}`);
          });
        });

        deleteReq.on('error', (e) => {
          console.error(`Problem with delete request: ${e.message}`);
        });

        deleteReq.end();
      }
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(userData);
req.end();
