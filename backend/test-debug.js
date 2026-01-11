const http = require('http');

const data = JSON.stringify({
  title: 'Test Article',
  description: 'This is a test article description for UCUMS system.',
  content: 'This is a test article content for UCUMS system.',
  status: 'published',
  category: 'academic'
});

console.log('Sending data:', data);

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/articles',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODA4NDEyOCwiZXhwIjoxNzY4Njg4OTI4fQ.TRvSqAG5mlBwIMnEaYOg2pBwkOpxTJOCZ7PRK21B7jk'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers, null, 2)}`);
  
  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log(`Response: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
