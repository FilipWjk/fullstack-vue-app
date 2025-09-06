import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosError } from 'axios'
import { handleApiError } from '@/utils/errorService'

export interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
  createdAt: string
  updatedAt: string
  _count?: {
    orders: number
  }
  orders?: Order[]
}

export interface Order {
  id: string
  total: number
  status: string
  createdAt: string
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role?: 'ADMIN' | 'MANAGER' | 'USER'
}

export interface UpdateUserData {
  email?: string
  name?: string
  role?: 'ADMIN' | 'MANAGER' | 'USER'
}

interface UsersState {
  users: User[]
  currentUser: User | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    search: string
    role: string
  }
}

export const useUsersStore = defineStore('users', () => {
  const state = ref<UsersState>({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    },
    filters: {
      search: '',
      role: '',
    },
  })

  // * Getters
  const users = computed(() => state.value.users)
  const currentUser = computed(() => state.value.currentUser)
  const loading = computed(() => state.value.loading)
  const error = computed(() => state.value.error)
  const pagination = computed(() => state.value.pagination)
  const filters = computed(() => state.value.filters)

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

  const setFilters = (newFilters: Partial<typeof state.value.filters>) => {
    state.value.filters = { ...state.value.filters, ...newFilters }
  }

  // * Fetch users with pagination and filters
  async function fetchUsers(
    params: {
      page?: number
      limit?: number
      search?: string
      role?: string
    } = {},
  ) {
    setLoading(true)
    clearError()

    try {
      const queryParams = {
        page: params.page || state.value.pagination.page,
        limit: params.limit || state.value.pagination.limit,
        search: params.search || state.value.filters.search,
        role: params.role || state.value.filters.role,
      }

      // * Remove empty parameters
      Object.keys(queryParams).forEach((key) => {
        if (!queryParams[key as keyof typeof queryParams]) {
          delete queryParams[key as keyof typeof queryParams]
        }
      })

      const response = await axios.get<{
        success: boolean
        data: {
          users: User[]
          pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
          }
        }
      }>('/users', { params: queryParams })

      if (response.data.success) {
        state.value.users = response.data.data.users
        state.value.pagination = response.data.data.pagination
      }
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'USERS_FETCH_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Fetch single user by ID
  async function fetchUser(id: string): Promise<{ data: User }> {
    setLoading(true)
    clearError()

    try {
      const response = await axios.get<{ data: User }>(`/users/${id}`)
      state.value.currentUser = response.data.data
      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'USER_FETCH_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Create new user
  async function createUser(userData: CreateUserData): Promise<{ data: User }> {
    setLoading(true)
    clearError()

    try {
      const response = await axios.post<{ data: User }>('/users', userData)

      state.value.users.unshift(response.data.data)

      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'USER_CREATE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Update user
  async function updateUser(id: string, userData: UpdateUserData): Promise<{ data: User }> {
    setLoading(true)
    clearError()

    try {
      const response = await axios.put<{ data: User }>(`/users/${id}`, userData)

      const index = state.value.users.findIndex((user) => user.id === id)
      if (index !== -1) {
        // Preserve _count and other data that might not be returned from the update
        const existingUser = state.value.users[index]
        state.value.users[index] = {
          ...existingUser,
          ...response.data.data,
          _count: existingUser._count, // Preserve order count
        }
      }

      if (state.value.currentUser?.id === id) {
        const existingCurrentUser = state.value.currentUser
        state.value.currentUser = {
          ...existingCurrentUser,
          ...response.data.data,
          _count: existingCurrentUser._count, // Preserve order count
        }
      }

      return response.data
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'USER_UPDATE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  // * Delete user
  async function deleteUser(id: string): Promise<void> {
    setLoading(true)
    clearError()

    try {
      await axios.delete(`/users/${id}`)

      state.value.users = state.value.users.filter((user) => user.id !== id)

      if (state.value.currentUser?.id === id) {
        state.value.currentUser = null
      }
    } catch (error) {
      setError(handleApiError(error as AxiosError, 'USER_DELETE_FAILED'))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const clearCurrentUser = () => {
    state.value.currentUser = null
  }

  const resetPagination = () => {
    state.value.pagination.page = 1
  }

  return {
    // State
    users,
    currentUser,
    loading,
    error,
    pagination,
    filters,

    // Actions
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    clearCurrentUser,
    clearError,
    setError,
    setFilters,
    resetPagination,
  }
})
