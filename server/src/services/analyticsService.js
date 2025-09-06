const prisma = require('../utils/prismaClient');
const { OrderStatus, ProductStatus } = require('../constants/businessEnums');

// ? Helper function to parse product images safely
function parseProductImages(images) {
  try {
    return images ? JSON.parse(images) : [];
  } catch {
    return [];
  }
}

// ? Helper function to get date ranges for analytics
function getDateRanges() {
  const now = new Date();
  return {
    startOfToday: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    startOfMonth: new Date(now.getFullYear(), now.getMonth(), 1),
    startOfYear: new Date(now.getFullYear(), 0, 1),
  };
}

// ? Helper function to get revenue statuses
function getRevenueStatuses() {
  return [OrderStatus.DELIVERED, OrderStatus.SHIPPED, OrderStatus.PROCESSING];
}

// ? Reusable revenue aggregation function
function createRevenueAggregator() {
  const revenueStatuses = getRevenueStatuses();
  return since =>
    prisma.order.aggregate({
      _sum: { total: true },
      where: since
        ? { status: { in: revenueStatuses }, createdAt: { gte: since } }
        : { status: { in: revenueStatuses } },
    });
}

// * Main dashboard metrics function
async function dashboardMetrics() {
  const { startOfToday, startOfMonth, startOfYear } = getDateRanges();
  const revenueAggregate = createRevenueAggregator();

  // ? Fetch all dashboard data in parallel
  const [
    totalOrders,
    todayOrders,
    monthOrders,
    ordersByStatus,
    totalRevenueAgg,
    todayRevenueAgg,
    monthRevenueAgg,
    yearRevenueAgg,
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    topSellingProducts,
    totalUsers,
    newUsersToday,
    newUsersThisMonth,
    recentOrders,
  ] = await Promise.all([
    // ? Order counts
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.groupBy({ by: ['status'], _count: { status: true } }),

    // ? Revenue aggregations
    revenueAggregate(),
    revenueAggregate(startOfToday),
    revenueAggregate(startOfMonth),
    revenueAggregate(startOfYear),

    // ? Product counts
    prisma.product.count(),
    prisma.product.count({ where: { stock: { lte: 10, gt: 0 }, status: ProductStatus.ACTIVE } }),
    prisma.product.count({ where: { stock: 0 } }),

    // ? Top selling products
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    }),

    // ? User counts
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),

    // ? Recent orders
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  // ? Enrich top selling products with details
  const topSellingWithDetails = await Promise.all(
    topSellingProducts.map(async item => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: {
          id: true,
          name: true,
          price: true,
          images: true,
          category: { select: { name: true } },
        },
      });

      if (!product) return null;

      const parsedImages = parseProductImages(product.images);
      return {
        productId: item.productId,
        _sum: item._sum,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          images: parsedImages,
          imageUrl: parsedImages.length > 0 ? parsedImages[0] : null,
          category: product.category ? product.category.name : null,
        },
      };
    })
  );

  // ? Structure the response data
  return {
    orders: {
      total: totalOrders,
      today: todayOrders,
      month: monthOrders,
      byStatus: ordersByStatus,
    },
    revenue: {
      total: totalRevenueAgg._sum.total || 0,
      today: todayRevenueAgg._sum.total || 0,
      month: monthRevenueAgg._sum.total || 0,
      year: yearRevenueAgg._sum.total || 0,
    },
    products: {
      total: totalProducts,
      lowStock: lowStockProducts,
      outOfStock: outOfStockProducts,
      topSelling: topSellingWithDetails,
    },
    users: {
      total: totalUsers,
      newToday: newUsersToday,
      newThisMonth: newUsersThisMonth,
    },
    recentOrders: recentOrders.map(order => ({ ...order, user: order.user })),
  };
}

