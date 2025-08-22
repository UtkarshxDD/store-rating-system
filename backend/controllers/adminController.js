// controllers/adminController.js
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

const getDashboard = async (req, res) => {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users'),
      pool.query('SELECT COUNT(*) FROM stores'),
      pool.query('SELECT COUNT(*) FROM ratings')
    ]);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStores: parseInt(storesCount.rows[0].count),
      totalRatings: parseInt(ratingsCount.rows[0].count)
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStore = async (req, res) => {
  const { name, email, address, ownerEmail } = req.body;

  try {
    // Find owner
    const ownerResult = await pool.query('SELECT id FROM users WHERE email = $1 AND role = $2', 
      [ownerEmail, 'store_owner']);
    
    if (ownerResult.rows.length === 0) {
      return res.status(400).json({ error: 'Store owner not found with this email' });
    }

    const ownerId = ownerResult.rows[0].id;

    // Check if store email already exists
    const existingStore = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existingStore.rows.length > 0) {
      return res.status(400).json({ error: 'Store already exists with this email' });
    }

    // Create store
    const result = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, ownerId]
    );

    res.status(201).json({
      message: 'Store created successfully',
      store: result.rows[0]
    });
  } catch (error) {
    console.error('Create store error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStores = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, email, address } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT 
        s.id, s.name, s.email, s.address, s.created_at,
        COALESCE(AVG(r.rating), 0) as rating,
        COUNT(r.id) as total_ratings
      FROM stores s 
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    
    let conditions = [];
    let params = [];
    let paramCount = 0;

    if (name) {
      paramCount++;
      conditions.push(`s.name ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }
    if (email) {
      paramCount++;
      conditions.push(`s.email ILIKE $${paramCount}`);
      params.push(`%${email}%`);
    }
    if (address) {
      paramCount++;
      conditions.push(`s.address ILIKE $${paramCount}`);
      params.push(`%${address}%`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` GROUP BY s.id, s.name, s.email, s.address, s.created_at`;
    query += ` ORDER BY ${sortBy === 'rating' ? 'rating' : `s.${sortBy}`} ${sortOrder.toUpperCase()}`;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM stores s';
    let countParams = [];
    let countParamCount = 0;

    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
      if (name) {
        countParams.push(`%${name}%`);
        countParamCount++;
      }
      if (email) {
        countParams.push(`%${email}%`);
        countParamCount++;
      }
      if (address) {
        countParams.push(`%${address}%`);
        countParamCount++;
      }
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      stores: result.rows.map(store => ({
        ...store,
        rating: parseFloat(store.rating).toFixed(1)
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

const getUsers = async (req, res) => {
  const { page = 1, limit = 10, sortBy = 'name', sortOrder = 'asc', name, email, address, role } = req.query;
  const offset = (page - 1) * limit;

  try {
    let query = `
      SELECT 
        u.id, u.name, u.email, u.address, u.role, u.created_at,
        CASE 
          WHEN u.role = 'store_owner' THEN (
            SELECT COALESCE(AVG(r.rating), 0)
            FROM stores s 
            LEFT JOIN ratings r ON s.id = r.store_id 
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END as rating
      FROM users u
    `;
    
    let conditions = [];
    let params = [];
    let paramCount = 0;

    if (name) {
      paramCount++;
      conditions.push(`u.name ILIKE $${paramCount}`);
      params.push(`%${name}%`);
    }
    if (email) {
      paramCount++;
      conditions.push(`u.email ILIKE $${paramCount}`);
      params.push(`%${email}%`);
    }
    if (address) {
      paramCount++;
      conditions.push(`u.address ILIKE $${paramCount}`);
      params.push(`%${address}%`);
    }
    if (role) {
      paramCount++;
      conditions.push(`u.role = $${paramCount}`);
      params.push(role);
    }

    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ` ORDER BY u.${sortBy} ${sortOrder.toUpperCase()}`;
    query += ` LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    
    params.push(limit, offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM users u';
    let countParams = [];

    if (conditions.length > 0) {
      countQuery += ` WHERE ${conditions.join(' AND ')}`;
      countParams = params.slice(0, -2); // Remove limit and offset
    }

    const countResult = await pool.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].count);

    res.json({
      users: result.rows.map(user => ({
        ...user,
        rating: user.rating ? parseFloat(user.rating).toFixed(1) : null
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
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        u.id, u.name, u.email, u.address, u.role, u.created_at,
        CASE 
          WHEN u.role = 'store_owner' THEN (
            SELECT COALESCE(AVG(r.rating), 0)
            FROM stores s 
            LEFT JOIN ratings r ON s.id = r.store_id 
            WHERE s.owner_id = u.id
          )
          ELSE NULL
        END as rating
      FROM users u 
      WHERE u.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      ...user,
      rating: user.rating ? parseFloat(user.rating).toFixed(1) : null
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  getDashboard, 
  createUser, 
  createStore, 
  getStores, 
  getUsers, 
  getUserDetails 
};
