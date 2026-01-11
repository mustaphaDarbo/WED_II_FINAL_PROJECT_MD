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

async function testCourseCRUD() {
  console.log('🧪 TESTING COURSE CRUD\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    // Get users to find a lecturer
    console.log('👨‍🏫 Getting users...');
    const usersResponse = await makeRequest('/api/users', 'GET', null, token);
    
    if (usersResponse.status === 200 && usersResponse.data.success) {
      const lecturers = usersResponse.data.users.filter(u => u.role === 'lecturer');
      
      if (lecturers.length > 0) {
        const lecturer = lecturers[0];
        console.log(`✅ Found lecturer: ${lecturer.fullName} (ID: ${lecturer._id})`);
        
        // Create course
        console.log('\n📚 Creating course...');
        const newCourse = {
          courseCode: 'CRUD123',
          title: 'Test Course CRUD',
          description: 'Test course for CRUD operations',
          lecturerId: lecturer._id,
          creditUnits: 3,
          semester: 'first',
          academicYear: '2024/2025',
          maxStudents: 30
        };
        
        const createResponse = await makeRequest('/api/courses', 'POST', newCourse, token);
        console.log('Create Status:', createResponse.status);
        console.log('Create Response:', createResponse.data);
        
        if (createResponse.status === 201 && createResponse.data.success) {
          const courseId = createResponse.data.data._id;
          console.log(`✅ Course created with ID: ${courseId}`);
          
          // Delete course
          console.log('\n🗑️ Deleting course...');
          const deleteResponse = await makeRequest(`/api/courses/${courseId}`, 'DELETE', null, token);
          console.log('Delete Status:', deleteResponse.status);
          console.log('Delete Response:', deleteResponse.data);
          
          if (deleteResponse.status === 200 && deleteResponse.data.success) {
            console.log('✅ Course deleted successfully!');
          } else {
            console.log('❌ Course deletion failed!');
          }
        } else {
          console.log('❌ Course creation failed!');
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

testCourseCRUD();
