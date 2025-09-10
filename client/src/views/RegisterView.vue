<template>
  <div :class="getAuthPageContainerClass()">
    <div :class="getAuthHeaderContainerClass()">
      <h2 :class="getAuthTitleClass()">Create your account</h2>
      <p :class="getAuthSubtitleClass()">
        Or
        <router-link to="/login" :class="getAuthLinkClass()" data-testid="login-link">
          sign in to your existing account
        </router-link>
      </p>
    </div>

    <div :class="getAuthFormContainerClass()">
      <div :class="getFormCardClass()">
        <div :class="getAuthBackgroundOverlayClass()"></div>
        <div :class="getAuthDecorationTopClass()"></div>
        <div :class="getAuthDecorationBottomClass()"></div>

        <form :class="getFormSpaceClass()" @submit.prevent="handleRegister">
          <div>
            <label for="name" :class="getLabelClass()"> Full Name </label>
            <div :class="getFormFieldSpaceClass()">
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
                data-testid="name-input"
              />
            </div>
            <div
              v-if="validation.fieldErrors.name"
              :class="getErrorMessageClass()"
              data-testid="name-error"
            >
              {{ validation.fieldErrors.name }}
            </div>
          </div>

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
                placeholder="Enter your email"
                data-testid="email-input"
              />
            </div>
            <div
              v-if="validation.fieldErrors.email"
              :class="getErrorMessageClass()"
              data-testid="email-error"
            >
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
                autocomplete="new-password"
                required
                v-model="validation.form.password"
                @blur="validation.onFieldBlur('password')"
                @input="validation.onFieldInput('password')"
                :disabled="authStore.isLoading"
                :class="getInputClass(!!validation.fieldErrors.password)"
                placeholder="Create a strong password"
                data-testid="password-input"
              />
            </div>
            <div
              v-if="validation.fieldErrors.password"
              :class="getErrorMessageClass()"
              data-testid="password-error"
            >
              {{ validation.fieldErrors.password }}
            </div>
            <p :class="getPasswordHintClass()">Must be at least 6 characters long</p>
          </div>

          <div>
            <label for="confirmPassword" :class="getLabelClass()"> Confirm Password </label>
            <div :class="getFormFieldSpaceClass()">
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
                data-testid="confirm-password-input"
              />
            </div>
            <div
              v-if="validation.fieldErrors.confirmPassword"
              :class="getErrorMessageClass()"
              data-testid="confirm-password-error"
            >
              {{ validation.fieldErrors.confirmPassword }}
            </div>
          </div>

          <div v-if="authStore.error" :class="getWarningBadgeClass()">
            <div :class="getWarningBadgeTextClass()">
              {{ authStore.error }}
            </div>
          </div>

          <!-- Form validation message -->
          <div
            v-if="!validation.isFormValid.value && validation.formValidationMessage.value"
            :class="getWarningMessageClass()"
          >
            <div :class="getWarningTextClass()">
              <svg :class="getIconClass('small')" fill="currentColor" viewBox="0 0 20 20">
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
              data-testid="register-button"
            >
              <span v-if="authStore.isLoading" :class="getInlineSpinnerClass()">
                <div :class="getSpinnerElementClass()"></div>
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
import { handleApiError, getValidationErrors } from '../utils/errorService'
import { ErrorMessages } from '../utils/errorMessages'
import { SuccessMessages } from '../utils/successMessages'

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
  getAuthLinkClass,
  getFormSpaceClass,
  getFormFieldSpaceClass,
  getAuthBackgroundOverlayClass,
  getAuthDecorationTopClass,
  getAuthDecorationBottomClass,
  getPasswordHintClass,
  getInlineSpinnerClass,
  getSpinnerElementClass,
  getWarningBadgeClass,
  getWarningBadgeTextClass,
  getIconClass,
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

const handleRegister = async () => {
  if (!validation.validateForm()) {
    toast.error(ErrorMessages.FORM_VALIDATION_FAILED)
    return
  }

  try {
    await authStore.register({
      name: String(validation.form.name).trim(),
      email: String(validation.form.email).trim(),
      password: String(validation.form.password),
    })

    toast.success(SuccessMessages.REGISTRATION_SUCCESS)
    // * Redirect based on user role after successful registration
    if (authStore.canManageProducts) {
      await router.push('/dashboard')
    } else {
      await router.push('/my-orders')
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'REGISTRATION_FAILED')
    const validationErrors = getValidationErrors(error)

    if (validationErrors.length > 0) {
      validation.handleApiErrors(validationErrors)
      toast.error(ErrorMessages.FORM_VALIDATION_CHECK_ERRORS)
    } else {
      toast.error(errorMessage)
    }
  }
}
</script>
