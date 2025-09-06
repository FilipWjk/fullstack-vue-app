<template>
  <div :class="getMainLayoutClass()">
    <!-- Page header -->
    <div :class="getPageHeaderClass()">
      <div>
        <h1 :class="getPageTitleClass()">Orders</h1>
        <p :class="getPageDescriptionClass()">Manage customer orders and track status</p>
      </div>

      <!-- Filters -->
      <div :class="getFilterContainerClass()">
        <h3 :class="getFilterHeaderClass()">Filter Orders</h3>
        <div :class="getOrdersFilterGridClass()">
          <div>
            <label :class="getLabelClass()" class="mb-2">Search</label>
            <input
              v-model="searchQuery"
              @input="handleFilterChange"
              type="text"
              placeholder="Search orders..."
              :class="getInputClass()"
            />
          </div>
          <div>
            <label :class="getLabelClass()" class="mb-2">Status</label>
            <select v-model="filterStatus" @change="handleFilterChange" :class="getSelectClass()">
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div class="flex items-end">
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

      <!-- Orders Table -->
      <div :class="getOrdersTableContainerClass()">
        <table :class="getOrdersTableClass()">
          <thead :class="getOrdersTableHeaderClass()">
            <tr>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('orderNumber')">
                <div :class="getTableHeaderFlexClass()">
                  Order ID
                  <component
                    :is="getSortIcon('orderNumber')"
                    v-if="getSortIcon('orderNumber')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('customer')">
                <div :class="getTableHeaderFlexClass()">
                  Customer
                  <component
                    :is="getSortIcon('customer')"
                    v-if="getSortIcon('customer')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('date')">
                <div :class="getTableHeaderFlexClass()">
                  Date
                  <component
                    :is="getSortIcon('date')"
                    v-if="getSortIcon('date')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('status')">
                <div :class="getTableHeaderFlexClass()">
                  Status
                  <component
                    :is="getSortIcon('status')"
                    v-if="getSortIcon('status')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('total')">
                <div :class="getTableHeaderFlexClass()">
                  Total
                  <component
                    :is="getSortIcon('total')"
                    v-if="getSortIcon('total')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellClass()" @click="handleSort('items')">
                <div :class="getTableHeaderFlexClass()">
                  Items
                  <component
                    :is="getSortIcon('items')"
                    v-if="getSortIcon('items')"
                    :class="getTableSortIconClass()"
                  />
                </div>
              </th>
              <th :class="getOrdersTableHeaderCellActionsClass()">Actions</th>
            </tr>
          </thead>
          <tbody :class="getOrdersTableBodyClass()">
            <template v-if="loading">
              <tr v-for="n in 5" :key="n">
                <td v-for="m in 7" :key="m" :class="getOrdersTableSkeletonCellClass()">
                  <div :class="getOrdersTableSkeletonClass()"></div>
                </td>
              </tr>
            </template>
            <tr v-else-if="orders.length === 0">
              <td colspan="7" :class="getOrdersTableEmptyCellClass()">No orders found</td>
            </tr>
            <tr
              v-else
              v-for="order in filteredOrders"
              :key="order.id"
              :class="getOrdersTableRowClass()"
            >
              <td :class="getOrdersTableCellClass()">
                <div :class="getOrderNumberClass()">#{{ order.orderNumber }}</div>
              </td>
              <td :class="getOrdersTableCellClass()">
                <div>
                  <div :class="getCustomerNameClass()">
                    {{ order.user?.name || 'Unknown' }}
                  </div>
                  <div :class="getCustomerEmailClass()">
                    {{ order.user?.email || 'Unknown' }}
                  </div>
                </div>
              </td>
              <td :class="getOrdersTableCellClass()">
                <div :class="getOrderDateClass()">
                  {{ formatDate(order.createdAt) }}
                </div>
              </td>
              <td :class="getOrdersTableCellClass()">
                <span
                  :class="getStatusBadgeClass(order.status)"
                  class="px-2 py-1 text-xs font-medium rounded-full"
                >
                  {{ order.status }}
                </span>
              </td>
              <td :class="getOrdersTableCellClass()">
                <div :class="getOrderTotalClass()">
                  {{ formatCurrency(order.total) }}
                </div>
              </td>
              <td :class="getOrdersTableCellClass()">
                <div :class="getOrderItemsClass()">{{ order.orderItems?.length || 0 }} items</div>
              </td>
              <td :class="getOrdersTableActionsClass()">
                <div :class="getOrdersTableActionsContainerClass()">
                  <router-link :to="`/orders/${order.id}`" :class="getOrderViewLinkClass()">
                    View
                  </router-link>
                  <select
                    v-model="order.status"
                    @change="updateOrderStatus(order)"
                    :class="getOrderStatusSelectClass()"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useOrderStore, type Order } from '../stores/orders'
