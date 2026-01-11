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

async function runCompleteCRUDTest() {
  console.log('🚀 STARTING COMPREHENSIVE CRUD TEST\n');
  
  try {
    // Get login token
    console.log('🔐 Getting authentication token...');
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    let testsPassed = 0;
    let testsTotal = 0;
    
    // Test 1: Get all articles
    console.log('📰 Test 1: GET Articles');
    testsTotal++;
    const articlesGet = await makeRequest('/api/articles', 'GET', null, token);
    if (articlesGet.status === 200 && articlesGet.data.success) {
      console.log('   ✅ PASS - Articles retrieved successfully');
      console.log(`   📊 Count: ${articlesGet.data.count}`);
      testsPassed++;
    } else {
      console.log('   ❌ FAIL - Could not retrieve articles');
    }
    
    // Test 2: Create new article
    console.log('\n📝 Test 2: CREATE Article');
    testsTotal++;
    const newArticle = {
      title: `Test Article ${Date.now()}`,
      description: 'Comprehensive test article',
      content: 'This is a comprehensive test article content',
      category: 'announcement',
      status: 'published'
    };
    
    const articleCreate = await makeRequest('/api/articles', 'POST', newArticle, token);
    if (articleCreate.status === 201 && articleCreate.data.success) {
      console.log('   ✅ PASS - Article created successfully');
      console.log(`   🆔 Article ID: ${articleCreate.data.article.id}`);
      testsPassed++;
      const articleId = articleCreate.data.article.id;
      
      // Test 3: Update article
      console.log('\n✏️ Test 3: UPDATE Article');
      testsTotal++;
      const updatedArticle = {
        title: `Updated Article ${Date.now()}`,
        description: 'Updated description',
        content: 'Updated content',
        category: 'news',
        status: 'published'
      };
      
      const articleUpdate = await makeRequest(`/api/articles/${articleId}`, 'PUT', updatedArticle, token);
      if (articleUpdate.status === 200 && articleUpdate.data.success) {
        console.log('   ✅ PASS - Article updated successfully');
        testsPassed++;
        
        // Test 4: Delete article
        console.log('\n🗑️ Test 4: DELETE Article');
        testsTotal++;
        const articleDelete = await makeRequest(`/api/articles/${articleId}`, 'DELETE', null, token);
        if (articleDelete.status === 200 && articleDelete.data.success) {
          console.log('   ✅ PASS - Article deleted successfully');
          testsPassed++;
        } else {
          console.log('   ❌ FAIL - Could not delete article');
        }
      } else {
        console.log('   ❌ FAIL - Could not update article');
      }
    } else {
      console.log('   ❌ FAIL - Could not create article');
    }
    
    // Test 5: Get all users
    console.log('\n👥 Test 5: GET Users');
    testsTotal++;
    const usersGet = await makeRequest('/api/users', 'GET', null, token);
    if (usersGet.status === 200 && usersGet.data.success) {
      console.log('   ✅ PASS - Users retrieved successfully');
      console.log(`   📊 Count: ${usersGet.data.count}`);
      testsPassed++;
    } else {
      console.log('   ❌ FAIL - Could not retrieve users');
    }
    
    // Test 6: Create new user
    console.log('\n👤 Test 6: CREATE User');
    testsTotal++;
    const timestamp = Date.now();
    const newUser = {
      fullName: `Test User ${timestamp}`,
      email: `testuser${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const userCreate = await makeRequest('/api/users', 'POST', newUser, token);
    if (userCreate.status === 201 && userCreate.data.success) {
      console.log('   ✅ PASS - User created successfully');
      console.log(`   🆔 User ID: ${userCreate.data.user.id}`);
      testsPassed++;
      const userId = userCreate.data.user.id;
      
      // Test 7: Delete user
      console.log('\n🗑️ Test 7: DELETE User');
      testsTotal++;
      const userDelete = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      if (userDelete.status === 200 && userDelete.data.success) {
        console.log('   ✅ PASS - User deleted successfully');
        testsPassed++;
      } else {
        console.log('   ❌ FAIL - Could not delete user');
      }
    } else {
      console.log('   ❌ FAIL - Could not create user');
    }
    
    // Test 8: Get all courses
    console.log('\n📚 Test 8: GET Courses');
    testsTotal++;
    const coursesGet = await makeRequest('/api/courses', 'GET', null, token);
    if (coursesGet.status === 200 && coursesGet.data.success) {
      console.log('   ✅ PASS - Courses retrieved successfully');
      console.log(`   📊 Count: ${coursesGet.data.count}`);
      testsPassed++;
    } else {
      console.log('   ❌ FAIL - Could not retrieve courses');
    }
    
    // Final Results
    console.log('\n' + '='.repeat(50));
    console.log('📊 COMPREHENSIVE CRUD TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
    console.log(`📈 Success Rate: ${Math.round((testsPassed/testsTotal) * 100)}%`);
    
    if (testsPassed === testsTotal) {
      console.log('\n🎉 ALL CRUD OPERATIONS ARE WORKING PERFECTLY!');
      console.log('✅ The UCUMS system is fully functional.');
    } else {
      console.log(`\n⚠️  ${testsTotal - testsPassed} tests failed. Check the errors above.`);
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

runCompleteCRUDTest();
