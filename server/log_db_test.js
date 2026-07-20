const db = require('./src/config/db');
(async () => {
    try {
        const [rows] = await db.query('SELECT 1 AS test');
        console.log('DB connection successful, result:', rows);
    } catch (err) {
        console.error('DB connection failed:', err.message);
    }
})();
