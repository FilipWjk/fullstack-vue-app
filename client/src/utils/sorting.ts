import { ref, computed, type Ref } from 'vue'

export interface SortState {
  field: string | null
  direction: 'asc' | 'desc'
}

export interface SortConfig<T = unknown> {
  numericFields?: string[]
  customGetters?: Record<string, (item: T) => unknown>
}

export function useTableSorting<T extends Record<string, unknown>>(
  data: Ref<T[]>,
  config: SortConfig<T> = {},
) {
  const sortState = ref<SortState>({
    field: null,
    direction: 'asc',
  })

  const { numericFields = [], customGetters = {} } = config

  const sortedData = computed(() => {
    const sortedItems = [...data.value]

    if (sortState.value.field) {
      sortedItems.sort((a, b) => {
        let aValue: unknown
        let bValue: unknown

        // * Use custom getter if available
        if (customGetters[sortState.value.field!]) {
          aValue = customGetters[sortState.value.field!](a)
          bValue = customGetters[sortState.value.field!](b)
        } else {
          aValue = a[sortState.value.field!]
          bValue = b[sortState.value.field!]
        }

        // * Handle numeric fields
        if (numericFields.includes(sortState.value.field!)) {
          const aNum = Number(aValue) || 0
          const bNum = Number(bValue) || 0
          return sortState.value.direction === 'asc' ? aNum - bNum : bNum - aNum
        }

        // * Handle string fields
        const aStr = String(aValue || '').toLowerCase()
        const bStr = String(bValue || '').toLowerCase()

        if (aStr < bStr) return sortState.value.direction === 'asc' ? -1 : 1
        if (aStr > bStr) return sortState.value.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return sortedItems
  })

  const handleSort = (field: string) => {
    if (sortState.value.field === field) {
      sortState.value.direction = sortState.value.direction === 'asc' ? 'desc' : 'asc'
    } else {
      sortState.value.field = field
      sortState.value.direction = 'asc'
    }
  }

  const getSortIcon = (field: string) => {
    if (sortState.value.field !== field) return null
    return sortState.value.direction === 'asc' ? 'up' : 'down'
  }

  const resetSort = () => {
    sortState.value.field = null
    sortState.value.direction = 'asc'
  }

  return {
    sortState,
    sortedData,
    handleSort,
    getSortIcon,
    resetSort,
  }
}
