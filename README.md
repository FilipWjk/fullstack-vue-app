# E-commerce Management Platform

A modern, full-stack e-commerce management platform built with Vue.js, Node.js,
Express, and MySQL. This application provides management tools for products,
orders, users, categories, and analytics with role-based access control.

> 🖼️ **Want a quick preview?** Check out the [Screenshots section](#-screenshots) below to see the application in action without needing to clone or install anything!

## 🚀 Features

### 👤 User Management

- **Role-based Access Control**: Admin, Manager, and User roles
- **Authentication**: JWT-based authentication system
- **User Registration & Login**: Secure user authentication
- **Profile Management**: Update user information and preferences
- **Dark Mode**: Toggle between light and dark themes

### 📦 Product Management

- **Product CRUD Operations**: Create, read, update, and delete products
- **Category Management**: Organize products into categories
- **Inventory Tracking**: Real-time stock management
- **Product Status**: Active, inactive, and out-of-stock states

### 📋 Order Management

- **Order Processing**: Complete order lifecycle management
- **Order Status Tracking**: Pending, processing, shipped, delivered, cancelled
- **Order History**: View all orders with detailed information
- **Customer Orders**: Customers can view their order history

### 📊 Analytics Dashboard

- **Revenue Analytics**: Track sales performance over time
- **Category Performance**: Analyze product category sales
- **Order Statistics**: Monitor order trends and patterns
- **Interactive Charts**: Visual data representation using Chart.js

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first responsive interface
- **Tailwind CSS**: Modern and clean design system
- **Sidebar Navigation**: Intuitive navigation with role-based menu items
- **Toast Notifications**: User-friendly feedback system
- **Form Validation**: Client-side and server-side validation

## 🛠 Tech Stack

### Frontend

- **Vue.js 3**: Modern JavaScript framework with Composition API
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Vue Router**: Client-side routing
- **Pinia**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Chart.js**: Data visualization library
- **Axios**: HTTP client for API requests

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Prisma**: Database ORM
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcrypt.js**: Password hashing
- **Joi**: Data validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Cypress**: End-to-end testing
- **Nodemon**: Development server auto-restart

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0.0 or higher)
- **npm** (version 9.0.0 or higher)
- **MySQL** (version 5.7 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/FilipWjk/fullstack-vue-app.git
cd fullstack-vue-app
```

### 2. Install Dependencies

```bash
# Install all dependencies (client + server)
npm run install:all

# Or install separately
npm run install:client
npm run install:server
```

### 3. Environment Configuration

#### Server Environment

Create a `.env` file in the `server` directory:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/ecommerce_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRE="7d"

# Server
PORT=3001
NODE_ENV="development"

```

#### Client Environment

Create a `.env` file in the `client` directory:

```env
VITE_API_URL="http://localhost:3001/api"
```

### 4. Database Setup

```bash
# Generate Prisma client
npm run db:setup

# Or run commands separately
cd server
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

### 5. Start the Application

```bash
# Start both client and server
npm run dev

# Or start separately
npm run dev:client  # Frontend (http://localhost:5173)
npm run dev:server  # Backend (http://localhost:3001)
```

## 🎯 Default Login Credentials

After seeding the database, you can use these credentials:

### Admin User

- **Email**: `admin@example.com`
- **Password**: `admin123`

### Manager User

- **Email**: `manager@example.com`
- **Password**: `manager123`

### Regular User

- **Email**: `user@example.com`
- **Password**: `user123`

## 📝 Available Scripts

### Root Package Scripts

```bash
npm run install:all     # Install all dependencies
npm run dev            # Start both client and server in development
npm run build          # Build both client and server
npm run start          # Start both client and server in production
npm run test           # Run Cypress e2e tests
npm run lint           # Lint both client and server
npm run format         # Format both client and server
npm run db:setup       # Setup database with migrations and seed data
npm run clean          # Clean all node_modules and build files
```

### Client Scripts

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run test:e2e       # Run Cypress e2e tests
npm run test:e2e:dev   # Open Cypress in development mode
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

### Server Scripts

```bash
npm run dev            # Start development server with nodemon
npm start              # Start production server
npm run db:migrate     # Run database migrations
npm run db:seed        # Seed database with sample data
npm run db:studio      # Open Prisma Studio
npm run lint           # Run ESLint
npm run format         # Format with Prettier
```

## 🗂 Project Structure

```
fullstack-vue-app/
├── client/                 # Vue.js frontend application
│   ├── src/
│   │   ├── components/     # Reusable Vue components
│   │   ├── views/          # Page components
│   │   ├── stores/         # Pinia stores for state management
│   │   ├── composables/    # Vue composables
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── router/         # Vue Router configuration
│   ├── cypress/            # E2E tests
│   └── public/             # Static assets
├── server/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── utils/          # Utility functions
│   │   └── constants/      # Application constants
│   └── prisma/             # Database schema and migrations
└── screenshots/            # Application screenshots
```

## 🖼 Screenshots

### Authentication

<details>
<summary><strong>🔐 Login Page</strong></summary>

![Login Interface](screenshots/login/login_main_interface.png)
_User authentication interface with email/password form_

</details>

<details>
<summary><strong>📝 Registration Page</strong></summary>

![Registration Form](screenshots/register/registration_main_form.png)
_New user registration with form validation_

</details>

### Dashboard & Analytics

<details>
<summary><strong>📊 Main Dashboard</strong></summary>

![Dashboard Overview](screenshots/dashboard/dashboard_main_overview.png)
_Primary dashboard view with key metrics and charts_

![Dashboard Secondary View](screenshots/dashboard/dashboard_secondary_metrics.png)
_Dashboard view showing additional statistics_

</details>

<details>
<summary><strong>📈 Analytics Dashboard</strong></summary>

![Main Analytics](screenshots/analytics/main_dashboard_overview.png)
_Main analytics overview with revenue charts_

![Secondary Analytics](screenshots/analytics/secondary_dashboard_view.png)
_Analytics view with additional metrics_

![Sales Analytics](screenshots/analytics/sales_analytics.png)
_Sales Analytics_

![Product Analytics](screenshots/analytics/product_analytics.png)
_Product performance and category breakdown_

![Customer Analytics](screenshots/analytics/customer_analytics.png)
_Customer Analytics_

![Inventory Analytics](screenshots/analytics/inventory_analytics.png)
_Inventory levels and stock analytics_

</details>

### Management Pages

<details>
<summary><strong>📦 Products Management</strong></summary>

![Products List](screenshots/products/products_screen1.png)
_Main products listing page with search and filters_

![Second List](screenshots/products/products_screen2.png)
_Second view of products listing with different sorting/filtering_

![Product Edit Form 1](screenshots/products/edit_product_1.png)
_Product editing form_

![Product Edit Form 2](screenshots/products/edit_product_2.png)
_Product editing form_

</details>

<details>
<summary><strong>🏷️ Categories Management</strong></summary>

![Categories Overview](screenshots/categories/categories.png)
_Main categories listing page with all product categories_

![Category Edit](screenshots/categories/categories_edit.png)
_Category editing/creation modal interface_

</details>

<details>
<summary><strong>📋 Orders Management</strong></summary>

![Orders List](screenshots/orders/orders_screen.png)
_Main orders listing page with all customer orders and status filters_

![Order Details](screenshots/orders/order_details.png)
_Detailed view of a specific order with items, customer info, and status_

</details>

<details>
<summary><strong>👥 Users Management</strong></summary>

![Users List](screenshots/users/users.png)
_Main users listing page with all registered users and their roles_

![User Edit](screenshots/users/user_edit.png)
_User editing modal for updating user information and permissions_

</details>

### User Features

<details>
<summary><strong>👤 Profile Management</strong></summary>

![Profile Settings](screenshots/profile/profile.png)
_Main profile page with user information and settings_

![Profile Details](screenshots/profile/profile_2.png)
 _Different section of profile settings_

![Profile Dropdown](screenshots/profile/profile_dropdown.png)
_User profile dropdown menu from the navigation header_

</details>

<details>
<summary><strong>🛒 Customer Orders</strong></summary>

![My Orders List](screenshots/my-orders/my-orders.png)
_Customer orders listing page showing personal order history_

![Order Detail View 1](screenshots/my-orders/my-orders-detail1.png)
_Detailed view of a specific order (overview section)_

![Order Detail View 2](screenshots/my-orders/my-orders-detail2.png)
_Detailed view of a specific order (items section)_

</details>

## 🧪 Testing

This application uses Cypress for end-to-end testing to ensure all features work
correctly across different user scenarios.

### Running Tests

```bash
# Run tests in headless mode
npm run test:e2e

# Open Cypress Test Runner for development
npm run test:e2e:dev
```

### Test Coverage

- User authentication (login, logout, registration)
- Product management (CRUD operations)
- Order processing and management
- User management and role-based access
- Analytics dashboard functionality
- UI component responsiveness

![TestCoverage](screenshots/cypress-coverage.png)

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt.js for secure password storage
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Cross-origin request management
- **Input Validation**: Server-side validation with Joi
- **SQL Injection Prevention**: Prisma ORM protection
- **Security Headers**: Helmet.js middleware

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Products

- `GET /api/products` - Get all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders

- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `GET /api/orders/user/:userId` - Get user orders

### Users

- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Analytics

- `GET /api/analytics/revenue` - Revenue analytics
- `GET /api/analytics/categories` - Category performance
- `GET /api/analytics/orders` - Order statistics

### Acknowledgement

Thank you for reading this far!
