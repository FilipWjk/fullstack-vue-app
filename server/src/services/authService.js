const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prismaClient');
const { UserRole } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { createError, logError } = require('../utils/errorUtils');

function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
}

async function createUser({ email, password, name, role }) {
  const effectiveRole = role || UserRole.USER;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return createError(ErrorType.USER_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role: effectiveRole },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      darkMode: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
}

async function verifyCredentials({ email, password }) {
  let user;

  try {
    user = await prisma.user.findUnique({ where: { email } });
  } catch (e) {
    const error = createError(ErrorType.DB_UNAVAILABLE);
    logError(error);
    return error;
  }

  if (!user) {
    return createError(ErrorType.INVALID_CREDENTIALS);
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return createError(ErrorType.INVALID_CREDENTIALS);
  }

  const token = generateToken({ userId: user.id, email: user.email, role: user.role });

  const userResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    darkMode: user.darkMode,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return { user: userResponse, token };
}

function refreshJwt(oldToken) {
  const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
  return generateToken({ userId: decoded.userId, email: decoded.email, role: decoded.role });
}

module.exports = { createUser, verifyCredentials, refreshJwt };
