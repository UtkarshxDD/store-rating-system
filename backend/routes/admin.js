const express = require('express');
const { 
  getDashboard, 
  createUser, 
  createStore, 
  getStores, 
  getUsers, 
  getUserDetails 
} = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', validate(schemas.createUser), createUser);
router.post('/stores', validate(schemas.createStore), createStore);
router.get('/stores', getStores);
router.get('/users', getUsers);
router.get('/users/:id', getUserDetails);

module.exports = router;