// ? Helper function to generate date keys for grouping
function generateDateKey(date, groupBy) {
  switch (groupBy) {
    case 'week': {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().split('T')[0];
    }
    case 'month':
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    case 'day':
    default:
      return date.toISOString().split('T')[0];
  }
}

// * Sales analytics function
async function salesAnalytics({ startDate, endDate, groupBy }) {
  const revenueStatuses = getRevenueStatuses();

  // ? Fetch orders within date range with revenue-generating status
  const salesData = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { in: revenueStatuses },
    },
    select: {
      total: true,
      createdAt: true,
      orderItems: { select: { quantity: true, price: true } },
    },
  });

  // ? Group sales data by specified time period
  const grouped = {};
  for (const order of salesData) {
    const orderDate = new Date(order.createdAt);
    const key = generateDateKey(orderDate, groupBy);

    if (!grouped[key]) {
      grouped[key] = { date: key, revenue: 0, orders: 0, items: 0 };
    }

    grouped[key].revenue += Number(order.total);
    grouped[key].orders += 1;
    grouped[key].items += order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  // ? Sort data chronologically
  const chartData = Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));

  return {
    chartData,
    summary: {
      totalRevenue: chartData.reduce((sum, item) => sum + item.revenue, 0),
      totalOrders: chartData.reduce((sum, item) => sum + item.orders, 0),
      totalItems: chartData.reduce((sum, item) => sum + item.items, 0),
      averageOrderValue:
        chartData.length > 0
          ? chartData.reduce((sum, item) => sum + item.revenue, 0) /
            chartData.reduce((sum, item) => sum + item.orders, 0)
          : 0,
    },
  };
}

// * Product analytics function
async function productAnalytics({ limit, sortBy }) {
  // ? Get aggregated product sales data
  const productSales = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true, price: true },
    _count: { productId: true },
    orderBy: sortBy === 'revenue' ? { _sum: { price: 'desc' } } : { _sum: { quantity: 'desc' } },
    take: limit,
  });

  // ? Enrich product sales with product details
  const productAnalytics = await Promise.all(
    productSales.map(async item => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { category: { select: { name: true } } },
      });

      if (!product) return null;

      const parsedImages = parseProductImages(product.images);
      return {
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        status: product.status,
        category: product.category.name,
        images: parsedImages,
        imageUrl: parsedImages.length > 0 ? parsedImages[0] : null,
        analytics: {
          totalSold: item._sum.quantity,
          totalRevenue: Number(item._sum.price),
          orderCount: item._count.productId,
          averageOrderQuantity: item._sum.quantity / item._count.productId,
        },
      };
    })
  );

  // ? Get category performance data
  const categoryPerformance = await prisma.category.findMany({
    include: { products: { include: { orderItems: { select: { quantity: true, price: true } } } } },
  });

  // ? Process category analytics
  const categoryAnalytics = categoryPerformance
    .map(category => {
      const totalSold = category.products.reduce(
        (sum, product) =>
          sum + product.orderItems.reduce((itemSum, item) => itemSum + item.quantity, 0),
        0
      );
      const totalRevenue = category.products.reduce(
        (sum, product) =>
          sum +
          product.orderItems.reduce(
            (itemSum, item) => itemSum + Number(item.price) * item.quantity,
            0
          ),
        0
      );
      return {
        id: category.id,
        name: category.name,
        productCount: category.products.length,
        totalSold,
        totalRevenue,
      };
    })
    .sort((a, b) => b.totalRevenue - a.totalRevenue);

  return {
    topProducts: productAnalytics.filter(Boolean),
    categoryPerformance: categoryAnalytics,
  };
}

