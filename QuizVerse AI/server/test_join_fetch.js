(async () => {
    try {
        console.log('Logging in...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'rahul@gmail.com', password: 'password123' })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) {
            console.error('Login failed', loginRes.status, loginData);
            return;
        }
        const token = loginData.accessToken;
        console.log('Token obtained');

        console.log('Joining classroom...');
        const joinRes = await fetch('http://localhost:5000/api/student/join-classroom', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ join_code: 'FRZHSQ' })
        });
        const joinData = await joinRes.json();
        console.log('Join response status:', joinRes.status);
        console.log('Join response body:', joinData);
    } catch (err) {
        console.error('Error:', err);
    }
})();
