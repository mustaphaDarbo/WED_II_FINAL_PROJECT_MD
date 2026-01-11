const http = require('http');

// Get fresh token
function getLoginToken() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      email: 'admin@ucums.edu',
      password: 'admin123'
    });
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.success) {
            resolve(response.token);
          } else {
            reject(new Error('Login failed'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function makeRequest(path, method = 'GET', data = null, token) {
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

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testDeleteOperations() {
  console.log('🧪 TESTING DELETE OPERATIONS\n');
  
  try {
    // Get login token
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    // Test 1: Create a test user first
    console.log('👤 Creating test user...');
    const timestamp = Date.now();
    const newUser = {
      fullName: `Test Delete User ${timestamp}`,
      email: `testdelete${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createResponse = await makeRequest('/api/users', 'POST', newUser, token);
    if (createResponse.status === 201 && createResponse.data.success) {
      const userId = createResponse.data.user.id;
      console.log(`✅ User created with ID: ${userId}`);
      
      // Test 2: Delete the user
      console.log('\n🗑️ Testing DELETE user...');
      const deleteResponse = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      console.log(`Delete Status: ${deleteResponse.status}`);
      console.log(`Delete Response:`, deleteResponse.data);
      
      if (deleteResponse.status === 200 && deleteResponse.data.success) {
        console.log('✅ User deletion successful!');
      } else {
        console.log('❌ User deletion failed!');
      }
    } else {
      console.log('❌ Failed to create test user');
    }
    
    // Test 3: Create a test article
    console.log('\n📰 Creating test article...');
    const newArticle = {
      title: `Test Delete Article ${timestamp}`,
      description: 'Test article for deletion',
      content: 'Test content',
      category: 'announcement'
    };
    
    const createArticleResponse = await makeRequest('/api/articles', 'POST', newArticle, token);
    if (createArticleResponse.status === 201 && createArticleResponse.data.success) {
      const articleId = createArticleResponse.data.article.id;
      console.log(`✅ Article created with ID: ${articleId}`);
      
      // Test 4: Delete the article
      console.log('\n🗑️ Testing DELETE article...');
      const deleteArticleResponse = await makeRequest(`/api/articles/${articleId}`, 'DELETE', null, token);
      console.log(`Delete Status: ${deleteArticleResponse.status}`);
      console.log(`Delete Response:`, deleteArticleResponse.data);
      
      if (deleteArticleResponse.status === 200 && deleteArticleResponse.data.success) {
        console.log('✅ Article deletion successful!');
      } else {
        console.log('❌ Article deletion failed!');
      }
    } else {
      console.log('❌ Failed to create test article');
    }
    
    // Test 5: Get courses to see if we can delete one
    console.log('\n📚 Getting courses...');
    const coursesResponse = await makeRequest('/api/courses', 'GET', null, token);
    if (coursesResponse.status === 200 && coursesResponse.data.success && coursesResponse.data.data.length > 0) {
      const courseId = coursesResponse.data.data[0].id;
      console.log(`✅ Found course with ID: ${courseId}`);
      
      // Test 6: Delete the course
      console.log('\n🗑️ Testing DELETE course...');
      const deleteCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
      console.log(`Delete Status: ${deleteCourseResponse.status}`);
      console.log(`Delete Response:`, deleteCourseResponse.data);
      
      if (deleteCourseResponse.status === 200 && deleteCourseResponse.data.success) {
        console.log('✅ Course deletion successful!');
      } else {
        console.log('❌ Course deletion failed!');
      }
    } else {
      console.log('❌ No courses found to test deletion');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testDeleteOperations();
