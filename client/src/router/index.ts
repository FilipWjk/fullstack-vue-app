import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/',
      redirect: () => {
        const authStore = useAuthStore()

        // If auth is not initialized or user is not authenticated, go to login
        if (!authStore.isInitialized || !authStore.isAuthenticated) {
          return '/login'
        }

        // Users go to their orders, managers/admins go to dashboard
        if (authStore.canManageProducts) {
          return '/dashboard'
        } else {
          return '/my-orders'
        }
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/ProductsView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/products/create',
      name: 'product-create',
      component: () => import('../views/ProductCreateView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: () => import('../views/ProductEditView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/OrdersView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/my-orders',
      name: 'my-orders',
      component: () => import('../views/MyOrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/my-orders/:id',
      name: 'my-order-detail',
      component: () => import('../views/MyOrderDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('../views/OrderDetailView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/CategoriesView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('../views/UsersView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('../views/AnalyticsView.vue'),
      meta: { requiresAuth: true, requiresManager: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// * Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // * Wait for auth to be initialized if it isn't already
  if (!authStore.isInitialized) {
    try {
      await authStore.init()
    } catch (error) {
      console.error('Auth initialization failed:', error)
    }
  }

  // * Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // * Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // ! Redirect authenticated users to their appropriate home page
    if (authStore.canManageProducts) {
      next('/dashboard')
    } else {
      next('/my-orders')
    }
    return
  }

  // * Check if route requires admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    // ! Redirect non-admins to their appropriate home page
    if (authStore.isManager) {
      next('/dashboard')
    } else {
      next('/my-orders')
    }
    return
  }

  // * Check if route requires manager or admin
  if (to.meta.requiresManager && !authStore.isManager) {
    // * Regular users can't access manager pages
    next('/my-orders')
    return
  }

  next()
})

export default router
