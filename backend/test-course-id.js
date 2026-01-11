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

async function testCourseId() {
  console.log('🔍 Testing Course ID Issue\n');
  
  try {
    const token = await getLoginToken();
    console.log('✅ Authentication successful!\n');
    
    // Get courses
    const coursesResponse = await makeRequest('/api/courses', 'GET', null, token);
    console.log('Courses Status:', coursesResponse.status);
    
    if (coursesResponse.status === 200 && coursesResponse.data.success) {
      const courses = coursesResponse.data.data;
      console.log(`Found ${courses.length} courses`);
      
      if (courses.length > 0) {
        const course = courses[0];
        console.log('\n📋 First course structure:');
        console.log('_id:', course._id);
        console.log('id:', course.id);
        console.log('courseCode:', course.courseCode);
        console.log('title:', course.title);
        
        // Test delete with correct ID
        if (course._id) {
          console.log('\n🗑️ Testing DELETE with _id:', course._id);
          const deleteResponse = await makeRequest(`/api/courses/${course._id}`, 'DELETE', null, token);
          console.log('Delete Status:', deleteResponse.status);
          console.log('Delete Response:', deleteResponse.data);
        } else {
          console.log('❌ No _id found on course object');
        }
      } else {
        console.log('❌ No courses found');
      }
    } else {
      console.log('❌ Failed to get courses');
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
  }
}

testCourseId();
