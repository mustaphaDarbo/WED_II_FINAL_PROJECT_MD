const http = require('http');

console.log('Testing Article Creation with correct category...');
const articleData = JSON.stringify({
  title: 'Test Article Final',
  description: 'Test description for final check',
  content: 'Test content for final check',
  category: 'academic', // Using correct category
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
