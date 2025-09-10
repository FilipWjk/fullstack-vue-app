const prisma = require('../utils/prismaClient');
const { ErrorType } = require('../constants/errorMessages');
const { createError, logError } = require('../utils/errorUtils');

// ? Helper function to safely parse JSON image field from database
function parseImagesField(imagesField) {
  try {
    return imagesField ? JSON.parse(imagesField) : [];
  } catch (err) {
    logError(err);
    return [];
  }
}

// * GET /api/categories - Fetch all categories with product counts
async function listCategories() {
  return prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
}

// * GET /api/categories/:id - Fetch single category with products
async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        select: { id: true, name: true, price: true, stock: true, status: true, images: true },
      },
      _count: { select: { products: true } },
    },
  });

  if (!category) return null;

  // ? Parse product images and return enriched category data
  return {
    ...category,
    products: category.products.map(product => ({
      ...product,
      images: parseImagesField(product.images),
    })),
  };
}

// * POST /api/categories - Create new category with validation
async function createCategory({ name, description, imageUrl }) {
  // ? Check if category name already exists
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    const error = createError(ErrorType.CATEGORY_NAME_EXISTS);
    logError(error);
    return error;
  }

  // ? Create new category with provided data
  const category = await prisma.category.create({
    data: { name, description, imageUrl: imageUrl || null },
    include: { _count: { select: { products: true } } },
  });

  return { category };
}

// * PUT /api/categories/:id - Update existing category
async function updateCategory(id, updateData, newImageUrl) {
  // ? Check if category exists
  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    const error = createError(ErrorType.CATEGORY_NOT_FOUND);
    logError(error);
    return error;
  }

  // ? Check for name conflicts (excluding current category)
  if (updateData.name) {
    const conflict = await prisma.category.findFirst({
      where: { name: updateData.name, id: { not: id } },
    });
    if (conflict) {
      const error = createError(ErrorType.CATEGORY_NAME_EXISTS);
      logError(error);
      return error;
    }
  }

  // ? Handle image updates
  if (newImageUrl !== undefined) {
    updateData.imageUrl = newImageUrl || null;
  }

  // ? Update category in database
  const updated = await prisma.category.update({
    where: { id },
    data: updateData,
    include: { _count: { select: { products: true } } },
  });

  return { category: updated };
}

// * DELETE /api/categories/:id - Delete category with validation
async function deleteCategory(id) {
  // ? Check if category exists and get product count
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } },
  });

  if (!category) {
    const error = createError(ErrorType.CATEGORY_NOT_FOUND);
    logError(error);
    return error;
  }

  // ? Prevent deletion if category has products
  if (category._count.products > 0) {
    const error = createError(ErrorType.CANNOT_DELETE_CATEGORY_WITH_PRODUCTS);
    logError(error);
    return error;
  }

  // ? Delete category from database
  await prisma.category.delete({ where: { id } });
  return {};
}

// ? Export all service functions
module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
