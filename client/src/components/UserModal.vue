<template>
  <div v-if="isOpen" :class="getCustomModalOverlayClass()" @click.self="closeModal">
    <div :class="getCardClass() + ' ' + getCustomModalContainerClass()">
      <div :class="getCustomModalBodyClass()">
        <h2 :class="getCustomModalHeaderClass()">
          {{ isEditing ? 'Edit User' : 'Create User' }}
        </h2>

        <form @submit.prevent="handleSubmit" :class="getFormSpaceClass()">
          <!-- Name -->
          <div>
            <label for="name" :class="getLabelClass()"> Full Name * </label>
            <input
              v-model="validation.form.name"
              @blur="validation.onFieldBlur('name')"
              @input="validation.onFieldInput('name')"
              type="text"
              id="name"
              :class="getInputClass(!!validation.fieldErrors.name)"
              placeholder="Enter full name"
              :disabled="loading"
              required
            />
            <div v-if="validation.fieldErrors.name" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.name }}
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" :class="getLabelClass()"> Email Address * </label>
            <input
              v-model="validation.form.email"
              @blur="validation.onFieldBlur('email')"
              @input="validation.onFieldInput('email')"
              type="email"
              id="email"
              :class="getInputClass(!!validation.fieldErrors.email)"
              placeholder="Enter email address"
              :disabled="loading"
              required
            />
            <div v-if="validation.fieldErrors.email" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.email }}
            </div>
          </div>

          <!-- Password (only for create) -->
          <div v-if="!isEditing">
            <label for="password" :class="getLabelClass()"> Password * </label>
            <input
              v-model="validation.form.password"
              @blur="validation.onFieldBlur('password')"
              @input="validation.onFieldInput('password')"
              type="password"
              id="password"
              :class="getInputClass(!!validation.fieldErrors.password)"
              placeholder="Create a strong password"
              :disabled="loading"
              required
            />
            <div v-if="validation.fieldErrors.password" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.password }}
            </div>
            <p :class="getPasswordHintClass()">Must be at least 6 characters long</p>
          </div>

          <!-- Role -->
          <div>
            <label for="role" :class="getLabelClass()"> Role * </label>
            <select
              v-model="validation.form.role"
              @blur="validation.onFieldBlur('role')"
              @change="validation.onFieldInput('role')"
              id="role"
              :class="getSelectClass(!!validation.fieldErrors.role)"
              :disabled="loading"
              required
            >
              <option value="" disabled>Select a role</option>
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div v-if="validation.fieldErrors.role" :class="getErrorMessageClass()">
              {{ validation.fieldErrors.role }}
            </div>
          </div>

          <!-- Form validation message -->
          <div
            v-if="!validation.isFormValid.value && validation.formValidationMessage.value"
            :class="getWarningMessageClass()"
          >
            <div :class="getWarningTextClass()">
              <svg :class="getWarningIconClass()" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ validation.formValidationMessage.value }}
            </div>
          </div>

          <!-- Form Buttons -->
          <div :class="getUserModalButtonContainerClass()">
            <button
              type="button"
              @click="closeModal"
              :disabled="loading"
              :class="getCancelButtonClass() + ' flex-1 justify-center !rounded-xl'"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isSubmitEnabled"
              :class="
                (!isSubmitEnabled ? getDisabledButtonClass() : getPrimaryButtonClass()) +
                ' ' +
                getUserModalSubmitButtonClass()
              "
            >
              <span v-if="loading" :class="getUserModalSpinnerContainerClass()">
                <div :class="getUserModalSpinnerClass()"></div>
              </span>
              {{ loading ? 'Saving...' : isEditing ? 'Update User' : 'Create User' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { watch, ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useUIClasses } from '../composables/useUIClasses'
import { createValidationService, ValidationRules } from '../utils/validationService'
import { handleApiError, getValidationErrors } from '../utils/errorService'
import { ErrorMessages } from '../utils/errorMessages'
import type { User } from '../stores/users'

export default {
  name: 'UserModal',
  props: {
    isOpen: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object as () => User | null,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const toast = useToast()

    // * Track original user data for change detection
    const originalUserData = ref<{
      name: string
      email: string
      role: string
    } | null>(null)

    const {
      getPrimaryButtonClass,
      getDisabledButtonClass,
      getCancelButtonClass,
      getInputClass,
      getSelectClass,
      getLabelClass,
      getErrorMessageClass,
      getWarningMessageClass,
      getWarningTextClass,
      getCardClass,
      getCustomModalOverlayClass,
      getCustomModalContainerClass,
      getCustomModalHeaderClass,
      getCustomModalBodyClass,
      getFormSpaceClass,
      getPasswordHintClass,
      getUserModalButtonContainerClass,
      getUserModalSubmitButtonClass,
      getUserModalSpinnerContainerClass,
      getUserModalSpinnerClass,
      getWarningIconClass,
    } = useUIClasses()

    // * Create validation service with the same rules as RegisterView
    const validation = createValidationService(
      {
        name: '',
        email: '',
        password: '',
        role: '' as 'ADMIN' | 'MANAGER' | 'USER' | '',
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
          required: false, // ? Will handle validation manually
          rules: [ValidationRules.passwordStrength],
        },
        role: {
          required: true,
          rules: [], // ? Role validation is handled by the select options
        },
      },
    )

    // Computed property to detect if form has changes (for edit mode)
    const hasChanges = computed(() => {
      if (!props.isEditing || !originalUserData.value) {
        return true // For create mode, always allow submission if form is valid
      }

      const current = {
        name: String(validation.form.name).trim(),
        email: String(validation.form.email).trim(),
        role: validation.form.role,
      }

      return (
        current.name !== originalUserData.value.name ||
        current.email !== originalUserData.value.email ||
        current.role !== originalUserData.value.role ||
        (validation.form.password && String(validation.form.password).trim() !== '') // Password change
      )
    })

    // Determine if submit button should be enabled
    const isSubmitEnabled = computed(() => {
      if (props.loading) return false
      if (!validation.isFormValid.value) return false

      // For create mode, just check if form is valid
      if (!props.isEditing) {
        return validation.form.password && String(validation.form.password).trim() !== ''
      }

      // For edit mode, check if there are changes
      return hasChanges.value
    })

    // Watch for user prop changes to populate form when editing
    watch(
      () => props.user,
      (newUser) => {
        if (newUser && props.isEditing) {
          validation.form.name = newUser.name
          validation.form.email = newUser.email
          validation.form.password = ''
          validation.form.role = newUser.role
          validation.clearErrors()

          // ? Store original data for change detection
          originalUserData.value = {
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
          }
        }
      },
      { immediate: true },
    )

    // ? Watch for modal open/close to reset form
    watch(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen && !props.isEditing) {
          // Reset form when opening create modal
          validation.form.name = ''
          validation.form.email = ''
          validation.form.password = ''
          validation.form.role = ''
          validation.clearErrors()
          originalUserData.value = null
        }
      },
    )

    const closeModal = () => {
      emit('close')
    }

    const handleSubmit = async () => {
      // Custom validation for password based on editing mode
      if (!props.isEditing && !validation.form.password) {
        validation.errors.password = 'Password is required'
        toast.error(ErrorMessages.FORM_VALIDATION_FAILED)
        return
      }

      if (!validation.validateForm()) {
        toast.error(ErrorMessages.FORM_VALIDATION_FAILED)
        return
      }

      const formData = {
        name: String(validation.form.name).trim(),
        email: String(validation.form.email).trim(),
        role: validation.form.role as 'ADMIN' | 'MANAGER' | 'USER',
        ...(!props.isEditing &&
          validation.form.password && {
            password: String(validation.form.password),
          }),
      }

      try {
        emit('submit', formData)
      } catch (error: unknown) {
        const errorMessage = handleApiError(
          error,
          props.isEditing ? 'USER_UPDATE_FAILED' : 'USER_CREATE_FAILED',
        )
        const validationErrors = getValidationErrors(error)

        if (validationErrors.length > 0) {
          validation.handleApiErrors(validationErrors)
          toast.error(ErrorMessages.FORM_VALIDATION_CHECK_ERRORS)
        } else {
          toast.error(errorMessage)
        }
      }
    }

    return {
      validation,
      toast,
      getPrimaryButtonClass,
      getDisabledButtonClass,
      getCancelButtonClass,
      getInputClass,
      getSelectClass,
      getLabelClass,
      getErrorMessageClass,
      getWarningMessageClass,
      getWarningTextClass,
      getCardClass,
      getCustomModalOverlayClass,
      getCustomModalContainerClass,
      getCustomModalHeaderClass,
      getCustomModalBodyClass,
      getFormSpaceClass,
      getPasswordHintClass,
      getUserModalButtonContainerClass,
      getUserModalSubmitButtonClass,
      getUserModalSpinnerContainerClass,
      getUserModalSpinnerClass,
      getWarningIconClass,
      hasChanges,
      isSubmitEnabled,
      closeModal,
      handleSubmit,
    }
  },
}
</script>
