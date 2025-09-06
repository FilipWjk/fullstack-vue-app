<template>
  <div :class="getAuthPageContainerClass()">
    <div :class="getAuthHeaderContainerClass()">
      <h2 :class="getAuthTitleClass()">Sign in to your account</h2>
      <p :class="getAuthSubtitleClass()">
        Or
        <router-link to="/register" :class="getAuthLinkClass()"> create a new account </router-link>
      </p>
    </div>

    <div :class="getAuthFormContainerClass()">
      <div :class="getFormCardClass()">
        <form :class="getFormSpaceClass()" @submit.prevent="handleLogin">
          <div>
            <label for="email" :class="getLabelClass()"> Email address </label>
            <div :class="getFormFieldSpaceClass()">
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
            <div :class="getFormFieldSpaceClass()">
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

          <div v-if="authStore.error" :class="getWarningBadgeClass()">
            <div :class="getWarningBadgeTextClass()">
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
              <span v-if="authStore.isLoading" :class="getInlineSpinnerClass()">
                <div :class="getSpinnerElementClass()"></div>
              </span>
              {{ authStore.isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </form>

        <div :class="getDemoSectionClass()">
          <div :class="getDemoSeparatorContainerClass()">
            <div :class="getDemoSeparatorLineClass()">
              <div :class="getDemoSeparatorClass()" />
            </div>
            <div :class="getDemoSeparatorLabelContainerClass()">
              <span :class="getDemoSeparatorLabelClass()">Demo Credentials</span>
            </div>
          </div>

          <div :class="getDemoCredentialsContainerClass()">
            <div :class="getDemoCredentialsTextClass()">
              <p>
                <strong :class="getDemoCredentialLabelClass()">Admin:</strong> admin@ecommerce.com /
                admin123
              </p>
              <p>
                <strong :class="getDemoCredentialLabelClass()">Manager:</strong>
                manager@ecommerce.com / manager123
              </p>
              <p>
                <strong :class="getDemoCredentialLabelClass()">User:</strong>
                user1@example.com / user1123
              </p>
              <div :class="getDemoButtonsContainerClass()">
                <button
                  type="button"
                  @click="quickLogin('admin')"
                  :class="getDemoButtonClass('blue')"
                >
                  Quick Admin Login
                </button>
                <button
                  type="button"
                  @click="quickLogin('manager')"
                  :class="getDemoButtonClass('green')"
                >
                  Quick Manager Login
                </button>
                <button
                  type="button"
                  @click="quickLogin('user')"
                  :class="getDemoButtonClass('purple')"
                >
                  Quick User Login
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
import { SuccessMessages } from '../utils/successMessages'

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
  getWarningBadgeClass,
  getWarningBadgeTextClass,
  getDemoButtonClass,
  getAuthLinkClass,
  getFormSpaceClass,
  getFormFieldSpaceClass,
  getInlineSpinnerClass,
  getSpinnerElementClass,
  getDemoSectionClass,
  getDemoSeparatorContainerClass,
  getDemoSeparatorLineClass,
  getDemoSeparatorClass,
  getDemoSeparatorLabelContainerClass,
  getDemoSeparatorLabelClass,
  getDemoCredentialsContainerClass,
  getDemoCredentialsTextClass,
  getDemoCredentialLabelClass,
  getDemoButtonsContainerClass,
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

import { handleApiError } from '../utils/errorService'

const handleLogin = async () => {
  if (!validation.validateForm()) {
    return
  }

  try {
    await authStore.login({
      email: String(validation.form.email),
      password: String(validation.form.password),
    })
    toast.success(SuccessMessages.LOGIN_SUCCESS)
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'LOGIN_FAILED')
    toast.error(errorMessage)
  }
}

const quickLogin = async (role: string) => {
  const credentials = {
    admin: { email: 'admin@ecommerce.com', password: 'admin123' },
    manager: { email: 'manager@ecommerce.com', password: 'manager123' },
    user: { email: 'user1@example.com', password: 'user1123' },
  }

  const creds = credentials[role as keyof typeof credentials]
  if (creds) {
    validation.form.email = creds.email
    validation.form.password = creds.password
    try {
      await authStore.login(creds)
      toast.success(SuccessMessages.LOGIN_SUCCESS)

      // * Redirect based on user role after successful login
      if (authStore.canManageProducts) {
        await router.push('/dashboard')
      } else {
        await router.push('/my-orders')
      }
    } catch (error: unknown) {
      const errorMessage = handleApiError(error, 'LOGIN_FAILED')
      toast.error(errorMessage)
    }
  }
}
</script>
