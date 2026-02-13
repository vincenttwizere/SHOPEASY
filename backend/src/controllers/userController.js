const db = require('../config/db');

async function listUsers(req, res, next) {
    try {
        const [users] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (err) {
        next(err);
    }
}

module.exports = { listUsers };
