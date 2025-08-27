const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { UserRole, ProductStatus, OrderStatus, ORDER_STATUSES } = require('../constants/businessEnums');

async function main() {
  console.log('Starting database seeding...');

  // * Clear existing data
  console.log('Clearing existing data...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // * Create admin user
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@ecommerce.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  // * Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12);
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@ecommerce.com',
      password: managerPassword,
      name: 'Manager User',
      role: UserRole.MANAGER,
    },
  });

  // * Create some regular users
  const users = [];
  for (let i = 1; i <= 5; i++) {
    const userPassword = await bcrypt.hash(`user${i}123`, 12);
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        password: userPassword,
        name: `User ${i}`,
        role: UserRole.USER,
      },
    });
    users.push(user);
  }

  console.log(`✅ Created ${users.length + 2} users`);

  // * Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: '/uploads/categories/electronics.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Fashion and apparel',
        image: '/uploads/categories/clothing.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        description: 'Books and educational materials',
        image: '/uploads/categories/books.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        image: '/uploads/categories/home-garden.jpg',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        description: 'Sports equipment and outdoor gear',
        image: '/uploads/categories/sports.jpg',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // * Create products
  console.log('Creating products...');
  const productData = [
    // * Electronics
    {
      name: 'iPhone 14 Pro',
      description: 'Latest Apple iPhone with advanced camera system',
      price: 999.99,
      stock: 50,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/iphone-14-pro.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'MacBook Air M2',
      description: 'Powerful laptop with M2 chip',
      price: 1199.99,
      stock: 25,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/macbook-air-m2.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'Premium Android smartphone',
      price: 799.99,
      stock: 35,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/samsung-s23.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'AirPods Pro',
      description: 'Wireless earbuds with active noise cancellation',
      price: 249.99,
      stock: 100,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/airpods-pro.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'iPad Air',
      description: 'Versatile tablet for work and play',
      price: 599.99,
      stock: 40,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/ipad-air.jpg']),
      status: ProductStatus.ACTIVE,
    },

    // *Clothing
    {
      name: 'Nike Air Force 1',
      description: 'Classic white sneakers',
      price: 90.0,
      stock: 75,
      categoryId: categories[1].id,
      images: JSON.stringify(['/uploads/products/nike-air-force-1.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: "Levi's 501 Jeans",
      description: 'Original fit jeans',
      price: 69.99,
      stock: 120,
      categoryId: categories[1].id,
      images: JSON.stringify(['/uploads/products/levis-501.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Adidas Hoodie',
      description: 'Comfortable cotton hoodie',
      price: 55.0,
      stock: 85,
      categoryId: categories[1].id,
      images: JSON.stringify(['/uploads/products/adidas-hoodie.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Ray-Ban Sunglasses',
      description: 'Classic aviator sunglasses',
      price: 150.0,
      stock: 60,
      categoryId: categories[1].id,
      images: JSON.stringify(['/uploads/products/rayban-aviators.jpg']),
      status: ProductStatus.ACTIVE,
    },

    // * Books
    {
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald',
      price: 12.99,
      stock: 200,
      categoryId: categories[2].id,
      images: JSON.stringify(['/uploads/products/great-gatsby.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Clean Code',
      description: 'A handbook of agile software craftsmanship',
      price: 45.99,
      stock: 80,
      categoryId: categories[2].id,
      images: JSON.stringify(['/uploads/products/clean-code.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Harry Potter Set',
      description: 'Complete 7-book series',
      price: 89.99,
      stock: 45,
      categoryId: categories[2].id,
      images: JSON.stringify(['/uploads/products/harry-potter-set.jpg']),
      status: ProductStatus.ACTIVE,
    },

    // * Home & Garden
    {
      name: 'Dyson V15 Vacuum',
      description: 'Powerful cordless vacuum cleaner',
      price: 749.99,
      stock: 15,
      categoryId: categories[3].id,
      images: JSON.stringify(['/uploads/products/dyson-v15.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'KitchenAid Mixer',
      description: 'Professional stand mixer',
      price: 349.99,
      stock: 20,
      categoryId: categories[3].id,
      images: JSON.stringify(['/uploads/products/kitchenaid-mixer.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Garden Tool Set',
      description: '10-piece gardening tool kit',
      price: 79.99,
      stock: 55,
      categoryId: categories[3].id,
      images: JSON.stringify(['/uploads/products/garden-tools.jpg']),
      status: ProductStatus.ACTIVE,
    },

    // * Sports
    {
      name: 'Wilson Tennis Racket',
      description: 'Professional tennis racket',
      price: 199.99,
      stock: 30,
      categoryId: categories[4].id,
      images: JSON.stringify(['/uploads/products/wilson-racket.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip premium yoga mat',
      price: 39.99,
      stock: 100,
      categoryId: categories[4].id,
      images: JSON.stringify(['/uploads/products/yoga-mat.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Dumbbells Set',
      description: 'Adjustable weight dumbbells',
      price: 299.99,
      stock: 25,
      categoryId: categories[4].id,
      images: JSON.stringify(['/uploads/products/dumbbells.jpg']),
      status: ProductStatus.ACTIVE,
    },

    // * Some low stock and out of stock items
    {
      name: 'Limited Edition Watch',
      description: 'Luxury smartwatch with limited availability',
      price: 899.99,
      stock: 3,
      categoryId: categories[0].id,
      images: JSON.stringify(['/uploads/products/luxury-watch.jpg']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Vintage Jacket',
      description: 'Rare vintage leather jacket',
      price: 299.99,
      stock: 0,
      categoryId: categories[1].id,
      images: JSON.stringify(['/uploads/products/vintage-jacket.jpg']),
      status: ProductStatus.OUT_OF_STOCK,
    },
  ];

  const products = [];
  for (const productInfo of productData) {
    const product = await prisma.product.create({
      data: productInfo,
    });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products`);

  // * Create sample orders
  console.log('Creating sample orders...');
  const orders = [];

  // * Create orders with different statuses and dates
  const today = new Date();

  for (let i = 0; i < 20; i++) {
    // * Random date within last 30 days
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const orderDate = new Date(today);
    orderDate.setDate(today.getDate() - randomDaysAgo);

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomStatus = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)];

    // * Generate order number
    const orderNumber = `ORD-${randomUUID().replace(/-/g, '').toUpperCase()}`;

    // * Select 1-3 random products for this order
    const orderItemCount = Math.floor(Math.random() * 3) + 1;
    const selectedProducts = [];
    for (let j = 0; j < orderItemCount; j++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      selectedProducts.push({
        productId: randomProduct.id,
        quantity,
        price: randomProduct.price,
      });
    }

    const total = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: randomUser.id,
        status: randomStatus,
        total,
        shippingAddress: `${Math.floor(Math.random() * 9999)} Krottenbachstraße 11, 1190 Wien`,
        billingAddress: `${Math.floor(Math.random() * 9999)} Lehrbachgasse 12, 1120 Wien`,
        notes: i % 3 === 0 ? 'Please handle with care' : null,
        createdAt: orderDate,
        updatedAt: orderDate,
        orderItems: {
          create: selectedProducts,
        },
      },
    });
    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} sample orders`);

  console.log('Database seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`Users: ${users.length + 2} (including admin and manager)`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Orders: ${orders.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
