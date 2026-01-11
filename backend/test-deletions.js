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

async function testDeletions() {
  console.log('🗑️ TESTING DELETION OPERATIONS\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    // Test 1: Create and Delete User
    console.log('👤 Test 1: User Creation & Deletion');
    const timestamp = Date.now();
    const newUser = {
      fullName: `Delete Test User ${timestamp}`,
      email: `deletetest${timestamp}@ucums.edu`,
      password: 'password123',
      role: 'student'
    };
    
    const createUserResponse = await makeRequest('/api/users', 'POST', newUser, token);
    if (createUserResponse.status === 201 && createUserResponse.data.success) {
      const userId = createUserResponse.data.user.id;
      console.log(`✅ User created with ID: ${userId}`);
      
      const deleteUserResponse = await makeRequest(`/api/users/${userId}`, 'DELETE', null, token);
      console.log(`Delete Status: ${deleteUserResponse.status}`);
      console.log(`Delete Response: ${JSON.stringify(deleteUserResponse.data)}`);
      
      if (deleteUserResponse.status === 200 && deleteUserResponse.data.success) {
        console.log('✅ User deletion: SUCCESS');
      } else {
        console.log('❌ User deletion: FAILED');
      }
    } else {
      console.log('❌ User creation: FAILED');
    }
    
    // Test 2: Create and Delete Course
    console.log('\n📚 Test 2: Course Creation & Deletion');
    
    // Get a lecturer
    const usersResponse = await makeRequest('/api/users', 'GET', null, token);
    if (usersResponse.status === 200 && usersResponse.data.success) {
      const lecturers = usersResponse.data.users.filter(u => u.role === 'lecturer');
      
      if (lecturers.length > 0) {
        const lecturer = lecturers[0];
        console.log(`✅ Using lecturer: ${lecturer.fullName} (ID: ${lecturer._id})`);
        
        const newCourse = {
          courseCode: 'DEL123',
          title: 'Delete Test Course',
          description: 'Test course for deletion',
          lecturerId: lecturer._id,
          creditUnits: 3,
          semester: 'first',
          academicYear: '2024/2025',
          maxStudents: 30
        };
        
        const createCourseResponse = await makeRequest('/api/courses', 'POST', newCourse, token);
        if (createCourseResponse.status === 201 && createCourseResponse.data.success) {
          const courseId = createCourseResponse.data.data._id;
          console.log(`✅ Course created with ID: ${courseId}`);
          
          const deleteCourseResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
          console.log(`Delete Status: ${deleteCourseResponse.status}`);
          console.log(`Delete Response: ${JSON.stringify(deleteCourseResponse.data)}`);
          
          if (deleteCourseResponse.status === 200 && deleteCourseResponse.data.success) {
            console.log('✅ Course deletion: SUCCESS');
          } else {
            console.log('❌ Course deletion: FAILED');
          }
        } else {
          console.log('❌ Course creation: FAILED');
        }
      } else {
        console.log('❌ No lecturers found');
      }
    } else {
      console.log('❌ Failed to get users');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testDeletions();
