const http = require('http');

// Test token (you may need to update this after login)
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFhOTY2YWViOGM5MzE2MzY1OGM0YiIsImlhdCI6MTc2ODEyNTg2OSwiZXhwIjoxNzY4NzMwNjY5fQ.mIjb9OjDlLDrwpazkFAz1P-_THTOK6uuBK4qjf_DciM';

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testCRUD() {
  console.log('🧪 Testing CRUD Operations...\n');

  try {
    // Test 1: Get all articles
    console.log('1️⃣ Testing GET Articles...');
    const articlesResponse = await makeRequest('/api/articles');
    console.log(`   Status: ${articlesResponse.status}`);
    console.log(`   Success: ${articlesResponse.data.success}`);
    console.log(`   Count: ${articlesResponse.data.count}\n`);

    // Test 2: Create new article
    console.log('2️⃣ Testing CREATE Article...');
    const newArticle = {
      title: 'Test CRUD Article',
      description: 'This is a test article for CRUD operations',
      content: 'This is the full content of the test article created via CRUD test.',
      category: 'announcement',
      status: 'published'
    };
    
    const createResponse = await makeRequest('/api/articles', 'POST', newArticle);
    console.log(`   Status: ${createResponse.status}`);
    console.log(`   Success: ${createResponse.data.success}`);
    if (createResponse.data.success) {
      console.log(`   Article ID: ${createResponse.data.article.id}\n`);
    }

    // Test 3: Get all users
    console.log('3️⃣ Testing GET Users...');
    const usersResponse = await makeRequest('/api/users');
    console.log(`   Status: ${usersResponse.status}`);
    console.log(`   Success: ${usersResponse.data.success}`);
    console.log(`   Count: ${usersResponse.data.count}\n`);

    // Test 4: Create new user
    console.log('4️⃣ Testing CREATE User...');
    const timestamp = Date.now();
    const newUser = {
      fullName: 'Test CRUD User',
      email: `testcrud${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createUserResponse = await makeRequest('/api/users', 'POST', newUser);
    console.log(`   Status: ${createUserResponse.status}`);
    console.log(`   Success: ${createUserResponse.data.success}`);
    if (createUserResponse.data.success) {
      console.log(`   User ID: ${createUserResponse.data.user.id}\n`);
    }

    // Test 5: Get all courses
    console.log('5️⃣ Testing GET Courses...');
    const coursesResponse = await makeRequest('/api/courses');
    console.log(`   Status: ${coursesResponse.status}`);
    console.log(`   Success: ${coursesResponse.data.success}`);
    console.log(`   Count: ${coursesResponse.data.count}\n`);

    console.log('✅ CRUD Operations Test Complete!');

  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testCRUD();
