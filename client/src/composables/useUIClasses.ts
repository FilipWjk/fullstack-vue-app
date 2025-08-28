export const useUIClasses = () => {
  // * Input field classes
  const getInputClass = (hasError = false) => {
    const baseClasses = [
      'block w-full rounded-xl border-0 py-3 px-4',
      'text-gray-900 dark:text-white',
      'bg-white/70 dark:bg-gray-700',
      'shadow-sm ring-1 ring-inset',
      'ring-gray-200 dark:ring-gray-600',
      'placeholder:text-gray-400 dark:placeholder-gray-400',
      'focus:ring-2 focus:ring-inset focus:ring-blue-500 dark:focus:ring-emerald-400',
      'sm:text-sm sm:leading-6',
      'disabled:bg-gray-50 disabled:text-gray-500',
      'transition-all duration-200 hover:shadow-md focus:shadow-lg',
      'backdrop-blur-sm',
    ]

    if (hasError) {
      baseClasses.push('ring-red-500 focus:ring-red-500')
    }

    return baseClasses.join(' ')
  }

  // * Primary button class
  const getPrimaryButtonClass = (fullWidth = true) => {
    const baseClasses = [
      'flex justify-center rounded-xl px-4 py-3',
      'text-sm font-semibold leading-6 text-white',
      'bg-gradient-to-r from-blue-600 to-purple-600',
      'hover:from-blue-700 hover:to-purple-700',
      'shadow-lg hover:shadow-xl',
      'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600',
      'disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
      'transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
    ]

    if (fullWidth) {
      baseClasses.push('w-full')
    }

    return baseClasses.join(' ')
  }

  // * Disabled button state for register view
  const getDisabledButtonClass = () => {
    return [
      'flex w-full justify-center rounded-xl px-4 py-3',
      'text-sm font-semibold leading-6 text-white',
      'bg-gray-400 dark:bg-gray-600',
      'cursor-not-allowed shadow-sm',
    ].join(' ')
  }

  // * Label classes
  const getLabelClass = () => {
    return 'block text-sm font-semibold leading-6 text-gray-700 dark:text-gray-300'
  }

  // * Error message classes
  const getErrorMessageClass = () => {
    return 'mt-1 text-sm text-red-600 dark:text-red-400'
  }

  // * Success/warning message classes
  const getWarningMessageClass = () => {
    return 'rounded-md bg-amber-50 dark:bg-amber-900/20 p-3'
  }

  const getWarningTextClass = () => {
    return 'text-sm text-amber-700 dark:text-amber-300 flex items-center'
  }

  // * Card/form container classes
  const getFormCardClass = () => {
    return [
      'bg-white/80 backdrop-blur-sm dark:bg-gray-800',
      'px-6 py-12 shadow-xl shadow-blue-500/10',
      'sm:rounded-2xl sm:px-12',
      'border border-white/20 dark:border-gray-700',
      'transition-colors duration-200 relative overflow-hidden',
    ].join(' ')
  }

  return {
    getInputClass,
    getPrimaryButtonClass,
    getDisabledButtonClass,
    getLabelClass,
    getErrorMessageClass,
    getWarningMessageClass,
    getWarningTextClass,
    getFormCardClass,
  }
}
