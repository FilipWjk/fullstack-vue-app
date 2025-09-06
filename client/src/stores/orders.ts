import { defineStore } from 'pinia'
import axios from 'axios'
import { OrderStatus, type OrderStatusType } from '@/utils/enums'
import { handleApiError } from '@/utils/errorService'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    images: string[]
  }
}

export interface Order {
  id: number
  orderNumber: string
  userId: string
  user: {
    id: string
    name: string
    email: string
  }
  status: OrderStatusType
  total: number
  shippingAddress?: string
  billingAddress?: string
  notes?: string
  orderItems: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface OrderFilters {
  search: string
  status: string
  startDate: string
  endDate: string
}

export interface OrderStats {
  totalOrders: number
  ordersByStatus: Record<string, number>
  totalRevenue: number
  todayOrders: number
  thisMonthOrders: number
}

export interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  error: string | null
  pagination: OrderPagination
  filters: OrderFilters
  stats: OrderStats
}

export const useOrderStore = defineStore('orders', {
  state: (): OrderState => ({
    orders: [],
    currentOrder: null,
    isLoading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      search: '',
      status: '',
      startDate: '',
      endDate: '',
    },
    stats: {
      totalOrders: 0,
      ordersByStatus: {},
      totalRevenue: 0,
      todayOrders: 0,
      thisMonthOrders: 0,
    },
  }),

  getters: {
    pendingOrders: (state): Order[] => {
      return state.orders.filter((order) => order.status === OrderStatus.PENDING)
    },

    recentOrders: (state): Order[] => {
      return state.orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    },

    ordersByStatus: (state): Record<string, number> => {
      return state.orders.reduce(
        (acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
    },
  },

  actions: {
    // * Private helper method for fetching orders with authentication check
    async _fetchOrdersHelper(
      endpoint: string,
      params: Record<string, string | number> = {},
    ): Promise<{ data: { orders: Order[]; pagination: OrderPagination } }> {
      // ? Check if user is authenticated before making API call
      const { useAuthStore } = await import('./auth')
      const authStore = useAuthStore()

      if (!authStore.isAuthenticated) {
        // * Silently return empty data if not authenticated to avoid error toasts during logout
        return {
          data: {
            orders: [],
            pagination: {
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            },
          },
        }
      }

      this.isLoading = true
      this.error = null

      try {
        const queryParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...params,
        }

        const response = await axios.get<{
          data: { orders: Order[]; pagination: OrderPagination }
        }>(endpoint, { params: queryParams })

        this.orders = response.data.data.orders
        this.pagination = response.data.data.pagination

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'ORDERS_FETCH_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrders(
      params: Record<string, string | number> = {},
    ): Promise<{ data: { orders: Order[]; pagination: OrderPagination } }> {
      const queryParams = {
        ...this.filters,
        ...params,
      }
      return this._fetchOrdersHelper('/orders', queryParams)
    },

    async fetchMyOrders(
      params: Record<string, string | number> = {},
    ): Promise<{ data: { orders: Order[]; pagination: OrderPagination } }> {
      return this._fetchOrdersHelper('/orders/my-orders', params)
    },

    async fetchOrder(id: string | number): Promise<{ data: Order }> {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.get<{ data: Order }>(`/orders/${id}`)
        this.currentOrder = response.data.data
        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'ORDER_FETCH_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateOrderStatus(
      id: string | number,
      status: Order['status'],
    ): Promise<{ data: Order }> {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.patch<{ data: Order }>(`/orders/${id}`, { status })

        // * Update local state
        const index = this.orders.findIndex((o) => o.id === id)
        if (index !== -1) {
          this.orders[index] = response.data.data
        }

        if (this.currentOrder?.id === id) {
          this.currentOrder = response.data.data
        }

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'ORDER_UPDATE_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchOrderStats(): Promise<{ data: OrderStats }> {
      try {
        const response = await axios.get<{ data: OrderStats }>('/orders/stats/summary')
        this.stats = response.data.data
        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'ORDER_STATS_FETCH_FAILED')
        throw error
      }
    },

    setFilters(filters: Partial<OrderFilters>): void {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1 // ? Reset to first page when filtering
    },

    setPagination(pagination: Partial<OrderPagination>): void {
      this.pagination = { ...this.pagination, ...pagination }
    },

    clearError(): void {
      this.error = null
    },
  },
})
