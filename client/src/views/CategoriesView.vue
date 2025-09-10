<template>
  <div>
    <div :class="getPageHeaderContainerClass()">
      <h1 :class="getPageTitleClass()" data-testid="categories-header">Categories</h1>
      <button
        @click="openCreateModal"
        :class="getPrimaryButtonClass(false) + ' ' + getPageHeaderActionsClass()"
        data-testid="add-category-button"
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
        Add Category
      </button>
    </div>

    <!-- Error Message -->
    <div v-if="error" :class="getWarningBadgeClass() + ' mb-4'" data-testid="categories-error">
      <div :class="getWarningBadgeTextClass()">
        {{ error }}
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading && categories.length === 0" :class="getLoadingContainerClass()">
      <div :class="getSpinnerClass()"></div>
      <p :class="getTextMutedClass() + ' mt-2'">Loading categories...</p>
    </div>

    <!-- Categories Grid -->
    <div
      v-else-if="categories.length > 0"
      :class="getCategoryGridClass()"
      data-testid="categories-grid"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        :class="getCategoryCardClass()"
        data-testid="category-card"
      >
        <!-- Category Image -->
        <div :class="getCategoryImageContainerClass()">
          <img
            v-if="category.imageUrl"
            :src="getImageUrl(category.imageUrl)"
            :alt="category.name"
            :class="getCategoryImageClass()"
          />
          <div v-else :class="getCategoryImagePlaceholderClass()">
            <svg
              :class="getCategoryImagePlaceholderIconClass()"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
          </div>

          <!-- Action Buttons Overlay -->
          <div :class="getCategoryActionOverlayClass()">
            <button
              @click="openEditModal(category)"
              :class="getCategoryActionButtonClass('primary')"
              title="Edit Category"
              data-testid="edit-category"
            >
              <svg
                :class="getCategoryActionIconClass()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                ></path>
              </svg>
            </button>

            <button
              @click="openDeleteModal(category)"
              :class="[getCategoryActionButtonClass('danger')]"
              title="Delete Category"
              data-testid="delete-category"
            >
              <svg
                :class="getCategoryActionIconClass()"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Category Content -->
        <div :class="getCategoryContentClass()">
          <h3 :class="getCategoryTitleClass()" data-testid="category-name">
            {{ category.name }}
          </h3>

          <p v-if="category.description" :class="getCategoryDescriptionClass()">
            {{ category.description }}
          </p>

          <div :class="getCategoryStatsClass()">
            <span>{{ category._count?.products || 0 }} products</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading" :class="getEmptyStateClass()" data-testid="empty-categories">
      <svg :class="getEmptyStateIconClass()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        ></path>
      </svg>
      <h3 :class="getEmptyStateTitleClass()">No categories found</h3>
      <p :class="getEmptyStateDescriptionClass() + ' mb-4'">
        Get started by creating your first category.
      </p>
      <button @click="openCreateModal" :class="getPrimaryButtonClass(false) + ' px-6 py-2'">
        Create Category
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      :class="getCustomModalOverlayClass()"
      @click.self="closeModal"
      data-testid="modal-backdrop"
    >
      <div
        :class="getCardClass() + ' ' + getCustomModalContainerClass()"
        data-testid="category-modal"
      >
        <div :class="getCustomModalBodyClass()">
          <h2 :class="getCustomModalHeaderClass()" data-testid="modal-title">
            {{ isEditing ? 'Edit Category' : 'Add New Category' }}
          </h2>

          <form
            @submit.prevent="handleSubmit"
            :class="getFormSpaceClass()"
            data-testid="category-form"
          >
            <!-- Name -->
            <div>
              <label for="name" :class="getLabelClass()"> Name * </label>
              <input
                v-model="form.name"
                type="text"
                id="name"
                :class="getInputClass(!!formErrors.name)"
                placeholder="Enter category name"
                required
                data-testid="name-input"
              />
              <p v-if="formErrors.name" :class="getErrorMessageClass()" data-testid="name-error">
                {{ formErrors.name }}
              </p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" :class="getLabelClass()"> Description </label>
              <textarea
                v-model="form.description"
                id="description"
                rows="3"
                :class="getInputClass(!!formErrors.description)"
                placeholder="Enter category description (optional)"
                data-testid="description-input"
              ></textarea>
              <p v-if="formErrors.description" :class="getErrorMessageClass()">
                {{ formErrors.description }}
              </p>
            </div>

            <!-- Image Section -->
            <div>
              <label :class="getLabelClass()"> Image URL </label>

              <input
                v-model="imageUrl"
                type="url"
                :class="getInputClass(!!formErrors.imageUrl)"
                placeholder="https://example.com/image.jpg"
              />
              <p v-if="formErrors.imageUrl" :class="getErrorMessageClass()">
                {{ formErrors.imageUrl }}
              </p>

              <!-- URL Image Preview -->
              <div v-if="imageUrl && isValidUrl(imageUrl)" :class="getImagePreviewContainerClass()">
                <img
                  :src="imageUrl"
                  alt="Preview"
                  :class="getImagePreviewClass()"
                  @error="handleUrlImageError"
                />
                <button
                  type="button"
                  @click="clearImageUrl"
                  :class="getImagePreviewRemoveButtonClass()"
                >
                  <svg
                    :class="getImagePreviewRemoveIconClass()"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Form Buttons -->
            <div :class="getFormButtonContainerClass()">
              <button
                type="button"
                @click="closeModal"
                :class="getCancelButtonClass()"
                data-testid="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="!!isSubmitDisabled"
                :class="getSuccessButtonClass() + (isSubmitDisabled ? ' opacity-50' : '')"
                data-testid="submit-button"
              >
                {{ loading ? 'Saving...' : isEditing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDialog
      v-if="showDeleteModal"
      :isOpen="showDeleteModal"
      :title="`Delete ${categoryToDelete?.name}`"
      :message="
        (categoryToDelete?._count?.products ?? 0) > 0
          ? `This category has ${categoryToDelete?._count?.products ?? 0} products. Please move or delete all products before deleting this category.`
          : `Are you sure you want to delete this category? This action cannot be undone.`
      "
      :confirmText="(categoryToDelete?._count?.products ?? 0) > 0 ? 'OK' : 'Delete'"
      :cancelText="(categoryToDelete?._count?.products ?? 0) > 0 ? 'Cancel' : 'Cancel'"
      @confirm="handleDelete"
      @close="closeDeleteModal"
      data-testid="confirm-dialog"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useCategoriesStore, type Category } from '../stores/categories'
import { useUIClasses } from '../composables/useUIClasses'
import { ErrorMessages } from '../utils/errorMessages'
import { SuccessMessages } from '../utils/successMessages'
import { getImageUrl } from '../utils/urls'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import type { AxiosError } from 'axios'
import { handleApiError } from '../utils/errorService'

const toast = useToast()
const categoriesStore = useCategoriesStore()
const {
  getPrimaryButtonClass,
  getInputClass,
  getCardClass,
  getErrorMessageClass,
  getCancelButtonClass,
  getSuccessButtonClass,
  getPageHeaderContainerClass,
  getPageTitleClass,
  getPageHeaderActionsClass,
  getHeaderButtonIconClass,
  getWarningBadgeClass,
  getWarningBadgeTextClass,
  getLoadingContainerClass,
  getSpinnerClass,
  getTextMutedClass,
  getCategoryGridClass,
  getCategoryCardClass,
  getCategoryImageContainerClass,
  getCategoryImageClass,
  getCategoryImagePlaceholderClass,
  getCategoryImagePlaceholderIconClass,
  getCategoryActionOverlayClass,
  getCategoryActionButtonClass,
  getCategoryContentClass,
  getCategoryTitleClass,
  getCategoryDescriptionClass,
  getCategoryStatsClass,
  getCategoryActionIconClass,
  getEmptyStateClass,
  getEmptyStateIconClass,
  getEmptyStateTitleClass,
  getEmptyStateDescriptionClass,
  getCustomModalOverlayClass,
  getCustomModalContainerClass,
  getCustomModalHeaderClass,
  getCustomModalBodyClass,
  getFormSpaceClass,
  getLabelClass,
  getImagePreviewContainerClass,
  getImagePreviewClass,
  getImagePreviewRemoveButtonClass,
  getImagePreviewRemoveIconClass,
  getFormButtonContainerClass,
} = useUIClasses()

// * Types
// * Store getters
const categories = computed(() => categoriesStore.categories)
const loading = computed(() => categoriesStore.loading)
const error = computed(() => categoriesStore.error)

// * Modal state
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const editingCategory = ref<Category | null>(null)
const categoryToDelete = ref<Category | null>(null)

// * Form state
const form = ref({
  name: '',
  description: '',
})
const formErrors = ref<Record<string, string>>({})
const imageUrl = ref('')

// * Computed properties
const isFormValid = computed(() => form.value.name.trim().length >= 2)
const isSubmitDisabled = computed(() => loading.value || !isFormValid.value)

// * Utility functions
const clearForm = () => {
  form.value = {
    name: '',
    description: '',
  }
  formErrors.value = {}
  imageUrl.value = ''
}

// * Image handling functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const clearImageUrl = () => {
  imageUrl.value = ''
}

