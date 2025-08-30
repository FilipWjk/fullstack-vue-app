import { defineStore } from 'pinia'
import axios from 'axios'
import { UserRole, type UserRoleType } from '@/utils/enums'
import { handleApiError } from '@/utils/errorService'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

axios.defaults.baseURL = API_BASE_URL
axios.defaults.withCredentials = true

// * Flag to prevent multiple refresh attempts
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (error: Error) => void
}> = []

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })

  failedQueue = []
}

export interface User {
  id: number
  email: string
  name: string
  role: UserRoleType
  darkMode: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  role?: UserRoleType
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: User
    token: string
  }
}

export interface ApiErrorResponse {
  message: string
  error?: string
  errors?: Array<{
    field: string
    message: string
    value?: unknown
  }>
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.role === UserRole.ADMIN,
    isManager: (state): boolean =>
      state.user?.role === UserRole.ADMIN || state.user?.role === UserRole.MANAGER,
  },

  actions: {
    setAuthHeader(): void {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      } else {
        delete axios.defaults.headers.common['Authorization']
      }
    },

    applyDarkMode(): void {
      if (this.user?.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setTokenAndAuth(token: string): void {
      this.token = token
      localStorage.setItem('token', token)
      this.setAuthHeader()
    },

    async login(credentials: LoginCredentials): Promise<AuthResponse> {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post<AuthResponse>('/auth/login', credentials)

        this.user = response.data.data.user
        this.setTokenAndAuth(response.data.data.token)
        this.applyDarkMode()

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'LOGIN_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: RegisterData): Promise<AuthResponse> {
      this.isLoading = true
      this.error = null

      try {
        const response = await axios.post<AuthResponse>('/auth/register', userData)

        this.user = response.data.data.user
        this.setTokenAndAuth(response.data.data.token)
        this.applyDarkMode()

        return response.data
      } catch (error: unknown) {
        this.error = handleApiError(error, 'REGISTRATION_FAILED')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async logout(): Promise<void> {
      try {
        if (this.token) {
          await axios.post('/auth/logout')
        }
      } catch (error) {
        // * Continue with logout even if backend call fails
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.error = null

        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']

        // * Clear other stores that might have user-specific data
        try {
          const { useAnalyticsStore } = await import('./analytics')
          const analyticsStore = useAnalyticsStore()
          analyticsStore.clearAllData()
        } catch (error) {
          console.error('Error clearing analytics store:', error)
        }
      }
    },

    async refreshToken(): Promise<string | null> {
      if (!this.token) return null

      try {
        const response = await axios.post<{ success: boolean; data: { token: string } }>(
          '/auth/refresh',
          {
            token: this.token,
          },
        )

        const newToken = response.data.data.token
        this.setTokenAndAuth(newToken)

        return newToken
      } catch (error: unknown) {
        console.error('Token refresh failed:', error)
        this.logout()
        return null
      }
    },

    async fetchProfile(): Promise<void> {
      if (!this.token) return

      try {
        this.setAuthHeader()
        const response = await axios.get<{ data: User }>('/users/profile/me')
        this.user = response.data.data
        this.applyDarkMode()
      } catch (error: unknown) {
        console.error(error)
        this.logout()
      }
    },

    async updateDarkMode(darkMode: boolean): Promise<void> {
      try {
        this.setAuthHeader()
        await axios.patch<{ data: User }>('/users/profile/me', {
          darkMode,
        })

        if (this.user) {
          this.user.darkMode = darkMode
        }

        this.applyDarkMode()
      } catch (error: unknown) {
        console.error('Failed to update dark mode preference:', error)
        throw error
      }
    },

    init(): void {
      this.setAuthHeader()
      if (this.token) {
        this.fetchProfile()
      }
      this.setupInterceptors()
    },

    setupInterceptors(): void {
      // ! Response interceptor to handle token expiration
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config

          if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
              // ? If already refreshing, queue this request
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject })
              }).then((token) => {
                originalRequest.headers['Authorization'] = `Bearer ${token}`
                return axios(originalRequest)
              })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
              const newToken = await this.refreshToken()
              if (newToken) {
                processQueue(null, newToken)
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                return axios(originalRequest)
              }
            } catch (refreshError) {
              processQueue(refreshError as Error, null)
              return Promise.reject(refreshError)
            } finally {
              isRefreshing = false
            }
          }

          return Promise.reject(error)
        },
      )
    },
  },
})
