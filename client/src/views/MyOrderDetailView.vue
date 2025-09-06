<template>
  <div :class="getMyOrderDetailContainerClass()">
    <!-- Back button -->
    <div :class="getMyOrderDetailBackButtonContainerClass()">
      <button @click="$router.go(-1)" :class="getMyOrderDetailBackButtonClass()">
        <svg
          :class="getMyOrderDetailBackButtonIconClass()"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to My Orders
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="orderStore.isLoading" :class="getMyOrderDetailLoadingContainerClass()">
      <div :class="getMyOrderDetailLoadingButtonClass()">
        <svg
          :class="getMyOrderDetailLoadingSpinnerClass()"
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
        Loading order details...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="orderStore.error" :class="getMyOrderDetailErrorContainerClass()">
      <div :class="getMyOrderDetailErrorFlexClass()">
        <div :class="getMyOrderDetailErrorIconContainerClass()">
          <svg :class="getMyOrderDetailErrorIconClass()" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div :class="getMyOrderDetailErrorContentClass()">
          <h3 :class="getMyOrderDetailErrorTitleClass()">Error loading order</h3>
          <div :class="getMyOrderDetailErrorMessageClass()">
            <p>{{ orderStore.error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order details -->
    <div v-else-if="order">
      <!-- Order header -->
      <div :class="getMyOrderDetailCardClass()">
        <div :class="getMyOrderDetailCardContentClass()">
          <div class="sm:flex sm:items-center sm:justify-between">
            <div>
              <p :class="getMyOrderDetailHeaderTitleClass()">Order #{{ order.orderNumber }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Placed on {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="mt-4 sm:mt-0">
              <span :class="getMyOrderDetailStatusBadgeClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Order items -->
      <div :class="getMyOrderDetailCardClass()">
        <div :class="getMyOrderDetailCardContentClass()">
          <h2 :class="getMyOrderDetailCardHeaderTitleClass()">Order Items</h2>
          <div class="flow-root">
            <ul role="list" :class="getMyOrderDetailItemsListClass()">
              <li
                v-for="item in order.orderItems"
                :key="item.id"
                :class="getMyOrderDetailItemClass()"
              >
                <div class="flex items-center space-x-4">
                  <div :class="getMyOrderDetailItemImageClass()">
                    <img
                      v-if="item.product.images && item.product.images.length > 0"
                      :src="item.product.images[0]"
                      :alt="item.product.name"
                      :class="getMyOrderDetailItemImageImgClass()"
                    />
                    <div
                      v-else
                      class="h-full w-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center"
                    >
                      <svg
                        class="h-8 w-8 text-gray-400 dark:text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div :class="getMyOrderDetailItemContentClass()">
                    <h3 :class="getMyOrderDetailItemNameClass()">
                      {{ item.product.name }}
                    </h3>
                    <p :class="getMyOrderDetailItemQuantityClass()">
                      Quantity: {{ item.quantity }}
                    </p>
                    <p :class="getMyOrderDetailItemQuantityClass()">
                      Price: {{ formatCurrency(Number(item.price)) }} each
                    </p>
                  </div>
                  <div class="text-right">
                    <p :class="getMyOrderDetailItemPriceClass()">
                      {{ formatCurrency(Number(item.price) * item.quantity) }}
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Order summary -->
      <div :class="getMyOrderDetailCardClass()">
        <div :class="getMyOrderDetailCardContentClass()">
          <h2 :class="getMyOrderDetailCardHeaderTitleClass()">Order Summary</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Subtotal</span>
              <span class="text-gray-900 dark:text-gray-100">{{
                formatCurrency(Number(order.total))
              }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Shipping</span>
              <span class="text-gray-900 dark:text-gray-100">{{ formatCurrency(0) }}</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div class="flex justify-between text-base font-medium">
                <span class="text-gray-900 dark:text-gray-100">Total</span>
                <span class="text-gray-900 dark:text-gray-100">{{
                  formatCurrency(Number(order.total))
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Shipping information -->
      <div v-if="order.shippingAddress" :class="getMyOrderDetailCardClass()">
        <div :class="getMyOrderDetailCardContentClass()">
          <h2 :class="getMyOrderDetailCardHeaderTitleClass()">Shipping Information</h2>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            <p class="whitespace-pre-line">{{ order.shippingAddress }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Not found state -->
    <div v-else :class="getEmptyStateClass()">
      <svg :class="getEmptyStateIconClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 8l2 2 4-4"
        />
      </svg>
      <h3 :class="getEmptyStateTitleClass()">Order not found</h3>
      <p :class="getEmptyStateDescriptionClass()">
        The order you're looking for doesn't exist or you don't have permission to view it.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import { useUIClasses } from '../composables/useUIClasses'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'

export default defineComponent({
  name: 'MyOrderDetailView',
  setup() {
    const route = useRoute()
    const orderStore = useOrderStore()
    const authStore = useAuthStore()
    const {
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
      getStatusBadgeClass,
      getEmptyStateClass,
      getEmptyStateIconClass,
      getEmptyStateTitleClass,
      getEmptyStateDescriptionClass,
    } = useUIClasses()

    const orderId = computed(() => route.params.id as string)

    // * Get the specific order and ensure it belongs to the current user
    const order = computed(() => {
      const foundOrder = orderStore.orders.find((o) => o.id.toString() === orderId.value)
      if (foundOrder && foundOrder.userId === authStore.user?.id?.toString()) {
        return foundOrder
      }
      return null
    })

    onMounted(async () => {
      // * Load user's orders if not already loaded
      if (orderStore.orders.length === 0) {
        await orderStore.fetchMyOrders()
      }
    })

    return {
      orderStore,
      order,
      formatDate,
      getStatusBadgeClass,
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
      formatCurrency,
      getEmptyStateClass,
      getEmptyStateIconClass,
      getEmptyStateTitleClass,
      getEmptyStateDescriptionClass,
    }
  },
})
</script>
