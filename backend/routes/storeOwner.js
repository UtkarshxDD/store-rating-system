const express = require('express');
const { getDashboard } = require('../controllers/storeOwnerController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Apply authentication and store owner role check to all routes
router.use(authenticateToken);
router.use(authorizeRoles('store_owner'));

router.get('/dashboard', getDashboard);

module.exports = router;