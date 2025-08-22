const pool = require('../config/database');

const getStores = async (req, res) => {
  const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
  const offset = (page - 1) * limit;
  const userId = req.user.id;

  try {
    let query = `
      SELECT 
        s.id, s.name, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as overall_rating,
        COUNT(r.id) as total_ratings,
        ur.rating as user_rating
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
    `;

    let params = [userId];
    let paramCount = 1;

    if (search) {
      paramCount++;
      query += ` WHERE (s.name ILIKE $${paramCount} OR s.address ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ` GROUP BY s.id, s.name, s.address, s.created_at, ur.rating`;
    query += ` ORDER BY ${sortBy === 'overall_rating' ? 'overall_rating' : `s.${sortBy}`} ${sortOrder.toUpperCase()}`;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM stores s';
    let countParams = [];

    if (search) {
      countQuery += ` WHERE (s.name ILIKE $1 OR s.address ILIKE $1)`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      stores: result.rows.map(store => ({
        id: store.id,
        name: store.name,
        address: store.address,
        overall_rating: parseFloat(store.overall_rating).toFixed(1),
        total_ratings: parseInt(store.total_ratings),
        user_rating: store.user_rating,
        created_at: store.created_at
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page * limit < totalCount,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get stores error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const submitRating = async (req, res) => {
  const { rating } = req.body;
  const { storeId } = req.params;
  const userId = req.user.id;

  try {
    // Check if store exists
    const storeResult = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Insert or update rating
    const result = await pool.query(`
      INSERT INTO ratings (user_id, store_id, rating) 
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating = $3, updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [userId, storeId, rating]);

    res.json({
      message: 'Rating submitted successfully',
      rating: result.rows[0]
    });
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getStores, submitRating };


