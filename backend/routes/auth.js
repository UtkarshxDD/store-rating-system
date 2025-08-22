const express = require('express');
const { register, login, updatePassword } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.put('/update-password', authenticateToken, validate(schemas.updatePassword), updatePassword);

module.exports = router;