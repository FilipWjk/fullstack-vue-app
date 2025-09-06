<template>
  <div>
    <div :class="getUserPageHeaderClass()">
      <div>
        <h1 :class="getUserPageTitleClass()">Users</h1>
        <p :class="getPageDescriptionClass()">Manage user accounts and permissions</p>
      </div>
      <button
        @click="openCreateModal"
        :class="getPrimaryButtonClass(false) + ' ' + getUserAddButtonClass()"
      >
        <svg :class="getUserAddIconClass()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Add User
      </button>
    </div>

    <!-- Filters -->
    <div :class="getCardClass()" class="p-4 mb-6">
      <h3 :class="getFilterHeaderClass()">Filter Users</h3>
      <div :class="getUserFiltersGridClass()">
        <!-- Search -->
        <div>
          <label :class="getLabelClass()"> Search </label>
          <input
            v-model="searchTerm"
            type="text"
            id="search"
            :class="getInputClass()"
            placeholder="Search by name or email..."
            @input="handleSearch"
          />
        </div>

        <!-- Role Filter -->
        <div>
          <label :class="getLabelClass()"> Role </label>
          <select
            v-model="roleFilter"
            id="role"
            :class="getSelectClass()"
            @change="handleFilterChange"
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="MANAGER">Manager</option>
            <option value="USER">User</option>
          </select>
        </div>

        <!-- Actions -->
        <div :class="getUserFiltersActionsClass()">
          <button
            @click="clearFilters"
            :disabled="!hasActiveFilters"
            :class="getPrimaryButtonClass()"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" :class="getErrorMessageClass()" class="mb-4">
      {{ error }}
    </div>

    <!-- Loading State -->
    <div v-if="loading && users.length === 0" :class="getUserLoadingContainerClass()">
      <div :class="getUserLoadingSpinnerClass()"></div>
      <p :class="getUserLoadingTextClass()">Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else-if="users.length > 0" :class="getCardClass()">
      <div :class="getUserTableContainerClass()">
        <table :class="getUserTableClass()">
          <thead :class="getUserTableHeaderClass()">
            <tr>
              <th :class="getUserTableHeaderCellClass()" @click="handleSort('name')">
                <div :class="getTableHeaderFlexClass()">
                  User
                  <component
                    :is="getSortIcon('name')"
                    v-if="getSortIcon('name')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getUserTableHeaderCellClass()" @click="handleSort('role')">
                <div :class="getTableHeaderFlexClass()">
                  Role
                  <component
                    :is="getSortIcon('role')"
                    v-if="getSortIcon('role')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getUserTableHeaderCellClass()" @click="handleSort('orders')">
                <div :class="getTableHeaderFlexClass()">
                  Orders
                  <component
                    :is="getSortIcon('orders')"
                    v-if="getSortIcon('orders')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getUserTableHeaderCellClass()" @click="handleSort('createdAt')">
                <div :class="getTableHeaderFlexClass()">
                  Created
                  <component
                    :is="getSortIcon('createdAt')"
                    v-if="getSortIcon('createdAt')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getUserTableHeaderActionsClass()">Actions</th>
            </tr>
          </thead>
          <tbody :class="getUserTableBodyClass()">
            <tr v-for="user in sortedData" :key="user.id" :class="getUserTableRowClass()">
              <td :class="getUserTableCellClass()">
                <div>
                  <div :class="getUserNameClass()">
                    {{ user.name }}
                  </div>
                  <div :class="getUserEmailClass()">
                    {{ user.email }}
                  </div>
                </div>
              </td>
              <td :class="getUserTableCellClass()">
                <span :class="getRoleBadgeClass(user.role) + ' ' + getUserRoleBadgeClass()">
                  {{ user.role }}
                </span>
              </td>
              <td :class="getUserTableCellClass() + ' ' + getUserTableTextClass()">
                {{ user._count?.orders || 0 }} orders
              </td>
              <td :class="getUserTableCellClass() + ' ' + getUserTableTextClass()">
                {{ formatDate(user.createdAt) }}
              </td>
              <td :class="getUserTableActionsClass()">
                <div :class="getUserTableActionsContainerClass()">
                  <button
                    @click="openEditModal(user)"
                    :class="getActionButtonClass('primary')"
                    title="Edit user"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="openDeleteModal(user)"
                    :class="getActionButtonClass('danger')"
                    :disabled="(user._count?.orders || 0) > 0"
                    title="Delete user"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" :class="getUserPaginationContainerClass()">
        <div :class="getUserPaginationClass()">
          <div :class="getUserPaginationTextClass()">
            Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
            {{ pagination.total }} results
          </div>
          <div :class="getUserPaginationButtonsClass()">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              :class="getUserPaginationButtonClass()"
            >
              Previous
            </button>
            <span :class="getUserPaginationPageClass()">
              Page {{ pagination.page }} of {{ pagination.totalPages }}
            </span>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              :class="getUserPaginationButtonClass()"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" :class="getUserEmptyStateContainerClass()">
      <svg
        :class="getUserEmptyStateIconClass()"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
        ></path>
      </svg>
      <h3 :class="getUserEmptyStateTitleClass()">No users found</h3>
      <p :class="getUserEmptyStateDescriptionClass()">Get started by creating your first user.</p>
      <button
        @click="openCreateModal"
        :class="getPrimaryButtonClass(false) + ' ' + getUserEmptyStateButtonClass()"
      >
        Create User
      </button>
    </div>

    <!-- Create/Edit User Modal -->
    <UserModal
      :is-open="showModal"
      :is-editing="isEditing"
      :user="editingUser"
      :loading="loading"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      :is-open="showDeleteModal"
      :title="`Delete ${userToDelete?.name}`"
      :message="
        (userToDelete?._count?.orders ?? 0) > 0
          ? `This user has ${userToDelete?._count?.orders ?? 0} orders. Users with orders cannot be deleted.`
          : `Are you sure you want to delete this user? This action cannot be undone.`
      "
      :confirm-text="(userToDelete?._count?.orders ?? 0) > 0 ? 'OK' : 'Delete'"
      :cancel-text="(userToDelete?._count?.orders ?? 0) > 0 ? '' : 'Cancel'"
      @confirm="handleDelete"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUsersStore, type User } from '../stores/users'
