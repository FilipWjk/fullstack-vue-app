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

  // * Sidebar navigation classes
  const getNavLinkClass = (isActive = false) => {
    const baseClasses = [
      'group flex gap-x-3 rounded-lg p-3 text-sm leading-6 font-semibold',
      'transition-all duration-200',
    ]

    if (isActive) {
      baseClasses.push(
        'bg-primary-50 dark:bg-gray-700',
        'text-primary-600 dark:text-primary-400',
        'shadow-sm',
      )
    } else {
      baseClasses.push(
        'text-gray-700 dark:text-gray-300',
        'hover:text-primary-600 dark:hover:text-primary-400',
        'hover:bg-primary-50 dark:hover:bg-gray-700',
      )
    }

    return baseClasses.join(' ')
  }

  const getNavIconClass = (isActive = false) => {
    const baseClasses = ['h-5 w-5 shrink-0', 'transition-colors duration-200']

    if (isActive) {
      baseClasses.push('text-primary-600 dark:text-primary-400')
    } else {
      baseClasses.push(
        'text-gray-400 dark:text-gray-500',
        'group-hover:text-primary-600 dark:group-hover:text-primary-400',
      )
    }

    return baseClasses.join(' ')
  }

  // * Sidebar container classes
  const getSidebarClass = () => {
    return [
      'sidebar flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4',
      'bg-white dark:bg-gray-900',
      'border-r border-gray-200 dark:border-gray-700',
    ].join(' ')
  }

  // * Secondary button class (for logout, etc.)
  const getSecondaryButtonClass = (variant = 'default') => {
    const baseClasses = [
      'w-full flex items-center px-3 py-2 text-sm',
      'rounded-lg transition-all duration-200',
    ]

    if (variant === 'danger') {
      baseClasses.push(
        'text-gray-600 dark:text-gray-300',
        'hover:text-red-600 dark:hover:text-red-400',
        'hover:bg-red-50 dark:hover:bg-red-900/20',
      )
    } else {
      baseClasses.push(
        'text-gray-600 dark:text-gray-300',
        'hover:text-primary-600 dark:hover:text-primary-400',
        'hover:bg-primary-50 dark:hover:bg-gray-700',
      )
    }

    return baseClasses.join(' ')
  }

  // * Layout container classes
  const getAppContainerClass = () => {
    return 'bg-white dark:bg-gray-900 transition-colors duration-300'
  }

  const getMainLayoutClass = () => {
    return 'min-h-screen bg-gray-50 dark:bg-gray-900'
  }

  const getContentAreaClass = () => {
    return 'lg:pl-72'
  }

  // * Header/Topbar classes
  const getTopbarClass = () => {
    return [
      'sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4',
      'border-b border-gray-200 dark:border-gray-700',
      'bg-white dark:bg-gray-800 px-4 shadow-sm',
      'sm:gap-x-6 sm:px-6 lg:px-8',
      'transition-colors duration-300',
    ].join(' ')
  }

  const getMobileMenuButtonClass = () => {
    return [
      '-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden',
      'hover:text-primary-600 dark:hover:text-primary-400',
      'transition-colors duration-200',
    ].join(' ')
  }

  const getSeparatorClass = () => {
    return 'h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden'
  }

  // * User profile dropdown classes
  const getProfileButtonClass = () => {
    return [
      '-m-1.5 flex items-center p-1.5',
      'hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg',
      'transition-colors duration-200',
    ].join(' ')
  }

  const getProfileAvatarClass = () => {
    return [
      'h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600',
      'flex items-center justify-center',
    ].join(' ')
  }

  const getProfileDropdownClass = () => {
    return [
      'absolute right-0 z-10 mt-2.5 w-48 origin-top-right rounded-xl',
      'bg-white dark:bg-gray-800 py-2 shadow-lg',
      'ring-1 ring-gray-900/5 dark:ring-gray-700 focus:outline-none',
    ].join(' ')
  }

  const getDropdownItemClass = (isActive = false, variant = 'default') => {
    const baseClasses = [
      'flex items-center w-full text-left px-3 py-2 text-sm leading-6',
      'transition-colors duration-200 rounded-lg',
    ]

    if (variant === 'danger') {
      if (isActive) {
        baseClasses.push('bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400')
      } else {
        baseClasses.push('text-gray-900 dark:text-gray-300')
      }
    } else {
      if (isActive) {
        baseClasses.push('bg-primary-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400')
      } else {
        baseClasses.push('text-gray-900 dark:text-gray-300')
      }
    }

    return baseClasses.join(' ')
  }

  // * Common icon classes
  const getSmallIconClass = () => {
    return 'w-4 h-4 mr-3'
  }

  const getStandardIconClass = () => {
    return 'h-5 w-5 text-gray-400 dark:text-gray-500'
  }

  const getMenuIconClass = () => {
    return 'h-6 w-6'
  }

  // * Icon utility for flexible sizing and colors
  const getIconClass = (size = 'standard', color = 'default') => {
    const sizeClasses = {
      small: 'w-4 h-4',
      standard: 'w-5 h-5',
      large: 'w-6 h-6',
    }

    const colorClasses = {
      default: 'text-gray-400 dark:text-gray-500',
      primary: 'text-primary-600 dark:text-primary-400',
      yellow: 'text-yellow-500',
      gray: 'text-gray-600',
      white: 'text-white',
    }

    const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || sizeClasses.standard
    const colorClass = colorClasses[color as keyof typeof colorClasses] || colorClasses.default

    return `${sizeClass} ${colorClass}`
  }

  // * Text utility classes
  const getWelcomeTextClass = () => {
    return 'text-sm text-gray-500 dark:text-gray-400'
  }

  const getUserNameTextClass = () => {
    return 'text-sm font-medium text-white'
  }

  const getProfileNameTextClass = () => {
    return 'ml-4 text-sm font-semibold leading-6 text-gray-900 dark:text-white'
  }

  // * Main content classes
  const getMainContentClass = () => {
    return 'py-10'
  }

  const getContentPaddingClass = () => {
    return 'px-4 sm:px-6 lg:px-8'
  }

  // * Screen reader classes
  const getScreenReaderClass = () => {
    return 'sr-only'
  }

  // * Page layout classes
  const getPageContainerClass = () => {
    return 'space-y-6'
  }

  const getPageHeaderClass = () => {
    return 'border-b border-gray-200 dark:border-gray-700 pb-4'
  }

  const getPageTitleClass = () => {
    return 'text-2xl font-bold text-gray-900 dark:text-white'
  }

  const getPageDescriptionClass = () => {
    return 'text-gray-600 dark:text-gray-400 mt-1'
  }

  // * Card classes
  const getCardClass = () => {
    return [
      'bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/20',
      'border border-gray-200 dark:border-gray-700 rounded-xl p-6',
      'transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/30',
    ].join(' ')
  }

  const getCardHeaderClass = () => {
    return 'text-lg font-medium text-gray-900 dark:text-white mb-6'
  }

  // * Auth page layout classes
  const getAuthPageContainerClass = () => {
    return [
      'flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8',
      'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
      'dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
      'transition-colors duration-200',
    ].join(' ')
  }

  const getAuthHeaderContainerClass = () => {
    return 'sm:mx-auto sm:w-full sm:max-w-md'
  }

  const getAuthTitleClass = () => {
    return [
      'mt-6 text-center text-2xl font-bold leading-9 tracking-tight',
      'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600',
      'bg-clip-text text-transparent',
      'dark:bg-gradient-to-r dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400',
      'dark:bg-clip-text dark:text-transparent',
    ].join(' ')
  }

  const getAuthSubtitleClass = () => {
    return 'mt-2 text-center text-sm text-gray-600 dark:text-gray-400'
  }

  const getAuthFormContainerClass = () => {
    return 'mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]'
  }

  // * Common text utility classes
  const getTextCenterClass = () => {
    return 'text-center'
  }

  const getTextLargeClass = () => {
    return 'text-lg font-medium text-gray-900 dark:text-white'
  }

  const getTextSmallMutedClass = () => {
    return 'text-sm text-gray-600 dark:text-gray-400'
  }

  const getTextMutedClass = () => {
    return 'text-gray-600 dark:text-gray-400'
  }

  // * Grid and layout utility classes
  const getStatsGridClass = () => {
    return 'grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700'
  }

  const getFlexItemsCenterClass = () => {
    return 'flex items-center space-x-4'
  }

  // * Stat card classes
  const getStatNumberClass = (color = 'blue') => {
    const colors = {
      blue: 'text-blue-600 dark:text-blue-400',
      green: 'text-green-600 dark:text-green-400',
      purple: 'text-purple-600 dark:text-purple-400',
    }
    return `text-2xl font-bold ${colors[color as keyof typeof colors] || colors.blue}`
  }

  const getStatLabelClass = () => {
    return 'text-sm text-gray-600 dark:text-gray-400'
  }

  // * Sidebar specific classes
  const getSidebarOverlayClass = () => {
    return 'fixed inset-0 bg-gray-900/80 transition-opacity duration-300'
  }

  const getSidebarCloseButtonClass = () => {
    return '-m-2.5 p-2.5 text-white hover:text-gray-300 transition-colors duration-200'
  }

  const getSidebarBrandClass = () => {
    return 'w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center'
  }

  const getSidebarTitleClass = () => {
    return 'text-xl font-bold text-gray-900 dark:text-white'
  }

  const getSidebarSectionTitleClass = () => {
    return 'text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wider'
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
    getNavLinkClass,
    getNavIconClass,
    getSidebarClass,
    getSecondaryButtonClass,
    // Layout classes
    getAppContainerClass,
    getMainLayoutClass,
    getContentAreaClass,
    // Header classes
    getTopbarClass,
    getMobileMenuButtonClass,
    getSeparatorClass,
    // Profile dropdown classes
    getProfileButtonClass,
    getProfileAvatarClass,
    getProfileDropdownClass,
    getDropdownItemClass,
    // Icon classes
    getSmallIconClass,
    getStandardIconClass,
    getMenuIconClass,
    getIconClass,
    // Text classes
    getWelcomeTextClass,
    getUserNameTextClass,
    getProfileNameTextClass,
    // Content classes
    getMainContentClass,
    getContentPaddingClass,
    // Utility classes
    getScreenReaderClass,
    // Page layout classes
    getPageContainerClass,
    getPageHeaderClass,
    getPageTitleClass,
    getPageDescriptionClass,
    // Card classes
    getCardClass,
    getCardHeaderClass,
    // Auth page classes
    getAuthPageContainerClass,
    getAuthHeaderContainerClass,
    getAuthTitleClass,
    getAuthSubtitleClass,
    getAuthFormContainerClass,
    // Text utility classes
    getTextCenterClass,
    getTextLargeClass,
    getTextSmallMutedClass,
    getTextMutedClass,
    // Layout utility classes
    getStatsGridClass,
    getFlexItemsCenterClass,
    // Stat classes
    getStatNumberClass,
    getStatLabelClass,
    // Sidebar specific classes
    getSidebarOverlayClass,
    getSidebarCloseButtonClass,
    getSidebarBrandClass,
    getSidebarTitleClass,
    getSidebarSectionTitleClass,
  }
}
