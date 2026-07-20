const db = require("./src/config/db");

async function run() {
    try {
        const [users] = await db.query("SELECT id, username, email, role FROM users");
        console.log("Users in database:");
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
