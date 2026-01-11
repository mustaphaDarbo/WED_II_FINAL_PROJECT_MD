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

async function debugCRUDIssues() {
  console.log('🔍 DEBUGGING CRUD ISSUES\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    // Test 1: Create User
    console.log('👤 Testing User Creation...');
    const timestamp = Date.now();
    const newUser = {
      fullName: `Debug User ${timestamp}`,
      email: `debug${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createUserResponse = await makeRequest('/api/users', 'POST', newUser, token);
    console.log('Create User Status:', createUserResponse.status);
    console.log('Create User Response:', createUserResponse.data);
    
    if (createUserResponse.status === 201 && createUserResponse.data.success) {
      const userId = createUserResponse.data.user.id;
      console.log(`✅ User created with ID: ${userId}`);
      
      // Test 2: Try to delete user
      console.log('\n🗑️ Testing User Deletion...');
      const deleteUserResponse = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      console.log('Delete User Status:', deleteUserResponse.status);
      console.log('Delete User Response:', deleteUserResponse.data);
    }
    
    // Test 3: Create Article
    console.log('\n📰 Testing Article Creation...');
    const newArticle = {
      title: `Debug Article ${timestamp}`,
      description: 'Debug article test',
      content: 'Debug article content',
      category: 'announcement'
    };
    
    const createArticleResponse = await makeRequest('/api/articles', 'POST', newArticle, token);
    console.log('Create Article Status:', createArticleResponse.status);
    console.log('Create Article Response:', createArticleResponse.data);
    
    // Test 4: Check existing articles
    console.log('\n📋 Checking Existing Articles...');
    const getArticlesResponse = await makeRequest('/api/articles', 'GET', null, token);
    console.log('Get Articles Status:', getArticlesResponse.status);
    console.log('Articles Count:', getArticlesResponse.data.count);
    console.log('Articles Sample:', getArticlesResponse.data.articles?.slice(0, 2));
    
    // Test 5: Create Course
    console.log('\n📚 Testing Course Creation...');
    
    // First get a lecturer
    const getUsersResponse = await makeRequest('/api/users', 'GET', null, token);
    let lecturerId = null;
    
    if (getUsersResponse.status === 200 && getUsersResponse.data.success) {
      const lecturers = getUsersResponse.data.users.filter(u => u.role === 'lecturer');
      if (lecturers.length > 0) {
        lecturerId = lecturers[0]._id;
        console.log(`Found lecturer: ${lecturers[0].fullName} (${lecturerId})`);
      } else {
        // Create a lecturer
        console.log('No lecturer found, creating one...');
        const newLecturer = {
          fullName: `Debug Lecturer ${timestamp}`,
          email: `lecturer${timestamp}@ucums.edu`,
          password: 'password123',
          role: 'lecturer'
        };
        
        const createLecturerResponse = await makeRequest('/api/users', 'POST', newLecturer, token);
        if (createLecturerResponse.status === 201) {
          lecturerId = createLecturerResponse.data.user.id;
          console.log(`Created lecturer with ID: ${lecturerId}`);
        }
      }
    }
    
    if (lecturerId) {
      const newCourse = {
        courseCode: `DBG${timestamp.toString().slice(-6)}`,
        title: `Debug Course ${timestamp}`,
        description: 'Debug course test',
        lecturerId: lecturerId,
        creditUnits: 3,
        semester: 'first',
        academicYear: '2024/2025',
        maxStudents: 30
      };
      
      const createCourseResponse = await makeRequest('/api/courses', 'POST', newCourse, token);
      console.log('Create Course Status:', createCourseResponse.status);
      console.log('Create Course Response:', createCourseResponse.data);
      
      if (createCourseResponse.status === 201 && createCourseResponse.data.success) {
        const courseId = createCourseResponse.data.data._id;
        console.log(`✅ Course created with ID: ${courseId}`);
        
        // Test 6: Try to delete course
        console.log('\n🗑️ Testing Course Deletion...');
        const deleteCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
        console.log('Delete Course Status:', deleteCourseResponse.status);
        console.log('Delete Course Response:', deleteCourseResponse.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug Error:', error.message);
  }
}

debugCRUDIssues();
