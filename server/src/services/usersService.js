const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const { UserRole } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { createError, logError } = require('../utils/errorUtils');

async function listUsers({ page, limit, search, role }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);
  return { users, total };
}

async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      orders: {
        select: { id: true, orderNumber: true, status: true, total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      _count: { select: { orders: true } },
    },
  });
}

async function createUser({ email, password, name, role = UserRole.USER }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return createError(ErrorType.USER_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
  });

  return { user };
}

async function updateUser(id, updateData, currentUserId) {
  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) {
    const error = createError(ErrorType.USER_NOT_FOUND);
    logError(error);
    return error;
  }

  if (currentUserId === id && updateData.role && updateData.role !== existing.role)
    return createError(ErrorType.CANNOT_CHANGE_OWN_ROLE);

  if (updateData.email && updateData.email !== existing.email) {
    const conflict = await prisma.user.findUnique({ where: { email: updateData.email } });
    if (conflict) {
      return createError(ErrorType.EMAIL_ALREADY_EXISTS);
    }
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
  });

  return { user };
}

async function deleteUser(id, currentUserId) {
  if (id === currentUserId) {
    return createError(ErrorType.CANNOT_DELETE_OWN_ACCOUNT);
  }
  const user = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { orders: true } } },
  });

  if (!user) {
    const error = createError(ErrorType.USER_NOT_FOUND);
    logError(error);
    return error;
  }

  if (user._count.orders > 0) {
    return createError(ErrorType.CANNOT_DELETE_USER_WITH_ORDERS);
  }
  await prisma.user.delete({ where: { id } });
  return {};
}

async function getCurrentUserProfile(id) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      darkMode: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { orders: true } },
    },
  });
}

async function updateCurrentUserProfile(id, { email, name, currentPassword, newPassword, darkMode }) {
  const currentUser = await prisma.user.findUnique({ where: { id } });
  if (!currentUser) {
    const error = createError(ErrorType.USER_NOT_FOUND);
    logError(error);
    return error;
  }

  const updateData = {};

  if (email && email !== currentUser.email) {
    const conflict = await prisma.user.findUnique({ where: { email } });
    if (conflict) {
      return createError(ErrorType.EMAIL_ALREADY_EXISTS);
    }
    updateData.email = email;
  }

  if (name) {
    updateData.name = name;
  }

  if (typeof darkMode === 'boolean') {
    updateData.darkMode = darkMode;
  }

  if (newPassword) {
    if (!currentPassword) {
      return createError(ErrorType.CURRENT_PASSWORD_REQUIRED);
    }
    const isValid = await bcrypt.compare(currentPassword, currentUser.password);
    if (!isValid) {
      return createError(ErrorType.CURRENT_PASSWORD_INCORRECT);
    }
    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
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

  return { user };
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getCurrentUserProfile,
  updateCurrentUserProfile,
};
