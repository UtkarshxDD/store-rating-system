const pool = require('../config/database');

const fixConstraints = async () => {
  try {
    console.log('Fixing database constraints...');
    
    // Drop the old constraint that requires name >= 20
    await pool.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_name_check');
    await pool.query('ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_name_check');
    
    // Add the new constraint that requires name >= 3
    await pool.query(`
      ALTER TABLE users ADD CONSTRAINT users_name_check 
      CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60)
    `);
    
    await pool.query(`
      ALTER TABLE stores ADD CONSTRAINT stores_name_check 
      CHECK (LENGTH(name) >= 3 AND LENGTH(name) <= 60)
    `);
    
    console.log('Database constraints fixed successfully!');
    console.log('Name validation now allows 3-60 characters');
    
    process.exit(0);
  } catch (error) {
    console.error('Failed to fix constraints:', error);
    process.exit(1);
  }
};

fixConstraints();
