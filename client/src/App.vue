<template>
  <div id="app" :class="getAppContainerClass()">
    <!-- Show layout only if authenticated -->
    <div v-if="authStore.isAuthenticated" :class="getMainLayoutClass()">
      <!-- Sidebar -->
      <Sidebar :sidebarOpen="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Main content -->
      <div :class="getContentAreaClass()">
        <!-- Top header -->
        <div :class="getTopbarClass()">
          <button
            type="button"
            :class="getMobileMenuButtonClass()"
            @click="sidebarOpen = !sidebarOpen"
          >
            <span :class="getScreenReaderClass()">Open sidebar</span>
            <Bars3Icon :class="getMenuIconClass()" aria-hidden="true" />
          </button>

          <!-- Separator -->
          <div :class="getSeparatorClass()" aria-hidden="true" />

          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div class="relative flex flex-1">
              <!-- Search can go here -->
              <div class="flex items-center">
                <div :class="getWelcomeTextClass()">Welcome back, {{ authStore.user?.name }}!</div>
              </div>
            </div>
            <div class="flex items-center gap-x-4 lg:gap-x-6">
              <!-- Profile dropdown -->
              <Menu as="div" class="relative">
                <MenuButton :class="getProfileButtonClass()">
                  <span :class="getScreenReaderClass()">Open user menu</span>
                  <div :class="getProfileAvatarClass()">
                    <span :class="getUserNameTextClass()">
                      {{ authStore.user?.name?.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <span class="hidden lg:flex lg:items-center">
                    <span :class="getProfileNameTextClass()">{{ authStore.user?.name }}</span>
                    <ChevronDownIcon :class="getStandardIconClass()" aria-hidden="true" />
                  </span>
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems :class="getProfileDropdownClass()">
                    <MenuItem v-slot="{ active }" as="div" class="mx-2">
                      <button @click="navigateToProfile" :class="getDropdownItemClass(active)">
                        <UserIcon :class="getSmallIconClass()" />
                        Your profile
                      </button>
                    </MenuItem>
                    <MenuItem v-slot="{ active }" as="div" class="mx-2">
                      <button @click="handleLogout" :class="getDropdownItemClass(active, 'danger')">
                        <ArrowRightOnRectangleIcon :class="getSmallIconClass()" />
                        Sign out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <!-- Page content -->
        <main :class="getMainContentClass()">
          <div :class="getContentPaddingClass()">
            <router-view />
          </div>
        </main>
      </div>
    </div>

    <!-- Show login page if not authenticated -->
    <div v-else :class="getMainLayoutClass()">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from './stores/auth'
import { useUIClasses } from './composables/useUIClasses'
import Sidebar from './components/Sidebar.vue'
import { ErrorMessages } from './utils/errorMessages'

// Headless UI components used for the profile menu
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

// Hero icons used in the template
import {
  Bars3Icon,
  ChevronDownIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

// UI classes
const {
  getAppContainerClass,
  getMainLayoutClass,
  getContentAreaClass,
  getTopbarClass,
  getMobileMenuButtonClass,
  getSeparatorClass,
  getProfileButtonClass,
  getProfileAvatarClass,
  getProfileDropdownClass,
  getDropdownItemClass,
  getSmallIconClass,
  getStandardIconClass,
  getMenuIconClass,
  getWelcomeTextClass,
  getUserNameTextClass,
  getProfileNameTextClass,
  getMainContentClass,
  getContentPaddingClass,
  getScreenReaderClass,
} = useUIClasses()

const sidebarOpen = ref(false)

const navigateToProfile = () => {
  router.push('/profile')
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success(ErrorMessages.LOGOUT_SUCCESS)
    router.push('/login')
  } catch {
    toast.error(ErrorMessages.LOGOUT_FAILED)
  }
}
</script>
