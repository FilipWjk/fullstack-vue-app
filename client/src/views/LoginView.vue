<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 dark:bg-clip-text dark:text-transparent"
      >
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or
        <router-link
          to="/register"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          create a new account
        </router-link>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="bg-white dark:bg-gray-800 px-6 py-12 shadow-xl sm:rounded-2xl sm:px-12 border border dark:border-gray-700 transition-colors duration-200 relative overflow-hidden"
      >
        <form class="space-y-6 relative z-10" @submit.prevent="handleLogin">
          <div>
            <label for="email" :class="getLabelClass()"> Email address </label>
            <div class="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                v-model="form.email"
                :disabled="authStore.isLoading"
                :class="getInputClass()"
              />
            </div>
          </div>

          <div>
            <label for="password" :class="getLabelClass()"> Password </label>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                v-model="form.password"
                :disabled="authStore.isLoading"
                :class="getInputClass()"
              />
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="text-sm text-red-700 dark:text-red-300">
              {{ authStore.error }}
            </div>
          </div>

          <div>
            <button type="submit" :disabled="authStore.isLoading" :class="getPrimaryButtonClass()">
              <span v-if="authStore.isLoading" class="mr-2">
                <div class="spinner"></div>
              </span>
              {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div class="mt-6 relative z-10">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-600" />
            </div>
            <div class="relative flex justify-center text-sm font-medium leading-6">
              <span
                class="bg-white/80 backdrop-blur-sm dark:bg-gray-800 px-6 text-gray-600 dark:text-gray-300 rounded-full"
                >Demo Credentials</span
              >
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4">
            <div class="text-sm text-gray-500 dark:text-gray-300 space-y-2">
              <p>
                <strong class="text-gray-700 dark:text-gray-200">Admin:</strong> admin@ecommerce.com
                / admin123
              </p>
              <p>
                <strong class="text-gray-700 dark:text-gray-200">Manager:</strong>
                manager@ecommerce.com / manager123
              </p>
              <div class="flex space-x-2 mt-3">
                <button
                  type="button"
                  @click="quickLogin('admin')"
                  class="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-blue-600 text-white px-3 py-2 rounded-lg text-xs hover:from-blue-600 hover:to-blue-700 dark:hover:bg-blue-700 hover:shadow-lg"
                >
                  Quick Admin Login
                </button>
                <button
                  type="button"
                  @click="quickLogin('manager')"
                  class="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 dark:bg-green-600 text-white px-3 py-2 rounded-lg text-xs hover:from-emerald-600 hover:to-green-700 dark:hover:bg-green-700 hover:shadow-lg"
                >
                  Quick Manager Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const { getPrimaryButtonClass, getInputClass, getLabelClass } = useUIClasses()

const form = reactive({
  email: '',
  password: '',
})

// * Clear any existing auth errors when component mounts
onMounted(() => {
  authStore.error = null
})

import { AxiosError } from 'axios'

interface ErrorResponse {
  message?: string
  error?: string
}

const handleLogin = async () => {
  try {
    await authStore.login(form)
    toast.success('Login successful!')
    await router.push('/dashboard')
  } catch (error: unknown) {
    const message =
      ((error as AxiosError)?.response?.data as ErrorResponse)?.message || 'Login failed'
    toast.error(message)
  }
}

const quickLogin = async (role: string) => {
  const credentials = {
    admin: { email: 'admin@ecommerce.com', password: 'admin123' },
    manager: { email: 'manager@ecommerce.com', password: 'manager123' },
  }

  const creds = credentials[role as keyof typeof credentials]
  if (creds) {
    form.email = creds.email
    form.password = creds.password
    try {
      await authStore.login(creds)
      window.location.href = '/dashboard'
    } catch (error: unknown) {
      const message =
        ((error as AxiosError)?.response?.data as ErrorResponse)?.message || 'Login failed'
      toast.error(message)
    }
  }
}
</script>
