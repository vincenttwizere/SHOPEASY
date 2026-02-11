// Node 18+ has native fetch

async function testAuth() {
    const BASE = 'http://127.0.0.1:4000/api/auth';
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    console.log('Testing Register against ' + BASE + '/register');
    try {
        const regRes = await fetch(`${BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (regRes.status === 201 || regRes.status === 200) {
            console.log('Register Success:', await regRes.json());
        } else {
            console.log('Register Failed:', regRes.status, await regRes.text());
            return; // Can't login if register failed
        }

        console.log('Testing Login against ' + BASE + '/login');
        const loginRes = await fetch(`${BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (loginRes.status === 200) {
            console.log('Login Success:', await loginRes.json());
        } else {
            console.log('Login Failed:', loginRes.status, await loginRes.text());
        }

    } catch (e) {
        console.error('Auth Test Error:', e.message);
    }
}

testAuth();
