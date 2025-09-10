<template>
  <div>
    <!-- Skeletons while loading -->
    <div v-if="loading" :class="getDashboardGridClass()">
      <div
        v-for="n in 4"
        :key="n"
        :class="[getCardClass(), getDashboardCardPaddingClass()]"
        data-testid="skeleton-card"
      >
        <div class="animate-pulse space-y-4">
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <div :class="getFlexJustifyBetweenClass()">
      <h1 :class="getAnalyticsHeaderClass()" data-testid="analytics-header">Analytics Dashboard</h1>
      <button
        @click="refreshData"
        :disabled="loading"
        :class="getActionButtonClass('refresh')"
        data-testid="refresh-button"
      >
        <span>Refresh</span>
        <svg
          :class="[getRefreshIconClass(), { 'animate-spin': loading }]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" :class="[getErrorMessageClass(), getProductFormTitleSpacingClass()]">
      {{ error }}
    </div>

    <!-- Dashboard Metrics -->
    <div v-if="dashboard" :class="getDashboardGridClass()">
      <!-- Revenue Card -->
      <div :class="[getCardClass(), getDashboardCardPaddingClass()]">
        <div :class="getDashboardCardContentClass()">
          <div :class="getDashboardCardIconContainerClass()">
            <CurrencyEuroIcon :class="getDashboardStatIconClass('emerald')" />
          </div>
          <div :class="getDashboardCardTextContainerClass()">
            <p :class="getDashboardCardTitleClass()">Total Revenue</p>
            <p :class="getStatNumberClass('green')">
              {{ formatCurrency(dashboard?.revenue?.total || 0) }}
            </p>
            <p :class="getDashboardCardSubtextClass()">
              This month:
              <span :class="getDashboardCardSubtextValueClass()">{{
                formatCurrency(dashboard?.revenue?.month || 0)
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- Avg Order Value Card -->
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass(), 'w-full']"
        data-testid="avg-order-value-card"
      >
        <div :class="getDashboardCardContentClass()">
          <div :class="getDashboardCardIconContainerClass()">
            <ClipboardDocumentListIcon :class="getDashboardStatIconClass('emerald')" />
          </div>
          <div :class="getDashboardCardTextContainerClass()">
            <p :class="getDashboardCardTitleClass()">Average Order</p>
            <p :class="getStatNumberClass('green')">
              {{
                formatCurrency(
                  (dashboard?.revenue?.total || 0) / Math.max(dashboard?.orders?.total || 1, 1),
                )
              }}
            </p>
            <p :class="getDashboardCardSubtextClass()">Approximate value</p>
          </div>
        </div>
      </div>

      <!-- Orders Card -->
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass(), 'w-full']"
        data-testid="total-orders-card"
      >
        <div :class="getDashboardCardContentClass()">
          <div :class="getDashboardCardIconContainerClass()">
            <ClipboardDocumentListIcon :class="getDashboardStatIconClass('blue')" />
          </div>
          <div :class="getDashboardCardTextContainerClass()">
            <p :class="getDashboardCardTitleClass()">Total Orders</p>
            <p :class="getStatNumberClass('blue')">
              {{ (dashboard?.orders?.total || 0).toLocaleString() }}
            </p>
            <p :class="getDashboardCardSubtextClass()">
              Today:
              <span :class="getDashboardCardSubtextValueClass()">{{
                dashboard?.orders?.today || 0
              }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Products Card -->
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass(), 'w-full']"
        data-testid="total-products-card"
      >
        <div :class="getDashboardCardContentClass()">
          <div :class="getDashboardCardIconContainerClass()">
            <ShoppingBagIcon :class="getDashboardStatIconClass('purple')" />
          </div>
          <div :class="getDashboardCardTextContainerClass()">
            <p :class="getDashboardCardTitleClass()">Total Products</p>
            <p :class="getStatNumberClass('purple')">
              {{ (dashboard?.products?.total || 0).toLocaleString() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Users Card -->
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass(), 'w-full']"
        data-testid="total-customers-card"
      >
        <div :class="getDashboardCardContentClass()">
          <div :class="getDashboardCardIconContainerClass()">
            <UsersIcon :class="getDashboardStatIconClass('orange')" />
          </div>
          <div :class="getDashboardCardTextContainerClass()">
            <p :class="getDashboardCardTitleClass()">Total Users</p>
            <p :class="getStatNumberClass('orange')">
              {{ (dashboard?.users?.total || 0).toLocaleString() }}
            </p>
            <p :class="getDashboardCardSubtextClass()">
              New today:
              <span :class="getDashboardCardSubtextValueClass()">{{
                dashboard?.users?.newToday || 0
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <!-- Global empty state based on dashboard metrics -->
    </div>
    <div
      v-if="dashboard && isEmptyDashboard"
      :class="getAnalyticsNoDataClass()"
      data-testid="no-data-message"
    >
      No data available
    </div>

    <!-- Order Status Distribution -->
    <div v-if="dashboard" :class="getAnalyticsGridClass()">
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass()]"
        data-testid="order-stats-section"
      >
        <h3 :class="getAnalyticsSectionTitleClass()">Order Status Distribution</h3>
        <div :class="getAnalyticsStatusListClass()" data-testid="order-status-breakdown">
          <div
            v-for="status in dashboard?.orders?.byStatus || []"
            :key="status.status"
            :class="getAnalyticsStatusItemClass()"
          >
            <div :class="getAnalyticsStatusIndicatorClass()">
              <div :class="[getStatusColor(status.status), getAnalyticsStatusDotClass()]"></div>
              <span :class="getAnalyticsStatusLabelClass()">
                {{ status.status.toLowerCase() }}
              </span>
            </div>
            <span :class="getAnalyticsStatusCountClass()">
              {{ status._count.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Top Selling Products -->
      <div
        :class="[getCardClass(), getDashboardCardPaddingClass()]"
        data-testid="top-products-section"
      >
        <h3 :class="getAnalyticsSectionTitleClass()">Top Selling Products</h3>
        <div :class="getTopProductsListClass()" data-testid="top-products-list">
          <div
            v-for="(product, index) in (dashboard?.products?.topSelling || []).slice(0, 5)"
            :key="product.productId"
            :class="getTopProductItemClass()"
          >
            <div :class="getTopProductRankingClass()">
              <div :class="getTopProductRankBadgeClass()">
                {{ index + 1 }}
              </div>
              <div :class="getTopProductInfoClass()">
                <p :class="getTopProductNameClass()">
                  {{ product.product?.name || `Product ${product.productId}` }}
                </p>
                <p :class="getTopProductPriceClass()">
                  {{ formatCurrency(product.product?.price || 0) }}
                </p>
              </div>
            </div>
            <span :class="getTopProductSalesClass()"> {{ product._sum.quantity }} sold </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders -->
    <div v-if="dashboard" :class="[getCardClass(), 'mb-8']" data-testid="sales-trends-section">
      <div :class="getDashboardCardPaddingClass()">
        <h3 :class="getAnalyticsSectionTitleClass()">Recent Orders</h3>
        <div :class="getAnalyticsTableContainerClass()">
          <table :class="getAnalyticsTableClass()" data-testid="orders-chart">
            <thead>
              <tr>
                <th :class="getAnalyticsTableHeaderCellClass()">Order ID</th>
                <th :class="getAnalyticsTableHeaderCellCenterClass()">Customer</th>
                <th :class="getAnalyticsTableHeaderCellCenterClass()">Total</th>
                <th :class="getAnalyticsTableHeaderCellCenterClass()">Status</th>
                <th :class="getAnalyticsTableHeaderCellCenterClass()">Date</th>
              </tr>
            </thead>
            <tbody :class="getAnalyticsTableBodyClass()">
              <tr
                v-for="order in (dashboard?.recentOrders || []).slice(0, 10)"
                :key="order.id"
                :class="getAnalyticsTableRowClass()"
              >
                <td :class="getAnalyticsTableCellClass()">#{{ order.id.slice(-8) }}</td>
                <td :class="getAnalyticsTableCellCenterClass()">
                  {{ order.user.name }}
                </td>
                <td :class="getAnalyticsTableCellCenterClass()">
                  {{ formatCurrency(order.total) }}
                </td>
                <td :class="getAnalyticsTableCellCenterClass()">
                  <span :class="getStatusBadgeClass(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td :class="getAnalyticsTableCellCenterClass()">
                  {{ formatDate(order.createdAt) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Analytics Sections Toggle -->
    <div :class="getAnalyticsToggleContainerClass()" data-testid="chart-legend">
      <button
        @click="activeSection = 'sales'"
        :class="[
          getAnalyticsToggleButtonClass(),
          activeSection === 'sales'
            ? getAnalyticsToggleActiveClass()
            : getAnalyticsToggleInactiveClass(),
        ]"
      >
        Sales Analytics
      </button>
      <button
        @click="activeSection = 'products'"
        :class="[
          getAnalyticsToggleButtonClass(),
          activeSection === 'products'
            ? getAnalyticsToggleActiveClass()
            : getAnalyticsToggleInactiveClass(),
        ]"
      >
        Product Analytics
      </button>
      <button
        @click="activeSection = 'customers'"
        :class="[
          getAnalyticsToggleButtonClass(),
          activeSection === 'customers'
            ? getAnalyticsToggleActiveClass()
            : getAnalyticsToggleInactiveClass(),
        ]"
      >
        Customer Analytics
      </button>
      <button
        @click="activeSection = 'inventory'"
        :class="[
          getAnalyticsToggleButtonClass(),
          activeSection === 'inventory'
            ? getAnalyticsToggleActiveClass()
            : getAnalyticsToggleInactiveClass(),
        ]"
      >
        Inventory Analytics
      </button>
    </div>

    <!-- Sales Analytics -->
    <div
      v-if="activeSection === 'sales'"
      :class="[getCardClass(), getDashboardCardPaddingClass()]"
      data-testid="sales-chart"
    >
      <h3 :class="getAnalyticsSectionTitleClass()">Sales Analytics</h3>
      <div v-if="sales?.length > 0" :class="getProductFormSpacingClass()">
        <div :class="getAnalyticsStatsGridClass()">
          <div
            v-for="item in sales.slice(0, 3)"
            :key="item.date"
            :class="getAnalyticsStatItemClass()"
          >
            <p :class="getAnalyticsStatLabelClass()">{{ formatDate(item.period) }}</p>
            <p :class="getAnalyticsStatValueClass()">
              {{ formatCurrency(item.revenue) }}
            </p>
            <p :class="getAnalyticsStatSubtextClass()">
              {{ item.orders }} {{ item.orders === 1 ? 'order' : 'orders' }}
            </p>
          </div>
        </div>
      </div>
      <div v-else :class="getAnalyticsNoDataClass()" data-testid="no-data-message">
        No sales data available
      </div>
    </div>

    <!-- Product Analytics -->
    <div
      v-if="activeSection === 'products'"
      :class="[getCardClass(), getDashboardCardPaddingClass()]"
      data-testid="top-products-chart"
    >
      <h3 :class="getAnalyticsSectionTitleClass()">Product Analytics</h3>
      <div v-if="products?.length > 0" :class="getAnalyticsTableContainerClass()">
        <table :class="getAnalyticsTableClass()">
          <thead>
            <tr>
              <th :class="getAnalyticsTableHeaderCellClass()">Product</th>
              <th :class="getAnalyticsTableHeaderCellCenterClass()">Sales</th>
              <th :class="getAnalyticsTableHeaderCellClass()">Revenue</th>
              <th :class="getAnalyticsTableHeaderCellCenterClass()">Stock</th>
            </tr>
          </thead>
          <tbody :class="getAnalyticsTableBodyClass()">
            <tr v-for="product in products" :key="product.id" :class="getAnalyticsTableRowClass()">
              <td :class="getAnalyticsTableCellClass()">
                {{ product.name }}
              </td>
              <td :class="getAnalyticsTableCellCenterClass()">
                {{ product.totalSales }}
              </td>
              <td :class="getAnalyticsTableCellDataClass()">
                {{ formatCurrency(product.totalRevenue) }}
              </td>
              <td :class="getAnalyticsTableCellCenterClass()">
                {{ product.stock }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else :class="getAnalyticsNoDataClass()" data-testid="no-data-message">
        No data available
      </div>
    </div>

    <!-- Customer Analytics -->
    <div
      v-if="activeSection === 'customers'"
      :class="[getCardClass(), getDashboardCardPaddingClass()]"
      data-testid="order-trends-chart"
    >
      <h3 :class="getAnalyticsSectionTitleClass()">Customer Analytics</h3>
      <div v-if="customers" :class="getProductFormSpacingClass()">
        <div :class="getAnalyticsStatsGridClass()">
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Total Customers</p>
            <p :class="getAnalyticsStatValueClass()">
              {{ customers?.totalCustomers || 0 }}
            </p>
          </div>
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">New Customers</p>
            <p :class="getAnalyticsStatValueClass()">
              {{ customers?.newCustomers || 0 }}
            </p>
          </div>
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Returning Customers</p>
            <p :class="getAnalyticsStatValueClass()">
              {{ customers?.returningCustomers || 0 }}
            </p>
          </div>
        </div>

        <!-- Divider -->
        <div :class="getAnalyticsDividerClass()"></div>

        <div v-if="customers?.topCustomers?.length > 0">
          <h4 :class="getAnalyticsSectionTitleClass()">Top Customers</h4>
          <div :class="getProductFormSpacingClass()">
            <div
              v-for="customer in customers?.topCustomers || []"
              :key="customer.id"
              :class="getAnalyticsCustomerCardClass()"
            >
              <div :class="getAnalyticsCustomerInfoClass()">
                <p :class="getAnalyticsCustomerNameClass()">{{ customer.name }}</p>
                <p :class="getAnalyticsCustomerEmailClass()">{{ customer.email }}</p>
              </div>
              <div :class="getAnalyticsCustomerStatsClass()">
                <p :class="getAnalyticsCustomerSpentClass()">
                  {{ formatCurrency(customer.totalSpent) }}
                </p>
                <p :class="getAnalyticsCustomerOrdersClass()">
                  {{ customer.totalOrders }} {{ customer.totalOrders === 1 ? 'order' : 'orders' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else :class="getAnalyticsNoDataClass()" data-testid="no-data-message">
        No data available
      </div>
    </div>

    <!-- Inventory Analytics -->
    <div
      v-if="activeSection === 'inventory'"
      :class="[getCardClass(), getDashboardCardPaddingClass()]"
      data-testid="order-status-chart"
    >
      <h3 :class="getAnalyticsSectionTitleClass()">Inventory Analytics</h3>
      <div v-if="inventory" :class="getProductFormSpacingClass()">
        <div :class="getInventoryStatsGridClass()">
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Total Products</p>
            <p :class="getAnalyticsStatValueClass()">
              {{ inventory?.totalProducts || 0 }}
            </p>
          </div>
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Good Stock</p>
            <p :class="getAnalyticsStatValueClass()" class="text-emerald-600 dark:text-emerald-400">
              {{
                (inventory?.totalProducts || 0) -
                (inventory?.lowStockProducts || 0) -
                (inventory?.outOfStockProducts || 0)
              }}
            </p>
          </div>
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Low Stock</p>
            <p :class="getAnalyticsStatValueClass()" class="text-amber-600 dark:text-amber-400">
              {{ inventory?.lowStockProducts || 0 }}
            </p>
          </div>
          <div :class="getAnalyticsStatItemClass()">
            <p :class="getAnalyticsStatLabelClass()">Out of Stock</p>
            <p :class="getAnalyticsStatValueClass()" class="text-red-600 dark:text-red-400">
              {{ inventory?.outOfStockProducts || 0 }}
            </p>
          </div>
        </div>

        <div v-if="inventory?.topCategories?.length > 0">
          <h4 :class="getAnalyticsSectionTitleClass()">Top Categories</h4>
          <div :class="getProductFormSpacingClass()">
            <div
              v-for="category in inventory?.topCategories || []"
              :key="category.id"
              :class="getAnalyticsCategoryItemClass()"
            >
              <div :class="getAnalyticsCategoryInfoClass()">
                <p :class="getAnalyticsCategoryNameClass()">{{ category.name }}</p>
                <p :class="getAnalyticsCategoryCountClass()">
                  {{ category.productCount }} products
                </p>
              </div>
              <div :class="getAnalyticsCategoryStatsClass()">
                <p :class="getAnalyticsCategoryStockClass()">
                  {{ category.totalStock }} total stock
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else :class="getAnalyticsNoDataClass()" data-testid="no-data-message">
        No data available
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAnalyticsStore } from '../stores/analytics'
import { useUIClasses } from '../composables/useUIClasses'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import {
  CurrencyEuroIcon,
  ClipboardDocumentListIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toastification'

const analyticsStore = useAnalyticsStore()
const toast = useToast()
const {
  getCardClass,
  getErrorMessageClass,
  getDashboardStatIconClass,
  getFlexJustifyBetweenClass,
  getActionButtonClass,
  getRefreshIconClass,
  getAnalyticsHeaderClass,
  getDashboardGridClass,
  getStatusColor,
  getDashboardCardPaddingClass,
  getDashboardCardContentClass,
  getDashboardCardIconContainerClass,
  getDashboardCardTextContainerClass,
  getDashboardCardTitleClass,
  getDashboardCardSubtextClass,
  getDashboardCardSubtextValueClass,
  getAnalyticsGridClass,
  getAnalyticsSectionTitleClass,
  getAnalyticsStatusListClass,
  getAnalyticsStatusItemClass,
  getAnalyticsStatusIndicatorClass,
  getAnalyticsStatusDotClass,
  getAnalyticsStatusLabelClass,
  getAnalyticsStatusCountClass,
  getTopProductsListClass,
  getTopProductItemClass,
  getTopProductRankingClass,
  getTopProductRankBadgeClass,
  getTopProductInfoClass,
  getTopProductNameClass,
  getTopProductPriceClass,
  getTopProductSalesClass,
  getAnalyticsTableContainerClass,
  getAnalyticsTableClass,
  getAnalyticsTableHeaderCellClass,
  getAnalyticsTableHeaderCellCenterClass,
  getAnalyticsTableBodyClass,
  getAnalyticsTableRowClass,
  getAnalyticsTableCellClass,
  getAnalyticsTableCellDataClass,
  getAnalyticsTableCellCenterClass,
  getAnalyticsToggleContainerClass,
  getAnalyticsToggleButtonClass,
  getAnalyticsToggleActiveClass,
  getAnalyticsToggleInactiveClass,
  getAnalyticsStatsGridClass,
  getAnalyticsStatItemClass,
  getAnalyticsStatLabelClass,
  getAnalyticsStatValueClass,
  getAnalyticsStatSubtextClass,
  getAnalyticsNoDataClass,
  getAnalyticsDividerClass,
  getAnalyticsCustomerCardClass,
  getAnalyticsCustomerInfoClass,
  getAnalyticsCustomerNameClass,
  getAnalyticsCustomerEmailClass,
  getAnalyticsCustomerStatsClass,
  getAnalyticsCustomerSpentClass,
  getAnalyticsCustomerOrdersClass,
  getInventoryStatsGridClass,
  getAnalyticsCategoryItemClass,
  getAnalyticsCategoryInfoClass,
  getAnalyticsCategoryNameClass,
  getAnalyticsCategoryCountClass,
  getAnalyticsCategoryStatsClass,
  getAnalyticsCategoryStockClass,
  getProductFormSpacingClass,
  getProductFormTitleSpacingClass,
  getStatNumberClass,
  getStatusBadgeClass,
} = useUIClasses()

// * Store getters
const dashboard = computed(() => analyticsStore.dashboard)
const sales = computed(() => analyticsStore.sales)
const products = computed(() => analyticsStore.products)
const customers = computed(() => analyticsStore.customers)
const inventory = computed(() => analyticsStore.inventory)
const loading = computed(() => analyticsStore.loading)
const error = computed(() => analyticsStore.error)

// * Local state
const activeSection = ref<'sales' | 'products' | 'customers' | 'inventory'>('sales')

// Consider dashboard with all zeros as empty for global message
const isEmptyDashboard = computed(() => {
  const d = dashboard.value
  if (!d) return false
  const revenueZero = (d.revenue?.total || 0) === 0
  const ordersZero = (d.orders?.total || 0) === 0
  const usersZero = (d.users?.total || 0) === 0
  const productsZero = (d.products?.total || 0) === 0
  return revenueZero && ordersZero && usersZero && productsZero
})

// * Actions
const refreshData = async () => {
  try {
    await analyticsStore.fetchAllAnalytics()
    toast.success('Analytics data refreshed')
  } catch (error) {
    console.error('Error refreshing analytics data:', error)
  }
}

// * Initialize
onMounted(async () => {
  await refreshData()
})
</script>
