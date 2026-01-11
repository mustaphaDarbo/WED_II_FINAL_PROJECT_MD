const http = require('http');

// First create a lecturer user
const lecturerData = JSON.stringify({
  fullName: 'Dr. John Smith',
  email: 'smith@ucums.edu',
  password: 'lecturer123',
  role: 'lecturer'
});

const lecturerOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': lecturerData.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
  }
};

const lecturerReq = http.request(lecturerOptions, (res) => {
  console.log(`Lecturer Creation Status: ${res.statusCode}`);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`Lecturer Creation Response: ${body}`);
    
    // Parse the response to get lecturer ID
    const lecturerResponse = JSON.parse(body);
    if (lecturerResponse.success && lecturerResponse.user) {
      const lecturerId = lecturerResponse.user.id;
      
      // Now create the course with the lecturer ID
      const courseData = JSON.stringify({
        courseCode: 'CS101',
        title: 'Introduction to Computer Science',
        description: 'This is a foundational course in computer science.',
        creditUnits: 3,
        lecturerId: lecturerId,
        semester: 'first',
        academicYear: '2024/2025',
        maxStudents: 50
      });

      const courseOptions = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/courses',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': courseData.length,
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
        }
      };

      const courseReq = http.request(courseOptions, (courseRes) => {
        console.log(`Course Creation Status: ${courseRes.statusCode}`);
        console.log(`Course Creation Headers: ${JSON.stringify(courseRes.headers, null, 2)}`);
        
        courseRes.setEncoding('utf8');
        let courseBody = '';
        courseRes.on('data', (chunk) => {
          courseBody += chunk;
        });
        courseRes.on('end', () => {
          console.log(`Course Creation Response: ${courseBody}`);
        });
      });

      courseReq.on('error', (e) => {
        console.error(`Problem with course request: ${e.message}`);
      });

      courseReq.write(courseData);
      courseReq.end();
    }
  });
});

lecturerReq.on('error', (e) => {
  console.error(`Problem with lecturer request: ${e.message}`);
});

lecturerReq.write(lecturerData);
lecturerReq.end();