import { useToast } from 'vue-toastification'
import { ErrorMessages } from '../utils/errorMessages'
import { SuccessMessages } from '../utils/successMessages'
import { formatCurrency } from '../utils/currency'
import { formatDate } from '../utils/date'
import { useTableSorting } from '../utils/sorting'
import { debounce, SEARCH_DEBOUNCE_DELAY } from '../utils/debounce'
import { useUIClasses } from '../composables/useUIClasses'
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const toast = useToast()
const orderStore = useOrderStore()

// UI classes
const {
  getMainLayoutClass,
  getPageHeaderClass,
  getPageTitleClass,
  getPageDescriptionClass,
  getFilterContainerClass,
  getFilterHeaderClass,
  getOrdersFilterGridClass,
  getLabelClass,
  getInputClass,
  getSelectClass,
  getPrimaryButtonClass,
  getOrdersTableContainerClass,
  getOrdersTableClass,
  getOrdersTableHeaderClass,
  getOrdersTableHeaderCellClass,
  getOrdersTableHeaderCellActionsClass,
  getOrdersTableBodyClass,
  getOrdersTableRowClass,
  getOrdersTableCellClass,
  getOrdersTableSkeletonCellClass,
  getOrdersTableSkeletonClass,
  getOrdersTableEmptyCellClass,
  getOrdersTableActionsClass,
  getOrdersTableActionsContainerClass,
  getOrderNumberClass,
  getCustomerNameClass,
  getCustomerEmailClass,
  getOrderDateClass,
  getOrderTotalClass,
  getOrderItemsClass,
  getOrderViewLinkClass,
  getOrderStatusSelectClass,
  getTableHeaderFlexClass,
  getTableSortIconClass,
  getStatusBadgeClass,
} = useUIClasses()

const searchQuery = ref('')
const filterStatus = ref('')

const orders = computed(() => orderStore.orders)
const loading = computed(() => orderStore.isLoading)

// * Sorting configuration for orders
const {
  sortedData: sortedOrders,
  handleSort,
  getSortIcon: getSortIconDirection,
} = useTableSorting(orders, {
  numericFields: ['total'],
  customGetters: {
    customer: (order) => (order as Order).user?.name || 'Unknown',
    date: (order) => new Date((order as Order).createdAt).getTime(),
    items: (order) => (order as Order).orderItems?.length || 0,
  },
})

const filteredOrders = computed(() => {
  return sortedOrders.value
})

// * Get sort icon component for header
const getSortIcon = (field: string) => {
  const direction = getSortIconDirection(field)
  if (!direction) return null
  return direction === 'up' ? ChevronUpIcon : ChevronDownIcon
}

const updateOrderStatus = async (order: Order) => {
  try {
    await orderStore.updateOrderStatus(order.id, order.status)
    toast.success(SuccessMessages.ORDER_UPDATE_SUCCESS)
  } catch (error) {
    console.error('Error updating order status:', error)
    toast.error(ErrorMessages.ORDER_UPDATE_FAILED)
  }
}

// * Check if any filters are currently applied
const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || filterStatus.value !== ''
})

const clearFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  applyFilters()
}

const doApplyFilters = () => {
  orderStore.setFilters({
    search: searchQuery.value,
    status: filterStatus.value,
  })
  orderStore.fetchOrders()
}

const debouncedApplyFilters = debounce(doApplyFilters, SEARCH_DEBOUNCE_DELAY)

const handleFilterChange = (event?: Event) => {
  const target = event?.target as HTMLElement | undefined
  if (target && target.tagName === 'INPUT') {
    debouncedApplyFilters()
  } else {
    doApplyFilters()
  }
}

const applyFilters = () => {
  doApplyFilters()
}

onMounted(async () => {
  try {
    await orderStore.fetchOrders()
  } catch (error) {
    console.error('Error fetching orders:', error)
    toast.error(ErrorMessages.ORDERS_FETCH_FAILED)
  }
})
</script>
