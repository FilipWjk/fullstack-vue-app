const prisma = require('../utils/prismaClient');
const path = require('path');
const fs = require('fs').promises;
const { ProductStatus } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { createError, logError, isError } = require('../utils/errorUtils');

// * Helper functions
function parseProduct(product) {
  if (!product) return product;
  const parsedImages = product.images ? JSON.parse(product.images) : [];
  return {
    ...product,
    images: parsedImages,
    imageUrl: parsedImages.length > 0 ? parsedImages[0] : null,
  };
}

async function findProductByIdOrError(id, includeRelations = {}) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: includeRelations,
  });

  if (!product) {
    const error = createError(ErrorType.PRODUCT_NOT_FOUND);
    logError(error);
    return error;
  }

  return product;
}

async function validateCategoryExists(categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    const error = createError(ErrorType.CATEGORY_NOT_FOUND);
    logError(error);
    return error;
  }
  return category;
}

function sanitizeProductData(data) {
  const sanitized = { ...data };
  if (sanitized.price) sanitized.price = parseFloat(sanitized.price);
  if (sanitized.stock) sanitized.stock = parseInt(sanitized.stock);
  return sanitized;
}

async function deleteImageFiles(imageUrls) {
  for (const imageUrl of imageUrls) {
    const imagePath = path.join(__dirname, '..', '..', imageUrl);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      // * ignore file deletion errors
    }
  }
}

const PRODUCT_INCLUDE_RELATIONS = {
  category: { select: { id: true, name: true } },
};

// * Main service functions
async function listProducts({ page, limit, search, categoryId, status }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (search) {
    where.OR = [{ name: { contains: search } }, { description: { contains: search } }];

    const numericValue = parseFloat(search);
    if (!isNaN(numericValue) && numericValue > 0) {
      // ? For exact matches
      where.OR.push({ price: { equals: numericValue } });
      // ? For partial matches (e.g., searching "25" should find "25.99")
      if (search.includes('.')) {
        // ? Exact decimal search
        where.OR.push({ price: { equals: numericValue } });
      } else {
        // ? Integer search - find prices that start with this number
        const rangeStart = numericValue;
        const rangeEnd = numericValue + 1;
        where.OR.push({
          price: {
            gte: rangeStart,
            lt: rangeEnd,
          },
        });
      }
    }

    // ? Add stock search for integer values
    const stockValue = parseInt(search);
    if (!isNaN(stockValue) && stockValue >= 0) {
      where.OR.push({ stock: { equals: stockValue } });
    }
  }

  if (categoryId) where.categoryId = categoryId;
  if (status) where.status = status;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: PRODUCT_INCLUDE_RELATIONS,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: products.map(parseProduct), total };
}

async function getProductById(id) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: PRODUCT_INCLUDE_RELATIONS,
  });
  return parseProduct(product);
}

async function createProduct({
  name,
  description,
  price,
  stock,
  categoryId,
  status = ProductStatus.ACTIVE,
  imageUrl,
}) {
  const categoryValidation = await validateCategoryExists(categoryId);
  if (isError(categoryValidation)) {
    return categoryValidation;
  }

  const sanitizedData = sanitizeProductData({ price, stock });

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price: sanitizedData.price,
      stock: sanitizedData.stock,
      categoryId,
      status,
      images: JSON.stringify(imageUrl ? [imageUrl] : []),
    },
    include: PRODUCT_INCLUDE_RELATIONS,
  });

  return { product: parseProduct(product) };
}

async function updateProduct(id, updateData) {
  const existing = await findProductByIdOrError(id);
  if (isError(existing)) {
    return existing;
  }

  const sanitizedData = sanitizeProductData(updateData);
  const prismaUpdateData = { ...sanitizedData };

  if (updateData.categoryId) {
    prismaUpdateData.category = {
      connect: { id: updateData.categoryId },
    };
    delete prismaUpdateData.categoryId;
  }

  // * Handle imageUrl update
  if (updateData.imageUrl !== undefined) {
    prismaUpdateData.images = JSON.stringify(updateData.imageUrl ? [updateData.imageUrl] : []);
    delete prismaUpdateData.imageUrl;
  }

  const updated = await prisma.product.update({
    where: { id },
    data: prismaUpdateData,
    include: PRODUCT_INCLUDE_RELATIONS,
  });

  return { product: parseProduct(updated) };
}

async function deleteProduct(id) {
  // ? Find product with order items to check for dependencies
  const product = await findProductByIdOrError(id, { orderItems: true });
  if (isError(product)) {
    return product;
  }

  // * Check if product has associated order items
  if (product.orderItems && product.orderItems.length > 0) {
    const error = createError(ErrorType.CANNOT_DELETE_PRODUCT_WITH_ORDERS);
    logError(error);
    return error;
  }

  // * Delete associated image files
  if (product.images) {
    const imageUrls = JSON.parse(product.images);
    await deleteImageFiles(imageUrls);
  }

  await prisma.product.delete({ where: { id } });
  return {};
}

async function removeProductImages(id, imageUrls) {
  const product = await findProductByIdOrError(id);
  if (isError(product)) {
    return product;
  }

  const existingImages = product.images ? JSON.parse(product.images) : [];
  const updatedImages = existingImages.filter(img => !imageUrls.includes(img));

  // * Delete image files from filesystem
  await deleteImageFiles(imageUrls);

  // * Update product with remaining images
  const updated = await prisma.product.update({
    where: { id },
    data: { images: JSON.stringify(updatedImages) },
    include: PRODUCT_INCLUDE_RELATIONS,
  });

  return { product: parseProduct(updated) };
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  removeProductImages,
};
