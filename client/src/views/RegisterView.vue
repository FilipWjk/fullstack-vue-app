<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2
        class="mt-6 text-center text-3xl font-bold leading-9 tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent dark:text-gray-200"
      >
        Create your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or
        <router-link
          to="/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
      <div
        class="bg-white/80 backdrop-blur-sm dark:bg-gray-800 px-6 py-12 shadow-xl shadow-blue-500/10 sm:rounded-2xl sm:px-12 border border-white/20 dark:border-gray-700 transition-colors duration-200 relative overflow-hidden"
      >
        <div
          class="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 dark:opacity-0"
        ></div>
        <div
          class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl dark:opacity-0"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl dark:opacity-0"
        ></div>

        <form class="space-y-6 relative z-10" @submit.prevent="handleRegister">
          <div>
            <label for="name" :class="getLabelClass()"> Full Name </label>
            <div class="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                v-model="form.name"
                @blur="onFieldBlur('name')"
                @input="onFieldInput('name')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validationErrors.name)"
                placeholder="Enter your full name"
              />
            </div>
            <div v-if="validationErrors.name" :class="getErrorMessageClass()">
              {{ validationErrors.name }}
            </div>
          </div>

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
                @blur="onFieldBlur('email')"
                @input="onFieldInput('email')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validationErrors.email)"
                placeholder="Enter your email"
              />
            </div>
            <div v-if="validationErrors.email" :class="getErrorMessageClass()">
              {{ validationErrors.email }}
            </div>
          </div>

          <div>
            <label for="password" :class="getLabelClass()"> Password </label>
            <div class="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                v-model="form.password"
                @blur="onFieldBlur('password')"
                @input="onFieldInput('password')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validationErrors.password)"
                placeholder="Create a strong password"
              />
            </div>
            <div v-if="validationErrors.password" :class="getErrorMessageClass()">
              {{ validationErrors.password }}
            </div>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Must be at least 6 characters long
            </p>
          </div>

          <div>
            <label for="confirmPassword" :class="getLabelClass()"> Confirm Password </label>
            <div class="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
                v-model="form.confirmPassword"
                @blur="onFieldBlur('confirmPassword')"
                @input="onFieldInput('confirmPassword')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validationErrors.confirmPassword)"
                placeholder="Confirm your password"
              />
            </div>
            <div v-if="validationErrors.confirmPassword" :class="getErrorMessageClass()">
              {{ validationErrors.confirmPassword }}
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="text-sm text-red-700 dark:text-red-300">
              {{ authStore.error }}
            </div>
          </div>

          <!-- Form validation message -->
          <div v-if="!isFormValid && formValidationMessage" :class="getWarningMessageClass()">
            <div :class="getWarningTextClass()">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ formValidationMessage }}
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading || !isFormValid"
              :class="
                authStore.isLoading || !isFormValid
                  ? getDisabledButtonClass()
                  : getPrimaryButtonClass()
              "
            >
              <span v-if="authStore.isLoading" class="mr-2">
                <div class="spinner"></div>
              </span>
              {{ authStore.isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'
import { AxiosError } from 'axios'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const {
  getPrimaryButtonClass,
  getDisabledButtonClass,
  getInputClass,
  getLabelClass,
  getErrorMessageClass,
  getWarningMessageClass,
  getWarningTextClass,
} = useUIClasses()

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const validationErrors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const fieldTouched = reactive({
  name: false,
  email: false,
  password: false,
  confirmPassword: false,
})

// * Clear any existing auth errors when component mounts
onMounted(() => {
  authStore.error = null
})

// * Validation rules - single source of truth
const validationRules = {
  name: (value: string) => {
    if (!value.trim()) return 'Name is required'
    if (value.trim().length < 2) return 'Name must be at least 2 characters'
    return ''
  },
  email: (value: string) => {
    if (!value.trim()) return 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address'
    return ''
  },
  password: (value: string) => {
    if (!value) return 'Password is required'
    if (value.length < 6) return 'Password must be at least 6 characters'
    return ''
  },
  confirmPassword: (value: string, passwordValue: string) => {
    if (!value) return 'Please confirm your password'
    if (passwordValue !== value) return 'Passwords do not match'
    return ''
  },
}

const validateField = (fieldName: keyof typeof validationErrors) => {
  if (!fieldTouched[fieldName]) return

  switch (fieldName) {
    case 'name':
      validationErrors.name = validationRules.name(form.name)
      break
    case 'email':
      validationErrors.email = validationRules.email(form.email)
      break
    case 'password':
      validationErrors.password = validationRules.password(form.password)
      if (fieldTouched.confirmPassword) {
        validateField('confirmPassword')
      }
      break
    case 'confirmPassword':
      validationErrors.confirmPassword = validationRules.confirmPassword(
        form.confirmPassword,
        form.password,
      )
      break
  }
}

// * Mark field as touched and validate
const onFieldBlur = (fieldName: keyof typeof validationErrors) => {
  fieldTouched[fieldName] = true
  validateField(fieldName)
}

// * Validate on input for touched fields
const onFieldInput = (fieldName: keyof typeof validationErrors) => {
  if (fieldTouched[fieldName]) {
    validateField(fieldName)
  }
}

const isFormValid = computed(() => {
  return (
    !validationRules.name(form.name) &&
    !validationRules.email(form.email) &&
    !validationRules.password(form.password) &&
    !validationRules.confirmPassword(form.confirmPassword, form.password) &&
    !validationErrors.name &&
    !validationErrors.email &&
    !validationErrors.password &&
    !validationErrors.confirmPassword
  )
})

const formValidationMessage = computed(() => {
  // Check validation rules first (for untouched fields)
  const nameError = validationRules.name(form.name)
  if (nameError) return nameError

  const emailError = validationRules.email(form.email)
  if (emailError) return emailError

  const passwordError = validationRules.password(form.password)
  if (passwordError) return passwordError

  const confirmPasswordError = validationRules.confirmPassword(form.confirmPassword, form.password)
  if (confirmPasswordError) return confirmPasswordError

  // * Check for field-specific validation errors (for touched fields)
  if (
    validationErrors.name ||
    validationErrors.email ||
    validationErrors.password ||
    validationErrors.confirmPassword
  ) {
    return 'Please fix the errors above'
  }

  return ''
})

interface ErrorResponse {
  message?: string
  error?: string
  errors?: Array<{ field: string; message: string }>
}

const handleRegister = async () => {
  // * Mark all fields as touched to show any remaining errors
  Object.keys(fieldTouched).forEach((field) => {
    fieldTouched[field as keyof typeof fieldTouched] = true
    validateField(field as keyof typeof validationErrors)
  })

  if (!isFormValid.value) {
    toast.error('Please fix the form errors before submitting')
    return
  }

  try {
    await authStore.register({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    })

    toast.success('Account created successfully!')
    await router.push('/dashboard')
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as ErrorResponse
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err) => {
          if (err.field in validationErrors) {
            validationErrors[err.field as keyof typeof validationErrors] = err.message
          }
        })
        toast.error('Please check the form for errors')
      } else {
        const message = errorData?.message || 'Registration failed'
        toast.error(message)
      }
    } else {
      toast.error('Registration failed')
    }
  }
}
</script>

<style scoped>
.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
