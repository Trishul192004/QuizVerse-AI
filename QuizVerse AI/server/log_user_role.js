const db = require('./src/config/db');
(async () => {
    const [rows] = await db.query('SELECT id, email, role FROM users WHERE email = ?', ['rahul@gmail.com']);
    console.log('User rows:', rows);
    process.exit();
})();
