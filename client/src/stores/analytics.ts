import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/utils/errorService'

export interface DashboardMetrics {
  orders: {
    total: number
    today: number
    month: number
    byStatus: Array<{ status: string; _count: { status: number } }>
  }
  revenue: {
    total: number
    today: number
    month: number
    year: number
  }
  products: {
    total: number
    lowStock: number
    outOfStock: number
    topSelling: Array<{
      productId: string
      _sum: { quantity: number }
      product?: {
        id?: string
        name: string
        price: number
        images?: string[]
        imageUrl?: string
        category?: string | null
      }
    }>
  }
  users: {
    total: number
    newToday: number
    newThisMonth: number
  }
  recentOrders: Array<{
    id: string
    total: number
    status: string
    createdAt: string
    user: { name: string; email: string }
  }>
}

export interface SalesData {
  period: string
  revenue: number
  orders: number
  date: string
}

export interface ProductAnalytics {
  id: string
  name: string
  totalSales: number
  totalRevenue: number
  stock: number
}

export interface CustomerAnalytics {
  totalCustomers: number
  newCustomers: number
  returningCustomers: number
  topCustomers: Array<{
    id: string
    name: string
    email: string
    totalOrders: number
    totalSpent: number
  }>
}

export interface InventoryAnalytics {
  totalProducts: number
  activeProducts: number
  lowStockProducts: number
  outOfStockProducts: number
  topCategories: Array<{
    id: string
    name: string
    productCount: number
    totalStock: number
  }>
}

interface AnalyticsState {
  dashboard: DashboardMetrics | null
  sales: SalesData[]
  products: ProductAnalytics[]
  customers: CustomerAnalytics | null
  inventory: InventoryAnalytics | null
  loading: boolean
  error: string | null
}

