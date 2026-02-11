const mysql = require('mysql2/promise');
const path = require('path');
const cfg = require('./src/config/config');

// Use central config so the same `.env` values are used everywhere
async function test() {
    const config = {
        host: cfg.DB_HOST,
        port: cfg.DB_PORT,
        user: cfg.DB_USER,
        password: cfg.DB_PASSWORD,
        database: cfg.DB_NAME
    };

    console.log('Connecting with config:', { host: config.host, port: config.port, user: config.user, database: config.database, password: config.password ? '***' : '(empty)' });
    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('Connected!');

        console.log('Querying products...');
        const [rows] = await connection.query('SELECT * FROM products LIMIT 5');
        console.log('Products found:', rows.length);
        console.log(rows);

    } catch (err) {
        console.error('Test failed:', err && err.message ? err.message : err);
        if (err && err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Trying with empty password...');
            try {
                config.password = '';
                connection = await mysql.createConnection(config);
                console.log('Connected with empty password!');
                const [rows] = await connection.query('SELECT * FROM products LIMIT 5');
                console.log('Products found:', rows.length);
            } catch (retryErr) {
                console.error('Retry failed:', retryErr && retryErr.message ? retryErr.message : retryErr);
            }
        }
    } finally {
        if (connection) await connection.end();
    }
}

test();
