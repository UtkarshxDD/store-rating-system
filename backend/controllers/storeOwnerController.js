const pool = require('../config/database');

const getDashboard = async (req, res) => {
  const userId = req.user.id;

  try {
    // Get store owned by the user
    const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [userId]);
    
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No store found for this owner' });
    }

    const storeId = storeResult.rows[0].id;

    // Get ratings for the store
    const ratingsResult = await pool.query(`
      SELECT 
        u.name as user_name,
        u.email as user_email,
        r.rating,
        r.created_at,
        r.updated_at
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.updated_at DESC
    `, [storeId]);

    // Get average rating
    const avgResult = await pool.query(`
      SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as total_ratings
      FROM ratings WHERE store_id = $1
    `, [storeId]);

    const { average_rating, total_ratings } = avgResult.rows[0];

    res.json({
      store_id: storeId,
      average_rating: parseFloat(average_rating).toFixed(1),
      total_ratings: parseInt(total_ratings),
      ratings: ratingsResult.rows
    });
  } catch (error) {
    console.error('Store owner dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getDashboard };