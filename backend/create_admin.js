const bcrypt = require('bcrypt');
const db = require('./src/config/db');

async function createAdminUser() {
    try {
        const email = 'admin@shopeasy.com';
        const password = 'admin123'; // Change this to a secure password
        const name = 'Admin User';
        const role = 'admin';

        // Check if admin already exists
        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length) {
            console.log('❌ Admin user already exists with email:', email);
            process.exit(0);
        }

        // Hash password
        const hashed = await bcrypt.hash(password, 10);

        // Insert admin user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashed, role]
        );

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        console.log('👤 User ID:', result.insertId);
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin user:', err.message);
        process.exit(1);
    }
}

createAdminUser();