// * Customer analytics function
async function customerAnalytics() {
  const revenueStatuses = getRevenueStatuses();

  // ? Fetch customer data with order information
  const customerStats = await prisma.user.findMany({
    include: {
      orders: { select: { total: true, status: true, createdAt: true } },
      _count: { select: { orders: true } },
    },
  });

  // ? Process customer analytics
  const analytics = customerStats
    .map(user => {
      const completedOrders = user.orders.filter(order => revenueStatuses.includes(order.status));
      const totalSpent = completedOrders.reduce((sum, order) => sum + Number(order.total), 0);
      const lastOrderDate = user.orders.length
        ? new Date(Math.max(...user.orders.map(order => new Date(order.createdAt).getTime())))
        : null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        totalOrders: user._count.orders,
        completedOrders: completedOrders.length,
        totalSpent,
        averageOrderValue: completedOrders.length ? totalSpent / completedOrders.length : 0,
        lastOrderDate,
        joinDate: user.createdAt,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  // ? Segment customers by spending patterns
  const segments = {
    vip: analytics.filter(customer => customer.totalSpent > 1000).length,
    regular: analytics.filter(customer => customer.totalSpent > 100 && customer.totalSpent <= 1000)
      .length,
    new: analytics.filter(customer => customer.totalSpent <= 100).length,
    inactive: analytics.filter(customer => customer.totalOrders === 0).length,
  };

  return {
    topCustomers: analytics.slice(0, 10),
    segments,
    summary: {
      totalCustomers: analytics.length,
      averageOrderValue:
        analytics.reduce((sum, customer) => sum + customer.averageOrderValue, 0) /
          analytics.length || 0,
      averageLifetimeValue:
        analytics.reduce((sum, customer) => sum + customer.totalSpent, 0) / analytics.length || 0,
    },
  };
}

// * Inventory analytics function
async function inventoryAnalytics() {
  // ? Fetch inventory data in parallel
  const [
    totalProducts,
    activeProducts,
    inactiveProducts,
    lowStockProducts,
    outOfStockProducts,
    productsWithStock,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: ProductStatus.ACTIVE } }),
    prisma.product.count({ where: { status: ProductStatus.INACTIVE } }),

    // ? Low stock products (10 or fewer, but not zero)
    prisma.product.findMany({
      where: {
        stock: { lte: 10, gt: 0 },
        status: ProductStatus.ACTIVE,
      },
      include: { category: { select: { name: true } } },
    }),

    // ? Out of stock products
    prisma.product.findMany({
      where: { stock: 0 },
      include: { category: { select: { name: true } } },
    }),

    // ? All products with stock for calculations
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        stock: true,
        price: true,
        images: true,
        category: { select: { name: true } },
      },
    }),
  ]);

  // ? Calculate total inventory value
  const totalInventoryValue = productsWithStock.reduce(
    (sum, product) => sum + Number(product.price) * product.stock,
    0
  );

  // ? Calculate category stock distribution
  const categoryStock = {};
  productsWithStock.forEach(product => {
    const categoryName = product.category.name;
    if (!categoryStock[categoryName]) {
      categoryStock[categoryName] = { products: 0, totalStock: 0, totalValue: 0 };
    }
    categoryStock[categoryName].products += 1;
    categoryStock[categoryName].totalStock += product.stock;
    categoryStock[categoryName].totalValue += Number(product.price) * product.stock;
  });

  // ? Helper function to enrich products with image data
  const enrichProductWithImages = product => {
    const parsedImages = parseProductImages(product.images);
    return {
      ...product,
      images: parsedImages,
      imageUrl: parsedImages.length > 0 ? parsedImages[0] : null,
    };
  };

  return {
    summary: {
      totalProducts,
      activeProducts,
      inactiveProducts,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      totalInventoryValue,
    },
    lowStockProducts: lowStockProducts.map(enrichProductWithImages),
    outOfStockProducts: outOfStockProducts.map(enrichProductWithImages),
    categoryDistribution: Object.entries(categoryStock).map(([category, data]) => ({
      category,
      ...data,
    })),
  };
}

module.exports = {
  dashboardMetrics,
  salesAnalytics,
  productAnalytics,
  customerAnalytics,
  inventoryAnalytics,
};
