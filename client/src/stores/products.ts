import { defineStore } from 'pinia'
import axios from 'axios'
import { ProductStatus, type ProductStatusType } from '@/utils/enums'
import { handleApiError } from '@/utils/errorService'

interface CreateProductData {
  name: string
  description?: string
  price: number
  categoryId: string
  stock: number
  status?: ProductStatusType
  imageUrl?: string
}

interface Product {
  id: string
  name: string
  description?: string
  price: number
  categoryId: string
  stock: number
  imageUrl?: string
  status: ProductStatusType
  createdAt: string
  updatedAt: string
}

interface Category {
  id: string
  name: string
  description?: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Filters {
  search: string
  category: string
  status: string
}

interface ProductState {
  products: Product[]
  categories: Category[]
  currentProduct: Product | null
  isLoading: boolean
  error: string | null
  pagination: Pagination
  filters: Filters
}

export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    products: [],
    categories: [],
    currentProduct: null,
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
      category: '',
      status: '',
    },
  }),

  getters: {
    filteredProducts: (state) => {
      let filtered = [...state.products]

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.name.toLowerCase().includes(search) ||
            product.description?.toLowerCase().includes(search),
        )
      }

      if (state.filters.category) {
        filtered = filtered.filter(
          (product) => product.categoryId.toString() === state.filters.category,
        )
      }

      if (state.filters.status) {
        filtered = filtered.filter((product) => product.status === state.filters.status)
      }

      return filtered
    },

    lowStockProducts: (state) => {
      return state.products.filter(
        (product) => product.stock <= 10 && product.status === ProductStatus.ACTIVE,
      )
    },

    outOfStockProducts: (state) => {
      return state.products.filter((product) => product.stock === 0)
    },
  },

  actions: {
    async fetchProducts(params: Record<string, unknown> = {}) {
      this.isLoading = true
      this.error = null

      try {
        const queryParams = {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...this.filters,
          ...params,
        }

        const response = await axios.get('/products', { params: queryParams })

        this.products = response.data.data.products || response.data.data
        if (response.data.data.pagination) {
          this.pagination = response.data.data.pagination
        }

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'PRODUCT_FETCH_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchProduct(id: number | string) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.get(`/products/${id}`)
        this.currentProduct = response.data.data
        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'PRODUCT_FETCH_SINGLE_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createProduct(productData: CreateProductData) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post('/products', productData)

        this.products.unshift(response.data.data)

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'PRODUCT_CREATE_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateProduct(id: number | string, productData: Partial<CreateProductData>) {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.put(`/products/${id}`, productData)

        const index = this.products.findIndex((p) => p.id === id)
        if (index !== -1) {
          this.products[index] = response.data.data
        }

        if (this.currentProduct?.id === id) {
          this.currentProduct = response.data.data
        }

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'PRODUCT_UPDATE_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteProduct(id: number | string) {
      this.isLoading = true
      this.error = null

      try {
        await axios.delete(`/products/${id}`)

        this.products = this.products.filter((p) => p.id !== id)

        if (this.currentProduct?.id === id) {
          this.currentProduct = null
        }
      } catch (error: unknown) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get('/categories')
        this.categories = response.data.data
        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'CATEGORIES_FETCH_FAILED')
        throw error
      }
    },

    setFilters(filters: Partial<Filters>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
    },

    setPagination(pagination: Partial<Pagination>) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    clearError() {
      this.error = null
    },
  },
})
