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

  const getRefreshIconClass = () => {
    return 'w-4 h-4 mr-0 ml-1'
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
      red: 'text-red-600 dark:text-red-400',
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
    return 'text-gray-600 dark:text-gray-400 mt-1 mb-3'
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

  // * Auth link classes
  const getAuthLinkClass = () => {
    return 'font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
  }

  // * Form layout classes
  const getFormSpaceClass = () => {
    return 'space-y-6 relative z-10'
  }

  const getFormFieldSpaceClass = () => {
    return 'mt-2'
  }

  const getPasswordHintClass = () => {
    return 'mt-1 text-xs text-gray-500 dark:text-gray-400'
  }

  // * Background decoration classes
  const getAuthBackgroundOverlayClass = () => {
    return 'absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-indigo-400/5 dark:opacity-0'
  }

  const getAuthDecorationTopClass = () => {
    return 'absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl dark:opacity-0'
  }

  const getAuthDecorationBottomClass = () => {
    return 'absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl dark:opacity-0'
  }

  // * Spinner loading classes
  const getInlineSpinnerClass = () => {
    return 'mr-2'
  }

  const getSpinnerElementClass = () => {
    return 'spinner'
  }

  // * Demo credentials section classes
  const getDemoSectionClass = () => {
    return 'mt-6 relative z-10'
  }

  const getDemoSeparatorContainerClass = () => {
    return 'relative'
  }

  const getDemoSeparatorLineClass = () => {
    return 'absolute inset-0 flex items-center'
  }

  const getDemoSeparatorClass = () => {
    return 'w-full border-t border-gray-200 dark:border-gray-600'
  }

  const getDemoSeparatorLabelContainerClass = () => {
    return 'relative flex justify-center text-sm font-medium leading-6'
  }

  const getDemoSeparatorLabelClass = () => {
    return 'bg-white/80 backdrop-blur-sm dark:bg-gray-800 px-6 text-gray-600 dark:text-gray-300 rounded-full'
  }

  const getDemoCredentialsContainerClass = () => {
    return 'mt-6 grid grid-cols-1 gap-4'
  }

  const getDemoCredentialsTextClass = () => {
    return 'text-sm text-gray-500 dark:text-gray-300 space-y-2'
  }

  const getDemoCredentialLabelClass = () => {
    return 'text-gray-700 dark:text-gray-200'
  }

  const getDemoButtonsContainerClass = () => {
    return 'flex flex-wrap gap-2 mt-3'
  }

  // * Sidebar mobile overlay and layout classes
  const getSidebarMobileContainerClass = () => {
    return 'relative z-50 lg:hidden'
  }

  const getSidebarMobileBackdropClass = () => {
    return 'fixed inset-0 flex'
  }

  const getSidebarMobileContentClass = () => {
    return 'relative mr-16 flex w-full max-w-xs flex-1 transform transition-transform duration-300'
  }

  const getSidebarMobileCloseContainerClass = () => {
    return 'absolute left-full top-0 flex w-16 justify-center pt-5'
  }

  const getSidebarDesktopContainerClass = () => {
    return 'hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col'
  }

  // * Navigation list classes
  const getNavigationListClass = () => {
    return 'flex flex-1 flex-col gap-y-7'
  }

  const getNavigationSubListClass = () => {
    return '-mx-2 space-y-1'
  }

  const getNavigationSectionSpaceClass = () => {
    return '-mx-2 mt-2 space-y-1'
  }

  const getNavigationBottomSectionClass = () => {
    return 'mt-4 space-y-4'
  }

  const getNavigationActionsClass = () => {
    return 'space-y-1'
  }

  // * Header/Logo classes
  const getSidebarHeaderClass = () => {
    return 'flex h-16 shrink-0 items-center space-x-3'
  }

  // * Table sorting and hover classes
  const getTableHeaderSortableClass = () => {
    return 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
  }

  const getTableHeaderSortContainerClass = () => {
    return 'flex items-center justify-between'
  }

  const getSortIconClass = () => {
    return 'w-4 h-4'
  }

  const getTableActionsHeaderClass = () => {
    return 'px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
  }

  // * Modal overlay classes for custom modals
  const getCustomModalOverlayClass = () => {
    return 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'
  }

  const getCustomModalContainerClass = () => {
    return 'w-full max-w-md'
  }

  const getCustomModalHeaderClass = () => {
    return 'text-xl font-semibold text-gray-900 dark:text-white mb-4'
  }

  const getCustomModalBodyClass = () => {
    return 'p-6'
  }

  // * List and divider classes
  const getListDividerClass = () => {
    return '-my-5 divide-y divide-gray-200 dark:divide-gray-700'
  }

  const getListItemClass = () => {
    return 'py-4'
  }

  const getListItemContentClass = () => {
    return 'flex items-center space-x-4'
  }

  const getListItemMainClass = () => {
    return 'flex-1 min-w-0'
  }

  const getListItemTitleClass = () => {
    return 'text-sm font-medium text-gray-900 dark:text-white truncate'
  }

  const getListItemSubtitleClass = () => {
    return 'text-sm text-gray-500 dark:text-gray-400 truncate'
  }

  const getListItemActionsClass = () => {
    return 'flex-shrink-0'
  }

  // * Header layout classes
  const getPageHeaderContainerClass = () => {
    return 'flex justify-between items-center mb-6'
  }

  const getPageHeaderActionsClass = () => {
    return 'px-6 py-2 items-center'
  }

  const getHeaderButtonIconClass = () => {
    return 'w-5 h-5 mr-2'
  }

  // * Filter form field classes
  const getFilterFormFieldClass = () => {
    return 'mb-2'
  }

  const getFilterButtonContainerClass = () => {
    return 'flex items-end'
  }

  // * Category card specific classes
  const getCategoryGridClass = () => {
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
  }

  const getCategoryCardClass = () => {
    return getCardClass() + ' relative group'
  }

  const getCategoryImageContainerClass = () => {
    return 'relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl overflow-hidden'
  }

  const getCategoryImageClass = () => {
    return 'w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
  }

  const getCategoryImagePlaceholderClass = () => {
    return 'w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500'
  }

  const getCategoryImagePlaceholderIconClass = () => {
    return 'w-16 h-16'
  }

  const getCategoryActionOverlayClass = () => {
    return 'absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2'
  }

  const getCategoryActionButtonClass = (variant = 'primary') => {
    const baseClasses = ['p-2 rounded-full transition-colors']

    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    }

    const variantClasses = variants[variant as keyof typeof variants] || variants.primary
    return [...baseClasses, variantClasses].join(' ')
  }

  const getCategoryContentClass = () => {
    return 'p-4'
  }

  const getCategoryTitleClass = () => {
    return 'text-lg font-semibold text-gray-900 dark:text-white mb-2'
  }

  const getCategoryDescriptionClass = () => {
    return 'text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2'
  }

  const getCategoryStatsClass = () => {
    return 'flex items-center justify-between text-xs text-gray-500 dark:text-gray-400'
  }

  const getCategoryActionIconClass = () => {
    return 'w-4 h-4'
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
      orange: 'text-orange-600 dark:text-orange-400',
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

  // * Table classes
  const getTableContainerClass = () => {
    return [
      'bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md',
      'border border-gray-200 dark:border-gray-700 transition-colors duration-200',
    ].join(' ')
  }

  const getTableClass = () => {
    return 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
  }

  const getTableHeaderClass = () => {
    return 'bg-gray-50 dark:bg-gray-900'
  }

  const getTableHeaderCellClass = () => {
    return 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
  }

  const getTableBodyClass = () => {
    return 'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'
  }

  const getTableRowClass = () => {
    return 'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
  }

  const getTableCellClass = () => {
    return 'px-6 py-4 whitespace-nowrap'
  }

  // * Status badge classes (unified)
  const getUnifiedStatusBadgeClass = (status: string) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
      DELIVERED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-800 dark:text-emerald-100',
      CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      INACTIVE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      OUT_OF_STOCK: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    }

    const colorClass =
      statusClasses[status as keyof typeof statusClasses] ||
      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

    return `${baseClasses} ${colorClass}`
  }

  const getStatusBadgeClass = (status: string) => getUnifiedStatusBadgeClass(status)

  // * Action button classes
  const getActionButtonClass = (variant = 'primary') => {
    const baseClasses = [
      'inline-flex items-center p-2 rounded-md transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
    ]

    const variants = {
      primary: [
        'text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300',
        'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 focus:ring-emerald-500',
      ],
      refresh: [
        'text-emerald-600 bg-emerald-200 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 dark:hover:text-emerald-300',
        'focus:ring-emerald-500',
      ],
      danger: [
        'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
        'hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500',
      ],
      secondary: [
        'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300',
        'hover:bg-gray-50 dark:hover:bg-gray-900/20 focus:ring-gray-500',
      ],
    }

    const variantClasses = variants[variant as keyof typeof variants] || variants.secondary
    return [...baseClasses, ...variantClasses].join(' ')
  }

  // * Filter form classes
  const getFilterContainerClass = () => {
    return [
      'bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg',
      'border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-200',
    ].join(' ')
  }

  const getFilterGridClass = () => {
    return 'grid grid-cols-1 md:grid-cols-4 gap-6'
  }

  const getOrdersFilterGridClass = () => {
    return 'grid grid-cols-1 md:grid-cols-3 gap-6'
  }

  const getFilterHeaderClass = () => {
    return 'text-lg font-medium text-gray-900 dark:text-white mb-4'
  }

  // * Select field classes
  const getSelectClass = (hasError = false) => {
    const baseClasses = [
      'block w-full px-4 py-3 pr-10 rounded-md border border-gray-300',
      'dark:border-gray-600 dark:bg-gray-700 dark:text-white',
      'shadow-sm focus:border-emerald-500 focus:ring-emerald-500',
      'dark:focus:border-emerald-400 transition-colors duration-200',
    ]

    if (hasError) {
      baseClasses.push('border-red-500 focus:border-red-500 focus:ring-red-500')
    }

    return baseClasses.join(' ')
  }

  // * Cancel/Secondary button classes
  const getCancelButtonClass = () => {
    return [
      'inline-flex items-center px-4 py-2 border border-red-300 dark:border-red-600',
      'text-sm font-medium rounded-md text-red-700 dark:text-red-300',
      'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
      'transition-colors duration-200',
    ].join(' ')
  }

  const getSuccessButtonClass = () => {
    return [
      'inline-flex items-center px-4 py-2 border border-transparent',
      'text-sm font-medium rounded-md shadow-sm text-white',
      'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
      'disabled:opacity-50 transition-colors duration-200',
    ].join(' ')
  }

  // * Pagination classes
  const getPaginationContainerClass = () => {
    return [
      'mt-6 flex items-center justify-between bg-white dark:bg-gray-800',
      'px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700',
      'shadow-sm transition-colors duration-200',
    ].join(' ')
  }

  const getPaginationButtonClass = (disabled = false) => {
    const baseClasses = [
      'px-4 py-2 border border-gray-300 dark:border-gray-600',
      'text-sm font-medium rounded-md text-gray-700 dark:text-gray-300',
      'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
      'transition-colors duration-200',
    ]

    if (disabled) {
      baseClasses.push('opacity-50 cursor-not-allowed')
    }

    return baseClasses.join(' ')
  }

  // * Modal/Dialog classes
  const getModalOverlayClass = () => {
    return 'fixed inset-0 z-50 overflow-y-auto'
  }

  const getModalBackdropClass = () => {
    return [
      'flex items-end justify-center min-h-screen pt-4 px-4 pb-20',
      'text-center sm:block sm:p-0',
    ].join(' ')
  }

  const getModalBackgroundClass = () => {
    return [
      'fixed inset-0 bg-gray-500 bg-opacity-75',
      'dark:bg-gray-900 dark:bg-opacity-75 transition-opacity',
    ].join(' ')
  }

  const getModalPanelClass = () => {
    return [
      'relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg',
      'px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all',
      'sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6',
    ].join(' ')
  }

  const getModalIconContainerClass = (variant = 'danger') => {
    const baseClasses = [
      'mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12',
      'rounded-full sm:mx-0 sm:h-10 sm:w-10',
    ]

    const variants = {
      danger: 'bg-red-100 dark:bg-red-900',
      warning: 'bg-yellow-100 dark:bg-yellow-900',
      info: 'bg-blue-100 dark:bg-blue-900',
    }

    const variantClass = variants[variant as keyof typeof variants] || variants.danger
    return [...baseClasses, variantClass].join(' ')
  }

  const getModalTitleClass = () => {
    return 'text-lg leading-6 font-medium text-gray-900 dark:text-white'
  }

  const getModalDescriptionClass = () => {
    return 'text-sm text-gray-500 dark:text-gray-300'
  }

  const getModalActionsClass = () => {
    return 'mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'
  }

  const getConfirmButtonClass = () => {
    return [
      'w-full inline-flex justify-center rounded-md border border-transparent',
      'shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white',
      'hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
      'sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200',
    ].join(' ')
  }

  const getModalCancelButtonClass = () => {
    return [
      'mt-3 w-full inline-flex justify-center rounded-md border',
      'border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2',
      'bg-white dark:bg-gray-700 text-base font-medium',
      'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      'sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200',
    ].join(' ')
  }

  // * Loading/spinner classes
  const getLoadingContainerClass = () => {
    return 'flex justify-center py-12'
  }

  const getSpinnerClass = (size = 'standard') => {
    const sizes = {
      small: 'h-4 w-4',
      standard: 'h-8 w-8',
      large: 'h-12 w-12',
    }

    const sizeClass = sizes[size as keyof typeof sizes] || sizes.standard
    return `spinner ${sizeClass}`
  }

  // Unified loading spinner class
  const getUnifiedLoadingSpinnerClass = () => {
    return 'animate-spin -ml-1 mr-3 h-5 w-5 text-white'
  }

  // * Product card specific classes
  const getProductImageClass = () => {
    return 'h-12 w-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600'
  }

  const getProductImagePlaceholderClass = () => {
    return [
      'h-12 w-12 rounded-lg bg-gray-200 dark:bg-gray-600',
      'flex items-center justify-center',
    ].join(' ')
  }

  const getProductNameClass = () => {
    return 'text-sm font-medium text-gray-900 dark:text-white'
  }

  const getProductDescriptionClass = () => {
    return 'text-sm text-gray-500 dark:text-gray-400'
  }

  const getProductPriceClass = () => {
    return 'text-sm font-medium text-gray-900 dark:text-white'
  }

  // * Form section and file upload classes
  // * Dashboard specific classes
  const getDashboardStatsGridClass = () => {
    return 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8'
  }

  const getDashboardChartsGridClass = () => {
    return 'grid grid-cols-1 lg:grid-cols-2 gap-8'
  }

  const getDashboardStatIconClass = (color = 'emerald') => {
    const colors = {
      emerald: 'h-8 w-8 text-emerald-600 dark:text-emerald-400',
      blue: 'h-8 w-8 text-blue-600 dark:text-blue-400',
      purple: 'h-8 w-8 text-purple-600 dark:text-purple-400',
      orange: 'h-8 w-8 text-orange-600 dark:text-orange-400',
    }

    return colors[color as keyof typeof colors] || colors.emerald
  }

  // * Link styles
  const getLinkClass = (variant = 'primary') => {
    const variants = {
      primary:
        'font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300',
      emerald:
        'text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300',
    }

    return variants[variant as keyof typeof variants] || variants.primary
  }

  // * Warning/Error message styles
  const getWarningBadgeClass = () => {
    return 'rounded-md bg-red-50 dark:bg-red-900/20 p-4'
  }

  const getWarningBadgeTextClass = () => {
    return 'text-sm text-red-700 dark:text-red-300'
  }

  // * Demo/Quick action button styles
  const getDemoButtonClass = (variant = 'blue') => {
    const baseClasses = [
      'flex-1 text-white px-3 py-2 rounded-lg text-xs font-medium',
      'transition-all duration-200 hover:shadow-lg',
    ]

    const variants = {
      blue: [
        'bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-blue-600',
        'hover:from-blue-600 hover:to-blue-700 dark:hover:bg-blue-700',
      ],
      green: [
        'bg-gradient-to-r from-emerald-500 to-green-600 dark:bg-green-600',
        'hover:from-emerald-600 hover:to-green-700 dark:hover:bg-green-700',
      ],
      purple: [
        'bg-gradient-to-r from-purple-500 to-purple-600 dark:bg-purple-600',
        'hover:from-purple-600 hover:to-purple-700 dark:hover:bg-purple-700',
      ],
    }

    const variantClasses = variants[variant as keyof typeof variants] || variants.blue
    return [...baseClasses, ...variantClasses].join(' ')
  }

  const getEmptyStateClass = () => {
    return 'text-center py-12'
  }

  const getEmptyStateIconClass = () => {
    return 'mx-auto h-12 w-12 text-gray-400 dark:text-gray-600'
  }

  const getEmptyStateTitleClass = () => {
    return 'mt-2 text-sm font-semibold text-gray-900 dark:text-white'
  }

  const getEmptyStateDescriptionClass = () => {
    return 'mt-1 text-sm text-gray-500 dark:text-gray-400'
  }

  // Image Preview Classes
  const getImagePreviewContainerClass = () => 'relative mt-2'
  const getImagePreviewClass = () => 'w-full h-32 object-cover rounded-xl'
  const getImagePreviewRemoveButtonClass = () =>
    'absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700'
  const getImagePreviewRemoveIconClass = () => 'w-4 h-4'

  // Form Button Container Class
  const getFormButtonContainerClass = () => 'flex items-center justify-between pt-6'

  // Orders Table Classes
  const getOrdersTableContainerClass = () =>
    'bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-200'
  const getOrdersTableClass = () => 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
  const getOrdersTableHeaderClass = () => 'bg-gray-50 dark:bg-gray-700'
  const getOrdersTableHeaderCellClass = () =>
    getTableHeaderCellClass() + ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
  const getOrdersTableHeaderCellActionsClass = () =>
    'px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
  const getOrdersTableBodyClass = () =>
    'bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'
  const getOrdersTableRowClass = () =>
    'hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
  const getOrdersTableCellClass = () => 'px-4 py-3 whitespace-nowrap'
  const getOrdersTableSkeletonCellClass = () => 'px-4 py-3'
  const getOrdersTableSkeletonClass = () => 'h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse'
  const getOrdersTableEmptyCellClass = () =>
    'px-4 py-8 text-center text-gray-500 dark:text-gray-400'
  const getOrdersTableActionsClass = () =>
    'px-4 py-3 whitespace-nowrap text-right text-sm font-medium'
  const getOrdersTableActionsContainerClass = () => 'flex justify-end items-center space-x-2'
  const getOrderNumberClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getCustomerNameClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getCustomerEmailClass = () => 'text-sm text-gray-500 dark:text-gray-400'
  const getOrderDateClass = () => 'text-sm text-gray-900 dark:text-white'
  const getOrderTotalClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getOrderItemsClass = () => 'text-sm text-gray-900 dark:text-white'
  const getOrderViewLinkClass = () =>
    'text-emerald-600 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors duration-200'
  const getOrderStatusSelectClass = () =>
    'text-sm border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded shadow-sm focus:border-emerald-500 focus:ring-emerald-500 dark:focus:border-emerald-400 transition-colors duration-200 px-2 py-1'
  const getTableHeaderFlexClass = () => 'flex items-center justify-between'
  const getTableSortIconClass = () => 'w-4 h-4'

  // MyOrdersView specific classes
  const getMyOrdersContainerClass = () => 'px-4 sm:px-6 lg:px-8'
  const getMyOrdersHeaderContainerClass = () => 'sm:flex sm:items-center'
  const getMyOrdersHeaderContentClass = () => 'sm:flex-auto'
  const getMyOrdersHeaderTitleClass = () =>
    'text-base font-semibold leading-6 text-gray-900 dark:text-gray-100'
  const getMyOrdersHeaderDescriptionClass = () => 'mt-2 text-sm text-gray-700 dark:text-gray-300'
  const getMyOrdersLoadingContainerClass = () => 'mt-8 text-center'
  const getMyOrdersLoadingButtonClass = () =>
    [
      'inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm',
      'shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400',
      'transition ease-in-out duration-150 cursor-not-allowed',
    ].join(' ')
  const getMyOrdersLoadingSpinnerClass = () => getUnifiedLoadingSpinnerClass()
  const getMyOrdersErrorContainerClass = () => 'mt-8'
  const getMyOrdersErrorCardClass = () => 'rounded-md bg-red-50 dark:bg-red-900/20 p-4'
  const getMyOrdersErrorFlexClass = () => 'flex'
  const getMyOrdersErrorIconContainerClass = () => 'flex-shrink-0'
  const getMyOrdersErrorIconClass = () => 'h-5 w-5 text-red-400 dark:text-red-300'
  const getMyOrdersErrorContentClass = () => 'ml-3'
  const getMyOrdersErrorTitleClass = () => 'text-sm font-medium text-red-800 dark:text-red-200'
  const getMyOrdersErrorMessageClass = () => 'mt-2 text-sm text-red-700 dark:text-red-300'
  const getMyOrdersTableContainerClass = () => 'mt-8 flow-root'
  const getMyOrdersTableWrapperClass = () => '-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'
  const getMyOrdersTableInnerClass = () =>
    'inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'
  const getMyOrdersTableClass = () => 'min-w-full divide-y divide-gray-300 dark:divide-gray-700'
  const getMyOrdersTableHeaderClass = () => 'bg-gray-50 dark:bg-gray-800'
  const getMyOrdersTableHeaderCellClass = () => getTableHeaderCellClass()
  const getMyOrdersTableHeaderCellRightClass = () =>
    getTableHeaderCellClass().replace('text-left', 'text-right')
  const getMyOrdersTableBodyClass = () =>
    'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'
  const getMyOrdersTableRowClass = () => 'hover:bg-gray-50 dark:hover:bg-gray-800'
  const getMyOrdersTableCellClass = () =>
    'px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'
  const getMyOrdersTableCellRightClass = () =>
    'px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-100'
  const getMyOrdersTableLinkClass = () =>
    [
      'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md',
      'bg-indigo-50 text-indigo-700 border border-indigo-200',
      'hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1',
      'dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
      'dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300 dark:hover:border-indigo-700',
      'dark:focus:ring-indigo-400 dark:focus:ring-offset-gray-900',
      'transition-all duration-200 ease-in-out transform hover:scale-105',
      'shadow-sm hover:shadow-md',
    ].join(' ')
  const getMyOrdersStatusBadgeClass = (status: string) => getUnifiedStatusBadgeClass(status)

  // MyOrderDetailView specific classes
  const getMyOrderDetailContainerClass = () => 'px-4 sm:px-6 lg:px-8'
  const getMyOrderDetailBackButtonContainerClass = () => 'mb-6'
  const getMyOrderDetailBackButtonClass = () =>
    [
      'inline-flex items-center text-sm font-medium text-gray-500',
      'hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
    ].join(' ')
  const getMyOrderDetailBackButtonIconClass = () => 'mr-2 h-4 w-4'
  const getMyOrderDetailLoadingContainerClass = () => 'text-center'
  const getMyOrderDetailLoadingButtonClass = () =>
    [
      'inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm',
      'shadow rounded-md text-white bg-indigo-500 hover:bg-indigo-400',
      'transition ease-in-out duration-150 cursor-not-allowed',
    ].join(' ')
  const getMyOrderDetailLoadingSpinnerClass = () => getUnifiedLoadingSpinnerClass()
  const getMyOrderDetailErrorContainerClass = () => 'rounded-md bg-red-50 dark:bg-red-900/20 p-4'
  const getMyOrderDetailErrorFlexClass = () => 'flex'
  const getMyOrderDetailErrorIconContainerClass = () => 'flex-shrink-0'
  const getMyOrderDetailErrorIconClass = () => 'h-5 w-5 text-red-400 dark:text-red-300'
  const getMyOrderDetailErrorContentClass = () => 'ml-3'
  const getMyOrderDetailErrorTitleClass = () => 'text-sm font-medium text-red-800 dark:text-red-200'
  const getMyOrderDetailErrorMessageClass = () => 'mt-2 text-sm text-red-700 dark:text-red-300'

  const getMyOrderDetailHeaderClass = () => 'md:flex md:items-center md:justify-between mb-8'
  const getMyOrderDetailHeaderTitleContainerClass = () => 'min-w-0 flex-1'
  const getMyOrderDetailHeaderTitleClass = () =>
    'text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-2xl sm:tracking-tight'
  const getMyOrderDetailHeaderMetaClass = () =>
    'mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6'
  const getMyOrderDetailHeaderMetaItemClass = () =>
    'mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400'
  const getMyOrderDetailHeaderMetaIconClass = () =>
    'mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400 dark:text-gray-500'

  const getMyOrderDetailCardClass = () => 'bg-white dark:bg-gray-800 shadow sm:rounded-lg mb-8'
  const getMyOrderDetailCardHeaderClass = () =>
    'px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700'
  const getMyOrderDetailCardHeaderTitleClass = () =>
    'text-lg leading-6 font-medium text-gray-900 dark:text-white'
  const getMyOrderDetailCardContentClass = () => 'px-4 py-5 sm:p-6'

  const getMyOrderDetailGridClass = () => 'grid grid-cols-1 lg:grid-cols-3 gap-8'
  const getMyOrderDetailMainContentClass = () => 'lg:col-span-2'
  const getMyOrderDetailSidebarClass = () => 'lg:col-span-1'

  const getMyOrderDetailSummaryGridClass = () => 'grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'
  const getMyOrderDetailSummaryItemClass = () =>
    'bg-gray-50 dark:bg-gray-700 px-4 py-5 sm:p-6 rounded-lg'
  const getMyOrderDetailSummaryLabelClass = () =>
    'text-sm font-medium text-gray-500 dark:text-gray-400'
  const getMyOrderDetailSummaryValueClass = () =>
    'mt-1 text-2xl font-semibold text-gray-900 dark:text-white'

  const getMyOrderDetailItemsListClass = () => 'divide-y divide-gray-200 dark:divide-gray-700'
  const getMyOrderDetailItemClass = () => 'py-6 flex'
  const getMyOrderDetailItemImageClass = () =>
    'h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700'
  const getMyOrderDetailItemImageImgClass = () => 'h-full w-full object-cover object-center'
  const getMyOrderDetailItemContentClass = () => 'ml-4 flex flex-1 flex-col'
  const getMyOrderDetailItemTopClass = () =>
    'flex justify-between text-base font-medium text-gray-900 dark:text-white'
  const getMyOrderDetailItemNameClass = () => 'text-base font-medium text-gray-900 dark:text-white'
  const getMyOrderDetailItemPriceClass = () =>
    'ml-4 text-base font-medium text-gray-900 dark:text-white'
  const getMyOrderDetailItemQuantityClass = () => 'mt-1 text-sm text-gray-500 dark:text-gray-400'

  const getMyOrderDetailStatusBadgeClass = (status: string) => getUnifiedStatusBadgeClass(status)

  // OrderDetailView specific classes (Admin view)
  const getOrderDetailContainerClass = () =>
    'min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-6'
  const getOrderDetailLoadingContainerClass = () => 'flex justify-center py-12'
  const getOrderDetailLoadingSpinnerClass = () => getUnifiedLoadingSpinnerClass()
  const getOrderDetailErrorContainerClass = () => 'text-center py-12'
  const getOrderDetailErrorMessageClass = () => 'text-red-600 dark:text-red-400 mb-4'
  const getOrderDetailErrorButtonClass = () =>
    [
      'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md',
      'text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200',
    ].join(' ')

  const getOrderDetailMainContainerClass = () => 'max-w-7xl mx-auto'
  const getOrderDetailHeaderCardClass = () =>
    [
      'bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700',
      'p-6 mb-6 transition-colors duration-200',
    ].join(' ')
  const getOrderDetailHeaderFlexClass = () =>
    'flex flex-col lg:flex-row lg:items-center lg:justify-between'
  const getOrderDetailHeaderContentClass = () => 'flex-1'
  const getOrderDetailHeaderTitleSectionClass = () => 'flex items-center space-x-4'
  const getOrderDetailHeaderTitleClass = () => 'text-2xl font-bold text-gray-900 dark:text-white'
  const getOrderDetailHeaderDateClass = () => 'text-sm text-gray-500 dark:text-gray-400 mt-1'
  const getOrderDetailHeaderBadgeClass = () =>
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
  const getOrderDetailHeaderActionsClass = () => 'mt-4 lg:mt-0 flex items-center space-x-3'
  const getOrderDetailBackButtonClass = () =>
    [
      'inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600',
      'text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700',
      'hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'focus:ring-emerald-500 transition-colors duration-200',
    ].join(' ')

  const getOrderDetailGridClass = () => 'grid grid-cols-1 lg:grid-cols-3 gap-6'
  const getOrderDetailMainSectionClass = () => 'lg:col-span-2 space-y-6'
  const getOrderDetailSidebarClass = () => 'lg:col-span-1 space-y-6'

  const getOrderDetailCardClass = () =>
    [
      'bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700',
      'p-6 mb-6 transition-colors duration-200',
    ].join(' ')
  const getOrderDetailCardHeaderClass = () =>
    'text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center'

  const getOrderDetailCardContentClass = () => 'space-y-4'

  const getOrderDetailItemsListClass = () => 'divide-y divide-gray-200 dark:divide-gray-700'
  const getOrderDetailItemClass = () =>
    'p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
  const getOrderDetailItemImageClass = () => 'flex-shrink-0'
  const getOrderDetailItemImageImgClass = () =>
    'h-20 w-20 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600'
  const getOrderDetailItemContentClass = () => 'flex items-center space-x-4'
  const getOrderDetailItemNameClass = () =>
    'text-lg font-semibold text-gray-900 dark:text-white mb-1'
  const getOrderDetailItemDetailsClass = () =>
    'flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0'
  const getOrderDetailItemPriceClass = () => 'text-right'

  const getOrderDetailSummaryListClass = () => 'bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg'
  const getOrderDetailSummaryItemClass = () => 'flex justify-between items-center'
  const getOrderDetailSummaryLabelClass = () => 'text-sm text-gray-500 dark:text-gray-400'

  const getOrderDetailSummaryTotalClass = () => 'text-right'
  const getOrderDetailSummaryTotalLabelClass = () => 'text-sm text-gray-500 dark:text-gray-400'
  const getOrderDetailSummaryTotalValueClass = () =>
    'text-2xl font-bold text-gray-900 dark:text-white'

  const getOrderDetailCustomerInfoClass = () => 'flex items-start space-x-3'
  const getOrderDetailCustomerLabelClass = () => 'text-gray-900 dark:text-white font-medium'
  const getOrderDetailCustomerValueClass = () => 'text-gray-500 dark:text-gray-400 text-sm'

  // User Management Classes
  const getUserPageHeaderClass = () => 'flex justify-between items-center mb-6'
  const getUserPageTitleClass = () => 'text-2xl font-bold text-gray-900 dark:text-white'
  const getUserAddButtonClass = () => 'px-6 py-2 items-center'
  const getUserAddIconClass = () => 'w-5 h-5 mr-2'
  const getUserFiltersGridClass = () => 'grid grid-cols-1 md:grid-cols-3 gap-4'
  const getUserFiltersActionsClass = () => 'flex items-end'
  const getUserLoadingContainerClass = () => 'text-center py-8'
  const getUserLoadingSpinnerClass = () => getUnifiedLoadingSpinnerClass()
  const getUserLoadingTextClass = () => 'text-gray-600 dark:text-gray-400 mt-2'
  const getUserTableContainerClass = () => 'overflow-x-auto'
  const getUserTableClass = () => 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
  const getUserTableHeaderClass = () => 'bg-gray-50 dark:bg-gray-800'
  const getUserTableHeaderCellClass = () =>
    getTableHeaderCellClass() + ' cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
  const getUserTableHeaderActionsClass = () =>
    'px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
  const getUserTableBodyClass = () =>
    'bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700'
  const getUserTableRowClass = () => 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors'
  const getUserTableCellClass = () => 'px-6 py-4 whitespace-nowrap'
  const getUserNameClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getUserEmailClass = () => 'text-sm text-gray-500 dark:text-gray-400'
  const getUserTableTextClass = () => 'text-sm text-gray-500 dark:text-gray-400'
  const getUserTableActionsClass = () =>
    'px-6 py-4 whitespace-nowrap text-right text-sm font-medium'
  const getUserTableActionsContainerClass = () => 'flex justify-end space-x-2'
  const getUserRoleBadgeClass = () => 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'

  // * Role badge classes with color variants
  const getRoleBadgeClass = (role: string) => {
    const baseClasses = 'inline-flex px-2 py-1 text-xs font-semibold rounded-full'
    switch (role) {
      case 'ADMIN':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
      case 'MANAGER':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
      case 'USER':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
    }
  }

  const getUserPaginationContainerClass = () =>
    'px-6 py-3 border-t border-gray-200 dark:border-gray-700'
  const getUserPaginationClass = () => 'flex items-center justify-between'
  const getUserPaginationTextClass = () => 'text-sm text-gray-700 dark:text-gray-300'
  const getUserPaginationButtonsClass = () => 'flex space-x-2'
  const getUserPaginationButtonClass = () =>
    'px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800'
  const getUserPaginationPageClass = () => 'px-3 py-1 text-sm text-gray-700 dark:text-gray-300'
  const getUserEmptyStateContainerClass = () => 'text-center py-12'
  const getUserEmptyStateIconClass = () => 'w-16 h-16 text-gray-400 mx-auto mb-4'
  const getUserEmptyStateTitleClass = () => 'text-lg font-medium text-gray-900 dark:text-white mb-2'
  const getUserEmptyStateDescriptionClass = () => 'text-gray-600 dark:text-gray-400 mb-4'
  const getUserEmptyStateButtonClass = () => 'px-6 py-2'

  // Profile View Classes (removing duplicate)
  const getProfileFormSpaceClass = () => 'space-y-6'
  const getProfileFieldContainerClass = () => 'mt-2'
  const getProfileDarkModeContainerClass = () => 'flex items-center justify-between'
  const getProfileDarkModeDescriptionClass = () => 'text-sm text-gray-600 dark:text-gray-400'
  const getProfileToggleClass = (isActive: boolean, isDisabled: boolean) => {
    const baseClass =
      'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
    const activeClass = isActive ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
    const disabledClass = isDisabled ? ' opacity-50 cursor-not-allowed' : ''
    return `${baseClass} ${activeClass}${disabledClass}`
  }
  const getProfileToggleKnobClass = (isActive: boolean) => {
    const baseClass =
      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
    const translateClass = isActive ? ' translate-x-5' : ' translate-x-0'
    return `${baseClass}${translateClass}`
  }
  const getProfileSpinnerClass = () => getUnifiedLoadingSpinnerClass()
  const getProfileSpinnerCircleClass = () => 'opacity-25'
  const getProfileSpinnerPathClass = () => 'opacity-75'
  const getProfilePasswordRequirementsClass = () => 'bg-gray-50 dark:bg-gray-800 rounded-lg p-4'
  const getProfilePasswordRequirementsTitleClass = () =>
    'text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'
  const getProfilePasswordRequirementsListClass = () =>
    'text-sm text-gray-600 dark:text-gray-400 space-y-1'
  const getProfilePasswordRequirementItemClass = () => 'flex items-center'
  const getProfilePasswordRequirementIconClass = (isValid: boolean) => {
    const baseClass = 'w-4 h-4 mr-2'
    const colorClass = isValid ? ' text-green-500' : ' text-gray-400'
    return `${baseClass}${colorClass}`
  }

  // Modal Form Button Classes (UserModal specific)
  const getUserModalButtonContainerClass = () => 'flex space-x-3 pt-4'
  const getUserModalSubmitButtonClass = () => 'flex-1 px-4 py-2'
  const getUserModalSpinnerContainerClass = () => 'mr-2'
  const getUserModalSpinnerClass = () => 'spinner'

  // Warning Icon Classes
  const getWarningIconClass = () => 'w-4 h-4 mr-2 flex-shrink-0'

  // Analytics classes
  const getFlexJustifyBetweenClass = () => 'flex justify-between items-center mb-6'
  const getProductFormPaddingClass = () => 'p-6'
  const getProductFormTitleSpacingClass = () => 'mb-6'
  const getProductFormSpacingClass = () => 'space-y-6'
  const getProductFormButtonContainerClass = () => 'flex items-center justify-between pt-6'
  const getProductFormLabelClass = () => 'mb-2'

  const getAnalyticsHeaderClass = () => 'text-3xl font-bold text-gray-900 dark:text-white mb-8'
  const getDashboardGridClass = () => 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'
  const getDashboardCardPaddingClass = () => 'p-6'
  const getDashboardCardContentClass = () => 'flex items-center'
  const getDashboardCardIconContainerClass = () => 'flex-shrink-0'
  const getDashboardCardTextContainerClass = () => 'ml-4'
  const getDashboardCardTitleClass = () => 'text-sm font-medium text-gray-600 dark:text-gray-400'
  const getDashboardCardValueClass = () => 'text-2xl font-bold text-gray-900 dark:text-white'
  const getDashboardCardSubtextClass = () => 'text-xs text-gray-500 dark:text-gray-400'
  const getDashboardCardSubtextValueClass = () =>
    'text-xs font-bold text-gray-500 dark:text-gray-400'

  const getAnalyticsGridClass = () => 'grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'
  const getAnalyticsSectionTitleClass = () =>
    'text-lg font-semibold text-gray-900 dark:text-white mb-4'
  const getAnalyticsStatusListClass = () => 'space-y-3'
  const getAnalyticsStatusItemClass = () => 'flex items-center justify-between'
  const getAnalyticsStatusIndicatorClass = () => 'flex items-center'
  const getAnalyticsStatusDotClass = () => 'w-3 h-3 rounded-full mr-3'
  const getAnalyticsStatusLabelClass = () =>
    'text-sm font-medium text-gray-900 dark:text-white capitalize'
  const getAnalyticsStatusCountClass = () => 'text-sm text-gray-600 dark:text-gray-400'

  const getTopProductsListClass = () => 'space-y-3'
  const getTopProductItemClass = () => 'flex items-center justify-between'
  const getTopProductRankingClass = () => 'flex items-center'
  const getTopProductRankBadgeClass = () =>
    'w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-medium mr-3'
  const getTopProductInfoClass = () => ''
  const getTopProductNameClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getTopProductPriceClass = () => 'text-xs text-gray-500 dark:text-gray-400'
  const getTopProductSalesClass = () => 'text-sm text-gray-600 dark:text-gray-400'

  const getAnalyticsTableContainerClass = () => 'overflow-x-auto'
  const getAnalyticsTableClass = () => 'min-w-full divide-y divide-gray-200 dark:divide-gray-700'
  const getAnalyticsTableHeaderCellClass = () =>
    'px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
  const getAnalyticsTableHeaderCellCenterClass = () =>
    'px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
  const getAnalyticsTableBodyClass = () => 'divide-y divide-gray-200 dark:divide-gray-700'
  const getAnalyticsTableRowClass = () => 'hover:bg-gray-50 dark:hover:bg-gray-800'
  const getAnalyticsTableCellClass = () =>
    'px-4 py-3 text-sm font-medium text-gray-900 dark:text-white'
  const getAnalyticsTableCellDataClass = () => 'px-4 py-3 text-sm text-gray-600 dark:text-gray-400'
  const getAnalyticsTableCellCenterClass = () =>
    'px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-400'

  const getAnalyticsToggleContainerClass = () => 'flex space-x-4 mb-6'
  const getAnalyticsToggleButtonClass = () => 'px-4 py-2 rounded-xl transition-colors'
  const getAnalyticsToggleActiveClass = () => 'bg-blue-600 text-white'
  const getAnalyticsToggleInactiveClass = () =>
    'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'

  const getAnalyticsStatsGridClass = () => 'grid grid-cols-1 md:grid-cols-3 gap-4'
  const getAnalyticsStatItemClass = () => 'text-center'
  const getAnalyticsStatLabelClass = () => 'text-sm text-gray-600 dark:text-gray-400'
  const getAnalyticsStatValueClass = () => 'text-xl font-bold '
  const getAnalyticsStatSubtextClass = () => 'text-sm text-gray-500 dark:text-gray-400'

  const getAnalyticsNoDataClass = () => 'text-center py-8 text-gray-500 dark:text-gray-400'
  const getAnalyticsDividerClass = () => 'border-t border-gray-200 dark:border-gray-700'

  const getAnalyticsCustomerCardClass = () =>
    'flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg'
  const getAnalyticsCustomerInfoClass = () => 'flex-1'
  const getAnalyticsCustomerNameClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getAnalyticsCustomerEmailClass = () => 'text-xs text-gray-500 dark:text-gray-400'
  const getAnalyticsCustomerStatsClass = () => 'text-right ml-2'
  const getAnalyticsCustomerSpentClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getAnalyticsCustomerOrdersClass = () => 'text-xs text-gray-500 dark:text-gray-400'

  const getInventoryStatsGridClass = () => 'grid grid-cols-1 md:grid-cols-4 gap-4'
  const getAnalyticsCategoryItemClass = () =>
    'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
  const getAnalyticsCategoryInfoClass = () => ''
  const getAnalyticsCategoryNameClass = () => 'text-sm font-medium text-gray-900 dark:text-white'
  const getAnalyticsCategoryCountClass = () => 'text-xs text-gray-500 dark:text-gray-400'
  const getAnalyticsCategoryStatsClass = () => 'text-right'
  const getAnalyticsCategoryStockClass = () => 'text-sm font-medium text-gray-900 dark:text-white'

  // * Status color utility function
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-400'
      case 'processing':
        return 'bg-blue-400'
      case 'shipped':
        return 'bg-purple-400'
      case 'delivered':
        return 'bg-green-400'
      case 'cancelled':
        return 'bg-red-400'
      default:
        return 'bg-gray-400'
    }
  }

  return {
    // ? Form Input and Validation Classes
    getInputClass,
    getPrimaryButtonClass,
    getDisabledButtonClass,
    getLabelClass,
    getErrorMessageClass,
    getWarningMessageClass,
    getWarningTextClass,
    getFormCardClass,
    getSelectClass,
    getPasswordHintClass,
    getFormSpaceClass,
    getFormFieldSpaceClass,
    getFormButtonContainerClass,

    // ? Button Classes
    getActionButtonClass,
    getCancelButtonClass,
    getSuccessButtonClass,
    getConfirmButtonClass,
    getSecondaryButtonClass,

    // ? Layout and Container Classes
    getAppContainerClass,
    getMainLayoutClass,
    getMainContentClass,
    getContentAreaClass,
    getContentPaddingClass,
    getPageContainerClass,
    getPageHeaderClass,
    getPageHeaderContainerClass,
    getPageHeaderActionsClass,
    getPageTitleClass,
    getPageDescriptionClass,
    getCardClass,
    getCardHeaderClass,

    // ? Navigation and Sidebar Classes
    getNavLinkClass,
    getNavIconClass,
    getSidebarClass,
    getSidebarOverlayClass,
    getSidebarCloseButtonClass,
    getSidebarBrandClass,
    getSidebarTitleClass,
    getSidebarSectionTitleClass,
    getSidebarHeaderClass,
    getSidebarMobileContainerClass,
    getSidebarMobileBackdropClass,
    getSidebarMobileContentClass,
    getSidebarMobileCloseContainerClass,
    getSidebarDesktopContainerClass,
    getNavigationListClass,
    getNavigationSubListClass,
    getNavigationSectionSpaceClass,
    getNavigationBottomSectionClass,
    getNavigationActionsClass,

    // ? Header and Topbar Classes
    getTopbarClass,
    getMobileMenuButtonClass,
    getHeaderButtonIconClass,

    // ? Authentication Page Classes
    getAuthPageContainerClass,
    getAuthHeaderContainerClass,
    getAuthTitleClass,
    getAuthSubtitleClass,
    getAuthFormContainerClass,
    getAuthLinkClass,
    getAuthBackgroundOverlayClass,
    getAuthDecorationTopClass,
    getAuthDecorationBottomClass,

    // ? Table Classes
    getTableContainerClass,
    getTableClass,
    getTableHeaderClass,
    getTableHeaderCellClass,
    getTableHeaderFlexClass,
    getTableHeaderSortableClass,
    getTableHeaderSortContainerClass,
    getTableBodyClass,
    getTableRowClass,
    getTableCellClass,
    getTableActionsHeaderClass,
    getTableSortIconClass,

    // ? Modal and Dialog Classes
    getModalOverlayClass,
    getModalBackdropClass,
    getModalBackgroundClass,
    getModalPanelClass,
    getModalIconContainerClass,
    getModalTitleClass,
    getModalDescriptionClass,
    getModalActionsClass,
    getModalCancelButtonClass,
    getCustomModalOverlayClass,
    getCustomModalContainerClass,
    getCustomModalHeaderClass,
    getCustomModalBodyClass,

    // ? Loading and Spinner Classes
    getLoadingContainerClass,
    getSpinnerClass,
    getSpinnerElementClass,
    getInlineSpinnerClass,
    getUnifiedLoadingSpinnerClass,

    // ? Status and Badge Classes
    getStatusBadgeClass,
    getUnifiedStatusBadgeClass,
    getWarningBadgeClass,
    getWarningBadgeTextClass,

    // ? Icon Classes
    getSmallIconClass,
    getStandardIconClass,
    getMenuIconClass,
    getIconClass,
    getSortIconClass,
    getRefreshIconClass,
    getWarningIconClass,

    // ? Text Utility Classes
    getTextCenterClass,
    getTextLargeClass,
    getTextSmallMutedClass,
    getTextMutedClass,
    getWelcomeTextClass,
    getUserNameTextClass,
    getProfileNameTextClass,

    // ? Layout Utility Classes
    getStatsGridClass,
    getFlexItemsCenterClass,
    getFlexJustifyBetweenClass,
    getSeparatorClass,
    getScreenReaderClass,

    // ? Stat and Dashboard Classes
    getStatNumberClass,
    getStatLabelClass,
    getDashboardStatsGridClass,
    getDashboardChartsGridClass,
    getDashboardStatIconClass,
    getDashboardGridClass,
    getDashboardCardPaddingClass,
    getDashboardCardContentClass,
    getDashboardCardIconContainerClass,
    getDashboardCardTextContainerClass,
    getDashboardCardTitleClass,
    getDashboardCardValueClass,
    getDashboardCardSubtextClass,
    getDashboardCardSubtextValueClass,

    // ? Profile and User Management Classes
    getProfileButtonClass,
    getProfileAvatarClass,
    getProfileDropdownClass,
    getProfileFormSpaceClass,
    getProfileFieldContainerClass,
    getProfileDarkModeContainerClass,
    getProfileDarkModeDescriptionClass,
    getProfileToggleClass,
    getProfileToggleKnobClass,
    getProfileSpinnerClass,
    getProfileSpinnerCircleClass,
    getProfileSpinnerPathClass,
    getProfilePasswordRequirementsClass,
    getProfilePasswordRequirementsTitleClass,
    getProfilePasswordRequirementsListClass,
    getProfilePasswordRequirementItemClass,
    getProfilePasswordRequirementIconClass,
    getDropdownItemClass,

    // ? User Management (Admin) Classes
    getUserPageHeaderClass,
    getUserPageTitleClass,
    getUserAddButtonClass,
    getUserAddIconClass,
    getUserFiltersGridClass,
    getUserFiltersActionsClass,
    getUserLoadingContainerClass,
    getUserLoadingSpinnerClass,
    getUserLoadingTextClass,
    getUserTableContainerClass,
    getUserTableClass,
    getUserTableHeaderClass,
    getUserTableHeaderCellClass,
    getUserTableHeaderActionsClass,
    getUserTableBodyClass,
    getUserTableRowClass,
    getUserTableCellClass,
    getUserNameClass,
    getUserEmailClass,
    getUserTableTextClass,
    getUserTableActionsClass,
    getUserTableActionsContainerClass,
    getUserRoleBadgeClass,
    getRoleBadgeClass,
    getUserPaginationContainerClass,
    getUserPaginationClass,
    getUserPaginationTextClass,
    getUserPaginationButtonsClass,
    getUserPaginationButtonClass,
    getUserPaginationPageClass,
    getUserEmptyStateContainerClass,
    getUserEmptyStateIconClass,
    getUserEmptyStateTitleClass,
    getUserEmptyStateDescriptionClass,
    getUserEmptyStateButtonClass,
    getUserModalButtonContainerClass,
    getUserModalSubmitButtonClass,
    getUserModalSpinnerContainerClass,
    getUserModalSpinnerClass,

    // ? Product Classes
    getProductImageClass,
    getProductImagePlaceholderClass,
    getProductNameClass,
    getProductDescriptionClass,
    getProductPriceClass,
    getProductFormPaddingClass,
    getProductFormTitleSpacingClass,
    getProductFormSpacingClass,
    getProductFormButtonContainerClass,
    getProductFormLabelClass,

    // ? Category Classes
    getCategoryGridClass,
    getCategoryCardClass,
    getCategoryImageContainerClass,
    getCategoryImageClass,
    getCategoryImagePlaceholderClass,
    getCategoryImagePlaceholderIconClass,
    getCategoryActionOverlayClass,
    getCategoryActionButtonClass,
    getCategoryActionIconClass,
    getCategoryContentClass,
    getCategoryTitleClass,
    getCategoryDescriptionClass,
    getCategoryStatsClass,

    // ? Filter and Search Classes
    getFilterContainerClass,
    getFilterGridClass,
    getFilterHeaderClass,
    getFilterFormFieldClass,
    getFilterButtonContainerClass,
    getOrdersFilterGridClass,

    // ? Pagination Classes
    getPaginationContainerClass,
    getPaginationButtonClass,

    // ? List and Item Classes
    getListDividerClass,
    getListItemClass,
    getListItemContentClass,
    getListItemMainClass,
    getListItemTitleClass,
    getListItemSubtitleClass,
    getListItemActionsClass,

    // ? Image and Media Classes
    getImagePreviewContainerClass,
    getImagePreviewClass,
    getImagePreviewRemoveButtonClass,
    getImagePreviewRemoveIconClass,

    // ? Empty State Classes
    getEmptyStateClass,
    getEmptyStateIconClass,
    getEmptyStateTitleClass,
    getEmptyStateDescriptionClass,

    // ? Demo and Onboarding Classes
    getDemoButtonClass,
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

    // ? Order Management (Admin) Classes
    getOrdersTableContainerClass,
    getOrdersTableClass,
    getOrdersTableHeaderClass,
    getOrdersTableHeaderCellClass,
    getOrdersTableHeaderCellActionsClass,
    getOrdersTableBodyClass,
    getOrdersTableRowClass,
    getOrdersTableCellClass,
    getOrdersTableSkeletonCellClass,
    getOrdersTableSkeletonClass,
    getOrdersTableEmptyCellClass,
    getOrdersTableActionsClass,
    getOrdersTableActionsContainerClass,
    getOrderNumberClass,
    getCustomerNameClass,
    getCustomerEmailClass,
    getOrderDateClass,
    getOrderTotalClass,
    getOrderItemsClass,
    getOrderViewLinkClass,
    getOrderStatusSelectClass,

    // ? Order Detail (Admin) Classes
    getOrderDetailContainerClass,
    getOrderDetailLoadingContainerClass,
    getOrderDetailLoadingSpinnerClass,
    getOrderDetailErrorContainerClass,
    getOrderDetailErrorMessageClass,
    getOrderDetailErrorButtonClass,
    getOrderDetailMainContainerClass,
    getOrderDetailHeaderCardClass,
    getOrderDetailHeaderFlexClass,
    getOrderDetailHeaderContentClass,
    getOrderDetailHeaderTitleSectionClass,
    getOrderDetailHeaderTitleClass,
    getOrderDetailHeaderDateClass,
    getOrderDetailHeaderBadgeClass,
    getOrderDetailHeaderActionsClass,
    getOrderDetailBackButtonClass,
    getOrderDetailGridClass,
    getOrderDetailMainSectionClass,
    getOrderDetailSidebarClass,
    getOrderDetailCardClass,
    getOrderDetailCardHeaderClass,
    getOrderDetailCardContentClass,
    getOrderDetailItemsListClass,
    getOrderDetailItemClass,
    getOrderDetailItemImageClass,
    getOrderDetailItemImageImgClass,
    getOrderDetailItemContentClass,
    getOrderDetailItemNameClass,
    getOrderDetailItemDetailsClass,
    getOrderDetailItemPriceClass,
    getOrderDetailSummaryListClass,
    getOrderDetailSummaryItemClass,
    getOrderDetailSummaryLabelClass,
    getOrderDetailSummaryTotalClass,
    getOrderDetailSummaryTotalLabelClass,
    getOrderDetailSummaryTotalValueClass,
    getOrderDetailCustomerInfoClass,
    getOrderDetailCustomerLabelClass,
    getOrderDetailCustomerValueClass,

    // ? My Orders (Customer) Classes
    getMyOrdersContainerClass,
    getMyOrdersHeaderContainerClass,
    getMyOrdersHeaderContentClass,
    getMyOrdersHeaderTitleClass,
    getMyOrdersHeaderDescriptionClass,
    getMyOrdersLoadingContainerClass,
    getMyOrdersLoadingButtonClass,
    getMyOrdersLoadingSpinnerClass,
    getMyOrdersErrorContainerClass,
    getMyOrdersErrorCardClass,
    getMyOrdersErrorFlexClass,
    getMyOrdersErrorIconContainerClass,
    getMyOrdersErrorIconClass,
    getMyOrdersErrorContentClass,
    getMyOrdersErrorTitleClass,
    getMyOrdersErrorMessageClass,
    getMyOrdersTableContainerClass,
    getMyOrdersTableWrapperClass,
    getMyOrdersTableInnerClass,
    getMyOrdersTableClass,
    getMyOrdersTableHeaderClass,
    getMyOrdersTableHeaderCellClass,
    getMyOrdersTableHeaderCellRightClass,
    getMyOrdersTableBodyClass,
    getMyOrdersTableRowClass,
    getMyOrdersTableCellClass,
    getMyOrdersTableCellRightClass,
    getMyOrdersTableLinkClass,
    getMyOrdersStatusBadgeClass,

    // ? My Order Detail (Customer) Classes
    getMyOrderDetailContainerClass,
    getMyOrderDetailBackButtonContainerClass,
    getMyOrderDetailBackButtonClass,
    getMyOrderDetailBackButtonIconClass,
    getMyOrderDetailLoadingContainerClass,
    getMyOrderDetailLoadingButtonClass,
    getMyOrderDetailLoadingSpinnerClass,
    getMyOrderDetailErrorContainerClass,
    getMyOrderDetailErrorFlexClass,
    getMyOrderDetailErrorIconContainerClass,
    getMyOrderDetailErrorIconClass,
    getMyOrderDetailErrorContentClass,
    getMyOrderDetailErrorTitleClass,
    getMyOrderDetailErrorMessageClass,
    getMyOrderDetailHeaderClass,
    getMyOrderDetailHeaderTitleContainerClass,
    getMyOrderDetailHeaderTitleClass,
    getMyOrderDetailHeaderMetaClass,
    getMyOrderDetailHeaderMetaItemClass,
    getMyOrderDetailHeaderMetaIconClass,
    getMyOrderDetailCardClass,
    getMyOrderDetailCardHeaderClass,
    getMyOrderDetailCardHeaderTitleClass,
    getMyOrderDetailCardContentClass,
    getMyOrderDetailGridClass,
    getMyOrderDetailMainContentClass,
    getMyOrderDetailSidebarClass,
    getMyOrderDetailSummaryGridClass,
    getMyOrderDetailSummaryItemClass,
    getMyOrderDetailSummaryLabelClass,
    getMyOrderDetailSummaryValueClass,
    getMyOrderDetailItemsListClass,
    getMyOrderDetailItemClass,
    getMyOrderDetailItemImageClass,
    getMyOrderDetailItemImageImgClass,
    getMyOrderDetailItemContentClass,
    getMyOrderDetailItemTopClass,
    getMyOrderDetailItemNameClass,
    getMyOrderDetailItemPriceClass,
    getMyOrderDetailItemQuantityClass,
    getMyOrderDetailStatusBadgeClass,

    // ? Analytics and Reporting Classes
    getAnalyticsHeaderClass,
    getAnalyticsGridClass,
    getAnalyticsSectionTitleClass,
    getAnalyticsStatusListClass,
    getAnalyticsStatusItemClass,
    getAnalyticsStatusIndicatorClass,
    getAnalyticsStatusDotClass,
    getAnalyticsStatusLabelClass,
    getAnalyticsStatusCountClass,
    getAnalyticsNoDataClass,
    getAnalyticsDividerClass,
    getAnalyticsToggleContainerClass,
    getAnalyticsToggleButtonClass,
    getAnalyticsToggleActiveClass,
    getAnalyticsToggleInactiveClass,
    getAnalyticsStatsGridClass,
    getAnalyticsStatItemClass,
    getAnalyticsStatLabelClass,
    getAnalyticsStatValueClass,
    getAnalyticsStatSubtextClass,
    getAnalyticsTableContainerClass,
    getAnalyticsTableClass,
    getAnalyticsTableHeaderCellClass,
    getAnalyticsTableHeaderCellCenterClass,
    getAnalyticsTableBodyClass,
    getAnalyticsTableRowClass,
    getAnalyticsTableCellClass,
    getAnalyticsTableCellDataClass,
    getAnalyticsTableCellCenterClass,
    getAnalyticsCustomerCardClass,
    getAnalyticsCustomerInfoClass,
    getAnalyticsCustomerNameClass,
    getAnalyticsCustomerEmailClass,
    getAnalyticsCustomerStatsClass,
    getAnalyticsCustomerSpentClass,
    getAnalyticsCustomerOrdersClass,
    getTopProductsListClass,
    getTopProductItemClass,
    getTopProductRankingClass,
    getTopProductRankBadgeClass,
    getTopProductInfoClass,
    getTopProductNameClass,
    getTopProductPriceClass,
    getTopProductSalesClass,
    getInventoryStatsGridClass,
    getAnalyticsCategoryItemClass,
    getAnalyticsCategoryInfoClass,
    getAnalyticsCategoryNameClass,
    getAnalyticsCategoryCountClass,
    getAnalyticsCategoryStatsClass,
    getAnalyticsCategoryStockClass,

    // ? Link Classes
    getLinkClass,

    // ? Status Color Classes
    getStatusColor,
  }
}