const handleUrlImageError = () => {
  formErrors.value.imageUrl = ErrorMessages.IMAGE_URL_FAILED
}

const validateForm = () => {
  formErrors.value = {}

  if (!form.value.name.trim()) {
    formErrors.value.name = 'Category name is required'
    return false
  }

  if (form.value.name.trim().length < 2) {
    formErrors.value.name = 'Category name must be at least 2 characters'
    return false
  }

  return true
}

// * Modal handlers
const openCreateModal = () => {
  isEditing.value = false
  editingCategory.value = null
  clearForm()
  showModal.value = true
}

const openEditModal = (category: Category) => {
  isEditing.value = true
  editingCategory.value = category
  form.value.name = category.name
  form.value.description = category.description || ''
  imageUrl.value = category.imageUrl || ''
  formErrors.value = {}
  showModal.value = true
}

const openDeleteModal = (category: Category) => {
  categoryToDelete.value = category
  showDeleteModal.value = true
}

const closeModal = () => {
  showModal.value = false
  clearForm()
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  categoryToDelete.value = null
}

const handleSubmit = async () => {
  if (!validateForm()) return

  if (imageUrl.value && !isValidUrl(imageUrl.value)) {
    formErrors.value.imageUrl = 'Invalid image URL'
    return
  }

  try {
    const categoryData = {
      name: form.value.name.trim(),
      description: form.value.description?.trim() || undefined,
      imageUrl: imageUrl.value || undefined,
    }

    if (isEditing.value && editingCategory.value) {
      await categoriesStore.updateCategory(editingCategory.value.id, categoryData)
      toast.success(SuccessMessages.CATEGORY_UPDATE_SUCCESS)
    } else {
      await categoriesStore.createCategory(categoryData)
      toast.success(SuccessMessages.CATEGORY_CREATE_SUCCESS)
    }

    closeModal()
  } catch (error: unknown) {
    // ? Handle validation errors from API
    const axiosError = error as AxiosError<{ errors?: Array<{ path?: string; msg: string }> }>
    if (axiosError.response?.data?.errors) {
      const apiErrors = axiosError.response.data.errors
      apiErrors.forEach((err) => {
        if (err.path) {
          formErrors.value[err.path] = err.msg
        }
      })
    } else {
      // * Show generic error toast
      const errorMessage = isEditing.value
        ? ErrorMessages.CATEGORY_UPDATE_FAILED
        : ErrorMessages.CATEGORY_CREATE_FAILED
      toast.error(errorMessage)
    }
  }
}

const handleDelete = async () => {
  if (!categoryToDelete.value) return

  try {
    await categoriesStore.deleteCategory(categoryToDelete.value.id)
    closeDeleteModal()
    toast.success(SuccessMessages.CATEGORY_DELETE_SUCCESS)
  } catch (error) {
    console.error('Error deleting category:', error)
    const message = handleApiError(error, 'CATEGORY_DELETE_FAILED')
    toast.error(message)
  }
}

// * Initialize
onMounted(async () => {
  try {
    await categoriesStore.fetchCategories()
  } catch (error) {
    console.error('Error fetching categories:', error)
    toast.error(ErrorMessages.CATEGORIES_FETCH_FAILED)
  }
})
</script>
