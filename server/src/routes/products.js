const express = require('express');
const { body, query } = require('express-validator');
const { PRODUCT_STATUSES } = require('../constants/businessEnums');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productsController');
const { ErrorType } = require('../constants/errorMessages');

const router = express.Router();

/**
 * @route GET /api/products
 * @desc Get all products with pagination and search
 * @access Private
 */
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('search').optional().trim(),
    query('category')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      })
      .withMessage(ErrorType.CATEGORY_ID_MUST_BE_VALID),
    query('status')
      .optional()
      .custom(value => {
        if (value === '' || value === undefined || value === null) return true;
        return PRODUCT_STATUSES.includes(value);
      }),
  ],
  getProducts
);

/**
 * @route GET /api/products/:id
 * @desc Get single product by ID
 * @access Private
 */
router.get('/:id', getProduct);

/**
 * @route POST /api/products
 * @desc Create new product
 * @access Private
 */
router.post(
  '/',
  [
    body('name').trim().isLength({ min: 1 }),
    body('price').isFloat({ min: 0 }),
    body('stock').isInt({ min: 0 }),
    body('categoryId').isUUID().withMessage(ErrorType.CATEGORY_ID_MUST_BE_VALID),
    body('description').optional().trim(),
    body('status').optional().isIn(PRODUCT_STATUSES),
  ],
  createProduct
);

/**
 * @route PUT /api/products/:id
 * @desc Update product
 * @access Private
 */
router.put(
  '/:id',
  [
    body('name').optional().trim().isLength({ min: 1 }),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('categoryId')
      .optional({ checkFalsy: true })
      .isUUID()
      .withMessage(ErrorType.CATEGORY_ID_MUST_BE_VALID),
    body('description').optional().trim(),
    body('status').optional().isIn(PRODUCT_STATUSES),
  ],
  updateProduct
);

/**
 * @route DELETE /api/products/:id
 * @desc Delete product
 * @access Private
 */
router.delete('/:id', deleteProduct);

module.exports = router;
