const db = require('./src/config/db');

/**
 * Add colors and sizes columns to products table
 */
async function addProductVariations() {
  const conn = await db.getConnection();
  try {
    console.log('Running migration: Add product variations (colors, sizes)...');

    // Add colors column if it doesn't exist
    await conn.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS colors JSON COMMENT 'Available colors as JSON array'
    `);
    console.log('✓ Added colors column');

    // Add sizes column if it doesn't exist
    await conn.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS sizes JSON COMMENT 'Available sizes as JSON array'
    `);
    console.log('✓ Added sizes column');

    // Add specifications column for detailed product specs
    await conn.query(`
      ALTER TABLE products 
      ADD COLUMN IF NOT EXISTS specifications JSON COMMENT 'Product specifications as JSON'
    `);
    console.log('✓ Added specifications column');

    console.log('\n✅ Migration completed successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

// Run migration
addProductVariations()
  .then(() => {
    console.log('\nDatabase migration finished.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
