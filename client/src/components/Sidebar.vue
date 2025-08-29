<template>
  <div>
    <!-- Mobile sidebar overlay -->
    <div v-if="sidebarOpen" class="relative z-50 lg:hidden" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div
        class="fixed inset-0 bg-gray-900/80 transition-opacity duration-300"
        @click="$emit('close')"
      ></div>

      <div class="fixed inset-0 flex">
        <!-- Mobile sidebar -->
        <div
          class="relative mr-16 flex w-full max-w-xs flex-1 transform transition-transform duration-300"
        >
          <!-- Close button -->
          <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
            <button
              type="button"
              class="-m-2.5 p-2.5 text-white hover:text-gray-300 transition-colors duration-200"
              @click="$emit('close')"
            >
              <span class="sr-only">Close sidebar</span>
              <svg
                class="h-6 w-6"
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
            <div class="flex h-16 shrink-0 items-center space-x-3">
              <div
                class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
              >
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h1 class="text-xl font-bold text-gray-900 dark:text-white">E-Commerce Panel</h1>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="flex flex-1 flex-col">
              <ul role="list" class="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" class="-mx-2 space-y-1">
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
                <li v-if="authStore.isAdmin">
                  <div
                    class="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wider"
                  >
                    Administration
                  </div>
                  <ul role="list" class="-mx-2 mt-2 space-y-1">
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
              <div class="mt-4 space-y-4">
                <!-- Profile & Logout Actions -->
                <div class="space-y-1">
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
    <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div :class="getSidebarClass()">
        <!-- Logo/Brand Section -->
        <div class="flex h-16 shrink-0 items-center space-x-3">
          <div
            class="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center"
          >
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">E-Commerce Panel</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-1 flex-col">
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
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
            <li v-if="authStore.isAdmin">
              <div
                class="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wider"
              >
                Administration
              </div>
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

<script setup lang="ts">
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

defineOptions({
  name: 'AppSidebar',
})

interface Props {
  sidebarOpen: boolean
}

defineProps<Props>()

defineEmits<{
  close: []
}>()

const authStore = useAuthStore()
const router = useRouter()
const { getNavLinkClass, getNavIconClass, getSidebarClass, getSecondaryButtonClass } =
  useUIClasses()

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Products', href: '/products', icon: ShoppingBagIcon },
  { name: 'Orders', href: '/orders', icon: ClipboardDocumentListIcon },
  { name: 'Categories', href: '/categories', icon: TagIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
]

const adminNavigation = [
  { name: 'Users', href: '/users', icon: UsersIcon },
  { name: 'Reports', href: '/analytics', icon: ChartPieIcon },
]

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
</script>
