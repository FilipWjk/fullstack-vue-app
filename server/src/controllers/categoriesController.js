const { validationResult } = require('express-validator');
const { ErrorType } = require('../constants/errorMessages');
const { SuccessMessage } = require('../constants/successMessages');
const { isError, createValidationError, logError } = require('../utils/errorUtils');
const {
  listCategories,
  getCategoryById,
  createCategory: createCategoryService,
  updateCategory: updateCategoryService,
  deleteCategory: deleteCategoryService,
} = require('../services/categoriesService');

// * GET /api/categories - Retrieve all categories
async function getCategories(req, res, next) {
  try {
    const categories = await listCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/categories/:id - Retrieve single category by ID
async function getCategory(req, res, next) {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({ success: false, message: ErrorType.CATEGORY_NOT_FOUND });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * POST /api/categories - Create new category
async function createCategory(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(errors.array());
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    const { name, description, imageUrl } = req.body;

    // ? Create category via service layer
    const result = await createCategoryService({ name, description, imageUrl });

    // ? Handle service errors
    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res
      .status(201)
      .json({ success: true, message: SuccessMessage.CATEGORY_CREATED, data: result.category });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * PUT /api/categories/:id - Update existing category
async function updateCategory(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorResponse = createValidationError(errors.array());
      return res.status(errorResponse.status).json({
        success: false,
        message: errorResponse.error,
        errors: errorResponse.errors,
      });
    }

    const { id } = req.params;
    const updateData = { ...req.body };

    // ? Extract imageUrl for separate handling in service layer
    const newImageUrl = req.body.imageUrl;
    delete updateData.imageUrl;

    // ? Update category via service layer
    const result = await updateCategoryService(id, updateData, newImageUrl);

    // ? Handle service errors
    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.CATEGORY_UPDATED, data: result.category });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * DELETE /api/categories/:id - Delete category
async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // ? Delete category via service layer
    const result = await deleteCategoryService(id);

    // ? Handle service errors
    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.CATEGORY_DELETED });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// ? Export all controller functions
module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
