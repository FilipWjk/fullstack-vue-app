<template>
  <div :class="[getMainLayoutClass(), getProductFormPaddingClass()]">
    <div :class="getCardClass()">
      <h1 :class="[getPageTitleClass(), getProductFormTitleSpacingClass()]">Create Product</h1>

      <form @submit.prevent="handleSubmit" :class="getProductFormSpacingClass()">
        <!-- Product Name -->
        <div>
          <label for="name" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Product Name</label
          >
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            :class="getInputClass()"
            placeholder="Enter product name"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Description</label
          >
          <textarea
            v-model="form.description"
            id="description"
            rows="4"
            :class="getInputClass()"
            placeholder="Enter product description"
          ></textarea>
        </div>

        <!-- Price -->
        <div>
          <label for="price" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Price (€)</label
          >
          <input
            v-model.number="form.price"
            type="number"
            id="price"
            step="0.01"
            min="0"
            required
            :class="getInputClass()"
            placeholder="0.00"
          />
        </div>

        <!-- Category -->
        <div>
          <label for="category" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Category</label
          >
          <select v-model="form.categoryId" id="category" required :class="getSelectClass()">
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Stock Quantity -->
        <div>
          <label for="stock" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Stock Quantity</label
          >
          <input
            v-model.number="form.stock"
            type="number"
            id="stock"
            min="0"
            required
            :class="getInputClass()"
            placeholder="0"
          />
        </div>

        <!-- Image URL -->
        <div>
          <label for="imageUrl" :class="[getLabelClass(), getProductFormLabelClass()]"
            >Product Image URL</label
          >
          <input
            v-model="form.imageUrl"
            type="url"
            id="imageUrl"
            :class="getInputClass()"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
          />
          <div v-if="form.imageUrl" class="mt-4 flex justify-center">
            <img
              :src="form.imageUrl"
              alt="Product preview"
              class="h-64 w-auto rounded-md border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div :class="getProductFormButtonContainerClass()">
          <router-link to="/products" :class="getCancelButtonClass()"> Cancel </router-link>
          <button
            type="submit"
            :disabled="loading"
            :class="getSuccessButtonClass() + (loading ? ' opacity-50' : '')"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {{ loading ? 'Creating...' : 'Create Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useProductStore } from '../stores/products'
import { useUIClasses } from '../composables/useUIClasses'
import { handleApiError } from '../utils/errorService'
import { ErrorMessages } from '../utils/errorMessages'

const router = useRouter()
const toast = useToast()
const productsStore = useProductStore()

// UI classes
const {
  getMainLayoutClass,
  getCardClass,
  getPageTitleClass,
  getLabelClass,
  getInputClass,
  getSelectClass,
  getCancelButtonClass,
  getSuccessButtonClass,
  getProductFormPaddingClass,
  getProductFormTitleSpacingClass,
  getProductFormSpacingClass,
  getProductFormButtonContainerClass,
  getProductFormLabelClass,
} = useUIClasses()

const loading = ref(false)

const form = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  stock: 0,
  imageUrl: '',
})

const categories = ref(productsStore.categories)

const handleSubmit = async () => {
  loading.value = true

  try {
    const productData = {
      name: form.value.name,
      description: form.value.description,
      price: form.value.price,
      categoryId: form.value.categoryId,
      stock: form.value.stock,
      imageUrl: form.value.imageUrl,
    }

    await productsStore.createProduct(productData)
    toast.success(ErrorMessages.PRODUCT_CREATE_SUCCESS)
    router.push('/products')
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'PRODUCT_CREATE_FAILED')
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await productsStore.fetchCategories()
  categories.value = productsStore.categories
})
</script>
