<template>
  <div :class="getMainLayoutClass()">
    <!-- Page header -->
    <div class="mb-8">
      <h1 :class="getPageTitleClass()">Dashboard</h1>
    </div>

    <!-- Loading state -->
    <div v-if="analyticsStore.loading" :class="getLoadingContainerClass()">
      <div :class="getSpinnerClass()"></div>
    </div>

    <!-- Dashboard content -->
    <div v-else>
      <!-- Stats overview -->
      <div :class="getDashboardStatsGridClass()">
        <div :class="getCardClass()">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CurrencyEuroIcon :class="getDashboardStatIconClass('emerald')" />
            </div>
            <div class="ml-4">
              <p :class="getStatLabelClass()">Total Revenue</p>
              <p :class="getStatNumberClass('green')">
                {{ formatCurrency(analyticsStore.dashboard?.revenue?.total || 0) }}
              </p>
            </div>
          </div>
        </div>

        <div :class="getCardClass()">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ClipboardDocumentListIcon :class="getDashboardStatIconClass('blue')" />
            </div>
            <div class="ml-4">
              <p :class="getStatLabelClass()">Total Orders</p>
              <p :class="getStatNumberClass('blue')">
                {{ analyticsStore.dashboard?.orders?.total || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div :class="getCardClass()">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ShoppingBagIcon :class="getDashboardStatIconClass('purple')" />
            </div>
            <div class="ml-4">
              <p :class="getStatLabelClass()">Total Products</p>
              <p :class="getStatNumberClass('purple')">
                {{ analyticsStore.dashboard?.products?.total || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div :class="getCardClass()">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon :class="getDashboardStatIconClass('orange')" />
            </div>
            <div class="ml-4">
              <p :class="getStatLabelClass()">Total Users</p>
              <p :class="getStatNumberClass('orange')">
                {{ analyticsStore.dashboard?.users?.total || 0 }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and tables -->
      <div :class="getDashboardChartsGridClass()">
        <!-- Recent Orders -->
        <div :class="getCardClass()">
          <div :class="getFlexItemsCenterClass() + ' justify-between mb-4'">
            <h3 :class="getCardHeaderClass()">Recent Orders</h3>
            <router-link to="/orders" :class="getLinkClass('emerald')"> View all </router-link>
          </div>

          <div class="flow-root">
            <ul role="list" :class="getListDividerClass()">
              <li v-for="order in recentOrders" :key="order.id" :class="getListItemClass()">
                <div :class="getListItemContentClass()">
                  <div :class="getListItemMainClass()">
                    <p :class="getListItemTitleClass()">Order #{{ order.id }}</p>
                    <p :class="getListItemSubtitleClass()">
                      {{ order.user?.name }}
                    </p>
                  </div>
                  <div :class="getListItemActionsClass()">
                    <span :class="getStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </div>
                  <div :class="getListItemActionsClass()">
                    <p :class="getListItemTitleClass()">
                      {{ formatCurrency(order.total) }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-if="recentOrders.length === 0" :class="getEmptyStateClass()">
            <p :class="getEmptyStateDescriptionClass()">No recent orders</p>
          </div>
        </div>

        <!-- Top Products -->
        <div :class="getCardClass()">
          <div :class="getFlexItemsCenterClass() + ' justify-between mb-4'">
            <h3 :class="getCardHeaderClass()">Top Selling Products</h3>
            <router-link to="/products" :class="getLinkClass('emerald')"> View all </router-link>
          </div>

          <div class="space-y-4">
            <div
              v-for="product in topProducts"
              :key="product.id"
              :class="getListItemContentClass()"
            >
              <div :class="getListItemActionsClass()">
                <img
                  v-if="product.imageUrl"
                  :src="getImageUrl(product.imageUrl)"
                  :alt="product.name"
                  :class="getProductImageClass()"
                  @error="handleImageError($event)"
                />
                <div v-else :class="getProductImagePlaceholderClass()">
                  <ShoppingBagIcon :class="getIconClass('standard', 'default')" />
                </div>
              </div>
              <div :class="getListItemMainClass()">
                <p :class="getListItemTitleClass()">
                  {{ product.name }}
                </p>
                <p :class="getListItemSubtitleClass()">{{ product.totalSold }} sold</p>
              </div>
              <div :class="getListItemActionsClass()">
                <p :class="getListItemTitleClass()">
                  {{ formatCurrency(product.price) }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="topProducts.length === 0" :class="getEmptyStateClass()">
            <p :class="getEmptyStateDescriptionClass()">No product data available</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div :class="getDashboardChartsGridClass() + ' mt-8'">
        <!-- Revenue Chart -->
        <div :class="getCardClass()">
          <h3 :class="getCardHeaderClass()">Revenue Distribution</h3>
          <div class="h-64 flex items-center justify-center">
            <Doughnut v-if="chartData" :data="chartData" :options="chartOptions" />
            <p v-else :class="getTextMutedClass()">No data available</p>
          </div>
        </div>

        <!-- Order Status Chart -->
        <div :class="getCardClass()">
          <h3 :class="getCardHeaderClass()">Order Status Distribution</h3>
          <div class="h-64 flex items-center justify-center">
            <Doughnut
              v-if="orderStatusData"
              :data="orderStatusData"
              :options="orderStatusOptions"
            />
            <p v-else :class="getTextMutedClass()">No order data available</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useAnalyticsStore } from '../stores/analytics'
import { useUIClasses } from '../composables/useUIClasses'
import { OrderStatus } from '../utils/enums'
import {
  CurrencyEuroIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { Doughnut } from 'vue-chartjs'
import { getImageUrl } from '../utils/urls'
import { formatCurrency } from '../utils/currency'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const authStore = useAuthStore()
const analyticsStore = useAnalyticsStore()

// UI classes
const {
  getMainLayoutClass,
  getPageTitleClass,
  getLoadingContainerClass,
  getSpinnerClass,
  getDashboardStatsGridClass,
  getCardClass,
  getDashboardStatIconClass,
  getStatLabelClass,
  getStatNumberClass,
  getDashboardChartsGridClass,
  getCardHeaderClass,
  getLinkClass,
  getStatusBadgeClass,
  getFlexItemsCenterClass,
  getListDividerClass,
  getListItemClass,
  getListItemContentClass,
  getListItemMainClass,
  getListItemTitleClass,
  getListItemSubtitleClass,
  getListItemActionsClass,
  getEmptyStateClass,
  getEmptyStateDescriptionClass,
  getProductImageClass,
  getProductImagePlaceholderClass,
  getIconClass,
  getTextMutedClass,
} = useUIClasses()

const recentOrders = computed(() => {
  return analyticsStore.dashboard?.recentOrders || []
})

const topProducts = computed(() => {
  return (
    analyticsStore.dashboard?.products?.topSelling?.slice(0, 5)?.map((item) => ({
      id: item.product?.id || item.productId,
      name: item.product?.name || 'Unknown Product',
      price: item.product?.price || 0,
      totalSold: item._sum?.quantity || 0,
      imageUrl: item.product?.imageUrl || null,
    })) || []
  )
})

const orderStatusData = computed(() => {
  const ordersByStatus = analyticsStore.dashboard?.orders?.byStatus
  if (!ordersByStatus || !Array.isArray(ordersByStatus)) return null

  // * Convert array to object for easier access
  const statusCounts = ordersByStatus.reduce(
    (acc, item) => {
      acc[item.status.toLowerCase()] = item._count.status
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    labels: [
      OrderStatus.PENDING,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED,
    ],
    datasets: [
      {
        data: [
          statusCounts.pending || 0,
          statusCounts.processing || 0,
          statusCounts.shipped || 0,
          statusCounts.delivered || 0,
          statusCounts.cancelled || 0,
        ],
        backgroundColor: [
          '#f59e0b', // ? yellow for pending
          '#3b82f6', // ? blue for processing
          '#8b5cf6', // ? purple for shipped
          '#10b981', // ? green for delivered
          '#ef4444', // ? red for cancelled
        ],
        borderWidth: 0,
      },
    ],
  }
})

const chartData = computed(() => {
  const dashboard = analyticsStore.dashboard
  if (!dashboard) return null

  return {
    labels: ['Revenue', 'Orders', 'Products'],
    datasets: [
      {
        data: [
          dashboard.revenue?.total || 0,
          dashboard.orders?.total || 0,
          dashboard.products?.total || 0,
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
    },
  },
}

const orderStatusOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
      },
    },
  },
}

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
  const placeholder = target.nextElementSibling as HTMLElement
  if (placeholder) {
    placeholder.style.display = 'flex'
  }
}

onMounted(() => {
  // ! Only fetch analytics if user is authenticated
  if (authStore.isAuthenticated) {
    analyticsStore.fetchDashboard()
  }
})
</script>
