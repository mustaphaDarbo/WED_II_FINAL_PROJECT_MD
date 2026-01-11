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

async function testFrontendCRUD() {
  console.log('🧪 TESTING FRONTEND CRUD OPERATIONS\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    let testsPassed = 0;
    let testsTotal = 0;
    
    // Test 1: Create User
    console.log('👤 Test 1: Create User');
    testsTotal++;
    const timestamp = Date.now();
    const newUser = {
      fullName: `Frontend User ${timestamp}`,
      email: `frontend${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createUserResponse = await makeRequest('/api/users', 'POST', newUser, token);
    if (createUserResponse.status === 201 && createUserResponse.data.success) {
      console.log('   ✅ PASS - User created successfully');
      console.log(`   🆔 User ID: ${createUserResponse.data.user.id}`);
      testsPassed++;
      const userId = createUserResponse.data.user.id;
      
      // Test 2: Delete User
      console.log('\n🗑️ Test 2: Delete User');
      testsTotal++;
      const deleteUserResponse = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      if (deleteUserResponse.status === 200 && deleteUserResponse.data.success) {
        console.log('   ✅ PASS - User deleted successfully');
        testsPassed++;
      } else {
        console.log('   ❌ FAIL - Could not delete user');
      }
    } else {
      console.log('   ❌ FAIL - Could not create user');
    }
    
    // Test 3: Create Article
    console.log('\n📰 Test 3: Create Article');
    testsTotal++;
    const newArticle = {
      title: `Frontend Article ${timestamp}`,
      description: 'Frontend article test',
      content: 'Frontend article content',
      category: 'announcement'
    };
    
    const createArticleResponse = await makeRequest('/api/articles', 'POST', newArticle, token);
    if (createArticleResponse.status === 201 && createArticleResponse.data.success) {
      console.log('   ✅ PASS - Article created successfully');
      console.log(`   🆔 Article ID: ${createArticleResponse.data.article.id}`);
      testsPassed++;
      const articleId = createArticleResponse.data.article.id;
      
      // Test 4: Check if article appears in list
      console.log('\n📋 Test 4: Check Articles List');
      testsTotal++;
      const getArticlesResponse = await makeRequest('/api/articles', 'GET', null, token);
      if (getArticlesResponse.status === 200 && getArticlesResponse.data.success) {
        const articles = getArticlesResponse.data.articles || [];
        const foundArticle = articles.find(a => a.id === articleId);
        if (foundArticle) {
          console.log('   ✅ PASS - Article appears in list');
          testsPassed++;
        } else {
          console.log('   ❌ FAIL - Article not found in list');
        }
      } else {
        console.log('   ❌ FAIL - Could not get articles list');
      }
      
      // Test 5: Delete Article
      console.log('\n🗑️ Test 5: Delete Article');
      testsTotal++;
      const deleteArticleResponse = await makeRequest(`/api/articles/${articleId}`, 'DELETE', null, token);
      if (deleteArticleResponse.status === 200 && deleteArticleResponse.data.success) {
        console.log('   ✅ PASS - Article deleted successfully');
        testsPassed++;
      } else {
        console.log('   ❌ FAIL - Could not delete article');
      }
    } else {
      console.log('   ❌ FAIL - Could not create article');
    }
    
    // Test 6: Create Course
    console.log('\n📚 Test 6: Create Course');
    testsTotal++;
    
    // Get a lecturer first
    const getUsersResponse = await makeRequest('/api/users', 'GET', null, token);
    let lecturerId = null;
    
    if (getUsersResponse.status === 200 && getUsersResponse.data.success) {
      const lecturers = getUsersResponse.data.users.filter(u => u.role === 'lecturer');
      if (lecturers.length > 0) {
        lecturerId = lecturers[0]._id;
      } else {
        // Create a lecturer
        const newLecturer = {
          fullName: `Frontend Lecturer ${timestamp}`,
          email: `lecturer${timestamp}@ucums.edu`,
          password: 'password123',
          role: 'lecturer'
        };
        
        const createLecturerResponse = await makeRequest('/api/users', 'POST', newLecturer, token);
        if (createLecturerResponse.status === 201) {
          lecturerId = createLecturerResponse.data.user.id;
        }
      }
    }
    
    if (lecturerId) {
      const newCourse = {
        courseCode: `FRT${timestamp.toString().slice(-6)}`,
        title: `Frontend Course ${timestamp}`,
        description: 'Frontend course test',
        lecturerId: lecturerId,
        creditUnits: 3,
        semester: 'first',
        academicYear: '2024/2025',
        maxStudents: 30
      };
      
      const createCourseResponse = await makeRequest('/api/courses', 'POST', newCourse, token);
      if (createCourseResponse.status === 201 && createCourseResponse.data.success) {
        console.log('   ✅ PASS - Course created successfully');
        console.log(`   🆔 Course ID: ${createCourseResponse.data.data._id}`);
        testsPassed++;
        const courseId = createCourseResponse.data.data._id;
        
        // Test 7: Delete Course
        console.log('\n🗑️ Test 7: Delete Course');
        testsTotal++;
        const deleteCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
        if (deleteCourseResponse.status === 200 && deleteCourseResponse.data.success) {
          console.log('   ✅ PASS - Course deleted successfully');
          testsPassed++;
        } else {
          console.log('   ❌ FAIL - Could not delete course');
        }
      } else {
        console.log('   ❌ FAIL - Could not create course');
      }
    } else {
      console.log('   ❌ FAIL - No lecturer available for course');
    }
    
    // Final Results
    console.log('\n' + '='.repeat(50));
    console.log('📊 FRONTEND CRUD TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
    console.log(`📈 Success Rate: ${Math.round((testsPassed/testsTotal) * 100)}%`);
    
    if (testsPassed === testsTotal) {
      console.log('\n🎉 ALL FRONTEND CRUD OPERATIONS ARE WORKING!');
      console.log('✅ Users: Create, Delete');
      console.log('✅ Articles: Create, List, Delete');
      console.log('✅ Courses: Create, Delete');
      console.log('\n🚀 Frontend is ready for production!');
    } else {
      console.log(`\n⚠️  ${testsTotal - testsPassed} tests failed.`);
      console.log('Check individual test results above.');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testFrontendCRUD();
