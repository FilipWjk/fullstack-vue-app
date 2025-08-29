<template>
  <div :class="getAuthPageContainerClass()">
    <div :class="getAuthHeaderContainerClass()">
      <h2 :class="getAuthTitleClass()">Create your account</h2>
      <p :class="getAuthSubtitleClass()">
        Or
        <router-link
          to="/login"
          class="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div :class="getAuthFormContainerClass()">
      <div :class="getFormCardClass()">
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
                v-model="validation.form.name"
                @blur="validation.onFieldBlur('name')"
                @input="validation.onFieldInput('name')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.name)"
                placeholder="Enter your full name"
              />
            </div>
            <div v-if="validation.fieldErrors.name" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.name }}
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
                v-model="validation.form.email"
                @blur="validation.onFieldBlur('email')"
                @input="validation.onFieldInput('email')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.email)"
                placeholder="Enter your email"
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
                autocomplete="new-password"
                required
                v-model="validation.form.password"
                @blur="validation.onFieldBlur('password')"
                @input="validation.onFieldInput('password')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.password)"
                placeholder="Create a strong password"
              />
            </div>
            <div v-if="validation.fieldErrors.password" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.password }}
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
                v-model="validation.form.confirmPassword"
                @blur="validation.onFieldBlur('confirmPassword')"
                @input="validation.onFieldInput('confirmPassword')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.confirmPassword)"
                placeholder="Confirm your password"
              />
            </div>
            <div v-if="validation.fieldErrors.confirmPassword" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.confirmPassword }}
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
            <div class="text-sm text-red-700 dark:text-red-300">
              {{ authStore.error }}
            </div>
          </div>

          <!-- Form validation message -->
          <div
            v-if="!validation.isFormValid.value && validation.formValidationMessage.value"
            :class="getWarningMessageClass()"
          >
            <div :class="getWarningTextClass()">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validation.formValidationMessage.value }}
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="authStore.isLoading || !validation.isFormValid.value"
              :class="
                authStore.isLoading || !validation.isFormValid.value
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'
import { createValidationService, ValidationRules } from '../utils/validationService'
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
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  {
    name: {
      required: true,
      rules: [ValidationRules.minNameLength],
    },
    email: {
      required: true,
      rules: [ValidationRules.email],
    },
    password: {
      required: true,
      rules: [ValidationRules.passwordStrength],
    },
    confirmPassword: {
      required: true,
      rules: [ValidationRules.passwordMatch('confirmPassword', 'password')],
    },
  },
)

// * Clear any existing auth errors when component mounts
onMounted(() => {
  authStore.error = null
})

interface ErrorResponse {
  message?: string
  error?: string
  errors?: Array<{ field: string; message: string }>
}

const handleRegister = async () => {
  if (!validation.validateForm()) {
    toast.error('Please fix the form errors before submitting')
    return
  }

  try {
    await authStore.register({
      name: String(validation.form.name).trim(),
      email: String(validation.form.email).trim(),
      password: String(validation.form.password),
    })

    toast.success('Account created successfully!')
    await router.push('/dashboard')
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const errorData = error.response?.data as ErrorResponse
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        validation.handleApiErrors(errorData.errors)
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