export const useAnalyticsStore = defineStore('analytics', () => {
  const state = ref<AnalyticsState>({
    dashboard: null,
    sales: [],
    products: [],
    customers: null,
    inventory: null,
    loading: false,
    error: null,
  })

  // ? Getters
  const dashboard = computed(() => state.value.dashboard)
  const sales = computed(() => state.value.sales)
  const products = computed(() => state.value.products)
  const customers = computed(() => state.value.customers)
  const inventory = computed(() => state.value.inventory)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)

  // ? Utility Actions
  const setLoading = (isLoading: boolean) => {
    state.value.loading = isLoading
  }

  const setError = (errorMessage: string | null) => {
    state.value.error = errorMessage
  }

  const clearError = () => {
    state.value.error = null
  }

  // ? Generic fetch helper to reduce duplicate coding
  async function _fetchAnalyticsData<T>(
    endpoint: string,
    params: Record<string, string | number | boolean> = {},
    dataProcessor?: (data: unknown) => T,
    errorCode:
      | 'DASHBOARD_FETCH_FAILED'
      | 'SALES_DATA_FETCH_FAILED'
      | 'PRODUCT_ANALYTICS_FETCH_FAILED'
      | 'CUSTOMER_ANALYTICS_FETCH_FAILED'
      | 'INVENTORY_ANALYTICS_FETCH_FAILED' = 'DASHBOARD_FETCH_FAILED',
  ): Promise<{ data: T }> {
    setLoading(true)
    clearError()

    try {
      const response = await axios.get(endpoint, { params })
      const data = dataProcessor ? dataProcessor(response.data.data) : response.data.data

      return { data }
    } catch (error) {
      setError(handleApiError(error as AxiosError, errorCode))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Fetch dashboard metrics
  async function fetchDashboard(): Promise<{ data: DashboardMetrics }> {
    const result = await _fetchAnalyticsData<DashboardMetrics>(
      '/analytics/dashboard',
      {},
      undefined,
      'DASHBOARD_FETCH_FAILED',
    )
    state.value.dashboard = result.data
    return result
  }

  // * Fetch sales analytics
  async function fetchSales(
    params: {
      startDate?: string
      endDate?: string
      groupBy?: 'day' | 'week' | 'month'
    } = {},
  ): Promise<{ data: SalesData[] }> {
    const result = await _fetchAnalyticsData<SalesData[]>(
      '/analytics/sales',
      params,
      (serverData) => {
        const data = serverData as {
          chartData?: Array<{ date: string; revenue: number; orders: number }>
        }
        return (data.chartData || []).map((item) => ({
          period: item.date,
          revenue: item.revenue,
          orders: item.orders,
          date: item.date,
        }))
      },
      'SALES_DATA_FETCH_FAILED',
    )
    state.value.sales = result.data
    return result
  }

  // * Fetch product analytics
  async function fetchProductAnalytics(
    params: {
      limit?: number
      sortBy?: 'sales' | 'revenue' | 'rating'
    } = {},
  ): Promise<{ data: ProductAnalytics[] }> {
    const result = await _fetchAnalyticsData<ProductAnalytics[]>(
      '/analytics/products',
      params,
      (serverData) => {
        const data = serverData as {
          topProducts?: Array<{
            id: string
            name: string
            price: number
            stock: number
            category: string
            analytics: {
              totalSold: number
              totalRevenue: number
              orderCount: number
            }
          }>
        }
        return (data.topProducts || []).map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          totalSales: product.analytics.totalSold,
          totalRevenue: product.analytics.totalRevenue,
        }))
      },
      'PRODUCT_ANALYTICS_FETCH_FAILED',
    )
    state.value.products = result.data
    return result
  }

  // * Fetch customer analytics
  async function fetchCustomerAnalytics(): Promise<{ data: CustomerAnalytics }> {
    const result = await _fetchAnalyticsData<CustomerAnalytics>(
      '/analytics/customers',
      {},
      (serverData) => {
        const data = serverData as {
          summary: { totalCustomers: number }
          segments: { new?: number; regular?: number; vip?: number }
          topCustomers?: Array<{
            id: string
            name: string
            email: string
            totalOrders: number
            totalSpent: number
          }>
        }
        return {
          totalCustomers: data.summary.totalCustomers,
          newCustomers: data.segments.new || 0,
          returningCustomers: (data.segments.regular || 0) + (data.segments.vip || 0),
          topCustomers: (data.topCustomers || []).map((customer) => ({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            totalOrders: customer.totalOrders,
            totalSpent: customer.totalSpent,
          })),
        }
      },
      'CUSTOMER_ANALYTICS_FETCH_FAILED',
    )
    state.value.customers = result.data
    return result
  }

  // * Fetch inventory analytics
  async function fetchInventoryAnalytics(): Promise<{ data: InventoryAnalytics }> {
    const result = await _fetchAnalyticsData<InventoryAnalytics>(
      '/analytics/inventory',
      {},
      (serverData) => {
        const data = serverData as {
          summary: {
            totalProducts: number
            activeProducts: number
            lowStockCount: number
            outOfStockCount: number
          }
          categoryStock?: Record<string, { products: number; totalStock: number }>
        }
        return {
          totalProducts: data.summary.totalProducts,
          activeProducts: data.summary.activeProducts,
          lowStockProducts: data.summary.lowStockCount,
          outOfStockProducts: data.summary.outOfStockCount,
          topCategories: Object.entries(data.categoryStock || {}).map(([name, categoryData]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            productCount: categoryData.products,
            totalStock: categoryData.totalStock,
          })),
        }
      },
      'INVENTORY_ANALYTICS_FETCH_FAILED',
    )
    state.value.inventory = result.data
    return result
  }

  // * Fetch all analytics data
  async function fetchAllAnalytics() {
    await Promise.allSettled([
      fetchDashboard(),
      fetchSales(),
      fetchProductAnalytics(),
      fetchCustomerAnalytics(),
      fetchInventoryAnalytics(),
    ])
  }

  // * Clear all analytics state (used on logout)
  function clearAllData() {
    state.value.dashboard = null
    state.value.sales = []
    state.value.products = []
    state.value.customers = null
    state.value.inventory = null
    state.value.loading = false
    state.value.error = null
  }

  return {
    // State
    dashboard,
    sales,
    products,
    customers,
    inventory,
    loading,
    error,

    // Actions
    fetchDashboard,
    fetchSales,
    fetchProductAnalytics,
    fetchCustomerAnalytics,
    fetchInventoryAnalytics,
    fetchAllAnalytics,
    clearAllData,
    clearError,
    setError,
  }
})
