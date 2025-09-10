<template>
  <div :class="getOrderDetailContainerClass()">
    <!-- Loading State -->
    <div v-if="loading" :class="getOrderDetailLoadingContainerClass()">
      <div :class="getOrderDetailLoadingSpinnerClass()"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" :class="getOrderDetailErrorContainerClass()">
      <div :class="getOrderDetailErrorMessageClass()">{{ error }}</div>
      <router-link to="/orders" :class="getOrderDetailErrorButtonClass()">
        Back to Orders
      </router-link>
    </div>

    <!-- Order Details -->
    <div
      v-else-if="order"
      :class="getOrderDetailMainContainerClass()"
      data-testid="order-management"
    >
      <!-- Header with Status and Actions -->
      <div :class="getOrderDetailHeaderCardClass()">
        <div :class="getOrderDetailHeaderFlexClass()">
          <div :class="getOrderDetailHeaderContentClass()" data-testid="order-management-header">
            <div :class="getOrderDetailHeaderTitleSectionClass()">
              <div>
                <h1 :class="getOrderDetailHeaderTitleClass()" data-testid="order-details-header">
                  Order #{{ order.id }}
                </h1>
                <p :class="getOrderDetailHeaderDateClass()">
                  Placed on {{ formatDate(order.createdAt) }}
                </p>
              </div>
              <span :class="getOrderDetailHeaderBadgeClass()">
                {{ order.status }}
              </span>
            </div>
          </div>
          <div :class="getOrderDetailHeaderActionsClass()">
            <router-link
              to="/orders"
              :class="getOrderDetailBackButtonClass()"
              data-testid="back-to-orders"
            >
              ← Back to Orders
            </router-link>
          </div>
        </div>
      </div>

      <!-- Three Column Layout -->
      <div :class="getOrderDetailGridClass()">
        <!-- Customer & Order Info -->
        <div :class="getOrderDetailSidebarClass()">
          <!-- Customer Information -->
          <div :class="getOrderDetailCardClass()" data-testid="customer-info">
            <h2 :class="getOrderDetailCardHeaderClass()">
              <svg
                class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Customer Details
            </h2>
            <div :class="getOrderDetailCardContentClass()">
              <div :class="getOrderDetailCustomerInfoClass()">
                <div
                  class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center"
                >
                  <span class="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    {{ order.user.name.charAt(0).toUpperCase() }}
                  </span>
                </div>
                <div>
                  <p :class="getOrderDetailCustomerLabelClass()" data-testid="customer-name">
                    {{ order.user.name }}
                  </p>
                  <p :class="getOrderDetailCustomerValueClass()" data-testid="customer-email">
                    {{ order.user.email }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div
            v-if="order.shippingAddress || order.billingAddress || order.notes"
            :class="getOrderDetailCardClass()"
          >
            <h2 :class="getOrderDetailCardHeaderClass()">
              <svg
                class="w-5 h-5 mr-2 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Shipping Information
            </h2>
            <div :class="getOrderDetailCardContentClass()">
              <div v-if="order.shippingAddress">
                <p :class="getOrderDetailCustomerLabelClass()">Shipping Address</p>
                <p :class="getOrderDetailCustomerValueClass()">
                  {{ order.shippingAddress }}
                </p>
              </div>
              <div v-if="order.billingAddress">
                <p :class="getOrderDetailCustomerLabelClass()">Billing Address</p>
                <p :class="getOrderDetailCustomerValueClass()">
                  {{ order.billingAddress }}
                </p>
              </div>
              <div v-if="order.notes">
                <p :class="getOrderDetailCustomerLabelClass()">Notes</p>
                <p :class="getOrderDetailCustomerValueClass()">{{ order.notes }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div :class="getOrderDetailMainSectionClass()">
          <div :class="getOrderDetailCardClass()" data-testid="order-items">
            <h2 :class="getOrderDetailCardHeaderClass()">
              <svg
                class="w-6 h-6 mr-2 text-emerald-600 dark:text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Order Items ({{ order.orderItems.length }})
            </h2>

            <div :class="getOrderDetailItemsListClass()">
              <div
                v-for="(item, index) in order.orderItems"
                :key="item.id"
                :class="getOrderDetailItemClass()"
                data-testid="order-item"
              >
                <div :class="getOrderDetailItemContentClass()">
                  <div :class="getOrderDetailItemImageClass()">
                    <div class="relative">
                      <img
                        v-if="item.product.images && item.product.images.length > 0"
                        :src="getImageUrl(item.product.images[0])"
                        :alt="item.product.name"
                        :class="getOrderDetailItemImageImgClass()"
                        @error="handleImageError"
                      />
                      <div
                        v-else
                        class="h-20 w-20 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center border-2 border-gray-200 dark:border-gray-600"
                      >
                        <ShoppingBagIcon class="h-8 w-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div
                        class="absolute -top-2 -left-2 bg-emerald-600 dark:bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        {{ index + 1 }}
                      </div>
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h3 :class="getOrderDetailItemNameClass()" data-testid="product-name">
                      {{ item.product.name }}
                    </h3>
                    <div :class="getOrderDetailItemDetailsClass()">
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500 dark:text-gray-400">Quantity:</span>
                        <span
                          class="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ item.quantity }}
                        </span>
                      </div>
                      <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500 dark:text-gray-400">Unit Price:</span>
                        <span
                          class="text-sm font-medium text-gray-900 dark:text-white"
                          data-testid="product-price"
                        >
                          {{ formatCurrency(item.price) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div :class="getOrderDetailItemPriceClass()">
                    <p
                      class="text-lg font-bold text-gray-900 dark:text-white"
                      data-testid="item-total"
                    >
                      {{ formatCurrency(item.price * item.quantity) }}
                    </p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Total Footer -->
            <div :class="getOrderDetailSummaryListClass()" data-testid="order-summary">
              <div :class="getOrderDetailSummaryItemClass()">
                <div>
                  <p :class="getOrderDetailSummaryLabelClass()">
                    {{ order.orderItems.length }}
                    {{ order.orderItems.length === 1 ? 'item' : 'items' }} total
                  </p>
                </div>
                <div :class="getOrderDetailSummaryTotalClass()">
                  <p :class="getOrderDetailSummaryTotalValueClass()" data-testid="order-total">
                    {{ formatCurrency(order.total) }}
                  </p>
                  <p :class="getOrderDetailSummaryTotalLabelClass()">Grand Total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '../stores/orders'
import { useToast } from 'vue-toastification'
import { ShoppingBagIcon } from '@heroicons/vue/24/outline'
import { handleApiError } from '../utils/errorService'
import { getImageUrl } from '../utils/urls'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import { useUIClasses } from '../composables/useUIClasses'
import { getErrorMessage } from '../utils/errorMessages'

const {
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
} = useUIClasses()

const route = useRoute()
const orderStore = useOrderStore()
const toast = useToast()

const loading = ref(false)
const error = ref<string | null>(null)

const order = computed(() => orderStore.currentOrder)

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/placeholder-image.jpg'
}

const fetchOrderDetails = async () => {
  const orderId = route.params.id as string

  if (!orderId) {
    error.value = getErrorMessage('ORDER_ID_MISSING')
    return
  }

  loading.value = true
  error.value = null

  try {
    await orderStore.fetchOrder(orderId)
  } catch (err: unknown) {
    error.value = handleApiError(err, 'ORDER_FETCH_FAILED')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrderDetails()
})
</script>
