const db = require('./src/config/db');

async function runMigration() {
  try {
    console.log('Starting database migration...');

    const queries = [
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'stripe'`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255)`,
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_details JSON`,
      `CREATE INDEX IF NOT EXISTS idx_payment_reference ON orders(payment_reference)`,
      `CREATE INDEX IF NOT EXISTS idx_payment_method ON orders(payment_method)`
    ];

    for (const query of queries) {
      console.log(`Executing: ${query}`);
      await db.query(query);
      console.log('✓ Done');
    }

    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('✗ Migration failed:', err.message);
    process.exit(1);
  }
}

runMigration();
