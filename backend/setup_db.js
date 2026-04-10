const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const config = require('./src/config/config');

const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

async function setup() {
    const connConfig = {
        host: config.DB_HOST,
        port: config.DB_PORT,
        user: config.DB_USER,
        password: config.DB_PASSWORD,
        multipleStatements: true
    };

    console.log('Connecting to MySQL with user:', connConfig.user);
    let connection;
    try {
        connection = await mysql.createConnection(connConfig);
        console.log('Connected! Running schema...');
        await connection.query(schema);
        console.log('Schema applied. Ensuring product table has new columns...');
        // attempt to add missing columns (ignores errors if they already exist)
        const alterQueries = [
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(255) DEFAULT ''",
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(10,2) DEFAULT NULL",
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT TRUE",
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSON",
            "ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSON"
        ];
        for (const q of alterQueries) {
            try {
                await connection.query(q);
            } catch (e) {
                // some MySQL versions may not support IF NOT EXISTS; ignore duplicate errors
                if (e && e.code !== 'ER_DUP_FIELDNAME') {
                    console.warn('Alter table warning', e.message);
                }
            }
        }
        console.log('Database initialized successfully!');
    } catch (err) {
        if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('Access denied when connecting to MySQL with user:', connConfig.user);
            console.error('Please create the database user and grant privileges, or update backend/.env with correct credentials.');
            console.error('SQL to run as MySQL root (example):\n');
            console.error("CREATE USER 'shopeasy_user'@'localhost' IDENTIFIED BY 'sh0peasy2026!';");
            console.error("GRANT ALL PRIVILEGES ON shopeasy.* TO 'shopeasy_user'@'localhost';");
            console.error('FLUSH PRIVILEGES;');
            process.exit(1);
        } else {
            console.error('Error initializing database:', err && err.message ? err.message : err);
            process.exit(1);
        }
    } finally {
        if (connection) await connection.end();
    }
}

setup();
