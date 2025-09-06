const { validationResult } = require('express-validator');
const { ProductStatus } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { SuccessMessage } = require('../constants/successMessages');
const { isError, logError } = require('../utils/errorUtils');
const {
  listProducts,
  getProductById,
  createProduct: createProductService,
  updateProduct: updateProductService,
  deleteProduct: deleteProductService,
  removeProductImages: removeProductImagesService,
} = require('../services/productsService');

// * Helper functions
function handleValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessage = `Validation failed for ${req.method} ${req.originalUrl}: ${errors
      .array()
      .map(e => `${e.param}: ${e.msg}`)
      .join(', ')}`;
    logError({ error: errorMessage, status: 400 });
    res.status(400).json({
      success: false,
      message: ErrorType.VALIDATION_FAILED,
      errors: errors.array(),
    });
    return true;
  }
  return false;
}

function handleServiceError(result, res) {
  if (isError(result)) {
    logError(result);
    res.status(result.status).json({ success: false, message: result.error });
    return true;
  }
  return false;
}

function handleControllerError(error, next) {
  logError(error);
  next(error);
}

// * Controller functions
// * GET /api/products
async function getProducts(req, res, next) {
  try {
    if (handleValidationErrors(req, res)) return;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, category: categoryFilter, status: statusFilter } = req.query;

    const { products, total } = await listProducts({
      page,
      limit,
      search,
      categoryId: categoryFilter,
      status: statusFilter,
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (e) {
    handleControllerError(e, next);
  }
}

// * GET /api/products/:id
async function getProduct(req, res, next) {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: ErrorType.PRODUCT_NOT_FOUND });
    }

    res.json({ success: true, data: product });
  } catch (e) {
    handleControllerError(e, next);
  }
}

// * POST /api/products
async function createProduct(req, res, next) {
  try {
    if (handleValidationErrors(req, res)) return;

    const {
      name,
      description,
      price,
      stock,
      categoryId,
      status = ProductStatus.ACTIVE,
      imageUrl,
    } = req.body;

    const result = await createProductService({
      name,
      description,
      price,
      stock,
      categoryId,
      status,
      imageUrl,
    });

    if (handleServiceError(result, res)) return;

    res.status(201).json({
      success: true,
      message: SuccessMessage.PRODUCT_CREATED,
      data: result.product,
    });
  } catch (e) {
    handleControllerError(e, next);
  }
}

// * PUT /api/products/:id
async function updateProduct(req, res, next) {
  try {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const updateData = { ...req.body };

    const result = await updateProductService(id, updateData);

    if (handleServiceError(result, res)) return;

    res.json({
      success: true,
      message: SuccessMessage.PRODUCT_UPDATED,
      data: result.product,
    });
  } catch (e) {
    handleControllerError(e, next);
  }
}

// * DELETE /api/products/:id
async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteProductService(id);

    if (handleServiceError(result, res)) return;

    res.json({ success: true, message: SuccessMessage.PRODUCT_DELETED });
  } catch (e) {
    handleControllerError(e, next);
  }
}

// * DELETE /api/products/:id/images
async function removeProductImages(req, res, next) {
  try {
    if (handleValidationErrors(req, res)) return;

    const { id } = req.params;
    const { imageUrls } = req.body;
    const result = await removeProductImagesService(id, imageUrls);

    if (handleServiceError(result, res)) return;

    res.json({
      success: true,
      message: SuccessMessage.IMAGES_REMOVED,
      data: result.product,
    });
  } catch (e) {
    handleControllerError(e, next);
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImages,
};
