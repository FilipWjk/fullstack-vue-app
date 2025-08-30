<template>
  <div :class="getPageContainerClass()">
    <!-- Header -->
    <div :class="getPageHeaderClass()">
      <h1 :class="getPageTitleClass()">Profile Settings</h1>
      <p :class="getPageDescriptionClass()">Manage your account settings and preferences</p>
    </div>

    <!-- User Info Card -->
    <div :class="getCardClass() + ' space-y-6'">
      <div :class="getFlexItemsCenterClass()">
        <div class="flex-shrink-0">
          <div
            class="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold"
          >
            {{ userInitials }}
          </div>
        </div>
        <div>
          <h3 :class="getTextLargeClass()">
            {{ authStore.user?.name }}
          </h3>
          <p :class="getTextMutedClass()">{{ authStore.user?.email }}</p>
          <p :class="getTextSmallMutedClass() + ' capitalize'">
            {{ authStore.user?.role?.toLowerCase() }} Account
          </p>
        </div>
      </div>

      <!-- Account Stats -->
      <div v-if="profileData" :class="getStatsGridClass()">
        <div :class="getTextCenterClass()">
          <div :class="getStatNumberClass('blue')">
            {{ profileData.orders || 0 }}
          </div>
          <div :class="getStatLabelClass()">Total Orders</div>
        </div>
        <div :class="getTextCenterClass()">
          <div :class="getStatNumberClass('green')">
            {{ formatDate(authStore.user?.createdAt) }}
          </div>
          <div :class="getStatLabelClass()">Member Since</div>
        </div>
        <div :class="getTextCenterClass()">
          <div :class="getStatNumberClass('purple')">
            {{ formatDate(authStore.user?.updatedAt) }}
          </div>
          <div :class="getStatLabelClass()">Last Updated</div>
        </div>
      </div>
    </div>

    <!-- Profile Settings Form -->
    <div :class="getCardClass()">
      <h2 :class="getCardHeaderClass()">Personal Information</h2>

      <form @submit.prevent="handleProfileUpdate" class="space-y-6">
        <!-- Name Field -->
        <div>
          <label for="name" :class="getLabelClass()">Full Name</label>
          <div class="mt-2">
            <input
              id="name"
              name="name"
              type="text"
              required
              v-model="profileValidation.form.name"
              @blur="profileValidation.onFieldBlur('name')"
              @input="profileValidation.onFieldInput('name')"
              :disabled="isLoading"
              :class="getInputClass(!!profileValidation.fieldErrors.name)"
            />
            <p v-if="profileValidation.fieldErrors.name" :class="getErrorMessageClass()">
              {{ profileValidation.fieldErrors.name }}
            </p>
          </div>
        </div>

        <!-- Email Field -->
        <div>
          <label for="email" :class="getLabelClass()">Email Address</label>
          <div class="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              required
              v-model="profileValidation.form.email"
              @blur="profileValidation.onFieldBlur('email')"
              @input="profileValidation.onFieldInput('email')"
              :disabled="isLoading"
              :class="getInputClass(!!profileValidation.fieldErrors.email)"
            />
            <p v-if="profileValidation.fieldErrors.email" :class="getErrorMessageClass()">
              {{ profileValidation.fieldErrors.email }}
            </p>
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <div class="flex items-center justify-between">
          <div>
            <label :class="getLabelClass()">Dark Mode</label>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Toggle between light and dark themes
            </p>
          </div>
          <button
            type="button"
            @click="toggleDarkMode"
            :disabled="isLoading"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              profileValidation.form.darkMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
              isLoading ? 'opacity-50 cursor-not-allowed' : '',
            ]"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                profileValidation.form.darkMode ? 'translate-x-5' : 'translate-x-0',
              ]"
            />
          </button>
        </div>

        <!-- Update Profile Button -->
        <button
          type="submit"
          :disabled="isLoading || !hasProfileChanges || !profileValidation.isFormValid.value"
          :class="
            hasProfileChanges && profileValidation.isFormValid.value
              ? getPrimaryButtonClass()
              : getDisabledButtonClass()
          "
        >
          <svg
            v-if="isLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isLoading ? 'Updating...' : 'Update Profile' }}
        </button>
      </form>
    </div>

    <!-- Password Change Form -->
    <div :class="getCardClass()">
      <h2 :class="getCardHeaderClass()">Change Password</h2>

      <form @submit.prevent="handlePasswordChange" class="space-y-6">
        <!-- Current Password -->
        <div>
          <label for="currentPassword" :class="getLabelClass()">Current Password</label>
          <div class="mt-2">
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              required
              v-model="passwordValidation.form.currentPassword"
              @blur="passwordValidation.onFieldBlur('currentPassword')"
              @input="passwordValidation.onFieldInput('currentPassword')"
              :disabled="isPasswordLoading"
              :class="getInputClass(!!passwordValidation.fieldErrors.currentPassword)"
            />
            <p
              v-if="passwordValidation.fieldErrors.currentPassword"
              :class="getErrorMessageClass()"
            >
              {{ passwordValidation.fieldErrors.currentPassword }}
            </p>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label for="newPassword" :class="getLabelClass()">New Password</label>
          <div class="mt-2">
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              v-model="passwordValidation.form.newPassword"
              @blur="passwordValidation.onFieldBlur('newPassword')"
              @input="passwordValidation.onFieldInput('newPassword')"
              :disabled="isPasswordLoading"
              :class="getInputClass(!!passwordValidation.fieldErrors.newPassword)"
            />
            <p v-if="passwordValidation.fieldErrors.newPassword" :class="getErrorMessageClass()">
              {{ passwordValidation.fieldErrors.newPassword }}
            </p>
          </div>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label for="confirmPassword" :class="getLabelClass()">Confirm New Password</label>
          <div class="mt-2">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              v-model="passwordValidation.form.confirmPassword"
              @blur="passwordValidation.onFieldBlur('confirmPassword')"
              @input="passwordValidation.onFieldInput('confirmPassword')"
              :disabled="isPasswordLoading"
              :class="getInputClass(!!passwordValidation.fieldErrors.confirmPassword)"
            />
            <p
              v-if="passwordValidation.fieldErrors.confirmPassword"
              :class="getErrorMessageClass()"
            >
              {{ passwordValidation.fieldErrors.confirmPassword }}
            </p>
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password Requirements:
          </h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li class="flex items-center">
              <svg
                :class="[
                  'w-4 h-4 mr-2',
                  String(passwordValidation.form.newPassword).length >= 6
                    ? 'text-green-500'
                    : 'text-gray-400',
                ]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              At least 6 characters
            </li>
          </ul>
        </div>

        <!-- Change Password Button -->
        <button
          type="submit"
          :disabled="isPasswordLoading || !passwordValidation.isFormValid.value"
          :class="
            passwordValidation.isFormValid.value
              ? getPrimaryButtonClass()
              : getDisabledButtonClass()
          "
        >
          <svg
            v-if="isPasswordLoading"
            class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {{ isPasswordLoading ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'
import { useToast } from 'vue-toastification'
import { createValidationService, ValidationRules } from '../utils/validationService'
import axios from 'axios'
import { handleApiError, getValidationErrors } from '../utils/errorService'
import { ErrorMessages } from '../utils/errorMessages'

// Store & composables
const authStore = useAuthStore()
const toast = useToast()
const {
  getInputClass,
  getPrimaryButtonClass,
  getDisabledButtonClass,
  getLabelClass,
  getErrorMessageClass,
  // Page layout classes
  getPageContainerClass,
  getPageHeaderClass,
  getPageTitleClass,
  getPageDescriptionClass,
  // Card classes
  getCardClass,
  getCardHeaderClass,
  // Text utility classes
  getTextLargeClass,
  getTextMutedClass,
  getTextSmallMutedClass,
  getTextCenterClass,
  // Layout utility classes
  getStatsGridClass,
  getFlexItemsCenterClass,
  // Stat classes
  getStatNumberClass,
  getStatLabelClass,
} = useUIClasses()

// * State
const isLoading = ref(false)
const isPasswordLoading = ref(false)
const profileData = ref<{ orders?: number } | null>(null)

// * Create validation services
const profileValidation = createValidationService(
  {
    name: '',
    email: '',
    darkMode: false as boolean,
  },
  {
    name: { required: true, rules: [ValidationRules.minNameLength] },
    email: { required: true, rules: [ValidationRules.email] },
    darkMode: { required: false, rules: [] },
  },
)

const passwordValidation = createValidationService(
  {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  {
    currentPassword: { required: true, rules: [ValidationRules.required('Current password')] },
    newPassword: { required: true, rules: [ValidationRules.minLength(6)] },
    confirmPassword: {
      required: true,
      rules: [ValidationRules.passwordMatch('confirmPassword', 'newPassword')],
    },
  },
)
// * Computed Properties
const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const hasProfileChanges = computed(() => {
  if (!authStore.user) return false

  return (
    profileValidation.form.name !== authStore.user.name ||
    profileValidation.form.email !== authStore.user.email ||
    profileValidation.form.darkMode !== authStore.user.darkMode
  )
})

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const loadProfileData = async () => {
  try {
    const response = await axios.get('/users/profile/me')
    profileData.value = {
      orders: response.data.data._count?.orders || 0,
    }
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'PROFILE_LOAD_FAILED')
    console.error(errorMessage, error)
  }
}

const toggleDarkMode = () => {
  profileValidation.form.darkMode = !profileValidation.form.darkMode

  // * Apply the preview immediately to the DOM
  if (profileValidation.form.darkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

const handleProfileUpdate = async () => {
  if (!profileValidation.validateForm()) {
    toast.error(ErrorMessages.FORM_VALIDATION_FAILED)
    return
  }

  isLoading.value = true

  try {
    const response = await axios.put('/users/profile/me', {
      name: String(profileValidation.form.name).trim(),
      email: String(profileValidation.form.email).trim(),
      darkMode: Boolean(profileValidation.form.darkMode),
    })

    // Update the auth store with the new user data
    if (authStore.user) {
      authStore.user.name = response.data.data.name
      authStore.user.email = response.data.data.email
      authStore.user.darkMode = response.data.data.darkMode
    }

    authStore.applyDarkMode()
    toast.success(ErrorMessages.PROFILE_UPDATE_SUCCESS)
  } catch (error: unknown) {
    // * Revert dark mode preview to original state on error
    if (authStore.user) {
      profileValidation.form.darkMode = authStore.user.darkMode
      authStore.applyDarkMode()
    }

    const errorMessage = handleApiError(error, 'PROFILE_UPDATE_FAILED')
    toast.error(errorMessage)

    // * Handle validation errors from API
    const validationErrors = getValidationErrors(error)
    if (validationErrors.length > 0) {
      profileValidation.handleApiErrors(validationErrors)
    }
  } finally {
    isLoading.value = false
  }
}

const handlePasswordChange = async () => {
  if (!passwordValidation.validateForm()) {
    toast.error(ErrorMessages.FORM_VALIDATION_FAILED)
    return
  }

  isPasswordLoading.value = true

  try {
    await axios.put('/users/profile/me', {
      currentPassword: passwordValidation.form.currentPassword,
      newPassword: passwordValidation.form.newPassword,
    })

    // * Clear password form
    passwordValidation.form.currentPassword = ''
    passwordValidation.form.newPassword = ''
    passwordValidation.form.confirmPassword = ''
    passwordValidation.clearErrors()

    toast.success(ErrorMessages.PASSWORD_CHANGE_SUCCESS)
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'PASSWORD_CHANGE_FAILED')
    toast.error(errorMessage)

    // * Handle validation errors from API
    const validationErrors = getValidationErrors(error)
    if (validationErrors.length > 0) {
      passwordValidation.handleApiErrors(validationErrors)
    }
  } finally {
    isPasswordLoading.value = false
  }
}

// Initialize form data
const initializeFormData = () => {
  if (authStore.user) {
    profileValidation.form.name = authStore.user.name
    profileValidation.form.email = authStore.user.email
    profileValidation.form.darkMode = authStore.user.darkMode
    authStore.applyDarkMode()
  }
}

// * Watch for changes in auth store user and revert any unsaved dark mode preview
watch(
  () => authStore.user,
  (newUser, oldUser) => {
    if (newUser && oldUser && newUser.darkMode !== oldUser.darkMode) {
      initializeFormData()
    }
  },
  { immediate: true },
)

onMounted(() => {
  initializeFormData()
  loadProfileData()
})
</script>
