const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple test image (1x1 pixel PNG)
const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77ygAAAABJRU5ErkJggg==', 'base64');
const testImagePath = path.join(__dirname, 'test-image.png');
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('Test image created at:', testImagePath);

// Login and get token
const loginData = JSON.stringify({
  email: 'student@ucums.edu',
  password: 'student123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const loginReq = http.request(loginOptions, (loginRes) => {
  let loginBody = '';
  loginRes.on('data', chunk => {
    loginBody += chunk;
  });
  loginRes.on('end', () => {
    try {
      const loginResp = JSON.parse(loginBody);
      if (loginResp.success) {
        console.log('✅ Login successful, testing image upload...');
        
        // Read the test image file
        const imageBuffer = fs.readFileSync(testImagePath);
        
        // Create multipart form data manually
        const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2, 9);
        const formData = [
          '--' + boundary,
          'Content-Disposition: form-data; name="profileImage"; filename="test-image.png"',
          'Content-Type: image/png',
          '',
          imageBuffer.toString('base64'),
          '--' + boundary + '--'
        ].join('\r\n');

        const uploadOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/profile/upload-profile-image',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + loginResp.token,
            'Content-Type': 'multipart/form-data; boundary=' + boundary,
            'Content-Length': Buffer.byteLength(formData)
          }
        };

        const uploadReq = http.request(uploadOptions, (uploadRes) => {
          console.log('📤 Upload Status:', uploadRes.statusCode);
          let uploadBody = '';
          uploadRes.on('data', chunk => {
            uploadBody += chunk;
          });
          uploadRes.on('end', () => {
            console.log('📤 Upload Response:', uploadBody);
            
            // Clean up test file
            fs.unlinkSync(testImagePath);
            console.log('🧹 Test image cleaned up');
          });
        });

        uploadReq.on('error', (e) => {
          console.error('❌ Upload Error:', e);
          fs.unlinkSync(testImagePath);
        });

        uploadReq.write(formData);
        uploadReq.end();
        
      } else {
        console.log('❌ Login failed');
      }
    } catch (e) {
      console.log('❌ Login Response error:', e);
    }
  });
});

loginReq.on('error', (e) => {
  console.error('❌ Login Error:', e);
});

loginReq.write(loginData);
loginReq.end();
