import { reactive, computed } from 'vue'

interface FormData {
  [key: string]: string | boolean | number
}

type ValidationRule = (value: string, formData?: FormData) => string

interface FieldConfig {
  required?: boolean
  rules?: ValidationRule[]
}

interface FormConfig {
  [fieldName: string]: FieldConfig
}

export class ValidationService {
  public form: FormData
  public errors: { [key: string]: string }
  public touched: { [key: string]: boolean }
  private config: FormConfig

  constructor(initialData: FormData, config: FormConfig) {
    this.form = reactive({ ...initialData })
    this.errors = reactive({})
    this.touched = reactive({})
    this.config = config

    // * Initialize errors and touched for all fields
    Object.keys(initialData).forEach((key) => {
      this.errors[key] = ''
      this.touched[key] = false
    })
  }

  validateField(fieldName: string) {
    if (!this.touched[fieldName]) return

    const fieldConfig = this.config[fieldName]
    if (!fieldConfig) return

    const fieldValue = String(this.form[fieldName] || '')

    // * Clear previous error
    this.errors[fieldName] = ''

    // * Check if field is required
    if (fieldConfig.required && !fieldValue.trim()) {
      this.errors[fieldName] = `${fieldName} is required`
      return
    }

    // * Run validation rules
    if (fieldConfig.rules) {
      for (const rule of fieldConfig.rules) {
        const error = rule(fieldValue, this.form)
        if (error) {
          this.errors[fieldName] = error
          break
        }
      }
    }
  }

  // ? Mark field as touched and validate
  onFieldBlur(fieldName: string) {
    this.touched[fieldName] = true
    this.validateField(fieldName)
  }

  // ? Validate on input for touched fields
  onFieldInput(fieldName: string) {
    if (this.touched[fieldName]) {
      this.validateField(fieldName)
    }
  }

  // ? Validate entire form
  validateForm(): boolean {
    Object.keys(this.form).forEach((field) => {
      this.touched[field] = true
      this.validateField(field)
    })

    return this.isFormValid.value
  }

  // ? Clear all errors
  clearErrors() {
    Object.keys(this.errors).forEach((field) => {
      this.errors[field] = ''
    })
  }

  // ? Clear touched state
  clearTouched() {
    Object.keys(this.touched).forEach((field) => {
      this.touched[field] = false
    })
  }

  resetForm(newData?: FormData) {
    if (newData) {
      Object.assign(this.form, newData)
    }
    this.clearErrors()
    this.clearTouched()
  }

  handleApiErrors(apiErrors: Array<{ field: string; message: string }>) {
    apiErrors.forEach((error) => {
      if (this.errors.hasOwnProperty(error.field)) {
        this.errors[error.field] = error.message
      }
    })
  }

  // ? Check if form is valid
  get isFormValid() {
    return computed(() => {
      const hasErrors = Object.values(this.errors).some((error) => error !== '')
      if (hasErrors) return false

      // * Check if all required fields are filled
      for (const fieldName of Object.keys(this.config)) {
        const fieldConfig = this.config[fieldName]
        const fieldValue = String(this.form[fieldName] || '')

        if (fieldConfig.required && !fieldValue.trim()) {
          return false
        }

        // * Check validation rules
        if (fieldConfig.rules) {
          for (const rule of fieldConfig.rules) {
            if (rule(fieldValue, this.form)) {
              return false
            }
          }
        }
      }

      return true
    })
  }

  get formValidationMessage() {
    return computed(() => {
      const currentError = Object.values(this.errors).find((error) => error !== '')
      if (currentError) return 'Please fix the errors above'

      // * Check for missing required fields
      for (const fieldName of Object.keys(this.config)) {
        const fieldConfig = this.config[fieldName]
        const fieldValue = String(this.form[fieldName] || '')

        if (fieldConfig.required && !fieldValue.trim()) {
          return `${fieldName} is required`
        }

        if (fieldConfig.rules) {
          for (const rule of fieldConfig.rules) {
            const error = rule(fieldValue, this.form)
            if (error) return error
          }
        }
      }

      return ''
    })
  }

  get fieldErrors() {
    return this.errors
  }
}

// ? Validation rules object
export const ValidationRules = {
  required: (fieldName: string) => (value: string) => {
    if (!value.trim()) return `${fieldName} is required`
    return ''
  },

  // ? Email validator
  email: (value: string) => {
    if (!value.trim()) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address'
    }
    return ''
  },

  // ? Minimum length validator
  minLength: (min: number) => (value: string) => {
    if (!value) return ''
    if (value.length < min) {
      return `Must be at least ${min} characters long`
    }
    return ''
  },

  // ? Maximum length validator
  maxLength: (max: number) => (value: string) => {
    if (!value) return ''
    if (value.length > max) {
      return `Must be no more than ${max} characters long`
    }
    return ''
  },

  // ? Name minimum length validator
  minNameLength: (value: string) => {
    if (!value.trim()) return ''
    if (value.trim().length < 2) {
      return 'Name must be at least 2 characters long'
    }
    return ''
  },

  // ? Password strength validator
  passwordStrength: (value: string) => {
    if (!value) return ''
    if (value.length < 6) {
      return 'Password must be at least 6 characters long'
    }
    return ''
  },

  // ? Password match validator
  passwordMatch: (confirmFieldName: string, passwordFieldName: string) => {
    return (value: string, formData?: FormData) => {
      if (!value || !formData) return ''
      if (value !== formData[passwordFieldName]) {
        return 'Passwords do not match'
      }
      return ''
    }
  },

  custom: (validatorFn: (value: string, formData?: FormData) => string) => validatorFn,
}

export function createValidationService(initialData: FormData, config: FormConfig) {
  return new ValidationService(initialData, config)
}
