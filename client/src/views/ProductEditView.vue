<template>
  <div :class="[getMainLayoutClass(), getProductFormPaddingClass()]">
    <div :class="getCardClass()">
      <h1 :class="[getPageTitleClass(), getProductFormTitleSpacingClass()]">Edit Product</h1>

      <div v-if="loading && !form.name" :class="getLoadingContainerClass()">
        <div :class="getSpinnerClass()"></div>
      </div>

      <!-- Not Found State -->
      <div v-else-if="notFound" class="text-center py-12">
        <p class="text-lg text-gray-700 dark:text-gray-300" data-testid="not-found-message">
          Product not found
        </p>
        <router-link to="/products" :class="getCancelButtonClass()" data-testid="back-to-products">
          Back to products
        </router-link>
      </div>

      <form
        v-else
        @submit.prevent="handleSubmit"
        :class="getProductFormSpacingClass()"
        data-testid="product-form"
      >
        <!-- Product Name -->
        <div>
          <label for="name" :class="getLabelClass()"> Product Name </label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            required
            :class="getInputClass()"
            placeholder="Enter product name"
            data-testid="name-input"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description" :class="getLabelClass()"> Description </label>
          <textarea
            v-model="form.description"
            id="description"
            rows="4"
            :class="getInputClass()"
            placeholder="Enter product description"
            data-testid="description-input"
          ></textarea>
        </div>

        <!-- Price -->
        <div>
          <label for="price" :class="getLabelClass()"> Price (€) </label>
          <input
            v-model.number="form.price"
            type="number"
            id="price"
            step="0.01"
            min="0"
            required
            :class="getInputClass()"
            placeholder="0.00"
            data-testid="price-input"
          />
        </div>

        <!-- Category -->
        <div>
          <label for="category" :class="getLabelClass()"> Category </label>
          <select
            v-model="form.categoryId"
            id="category"
            required
            :class="getSelectClass()"
            data-testid="category-select"
          >
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Stock Quantity -->
        <div>
          <label for="stock" :class="getLabelClass()"> Stock Quantity </label>
          <input
            v-model.number="form.stock"
            type="number"
            id="stock"
            min="0"
            required
            :class="getInputClass()"
            placeholder="0"
            data-testid="stock-input"
          />
        </div>

        <!-- Image URL -->
        <div>
          <label for="imageUrl" :class="getLabelClass()"> Product Image URL </label>
          <input
            v-model="form.imageUrl"
            type="url"
            id="imageUrl"
            :class="getInputClass()"
            placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
            data-testid="image-input"
          />
          <div v-if="form.imageUrl" class="mt-4 flex justify-center">
            <img
              :src="form.imageUrl"
              alt="Product preview"
              class="h-64 w-auto rounded-md border border-gray-300 dark:border-gray-600"
              @error="handleImageError"
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
            data-testid="submit-button"
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
            {{ loading ? 'Updating...' : 'Update Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useToast } from 'vue-toastification'
import { useUIClasses } from '../composables/useUIClasses'
import { handleApiError } from '../utils/errorService'
import { ErrorMessages } from '../utils/errorMessages'
import { SuccessMessages } from '../utils/successMessages'

const router = useRouter()
const route = useRoute()
const productsStore = useProductStore()
const toast = useToast()

// UI classes
const {
  getMainLayoutClass,
  getCardClass,
  getPageTitleClass,
  getLoadingContainerClass,
  getSpinnerClass,
  getLabelClass,
  getInputClass,
  getSelectClass,
  getCancelButtonClass,
  getSuccessButtonClass,
  getProductFormPaddingClass,
  getProductFormTitleSpacingClass,
  getProductFormSpacingClass,
  getProductFormButtonContainerClass,
} = useUIClasses()

const loading = ref(false)
const notFound = ref(false)

const form = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  stock: 0,
  imageUrl: '',
})

const categories = ref(productsStore.categories)

const handleImageError = () => {
  // Handle image error if needed
}

const loadProduct = async () => {
  const productId = route.params.id as string

  if (!productId || productId.trim() === '') {
    toast.error('Product ID is missing')
    router.push('/products')
    return
  }

  loading.value = true

  try {
    const response = await productsStore.fetchProduct(productId)
    const product = response.data

    if (!product) {
      notFound.value = true
      return
    }

    // * Populate the form with the product data
    form.value = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      categoryId: product.categoryId?.toString() || '',
      stock: product.stock || 0,
      imageUrl: product.imageUrl || '',
    }
  } catch (error: unknown) {
    // If it's a 404, show not found state; otherwise show error and redirect
    const message = handleApiError(error, 'PRODUCT_FETCH_SINGLE_FAILED')
    if (typeof message === 'string' && message.toLowerCase().includes('not found')) {
      notFound.value = true
    } else {
      toast.error(message)
      router.push('/products')
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  const productId = route.params.id as string

  if (!productId || productId.trim() === '') {
    toast.error(ErrorMessages.PRODUCT_ID_MISSING)
    return
  }

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

    await productsStore.updateProduct(productId, productData)
    toast.success(SuccessMessages.PRODUCT_UPDATE_SUCCESS)
    router.push('/products')
  } catch (error: unknown) {
    const errorMessage = handleApiError(error, 'PRODUCT_UPDATE_FAILED')
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await productsStore.fetchCategories()
  categories.value = productsStore.categories
  await loadProduct()
})
</script>
