const express = require('express');
const { body, query } = require('express-validator');
const { requireAdmin } = require('../middleware/authentication');
const { USER_ROLES } = require('../constants/businessEnums');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} = require('../controllers/usersController');

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Get all users with pagination
 * @access Private (Admin only)
 */
router.get(
  '/',
  requireAdmin,
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim(),
    query('role').optional().isIn(USER_ROLES),
  ],
  getUsers,
);

/**
 * @route GET /api/users/:id
 * @desc Get single user by ID
 * @access Private (Admin only)
 */
router.get('/:id', requireAdmin, getUser);

/**
 * @route POST /api/users
 * @desc Create new user
 * @access Private (Admin only)
 */
router.post(
  '/',
  requireAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().isLength({ min: 2 }),
    body('role').optional().isIn(USER_ROLES),
  ],
  createUser,
);

/**
 * @route PUT /api/users/:id
 * @desc Update user
 * @access Private (Admin only)
 */
router.put(
  '/:id',
  requireAdmin,
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('role').optional().isIn(USER_ROLES),
    body('password').optional().isLength({ min: 6 }),
  ],
  updateUser,
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user
 * @access Private (Admin only)
 */
router.delete('/:id', requireAdmin, deleteUser);

/**
 * @route GET /api/users/profile/me
 * @desc Get current user's profile
 * @access Private
 */
router.get('/profile/me', getCurrentUserProfile);

/**
 * @route PUT /api/users/profile/me
 * @desc Update current user's profile
 * @access Private
 */
router.put(
  '/profile/me',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('currentPassword').optional().isLength({ min: 1 }),
    body('newPassword').optional().isLength({ min: 6 }),
    body('darkMode').optional().isBoolean(),
  ],
  updateCurrentUserProfile,
);

/**
 * @route PATCH /api/users/profile/me
 * @desc Update specific user profile fields (like dark mode preference)
 * @access Private
 */
router.patch(
  '/profile/me',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('name').optional().trim().isLength({ min: 2 }),
    body('currentPassword').optional().isLength({ min: 1 }),
    body('newPassword').optional().isLength({ min: 6 }),
    body('darkMode').optional().isBoolean(),
  ],
  updateCurrentUserProfile,
);

module.exports = router;
