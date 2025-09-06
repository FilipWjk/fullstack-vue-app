const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriesController');

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 * @access Private
 */
router.get('/', getCategories);

/**
 * @route GET /api/categories/:id
 * @desc Get single category by ID
 * @access Private
 */
router.get('/:id', getCategory);

/**
 * @route POST /api/categories
 * @desc Create new category
 * @access Private
 */
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1 }),
    body('description').optional().trim(),
    body('imageUrl').optional().isString(),
  ],
  createCategory
);

/**
 * @route PUT /api/categories/:id
 * @desc Update category
 * @access Private
 */
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 1 }),
    body('description').optional().trim(),
    body('imageUrl').optional().isString(),
  ],
  updateCategory
);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete category
 * @access Private
 */
router.delete('/:id', deleteCategory);

module.exports = router;
