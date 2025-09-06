import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/utils/errorService'

export interface Category {
  id: string
  name: string
  description?: string
  image?: string
  createdAt: string
  updatedAt: string
  _count?: {
    products: number
  }
}

interface CreateCategoryData {
  name: string
  description?: string
  imageUrl?: string
}

interface UpdateCategoryData {
  name?: string
  description?: string
  imageUrl?: string
}

interface CategoriesState {
  categories: Category[]
  currentCategory: Category | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useCategoriesStore = defineStore('categories', () => {
  // ? State
  const state = ref<CategoriesState>({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
  })

  // * Getters
  const categories = computed(() => state.value.categories)
  const currentCategory = computed(() => state.value.currentCategory)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)

  // * Actions
  const setLoading = (isLoading: boolean) => {
    state.value.loading = isLoading
  }

  const setError = (errorMessage: string | null) => {
    state.value.error = errorMessage
  }

  const clearError = () => {
    state.value.error = null
  }

  // * Fetch all categories
  async function fetchCategories() {
    setLoading(true)
    clearError()

    try {
      const response = await axios.get<{
        success: boolean
        data: Category[]
      }>('/categories')

      if (response.data.success) {
        state.value.categories = response.data.data
      }
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'CATEGORIES_FETCH_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Fetch single category by ID
  async function fetchCategory(id: string): Promise<{ data: Category }> {
    setLoading(true)
    clearError()

    try {
      const response = await axios.get<{ data: Category }>(`/categories/${id}`)
      state.value.currentCategory = response.data.data
      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'CATEGORY_FETCH_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Create new category
  async function createCategory(categoryData: CreateCategoryData): Promise<{ data: Category }> {
    setLoading(true)
    clearError()

    try {
      const jsonData = {
        name: categoryData.name,
        description: categoryData.description,
        imageUrl: categoryData.imageUrl,
      }

      const response = await axios.post<{ data: Category }>('/categories', jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      state.value.categories.unshift(response.data.data)
      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'CATEGORY_CREATE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Update category
  async function updateCategory(
    id: string,
    categoryData: UpdateCategoryData,
  ): Promise<{ data: Category }> {
    setLoading(true)
    clearError()

    try {
      const jsonData: Partial<{ name: string; description: string; imageUrl: string }> = {}

      if (categoryData.name) {
        jsonData.name = categoryData.name
      }

      if (categoryData.description !== undefined) {
        jsonData.description = categoryData.description
      }

      if (categoryData.imageUrl !== undefined) {
        jsonData.imageUrl = categoryData.imageUrl
      }

      const response = await axios.put<{ data: Category }>(`/categories/${id}`, jsonData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // ? Update the category in the list
      const index = state.value.categories.findIndex((cat) => cat.id === id)
      if (index !== -1) {
        state.value.categories[index] = response.data.data
      }

      // ? Update current category if it's the one being updated
      if (state.value.currentCategory?.id === id) {
        state.value.currentCategory = response.data.data
      }

      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'CATEGORY_UPDATE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Delete category
  async function deleteCategory(id: string): Promise<void> {
    setLoading(true)
    clearError()

    try {
      await axios.delete(`/categories/${id}`)

      // ? Remove from categories list
      state.value.categories = state.value.categories.filter((cat) => cat.id !== id)

      // ? Clear current category if it's the deleted one
      if (state.value.currentCategory?.id === id) {
        state.value.currentCategory = null
      }
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'CATEGORY_DELETE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ? Clear current category
  const clearCurrentCategory = () => {
    state.value.currentCategory = null
  }

  return {
    // State
    categories,
    currentCategory,
    loading,
    error,
    pagination,

    // Actions
    fetchCategories,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    clearCurrentCategory,
    clearError,
    setError,
  }
})
