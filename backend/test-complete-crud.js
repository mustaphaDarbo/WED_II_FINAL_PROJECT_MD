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

async function testCompleteCRUD() {
  console.log('🚀 COMPLETE CRUD OPERATIONS TEST\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    let testsPassed = 0;
    let testsTotal = 0;
    
    // Step 1: Create a lecturer first
    console.log('👨‍🏫 Creating lecturer for course tests...');
    const timestamp = Date.now();
    const newLecturer = {
      fullName: `Test Lecturer ${timestamp}`,
      email: `lecturer${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'lecturer'
    };
    
    const createLecturerResponse = await makeRequest('/api/users', 'POST', newLecturer, token);
    let lecturerId = null;
    
    if (createLecturerResponse.status === 201 && createLecturerResponse.data.success) {
      lecturerId = createLecturerResponse.data.user.id;
      console.log(`✅ Lecturer created with ID: ${lecturerId}`);
    } else {
      console.log('❌ Failed to create lecturer');
      return;
    }
    
    // Test Users CRUD
    console.log('\n👥 TESTING USERS CRUD');
    console.log('='.repeat(30));
    
    // Create User
    testsTotal++;
    const newUser = {
      fullName: `Test Student ${timestamp}`,
      email: `student${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createUserResponse = await makeRequest('/api/users', 'POST', newUser, token);
    if (createUserResponse.status === 201 && createUserResponse.data.success) {
      console.log('✅ CREATE User: SUCCESS');
      testsPassed++;
      const userId = createUserResponse.data.user.id;
      
      // Delete User
      testsTotal++;
      const deleteUserResponse = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      if (deleteUserResponse.status === 200 && deleteUserResponse.data.success) {
        console.log('✅ DELETE User: SUCCESS');
        testsPassed++;
      } else {
        console.log('❌ DELETE User: FAILED');
      }
    } else {
      console.log('❌ CREATE User: FAILED');
    }
    
    // Test Articles CRUD
    console.log('\n📰 TESTING ARTICLES CRUD');
    console.log('='.repeat(30));
    
    // Create Article
    testsTotal++;
    const newArticle = {
      title: `Test Article ${timestamp}`,
      description: 'Test article for CRUD operations',
      content: 'Test content for CRUD operations',
      category: 'announcement'
    };
    
    const createArticleResponse = await makeRequest('/api/articles', 'POST', newArticle, token);
    if (createArticleResponse.status === 201 && createArticleResponse.data.success) {
      console.log('✅ CREATE Article: SUCCESS');
      testsPassed++;
      const articleId = createArticleResponse.data.article.id;
      
      // Update Article
      testsTotal++;
      const updatedArticle = {
        title: `Updated Article ${timestamp}`,
        description: 'Updated description',
        content: 'Updated content',
        category: 'news'
      };
      
      const updateArticleResponse = await makeRequest(`/api/articles/${articleId}`, 'PUT', updatedArticle, token);
      if (updateArticleResponse.status === 200 && updateArticleResponse.data.success) {
        console.log('✅ UPDATE Article: SUCCESS');
        testsPassed++;
        
        // Delete Article
        testsTotal++;
        const deleteArticleResponse = await makeRequest(`/api/articles/${articleId}`, 'DELETE', null, token);
        if (deleteArticleResponse.status === 200 && deleteArticleResponse.data.success) {
          console.log('✅ DELETE Article: SUCCESS');
          testsPassed++;
        } else {
          console.log('❌ DELETE Article: FAILED');
        }
      } else {
        console.log('❌ UPDATE Article: FAILED');
      }
    } else {
      console.log('❌ CREATE Article: FAILED');
    }
    
    // Test Courses CRUD
    console.log('\n📚 TESTING COURSES CRUD');
    console.log('='.repeat(30));
    
    // Create Course
    testsTotal++;
    const newCourse = {
      courseCode: `TST${timestamp.toString().slice(-6)}`,
      title: `Test Course ${timestamp}`,
      description: 'Test course for CRUD operations',
      lecturerId: lecturerId,
      creditUnits: 3,
      semester: 'first',
      academicYear: '2024/2025',
      maxStudents: 30
    };
    
    const createCourseResponse = await makeRequest('/api/courses', 'POST', newCourse, token);
    if (createCourseResponse.status === 201 && createCourseResponse.data.success) {
      console.log('✅ CREATE Course: SUCCESS');
      testsPassed++;
      const courseId = createCourseResponse.data.data._id;
      
      // Update Course
      testsTotal++;
      const updatedCourse = {
        title: `Updated Course ${timestamp}`,
        description: 'Updated course description',
        creditUnits: 4
      };
      
      const updateCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'PUT', updatedCourse, token);
      if (updateCourseResponse.status === 200 && updateCourseResponse.data.success) {
        console.log('✅ UPDATE Course: SUCCESS');
        testsPassed++;
        
        // Delete Course
        testsTotal++;
        const deleteCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
        if (deleteCourseResponse.status === 200 && deleteCourseResponse.data.success) {
          console.log('✅ DELETE Course: SUCCESS');
          testsPassed++;
        } else {
          console.log('❌ DELETE Course: FAILED');
        }
      } else {
        console.log('❌ UPDATE Course: FAILED');
      }
    } else {
      console.log('❌ CREATE Course: FAILED');
      console.log('Response:', createCourseResponse.data);
    }
    
    // Clean up lecturer
    const deleteLecturerResponse = await makeRequest(`/api/users/${lecturerId}`, 'DELETE', null, token);
    if (deleteLecturerResponse.status === 200) {
      console.log('✅ Lecturer cleaned up');
    }
    
    // Final Results
    console.log('\n' + '='.repeat(50));
    console.log('📊 FINAL CRUD TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Tests Passed: ${testsPassed}/${testsTotal}`);
    console.log(`📈 Success Rate: ${Math.round((testsPassed/testsTotal) * 100)}%`);
    
    if (testsPassed === testsTotal) {
      console.log('\n🎉 ALL CRUD OPERATIONS ARE WORKING PERFECTLY!');
      console.log('✅ Users: Create, Delete');
      console.log('✅ Articles: Create, Update, Delete');
      console.log('✅ Courses: Create, Update, Delete');
      console.log('\n🚀 The UCUMS system is fully functional!');
    } else {
      console.log(`\n⚠️  ${testsTotal - testsPassed} tests failed.`);
      console.log('Check the individual test results above.');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testCompleteCRUD();
