const http = require('http');

// Test frontend authentication issue
function testFrontendAuth() {
  console.log('🔍 TESTING FRONTEND AUTHENTICATION\n');
  
  // Test 1: Check if user is logged in
  console.log('Testing localStorage authentication...');
  
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('userToken');
    const userRole = localStorage.getItem('userRole');
    const currentUser = localStorage.getItem('currentUser');
    
    console.log(`Token exists: ${!!token}`);
    console.log(`User role: ${userRole}`);
    console.log(`Current user: ${currentUser ? 'Yes' : 'No'}`);
    
    if (token && userRole === 'admin') {
      console.log('✅ Frontend authentication looks good');
      
      // Test 2: Try API call with frontend token
      console.log('\nTesting API call with frontend token...');
      
      const testData = JSON.stringify({
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
          'Content-Length': testData.length
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          try {
            const response = JSON.parse(body);
            if (response.success) {
              console.log('✅ Backend authentication works');
              
              // Test 3: Try a protected endpoint
              console.log('\nTesting protected endpoint...');
              const protectedOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/users',
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${response.token}`
                }
              };

              const protectedReq = http.request(protectedOptions, (protectedRes) => {
                console.log(`Protected endpoint status: ${protectedRes.statusCode}`);
                
                if (protectedRes.statusCode === 200) {
                  console.log('✅ Protected endpoint access: SUCCESS');
                } else {
                  console.log('❌ Protected endpoint access: FAILED');
                }
              });

              protectedReq.on('error', (e) => {
                console.error('Protected endpoint error:', e);
              });

              protectedReq.end();
            } else {
              console.log('❌ Backend authentication failed');
            }
          } catch (e) {
            console.log('Response parse error:', e);
          }
        });
      });

      req.on('error', (e) => {
        console.error('Login test error:', e);
      });

      req.write(testData);
      req.end();
    } else {
      console.log('❌ Frontend authentication issue - no token or not admin');
    }
  } else {
    console.log('❌ localStorage not available');
  }
}

// Simulate browser environment
global.localStorage = {
  getItem: function(key) {
    // Simulate checking if user is logged in
    if (key === 'userToken') return 'test-token';
    if (key === 'userRole') return 'admin';
    if (key === 'currentUser') return '{}';
    return null;
  }
};

testFrontendAuth();
