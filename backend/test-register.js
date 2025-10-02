const axios = require('axios');

async function testRegistration() {
  try {
    const response = await axios.post('http://localhost:3000/api/v1/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Registration Response:', response.data);
  } catch (error) {
    console.error('Registration Error:', error.response ? error.response.data : error.message);
  }
}

testRegistration();