const http = require('http');

console.log('Testing User Creation...');
const userData = JSON.stringify({
  fullName: 'Test User Final',
  email: 'testfinal@ucums.edu',
  password: 'password123',
  role: 'student'
});

const userOptions = {
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

const userReq = http.request(userOptions, (res) => {
  console.log(`User Creation Status: ${res.statusCode}`);
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log(`User Creation Response: ${body}`);
  });
});

userReq.on('error', (e) => { console.error(`User request error: ${e.message}`); });
userReq.write(userData);
userReq.end();

setTimeout(() => {
  console.log('\nTesting Article Creation...');
  const articleData = JSON.stringify({
    title: 'Test Article Final',
    description: 'Test description for final check',
    content: 'Test content for final check',
    category: 'education',
    author: 'Admin User'
  });

  const articleOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/articles',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': articleData.length,
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
    }
  };

  const articleReq = http.request(articleOptions, (res) => {
    console.log(`Article Creation Status: ${res.statusCode}`);
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log(`Article Creation Response: ${body}`);
    });
  });

  articleReq.on('error', (e) => { console.error(`Article request error: ${e.message}`); });
  articleReq.write(articleData);
  articleReq.end();
}, 2000);

setTimeout(() => {
  console.log('\nTesting Course Creation...');
  const courseData = JSON.stringify({
    courseCode: 'CS201',
    title: 'Test Course Final',
    description: 'Test course description',
    lecturerId: '6962dc589e071ac3d057bf0a', // Using existing lecturer ID
    creditUnits: 3,
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

  const courseReq = http.request(courseOptions, (res) => {
    console.log(`Course Creation Status: ${res.statusCode}`);
    res.setEncoding('utf8');
    let body = '';
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => {
      console.log(`Course Creation Response: ${body}`);
    });
  });

  courseReq.on('error', (e) => { console.error(`Course request error: ${e.message}`); });
  courseReq.write(courseData);
  courseReq.end();
}, 4000);
