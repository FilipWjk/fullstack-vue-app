<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      :class="getSidebarMobileContainerClass()"
      role="dialog"
      aria-modal="true"
    >
      <!-- Backdrop -->
      <div :class="getSidebarOverlayClass()" @click="$emit('close')"></div>

      <div :class="getSidebarMobileBackdropClass()">
        <!-- Mobile sidebar -->
        <div :class="getSidebarMobileContentClass()">
          <!-- Close button -->
          <div :class="getSidebarMobileCloseContainerClass()">
            <button type="button" :class="getSidebarCloseButtonClass()" @click="$emit('close')">
              <span :class="getScreenReaderClass()">Close sidebar</span>
              <svg
                :class="getIconClass('large', 'white')"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Mobile sidebar content -->
          <div :class="getSidebarClass()">
            <!-- Logo/Brand Section -->
            <div :class="getSidebarHeaderClass()">
              <div :class="getSidebarBrandClass()">
                <svg
                  :class="getIconClass('standard', 'white')"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 :class="getSidebarTitleClass()">E-Commerce Panel</h1>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex flex-1 flex-col">
              <ul role="list" :class="getNavigationListClass()">
                <li>
                  <ul role="list" :class="getNavigationSubListClass()">
                    <li v-for="item in navigation" :key="item.name">
                      <router-link
                        :to="item.href"
                        @click="$emit('close')"
                        :class="getNavLinkClass(isActiveRoute(item.href))"
                      >
                        <component
                          :is="item.icon"
                          :class="getNavIconClass(isActiveRoute(item.href))"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </router-link>
                    </li>
                  </ul>
                </li>

                <!-- Admin only section -->
                <li v-if="authStore.canManageUsers">
                  <div :class="getSidebarSectionTitleClass()">Admin Settings</div>
                  <ul role="list" :class="getNavigationSectionSpaceClass()">
                    <li v-for="item in adminNavigation" :key="item.name">
                      <router-link
                        :to="item.href"
                        @click="$emit('close')"
                        :class="getNavLinkClass(isActiveRoute(item.href))"
                      >
                        <component
                          :is="item.icon"
                          :class="getNavIconClass(isActiveRoute(item.href))"
                          aria-hidden="true"
                        />
                        {{ item.name }}
                      </router-link>
                    </li>
                  </ul>
                </li>
              </ul>

              <!-- Bottom Section: User Profile & Settings -->
              <div :class="getNavigationBottomSectionClass()">
                <!-- Profile & Logout Actions -->
                <div :class="getNavigationActionsClass()">
                  <router-link
                    to="/profile"
                    @click="$emit('close')"
                    :class="getSecondaryButtonClass()"
                  >
                    <UserIcon class="w-4 h-4 mr-2" />
                    Profile Settings
                  </router-link>

                  <button @click="handleLogout" :class="getSecondaryButtonClass('danger')">
                    <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop sidebar -->
    <div :class="getSidebarDesktopContainerClass()">
      <div :class="getSidebarClass()">
        <!-- Logo/Brand Section -->
        <div :class="getSidebarHeaderClass()">
          <div :class="getSidebarBrandClass()">
            <svg :class="getIconClass('standard', 'white')" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 :class="getSidebarTitleClass()">E-Commerce Panel</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-1 flex-col">
          <ul role="list" :class="getNavigationListClass()">
            <li>
              <ul role="list" :class="getNavigationSubListClass()">
                <li v-for="item in navigation" :key="item.name">
                  <router-link :to="item.href" :class="getNavLinkClass(isActiveRoute(item.href))">
                    <component
                      :is="item.icon"
                      :class="getNavIconClass(isActiveRoute(item.href))"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Admin only section -->
            <li v-if="authStore.canManageUsers">
              <div :class="getSidebarSectionTitleClass()">Administration</div>
              <ul role="list" class="-mx-2 mt-2 space-y-1">
                <li v-for="item in adminNavigation" :key="item.name">
                  <router-link :to="item.href" :class="getNavLinkClass(isActiveRoute(item.href))">
                    <component
                      :is="item.icon"
                      :class="getNavIconClass(isActiveRoute(item.href))"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </router-link>
                </li>
              </ul>
            </li>
          </ul>

          <!-- Bottom Section: User Profile & Settings -->
          <div class="mt-4 space-y-4">
            <!-- Profile & Logout Actions -->
            <div class="space-y-1">
              <router-link to="/profile" :class="getSecondaryButtonClass()">
                <UserIcon class="w-4 h-4 mr-2" />
                Profile Settings
              </router-link>

              <button @click="handleLogout" :class="getSecondaryButtonClass('danger')">
                <ArrowRightOnRectangleIcon class="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useUIClasses } from '../composables/useUIClasses'
import {
  ChartBarIcon,
  HomeIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  TagIcon,
  UsersIcon,
  ChartPieIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'AppSidebar',
  components: {
    ChartBarIcon,
    HomeIcon,
    ShoppingBagIcon,
    ClipboardDocumentListIcon,
    TagIcon,
    UsersIcon,
    ChartPieIcon,
    UserIcon,
    ArrowRightOnRectangleIcon,
  },
  props: {
    sidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['close'],
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const {
      getNavLinkClass,
      getNavIconClass,
      getSidebarClass,
      getSecondaryButtonClass,
      getSidebarOverlayClass,
      getSidebarCloseButtonClass,
      getSidebarBrandClass,
      getSidebarTitleClass,
      getSidebarSectionTitleClass,
      getIconClass,
      getScreenReaderClass,
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
      getSidebarHeaderClass,
    } = useUIClasses()

    // * Role-based navigation
    type NavigationItem = {
      name: string
      href: string
      icon: typeof HomeIcon
    }

    const baseNavigation: NavigationItem[] = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    ]

    const userNavigation: NavigationItem[] = [
      { name: 'My Orders', href: '/my-orders', icon: ClipboardDocumentListIcon },
    ]

    const managerNavigation: NavigationItem[] = [
      { name: 'Products', href: '/products', icon: ShoppingBagIcon },
      { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    ]

    const adminNavigation: NavigationItem[] = [
      { name: 'Categories', href: '/categories', icon: TagIcon },
      { name: 'Users', href: '/users', icon: UsersIcon },
    ]

    // * Compute navigation based on user role
    const navigation = computed(() => {
      const nav = []

      // * Users (only USER role) have no main navigation - they use Profile Settings
      if (authStore.isUser && !authStore.canManageProducts) {
        nav.push(...userNavigation)
      }

      // * Managers and Admins see dashboard and business operations
      if (authStore.canManageProducts) {
        nav.push(...baseNavigation, ...managerNavigation)
      }

      return nav
    })

    const isActiveRoute = (href: string) => {
      return (
        router.currentRoute.value.path === href ||
        (router.currentRoute.value.path.startsWith(href) && href !== '/dashboard')
      )
    }

    const handleLogout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    return {
      authStore,
      router,
      getNavLinkClass,
      getNavIconClass,
      getSidebarClass,
      getSecondaryButtonClass,
      getSidebarOverlayClass,
      getSidebarCloseButtonClass,
      getSidebarBrandClass,
      getSidebarTitleClass,
      getSidebarSectionTitleClass,
      getIconClass,
      getScreenReaderClass,
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
      getSidebarHeaderClass,
      navigation,
      adminNavigation,
      isActiveRoute,
      handleLogout,
    }
  },
})
</script>