import { useUIClasses } from '../composables/useUIClasses'
import { ErrorMessages } from '../utils/errorMessages'
import { debounce, SEARCH_DEBOUNCE_DELAY } from '../utils/debounce'
import { useTableSorting } from '../utils/sorting'
import { useToast } from 'vue-toastification'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import UserModal from '../components/UserModal.vue'
import { formatDate } from '../utils/date'
import { handleApiError } from '../utils/errorService'
import { PencilIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const usersStore = useUsersStore()
const toast = useToast()
const {
  getPrimaryButtonClass,
  getInputClass,
  getCardClass,
  getErrorMessageClass,
  getActionButtonClass,
  getLabelClass,
  getSelectClass,
  getPageDescriptionClass,
  getFilterHeaderClass,
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
  getTableHeaderFlexClass,
  getTableSortIconClass,
} = useUIClasses()

// ? Store getters
const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)
const pagination = computed(() => usersStore.pagination)

// ? Local state
const searchTerm = ref('')
const roleFilter = ref('')
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingUser = ref<User | null>(null)
const userToDelete = ref<User | null>(null)

// ? Sorting functionality
const {
  handleSort,
  getSortIcon: getSortIconDirection,
  sortedData,
} = useTableSorting(users, {
  numericFields: ['orders', 'createdAt'],
  customGetters: {
    name: (user: Record<string, unknown>) => (user as unknown as User).name,
    email: (user: Record<string, unknown>) => (user as unknown as User).email,
    role: (user: Record<string, unknown>) => (user as unknown as User).role,
    orders: (user: Record<string, unknown>) => (user as unknown as User)._count?.orders || 0,
    createdAt: (user: Record<string, unknown>) =>
      new Date((user as unknown as User).createdAt).getTime(),
  },
})

// * Get sort icon component for header
const getSortIcon = (field: string) => {
  const direction = getSortIconDirection(field)
  if (!direction) return null
  return direction === 'up' ? ChevronUpIcon : ChevronDownIcon
}

// * Check if any filters are currently applied
const hasActiveFilters = computed(() => {
  return searchTerm.value.trim() !== '' || roleFilter.value !== ''
})

// * Modal handlers
const openCreateModal = () => {
  isEditing.value = false
  editingUser.value = null
  showModal.value = true
}

const openEditModal = (user: User) => {
  isEditing.value = true
  editingUser.value = user
  showModal.value = true
}

const openDeleteModal = (user: User) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingUser.value = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  userToDelete.value = null
}

// ! CRUD operations
const handleSubmit = async (formData: {
  name: string
  email: string
  password?: string
  role: 'ADMIN' | 'MANAGER' | 'USER'
}) => {
  try {
    if (isEditing.value && editingUser.value) {
      const updateData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      }
      await usersStore.updateUser(editingUser.value.id, updateData)
      toast.success(ErrorMessages.USER_UPDATE_SUCCESS)
    } else {
      const createData = {
        name: formData.name,
        email: formData.email,
        password: formData.password!,
        role: formData.role,
      }
      await usersStore.createUser(createData)
      toast.success(ErrorMessages.USER_CREATE_SUCCESS)
    }

    closeModal()
  } catch (error: unknown) {
    console.error('Error saving user:', error)
    // Error handling is done in UserModal component
    throw error // Re-throw to let UserModal handle it
  }
}

const handleDelete = async () => {
  if (!userToDelete.value) return

  // If user has orders, just close the modal
  if ((userToDelete.value._count?.orders || 0) > 0) {
    closeDeleteModal()
    return
  }

  try {
    await usersStore.deleteUser(userToDelete.value.id)
    toast.success(ErrorMessages.USER_DELETE_SUCCESS)
    closeDeleteModal()
  } catch (error: unknown) {
    console.error('Error deleting user:', error)
    const errorMessage = handleApiError(error, 'USER_DELETE_FAILED')
    toast.error(errorMessage)
  }
}

// ? Search and filter handlers
const doSearch = () => {
  usersStore.setFilters({ search: searchTerm.value })
  usersStore.resetPagination()
  fetchUsers()
}

const debouncedSearch = debounce(doSearch, SEARCH_DEBOUNCE_DELAY)

const handleSearch = () => {
  debouncedSearch()
}

const handleFilterChange = () => {
  usersStore.setFilters({ role: roleFilter.value })
  usersStore.resetPagination()
  fetchUsers()
}

const clearFilters = () => {
  searchTerm.value = ''
  roleFilter.value = ''
  usersStore.setFilters({ search: '', role: '' })
  usersStore.resetPagination()
  fetchUsers()
}

// ? Pagination
const changePage = (page: number) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    fetchUsers({ page })
  }
}

// * Fetch users
const fetchUsers = async (params = {}) => {
  try {
    await usersStore.fetchUsers(params)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

// * Initialize
onMounted(async () => {
  await fetchUsers()
})
</script>
