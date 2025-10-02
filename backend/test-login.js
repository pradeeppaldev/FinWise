const axios = require('axios');

async function testLogin() {
  try {
    // First register a user
    await axios.post('http://localhost:3000/api/v1/auth/register', {
      name: 'Test User 2',
      email: 'test2@example.com',
      password: 'password123'
    });
    
    console.log('User registered successfully');
    
    // Then try to login (this will fail because email is not verified in production)
    const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
      email: 'test2@example.com',
      password: 'password123'
    });
    
    console.log('Login Response:', response.data);
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
  }
}

testLogin();