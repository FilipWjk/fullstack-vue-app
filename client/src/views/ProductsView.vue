<template>
  <div :class="getMainLayoutClass()">
    <!-- Page header -->
    <div :class="getPageHeaderContainerClass()">
      <div>
        <h1 :class="getPageTitleClass()">Products</h1>
        <p :class="getPageDescriptionClass()">Manage your product inventory</p>
      </div>
      <router-link
        to="/products/create"
        :class="getPrimaryButtonClass(false) + ' ' + getPageHeaderActionsClass()"
      >
        <svg
          :class="getHeaderButtonIconClass()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v16m8-8H4"
          ></path>
        </svg>
        Add Product
      </router-link>
    </div>

    <!-- Filters -->
    <div :class="getFilterContainerClass()">
      <h3 :class="getFilterHeaderClass()">Filter Products</h3>
      <div :class="getFilterGridClass()">
        <div>
          <label :class="getLabelClass() + ' ' + getFilterFormFieldClass()">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search products..."
            :class="getInputClass()"
            @input="handleFilterChange"
          />
        </div>
        <div>
          <label :class="getLabelClass() + ' ' + getFilterFormFieldClass()">Category</label>
          <select v-model="filters.category" :class="getSelectClass()" @change="handleFilterChange">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label :class="getLabelClass() + ' ' + getFilterFormFieldClass()">Status</label>
          <select v-model="filters.status" :class="getSelectClass()" @change="handleFilterChange">
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        <div :class="getFilterButtonContainerClass()">
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

    <!-- Loading state -->
    <div v-if="productStore.isLoading" :class="getLoadingContainerClass()">
      <div :class="getSpinnerClass()"></div>
    </div>

    <!-- Products table -->
    <div v-else :class="getTableContainerClass()">
      <table :class="getTableClass()">
        <thead :class="getTableHeaderClass()">
          <tr>
            <th
              :class="getTableHeaderCellClass() + ' ' + getTableHeaderSortableClass()"
              @click="handleSort('name')"
            >
              <div :class="getTableHeaderSortContainerClass()">
                Product
                <component
                  :is="getSortIcon('name')"
                  v-if="getSortIcon('name')"
                  :class="getSortIconClass()"
                />
              </div>
            </th>
            <th
              :class="getTableHeaderCellClass() + ' ' + getTableHeaderSortableClass()"
              @click="handleSort('categoryId')"
            >
              <div :class="getTableHeaderSortContainerClass()">
                Category
                <component
                  :is="getSortIcon('categoryId')"
                  v-if="getSortIcon('categoryId')"
                  :class="getSortIconClass()"
                />
              </div>
            </th>
            <th
              :class="getTableHeaderCellClass() + ' ' + getTableHeaderSortableClass()"
              @click="handleSort('price')"
            >
              <div :class="getTableHeaderSortContainerClass()">
                Price
                <component
                  :is="getSortIcon('price')"
                  v-if="getSortIcon('price')"
                  :class="getSortIconClass()"
                />
              </div>
            </th>
            <th
              :class="getTableHeaderCellClass() + ' ' + getTableHeaderSortableClass()"
              @click="handleSort('stock')"
            >
              <div :class="getTableHeaderSortContainerClass()">
                Stock
                <component
                  :is="getSortIcon('stock')"
                  v-if="getSortIcon('stock')"
                  :class="getSortIconClass()"
                />
              </div>
            </th>
            <th
              :class="getTableHeaderCellClass() + ' ' + getTableHeaderSortableClass()"
              @click="handleSort('status')"
            >
              <div :class="getTableHeaderSortContainerClass()">
                Status
                <component
                  :is="getSortIcon('status')"
                  v-if="getSortIcon('status')"
                  :class="getSortIconClass()"
                />
              </div>
            </th>
            <th :class="getTableActionsHeaderClass()">Actions</th>
          </tr>
        </thead>
        <tbody :class="getTableBodyClass()">
          <tr v-for="product in products" :key="product.id" :class="getTableRowClass()">
            <td :class="getTableCellClass()">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-12 w-12">
                  <img
                    v-if="product.imageUrl"
                    :src="getImageUrl(product.imageUrl)"
                    :alt="product.name"
                    :class="getProductImageClass()"
                    @error="handleImageError"
                  />
                  <div v-else :class="getProductImagePlaceholderClass()">
                    <ShoppingBagIcon :class="getIconClass('large', 'gray')" />
                  </div>
                </div>
                <div class="ml-4">
                  <div :class="getProductNameClass()">{{ product.name }}</div>
                  <div :class="getProductDescriptionClass()">
                    {{ truncateText(product.description || 'No description', 50) }}
                  </div>
                </div>
              </div>
            </td>
            <td :class="getTableCellClass()">
              <div :class="getTextSmallMutedClass()">
                {{ getCategoryName(product.categoryId) }}
              </div>
            </td>
            <td :class="getTableCellClass()">
              <div :class="getProductPriceClass()">{{ product.price }}€</div>
            </td>
            <td :class="getTableCellClass()">
              <div
                class="flex items-center justify-center text-sm text-gray-900 dark:text-gray-100"
              >
                {{ product.stock }}
              </div>
              <div
                v-if="product.stock === 0"
                class="flex items-center justify-center text-xs text-red-600 dark:text-red-400 font-medium"
              >
                Out of Stock
              </div>
              <div
                v-else-if="product.stock > 0 && product.stock <= 10"
                class="flex items-center justify-center text-xs text-orange-600 dark:text-orange-400 font-medium"
              >
                Low Stock
              </div>
            </td>
            <td :class="getTableCellClass()">
              <span :class="getStatusBadgeClass(product.status)">
                {{ getStatusLabel(product.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <router-link
                  :to="`/products/${product.id}/edit`"
                  :class="getActionButtonClass('primary')"
                  title="Edit product"
                >
                  <PencilIcon class="w-4 h-4" />
                </router-link>
                <button
                  @click="showDeleteDialog(product)"
                  :class="getActionButtonClass('danger')"
                  title="Delete product"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="products.length === 0" class="text-center py-12">
        <ShoppingBagIcon :class="getIconClass('large', 'gray')" class="mx-auto" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No products</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating a new product.
        </p>
        <div class="mt-6">
          <router-link to="/products/create" :class="getPrimaryButtonClass(false)">
            Add Product
          </router-link>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="products.length > 0" :class="getPaginationContainerClass()">
      <div class="text-sm text-gray-700 dark:text-gray-300">
        Showing {{ (pagination.page - 1) * pagination.limit + 1 }} to
        {{ Math.min(pagination.page * pagination.limit, pagination.total) }} of
        {{ pagination.total }} results
      </div>
      <div class="flex space-x-2">
        <button
          @click="previousPage"
          :disabled="pagination.page <= 1"
          :class="getPaginationButtonClass(pagination.page <= 1)"
        >
          Previous
        </button>
        <button
          @click="nextPage"
          :disabled="pagination.page >= pagination.totalPages"
          :class="getPaginationButtonClass(pagination.page >= pagination.totalPages)"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Confirm Delete Dialog -->
    <ConfirmDialog
      :is-open="confirmDialog.isOpen"
      :title="confirmDialog.title"
      :message="confirmDialog.message"
      confirm-text="Delete"
      cancel-text="Cancel"
      @confirm="handleDeleteConfirm"
      @close="closeDeleteDialog"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useProductStore } from '../stores/products'
import { useUIClasses } from '../composables/useUIClasses'
import { useTableSorting } from '../utils/sorting'
import { debounce, SEARCH_DEBOUNCE_DELAY } from '../utils/debounce'
import {
  ShoppingBagIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
import { SuccessMessages } from '../utils/successMessages'
import { handleApiError } from '../utils/errorService'
import { getImageUrl } from '../utils/urls'
import { ProductStatus } from '../utils/enums'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const toast = useToast()
const productStore = useProductStore()

// UI classes
const {
  getMainLayoutClass,
  getPageTitleClass,
  getPageDescriptionClass,
  getPrimaryButtonClass,
  getFilterContainerClass,
  getFilterHeaderClass,
  getFilterGridClass,
  getLabelClass,
  getInputClass,
  getSelectClass,
  getLoadingContainerClass,
  getSpinnerClass,
  getTableContainerClass,
  getTableClass,
  getTableHeaderClass,
  getTableHeaderCellClass,
  getTableBodyClass,
  getTableRowClass,
  getTableCellClass,
  getProductImageClass,
  getProductImagePlaceholderClass,
  getProductNameClass,
  getProductDescriptionClass,
  getTextSmallMutedClass,
  getProductPriceClass,
  getStatusBadgeClass,
  getActionButtonClass,
  getIconClass,
  getPaginationContainerClass,
  getPaginationButtonClass,
  getPageHeaderContainerClass,
  getPageHeaderActionsClass,
  getHeaderButtonIconClass,
  getTableHeaderSortableClass,
  getTableHeaderSortContainerClass,
  getSortIconClass,
  getTableActionsHeaderClass,
  getFilterFormFieldClass,
  getFilterButtonContainerClass,
} = useUIClasses()

// Dialog state
const confirmDialog = ref({
  isOpen: false,
  title: '',
  message: '',
  productToDelete: null as Product | null,
})

const filters = reactive({
  search: '',
  category: '',
  status: '',
})

const products = computed(() => productStore.products)

const { handleSort, getSortIcon: getSortIconDirection } = useTableSorting(products, {
  numericFields: ['price', 'stock'],
  customGetters: {
    categoryId: (product: { categoryId: string }) => getCategoryName(product.categoryId),
  },
})

const categories = computed(() => productStore.categories)
const pagination = computed(() => productStore.pagination)

// * Check if any filters are currently applied
const hasActiveFilters = computed(() => {
  return filters.search.trim() !== '' || filters.category !== '' || filters.status !== ''
})

const truncateText = (text: string | null, maxLength: number) => {
  if (!text) return ''
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}

const getCategoryName = (categoryId: string) => {
  const category = categories.value.find((cat) => cat.id === categoryId)
  return category ? category.name : 'Unknown'
}

const getStatusLabel = (status: string) => {
  return (ProductStatus as Record<string, string>)[status] || status
}

// ? Get sort icon component for header
const getSortIcon = (field: string) => {
  const direction = getSortIconDirection(field)
  if (!direction) return null
  return direction === 'up' ? ChevronUpIcon : ChevronDownIcon
}

const doFetchProducts = () => {
  productStore.setFilters(filters)
  productStore.fetchProducts()
}

const debouncedFetchProducts = debounce(doFetchProducts, SEARCH_DEBOUNCE_DELAY)

/**
 * Unified handler used by the template.
 * - If invoked from the search input (HTMLInputElement) it debounces the fetch.
 * - If invoked from selects (HTMLSelectElement) it triggers immediate fetch.
 */
const handleFilterChange = (event?: Event) => {
  const target = event?.target as HTMLElement | undefined
  if (target && target.tagName === 'INPUT') {
    debouncedFetchProducts()
  } else {
    doFetchProducts()
  }
}

const clearFilters = () => {
  filters.search = ''
  filters.category = ''
  filters.status = ''
  handleFilterChange()
}

const previousPage = () => {
  if (pagination.value.page > 1) {
    productStore.setPagination({ page: pagination.value.page - 1 })
    productStore.fetchProducts()
  }
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    productStore.setPagination({ page: pagination.value.page + 1 })
    productStore.fetchProducts()
  }
}

interface Product {
  id: string
  name: string
  description?: string
  price: number
  categoryId: string
  stock: number
  imageUrl?: string
  status: string
  createdAt: string
  updatedAt: string
}

const deleteProduct = async (product: Product) => {
  try {
    await productStore.deleteProduct(product.id)
    toast.success(SuccessMessages.PRODUCT_DELETE_SUCCESS)
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'PRODUCT_DELETE_FAILED')
    toast.error(errorMessage)
  }
}

const showDeleteDialog = (product: Product) => {
  confirmDialog.value = {
    isOpen: true,
    title: 'Delete Product',
    message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
    productToDelete: product,
  }
}

const handleDeleteConfirm = () => {
  if (confirmDialog.value.productToDelete) {
    deleteProduct(confirmDialog.value.productToDelete)
  }
  closeDeleteDialog()
}

const closeDeleteDialog = () => {
  confirmDialog.value = {
    isOpen: false,
    title: '',
    message: '',
    productToDelete: null,
  }
}

onMounted(() => {
  productStore.fetchProducts()
  productStore.fetchCategories()
})
</script>
