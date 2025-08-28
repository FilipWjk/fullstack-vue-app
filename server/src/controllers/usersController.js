const { validationResult } = require('express-validator');
const { UserRole } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { SuccessMessage } = require('../constants/successMessages');
const { isError, createValidationError, logError } = require('../utils/errorUtils');
const {
  listUsers,
  getUserById,
  createUser: createUserService,
  updateUser: updateUserService,
  deleteUser: deleteUserService,
  getCurrentUserProfile: getCurrentUserProfileService,
  updateCurrentUserProfile: updateCurrentUserProfileService,
} = require('../services/usersService');

// * GET /api/users
async function getUsers(req, res, next) {
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search, role } = req.query;
    const { users, total } = await listUsers({ page, limit, search, role });

    res.json({
      success: true,
      data: { users, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/users/:id
async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: ErrorType.USER_NOT_FOUND });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * POST /api/users
async function createUser(req, res, next) {
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

    const { email, password, name, role = UserRole.USER } = req.body;
    const result = await createUserService({ email, password, name, role });

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(201).json({ success: true, message: SuccessMessage.USER_CREATED, data: result.user });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * PUT /api/users/:id
async function updateUser(req, res, next) {
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
    const result = await updateUserService(id, updateData, req.user.id);

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.USER_UPDATED, data: result.user });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * DELETE /api/users/:id
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await deleteUserService(id, req.user.id);

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.USER_DELETED });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * GET /api/users/profile/me
async function getCurrentUserProfile(req, res, next) {
  try {
    const user = await getCurrentUserProfileService(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    logError(error);
    next(error);
  }
}

// * PUT /api/users/profile/me
async function updateCurrentUserProfile(req, res, next) {
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

    const { email, name, currentPassword, newPassword, darkMode } = req.body;

    const result = await updateCurrentUserProfileService(req.user.id, {
      email,
      name,
      currentPassword,
      newPassword,
      darkMode,
    });

    if (isError(result)) {
      logError(result);
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.json({ success: true, message: SuccessMessage.PROFILE_UPDATED, data: result.user });
  } catch (error) {
    logError(error);
    next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
