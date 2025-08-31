const prisma = require('../utils/prismaClient');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { UserRole, ProductStatus, ORDER_STATUSES } = require('../constants/businessEnums');

async function main() {
  console.log('Starting database seeding...');

  // * Clear existing data
  console.log('\nClearing existing data...');
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});

  // * Create admin user
  console.log('\nCreating admin user...');
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
  console.log('\nCreating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Clothing',
        description: 'Fashion and apparel',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Books',
        description: 'Books and educational materials',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sports',
        description: 'Sports equipment and outdoor gear',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // * Create products
  console.log('\nCreating products...');
  const productData = [
    // * Electronics
    {
      name: 'iPhone 14 Pro',
      description: 'Latest Apple iPhone with advanced camera system',
      price: 999.99,
      stock: 50,
      categoryId: categories[0].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'MacBook Air M2',
      description: 'Powerful laptop with M2 chip',
      price: 1199.99,
      stock: 25,
      categoryId: categories[0].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Samsung Galaxy S23',
      description: 'Premium Android smartphone',
      price: 799.99,
      stock: 35,
      categoryId: categories[0].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'AirPods Pro',
      description: 'Wireless earbuds with active noise cancellation',
      price: 249.99,
      stock: 100,
      categoryId: categories[0].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'iPad Air',
      description: 'Versatile tablet for work and play',
      price: 599.99,
      stock: 40,
      categoryId: categories[0].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400']),
      status: ProductStatus.ACTIVE,
    },

    // *Clothing
    {
      name: 'Nike Air Force 1',
      description: 'Classic white sneakers',
      price: 90.0,
      stock: 75,
      categoryId: categories[1].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: "Levi's 501 Jeans",
      description: 'Original fit jeans',
      price: 69.99,
      stock: 120,
      categoryId: categories[1].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1542272604-787c3835535d?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Adidas Hoodie',
      description: 'Comfortable cotton hoodie',
      price: 55.0,
      stock: 85,
      categoryId: categories[1].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Ray-Ban Sunglasses',
      description: 'Classic aviator sunglasses',
      price: 150.0,
      stock: 60,
      categoryId: categories[1].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },

    // * Books
    {
      name: 'The Great Gatsby',
      description: 'Classic American novel by F. Scott Fitzgerald',
      price: 12.99,
      stock: 200,
      categoryId: categories[2].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Clean Code',
      description: 'A handbook of agile software craftsmanship',
      price: 45.99,
      stock: 80,
      categoryId: categories[2].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Harry Potter Set',
      description: 'Complete 7-book series',
      price: 89.99,
      stock: 45,
      categoryId: categories[2].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },

    // * Home & Garden
    {
      name: 'Dyson V15 Vacuum',
      description: 'Powerful cordless vacuum cleaner',
      price: 749.99,
      stock: 15,
      categoryId: categories[3].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'KitchenAid Mixer',
      description: 'Professional stand mixer',
      price: 349.99,
      stock: 20,
      categoryId: categories[3].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1585515656717-5c0c8b84eaa5?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Garden Tool Set',
      description: '10-piece gardening tool kit',
      price: 79.99,
      stock: 55,
      categoryId: categories[3].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },

    // * Sports
    {
      name: 'Wilson Tennis Racket',
      description: 'Professional tennis racket',
      price: 199.99,
      stock: 30,
      categoryId: categories[4].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400']),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip premium yoga mat',
      price: 39.99,
      stock: 100,
      categoryId: categories[4].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Dumbbells Set',
      description: 'Adjustable weight dumbbells',
      price: 299.99,
      stock: 25,
      categoryId: categories[4].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },

    // * Some low stock and out of stock items
    {
      name: 'Limited Edition Watch',
      description: 'Luxury smartwatch with limited availability',
      price: 899.99,
      stock: 3,
      categoryId: categories[0].id,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      ]),
      status: ProductStatus.ACTIVE,
    },
    {
      name: 'Vintage Jacket',
      description: 'Rare vintage leather jacket',
      price: 299.99,
      stock: 0,
      categoryId: categories[1].id,
      images: JSON.stringify(['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400']),
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
  console.log('\nCreating sample orders...');
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

  console.log('\nDatabase seeding completed successfully!');
  console.log('\nSummary:');
  console.log(`Users: ${users.length + 2} (including admin and manager)`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Products: ${products.length}`);
  console.log(`Orders: ${orders.length}`);
  console.log();
}

main()
  .catch(e => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
