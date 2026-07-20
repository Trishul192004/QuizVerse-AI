const axios = require('axios');

async function test() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'rahul@gmail.com',
            password: 'password123'
        });
        const token = loginRes.data.accessToken;
        console.log('Token:', token);

        console.log('Joining classroom...');
        const joinRes = await axios.post('http://localhost:5000/api/student/join-classroom', {
            join_code: 'FRZHSQ'
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Join response status:', joinRes.status);
        console.log('Join response data:', joinRes.data);
    } catch (err) {
        if (err.response) {
            console.error('Error status:', err.response.status);
            console.error('Error data:', err.response.data);
        } else {
            console.error('Error:', err.message);
        }
    }
}

test();
