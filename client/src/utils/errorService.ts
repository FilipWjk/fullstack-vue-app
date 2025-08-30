import { AxiosError } from 'axios'
import { ErrorMessages } from './errorMessages'

// * Interface for API error responses from the backend
export interface ApiErrorResponse {
  message: string
  error?: string
  errors?: Array<{
    field: string
    message: string
    value?: unknown
  }>
}

// * Interface for standardized error information
export interface ErrorInfo {
  message: string
  details?: string
  validationErrors?: Array<{
    field: string
    message: string
    value?: unknown
  }>
}

// * Type guard to check if an error is an AxiosError
export const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return (error as AxiosError).isAxiosError === true
}

// * Service class for handling errors across the application
export class ErrorService {
  /**
   * Extract error message from unknown error type
   * @param error - The error to process
   * @param defaultMessageKey - Default message key from ErrorMessages enum
   * @returns Standardized error information
   */
  static extractErrorInfo(
    error: unknown,
    defaultMessageKey: keyof typeof ErrorMessages,
  ): ErrorInfo {
    const defaultMessage = ErrorMessages[defaultMessageKey]

    if (isAxiosError(error)) {
      const response = error.response?.data
      return {
        message: response?.message || response?.error || defaultMessage,
        details: error.message,
        validationErrors: response?.errors,
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message || defaultMessage,
        details: error.stack,
      }
    }

    if (typeof error === 'string') {
      return {
        message: error || defaultMessage,
      }
    }

    return {
      message: defaultMessage,
      details: 'Unknown error type',
    }
  }

  /**
   * Extract simple error message for UI display
   * @param error - The error to process
   * @param defaultMessageKey - Default message key from ErrorMessages enum
   * @returns Simple error message string
   */
  static extractErrorMessage(
    error: unknown,
    defaultMessageKey: keyof typeof ErrorMessages,
  ): string {
    return this.extractErrorInfo(error, defaultMessageKey).message
  }

  /**
   * Check if error contains validation errors
   * @param error - The error to check
   * @returns True if error contains validation errors
   */
  static hasValidationErrors(error: unknown): boolean {
    if (isAxiosError(error)) {
      return Boolean(error.response?.data?.errors?.length)
    }
    return false
  }

  /**
   * Extract validation errors from error
   * @param error - The error to process
   * @returns Array of validation errors or empty array
   */
  static extractValidationErrors(error: unknown): Array<{
    field: string
    message: string
    value?: unknown
  }> {
    if (isAxiosError(error)) {
      return error.response?.data?.errors || []
    }
    return []
  }

  /**
   * Log error to console
   * @param error - The error to log
   * @param context - Additional context information
   */
  static logError(error: unknown, context?: string): void {
    const errorInfo = this.extractErrorInfo(error, 'UNKNOWN_ERROR')

    console.error(`[ErrorService]${context ? ` ${context}:` : ''}`, {
      message: errorInfo.message,
      details: errorInfo.details,
      validationErrors: errorInfo.validationErrors,
      originalError: error,
    })
  }

  /**
   * Create a standardized error handler for store actions
   * @param defaultMessageKey - Default error message key from ErrorMessages enum
   * @param context - Context for logging
   * @returns Error handler function
   */
  static createStoreErrorHandler(defaultMessageKey: keyof typeof ErrorMessages, context?: string) {
    return (error: unknown) => {
      this.logError(error, context)
      return this.extractErrorMessage(error, defaultMessageKey)
    }
  }
}

// * Convenience functions for common error handling patterns
export const handleApiError = (
  error: unknown,
  defaultMessageKey: keyof typeof ErrorMessages,
): string => {
  return ErrorService.extractErrorMessage(error, defaultMessageKey)
}

export const logApiError = (error: unknown, context?: string): void => {
  ErrorService.logError(error, context)
}

export const getValidationErrors = (error: unknown) => {
  return ErrorService.extractValidationErrors(error)
}
