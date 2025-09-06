<template>
  <div :class="getMyOrdersContainerClass()">
    <div :class="getMyOrdersHeaderContainerClass()">
      <div :class="getMyOrdersHeaderContentClass()">
        <h1 :class="getMyOrdersHeaderTitleClass()">My Orders</h1>
        <p :class="getMyOrdersHeaderDescriptionClass()">
          A list of all your orders including their status and details.
        </p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="ordersStore.isLoading" :class="getMyOrdersLoadingContainerClass()">
      <div :class="getMyOrdersLoadingButtonClass()">
        <svg
          :class="getMyOrdersLoadingSpinnerClass()"
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
        Loading orders...
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="ordersStore.error" :class="getMyOrdersErrorContainerClass()">
      <div :class="getMyOrdersErrorCardClass()">
        <div :class="getMyOrdersErrorFlexClass()">
          <div :class="getMyOrdersErrorIconContainerClass()">
            <svg :class="getMyOrdersErrorIconClass()" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div :class="getMyOrdersErrorContentClass()">
            <h3 :class="getMyOrdersErrorTitleClass()">Error loading orders</h3>
            <div :class="getMyOrdersErrorMessageClass()">
              <p>{{ ordersStore.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders table -->
    <div v-else-if="orders.length > 0" :class="getMyOrdersTableContainerClass()">
      <div :class="getMyOrdersTableWrapperClass()">
        <div :class="getMyOrdersTableInnerClass()">
          <div
            class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 sm:rounded-lg"
          >
            <table :class="getMyOrdersTableClass()">
              <thead :class="getMyOrdersTableHeaderClass()">
                <tr>
                  <th scope="col" :class="getMyOrdersTableHeaderCellClass()">Order ID</th>
                  <th scope="col" :class="getMyOrdersTableHeaderCellClass()">Date</th>
                  <th scope="col" :class="getMyOrdersTableHeaderCellClass()">Items</th>
                  <th scope="col" :class="getMyOrdersTableHeaderCellClass()">Total</th>
                  <th scope="col" :class="getMyOrdersTableHeaderCellClass()">Status</th>
                  <th scope="col" :class="getMyOrdersTableHeaderCellRightClass()">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody :class="getMyOrdersTableBodyClass()">
                <tr v-for="order in orders" :key="order.id" :class="getMyOrdersTableRowClass()">
                  <td :class="getMyOrdersTableCellClass()">#{{ order.orderNumber }}</td>
                  <td :class="getMyOrdersTableCellClass()">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td :class="getMyOrdersTableCellClass()">
                    <div class="max-w-xs">
                      <p class="truncate">
                        {{ order.orderItems.length }} item{{
                          order.orderItems.length !== 1 ? 's' : ''
                        }}
                      </p>
                      <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {{ getOrderItemsSummary(order.orderItems) }}
                      </p>
                    </div>
                  </td>
                  <td :class="getMyOrdersTableCellClass()">
                    {{ formatCurrency(Number(order.total)) }}
                  </td>
                  <td :class="getMyOrdersTableCellClass()">
                    <span :class="getMyOrdersStatusBadgeClass(order.status)">
                      {{ order.status }}
                    </span>
                  </td>
                  <td :class="getMyOrdersTableCellRightClass()">
                    <button
                      @click="viewOrderDetails(order.id)"
                      :class="getMyOrdersTableLinkClass()"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else :class="getEmptyStateClass()">
      <svg :class="getEmptyStateIconClass()" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      <h3 :class="getEmptyStateTitleClass()">No orders</h3>
      <p :class="getEmptyStateDescriptionClass()">You haven't placed any orders yet.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue'
import { useOrderStore } from '../stores/orders'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useUIClasses } from '../composables/useUIClasses'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'

export default defineComponent({
  name: 'MyOrdersView',
  setup() {
    const orderStore = useOrderStore()
    const authStore = useAuthStore()
    const router = useRouter()
    const {
      getMyOrdersContainerClass,
      getMyOrdersHeaderContainerClass,
      getMyOrdersHeaderContentClass,
      getMyOrdersHeaderTitleClass,
      getMyOrdersHeaderDescriptionClass,
      getMyOrdersLoadingContainerClass,
      getMyOrdersLoadingButtonClass,
      getMyOrdersLoadingSpinnerClass,
      getMyOrdersErrorContainerClass,
      getMyOrdersErrorCardClass,
      getMyOrdersErrorFlexClass,
      getMyOrdersErrorIconContainerClass,
      getMyOrdersErrorIconClass,
      getMyOrdersErrorContentClass,
      getMyOrdersErrorTitleClass,
      getMyOrdersErrorMessageClass,
      getMyOrdersTableContainerClass,
      getMyOrdersTableWrapperClass,
      getMyOrdersTableInnerClass,
      getMyOrdersTableClass,
      getMyOrdersTableHeaderClass,
      getMyOrdersTableHeaderCellClass,
      getMyOrdersTableHeaderCellRightClass,
      getMyOrdersTableBodyClass,
      getMyOrdersTableRowClass,
      getMyOrdersTableCellClass,
      getMyOrdersTableCellRightClass,
      getMyOrdersTableLinkClass,
      getMyOrdersStatusBadgeClass,
      getStatusBadgeClass,
      getTableContainerClass,
      getTableClass,
      getTableHeaderClass,
      getTableBodyClass,
      getTableRowClass,
      getTableCellClass,
      getEmptyStateClass,
      getEmptyStateIconClass,
      getEmptyStateTitleClass,
      getEmptyStateDescriptionClass,
    } = useUIClasses()

    // * Get user's orders (already filtered by the API)
    const orders = computed(() => {
      return orderStore.orders
    })

    const getOrderItemsSummary = (items: Array<{ product: { name: string } }>) => {
      if (items.length === 0) return ''
      if (items.length === 1) return items[0].product.name
      return `${items[0].product.name}${items.length > 1 ? ` +${items.length - 1} more` : ''}`
    }

    const viewOrderDetails = (orderId: number) => {
      router.push(`/my-orders/${orderId}`)
    }

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        try {
          await orderStore.fetchMyOrders()
        } catch (error) {
          // Error is already handled by the store and will show a toast
          console.error('Failed to fetch orders in MyOrdersView:', error)
        }
      }
    })

    return {
      ordersStore: orderStore,
      orders,
      formatDate,
      formatCurrency,
      getOrderItemsSummary,
      getStatusBadgeClass,
      viewOrderDetails,
      getMyOrdersContainerClass,
      getMyOrdersHeaderContainerClass,
      getMyOrdersHeaderContentClass,
      getMyOrdersHeaderTitleClass,
      getMyOrdersHeaderDescriptionClass,
      getMyOrdersLoadingContainerClass,
      getMyOrdersLoadingButtonClass,
      getMyOrdersLoadingSpinnerClass,
      getMyOrdersErrorContainerClass,
      getMyOrdersErrorCardClass,
      getMyOrdersErrorFlexClass,
      getMyOrdersErrorIconContainerClass,
      getMyOrdersErrorIconClass,
      getMyOrdersErrorContentClass,
      getMyOrdersErrorTitleClass,
      getMyOrdersErrorMessageClass,
      getMyOrdersTableContainerClass,
      getMyOrdersTableWrapperClass,
      getMyOrdersTableInnerClass,
      getMyOrdersTableClass,
      getMyOrdersTableHeaderClass,
      getMyOrdersTableHeaderCellClass,
      getMyOrdersTableHeaderCellRightClass,
      getMyOrdersTableBodyClass,
      getMyOrdersTableRowClass,
      getMyOrdersTableCellClass,
      getMyOrdersTableCellRightClass,
      getMyOrdersTableLinkClass,
      getMyOrdersStatusBadgeClass,
      getTableContainerClass,
      getTableClass,
      getTableHeaderClass,
      getTableBodyClass,
      getTableRowClass,
      getTableCellClass,
      getEmptyStateClass,
      getEmptyStateIconClass,
      getEmptyStateTitleClass,
      getEmptyStateDescriptionClass,
    }
  },
})
</script>
