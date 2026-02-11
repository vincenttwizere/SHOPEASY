const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend/.env (two levels up from src/config/config.js)
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Validate that critical env vars are loaded
if (!process.env.DB_USER) {
  console.error('ERROR: DB_USER not found in .env file. Please check backend/.env');
  process.exit(1);
}

if (!process.env.DB_PASSWORD) {
  console.warn('WARNING: DB_PASSWORD not found in .env file. Connecting with empty password.');
}

module.exports = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 3306,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'shopeasy',
  JWT_SECRET: process.env.JWT_SECRET || 'change_this',
  PORT: process.env.PORT || 4000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
};

// Helpful diagnostic: show which DB user and host were loaded (masking password)
const conf = module.exports;
console.log('✓ Config loaded:', { DB_HOST: conf.DB_HOST, DB_PORT: conf.DB_PORT, DB_USER: conf.DB_USER, DB_NAME: conf.DB_NAME, DB_PASSWORD: conf.DB_PASSWORD ? '***' : '(empty)' });
