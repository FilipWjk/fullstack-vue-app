const prisma = require('../utils/prismaClient');
const { OrderStatus } = require('../constants/businessEnums');
const { ErrorType } = require('../constants/errorMessages');
const { createError, logError } = require('../utils/errorUtils');

function parseOrder(order) {
  if (!order) return order;
  return {
    ...order,
    total: order.total ? Number(order.total) : 0,
    orderItems: order.orderItems.map(item => ({
      ...item,
      price: item.price ? Number(item.price) : 0,
      product: {
        ...item.product,
        images: item.product.images ? JSON.parse(item.product.images) : [],
        price: item.product.price ? Number(item.product.price) : 0,
      },
    })),
  };
}

async function listOrders({ page, limit, status, search, startDate, endDate }) {
  const skip = (page - 1) * limit;
  const where = {};

  if (status) where.status = status;

  if (search) {
    where.OR = [
      { orderNumber: { contains: search } },
      { user: { name: { contains: search } } },
      { user: { email: { contains: search } } },
    ];

    // * Add status search (case insensitive)
    if (search.match(/^(pending|processing|shipped|delivered|cancelled)$/i)) {
      where.OR.push({ status: { equals: search.toUpperCase() } });
    }

    // * Add total search for numeric values (handle partial matches)
    const numericValue = parseFloat(search);
    if (!isNaN(numericValue) && numericValue > 0) {
      // ? For exact matches
      where.OR.push({ total: { equals: numericValue } });
      // ? For partial matches (e.g., searching "25" should find "25.99")
      if (search.includes('.')) {
        // ? Exact decimal search
        where.OR.push({ total: { equals: numericValue } });
      } else {
        // ? Integer search - find totals that start with this number
        const rangeStart = numericValue;
        const rangeEnd = numericValue + 1;
        where.OR.push({
          total: {
            gte: rangeStart,
            lt: rangeEnd,
          },
        });
      }
    }

    // * Add date search for date patterns (DD.MM or DD.MM.YYYY)
    const dateMatch = search.match(/^(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?$/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1]);
      const month = parseInt(dateMatch[2]);
      const year = dateMatch[3] ? parseInt(dateMatch[3]) : new Date().getFullYear();

      try {
        const searchDate = new Date(year, month - 1, day);
        // ? Create end of day to capture the full day
        const endDate = new Date(year, month - 1, day + 1);

        if (!isNaN(searchDate.getTime()) && day <= 31 && month <= 12) {
          where.OR.push({
            createdAt: {
              gte: searchDate,
              lt: endDate,
            },
          });
        }
      } catch (error) {
        // ! Ignore invalid dates
      }
    }
  }

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders: orders.map(parseOrder), total };
}

async function listUserOrders({ userId, page, limit, status }) {
  const skip = (page - 1) * limit;
  const where = { userId };

  if (status) where.status = status;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        orderItems: { include: { product: { select: { id: true, name: true, images: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders: orders.map(parseOrder), total };
}

async function getOrderById(id) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      orderItems: {
        include: { product: { select: { id: true, name: true, images: true, price: true } } },
      },
    },
  });

  return parseOrder(order);
}

async function updateOrderStatusTx(id, status) {
  const existingOrder = await prisma.order.findUnique({
    where: { id },
    include: { orderItems: { include: { product: true } } },
  });

  if (!existingOrder) {
    const error = createError(ErrorType.ORDER_NOT_FOUND);
    logError(error);
    return error;
  }

  // ? Handle stock restoration for cancelled orders
  if (status === OrderStatus.CANCELLED && existingOrder.status !== OrderStatus.CANCELLED) {
    await prisma.$transaction(async tx => {
      for (const item of existingOrder.orderItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
      await tx.order.update({ where: { id }, data: { status } });
    });
  } else {
    await prisma.order.update({ where: { id }, data: { status } });
  }

  const updated = await getOrderById(id);
  return { order: updated };
}

async function orderSummaryStats() {
  const [
    totalOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    todayOrders,
    thisMonthOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: OrderStatus.PENDING } }),
    prisma.order.count({ where: { status: OrderStatus.PROCESSING } }),
    prisma.order.count({ where: { status: OrderStatus.SHIPPED } }),
    prisma.order.count({ where: { status: OrderStatus.DELIVERED } }),
    prisma.order.count({ where: { status: OrderStatus.CANCELLED } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        status: { in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING] },
      },
    }),
    prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
    }),
    prisma.order.count({
      where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
  ]);

  const totalRevenueValue = totalRevenue._sum.total || 0;
  const averageOrderValue = totalOrders > 0 ? Number(totalRevenueValue) / Number(totalOrders) : 0;

  return {
    totalOrders,
    ordersByStatus: {
      pending: pendingOrders,
      processing: processingOrders,
      shipped: shippedOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    totalRevenue: totalRevenueValue,
    averageOrderValue,
    todayOrders,
    thisMonthOrders,
  };
}

module.exports = {
  listOrders,
  listUserOrders,
  getOrderById,
  updateOrderStatusTx,
  orderSummaryStats,
};
