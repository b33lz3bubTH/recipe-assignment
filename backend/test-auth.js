const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication API...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Registration successful');
    console.log('User ID:', registerResponse.data.data.user.id);
    console.log('Access Token:', registerResponse.data.data.tokens.accessToken.substring(0, 50) + '...');
    console.log('Refresh Token:', registerResponse.data.data.tokens.refreshToken.substring(0, 50) + '...\n');

    const accessToken = registerResponse.data.data.tokens.accessToken;
    const refreshToken = registerResponse.data.data.tokens.refreshToken;

    // Test 2: Login with the same user
    console.log('2. Testing user login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful');
    console.log('User ID:', loginResponse.data.data.user.id);
    console.log('Access Token:', loginResponse.data.data.tokens.accessToken.substring(0, 50) + '...\n');

    // Test 3: Access protected route
    console.log('3. Testing protected route access...');
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    console.log('✅ Protected route access successful');
    console.log('User Profile:', profileResponse.data.data);
    console.log('');

    // Test 4: Verify token
    console.log('4. Testing token verification...');
    const verifyResponse = await axios.post(`${BASE_URL}/auth/verify`, {
      token: accessToken
    });
    
    console.log('✅ Token verification successful');
    console.log('Token Payload:', verifyResponse.data.data);
    console.log('');

    // Test 5: Refresh token
    console.log('5. Testing token refresh...');
    const refreshResponse = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken: refreshToken
    });
    
    console.log('✅ Token refresh successful');
    console.log('New Access Token:', refreshResponse.data.data.accessToken.substring(0, 50) + '...');
    console.log('New Refresh Token:', refreshResponse.data.data.refreshToken.substring(0, 50) + '...\n');

    // Test 6: Test invalid login
    console.log('6. Testing invalid login...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid login correctly rejected');
        console.log('Error message:', error.response.data.message);
      }
    }
    console.log('');

    // Test 7: Test duplicate registration
    console.log('7. Testing duplicate registration...');
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('✅ Duplicate registration correctly rejected');
        console.log('Error message:', error.response.data.message);
      }
    }
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/health');
    console.log('✅ Server is running');
    await testAuth();
  } catch (error) {
    console.error('❌ Server is not running. Please start the server first with: npm run dev');
  }
}

checkServer(); 