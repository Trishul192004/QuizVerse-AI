async function test() {
    try {
        console.log('Logging in as student...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'rahul@gmail.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();

        if (!loginRes.ok) {
            throw new Error('Login failed: ' + JSON.stringify(loginData));
        }

        const token = loginData.accessToken;
        console.log('Login successful. Token:', token);

        console.log('Joining classroom with code FRZHSQ...');
        const joinRes = await fetch('http://localhost:5000/api/classrooms/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                joinCode: 'FRZHSQ'
            })
        });
        const joinData = await joinRes.json();

        console.log('Join response status:', joinRes.status);
        console.log('Join response body:', joinData);
    } catch (error) {
        console.error('Error during test:', error.message);
    }
}

test();
