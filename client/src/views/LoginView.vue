<template>
  <div :class="getAuthPageContainerClass()">
    <div :class="getAuthHeaderContainerClass()">
      <h2 :class="getAuthTitleClass()">Sign in to your account</h2>
      <p :class="getAuthSubtitleClass()">
        Or
        <router-link
          to="/register"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          create a new account
        </router-link>
      </p>
    </div>

    <div :class="getAuthFormContainerClass()">
      <div :class="getFormCardClass()">
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
                v-model="validation.form.email"
                @blur="validation.onFieldBlur('email')"
                @input="validation.onFieldInput('email')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.email)"
              />
            </div>
            <div v-if="validation.fieldErrors.email" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.email }}
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
                v-model="validation.form.password"
                @blur="validation.onFieldBlur('password')"
                @input="validation.onFieldInput('password')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.password)"
              />
            </div>
            <div v-if="validation.fieldErrors.password" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.password }}
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="text-sm text-red-700 dark:text-red-300">
              {{ authStore.error }}
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading || !validation.isFormValid.value"
              :class="
                authStore.isLoading || !validation.isFormValid.value
                  ? 'opacity-50 cursor-not-allowed ' + getPrimaryButtonClass()
                  : getPrimaryButtonClass()
              "
            >
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'
import { createValidationService, ValidationRules } from '../utils/validationService'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const {
  getPrimaryButtonClass,
  getInputClass,
  getLabelClass,
  getErrorMessageClass,
  getAuthPageContainerClass,
  getAuthHeaderContainerClass,
  getAuthTitleClass,
  getAuthSubtitleClass,
  getAuthFormContainerClass,
  getFormCardClass,
} = useUIClasses()

// * Create validation service
const validation = createValidationService(
  {
    email: '',
    password: '',
  },
  {
    email: { required: true, rules: [ValidationRules.email] },
    password: { required: true, rules: [ValidationRules.minLength(6)] },
  },
)

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
  if (!validation.validateForm()) {
    return
  }

  try {
    await authStore.login({
      email: String(validation.form.email),
      password: String(validation.form.password),
    })
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
    validation.form.email = creds.email
    validation.form.password = creds.password
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
