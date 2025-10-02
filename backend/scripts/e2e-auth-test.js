const fetch = require('node-fetch');

const base = 'http://localhost:3000/api/v1';

(async function() {
  try {
    console.log('Registering test user...');
    const registerRes = await fetch(`${base}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E Test', email: `e2e_test_${Date.now()}@example.com`, password: 'password123' })
    });
    const registerJson = await registerRes.json();
    console.log('Register status:', registerRes.status, registerJson);

    // If registration succeeded, try login
    if (registerJson && registerJson.success) {
      const email = registerJson.email || registerJson.user?.email || registerJson?.data?.email;
      // For the script we use the same email used above; but register response doesn't echo email.
      // So we will parse from the request we sent (we know it in this script) — easier: store it.
    }
  } catch (err) {
    console.error('E2E script error:', err.message);
  }
})();
