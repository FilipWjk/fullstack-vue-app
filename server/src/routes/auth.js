const express = require('express');
const { body } = require('express-validator');
const { register, login, refreshToken, logout } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authentication');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user (always creates USER role!)
 */
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 }),
  ],
  register
);

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and get token
 */
router.post('/login', [body('email').isEmail().normalizeEmail(), body('password').exists()], login);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 */
router.post('/refresh', refreshToken);

/**
 * @route POST /api/auth/logout
 * @desc Logout user
 */
router.post('/logout', authenticateToken, logout);

module.exports = router;
