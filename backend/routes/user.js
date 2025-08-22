const express = require('express');
const { getStores, submitRating } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

// Apply authentication and normal user role check to all routes
router.use(authenticateToken);
router.use(authorizeRoles('normal'));

router.get('/stores', getStores);
router.post('/stores/:storeId/rating', validate(schemas.rating), submitRating);

module.exports = router;
