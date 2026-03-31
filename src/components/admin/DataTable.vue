<script setup lang="ts">
import { ref, computed } from 'vue'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
}

const props = withDefaults(defineProps<{
  columns: TableColumn[]
  data: Record<string, any>[]
  loading?: boolean
  pagination?: Pagination
  rowKey?: string
}>(), {
  rowKey: 'id',
  loading: false
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'page-size-change', pageSize: number): void
  (e: 'sort', key: string, order: 'asc' | 'desc'): void
  (e: 'row-click', row: Record<string, any>): void
}>()

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]
    
    if (aVal === bVal) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    
    const cmp = aVal < bVal ? -1 : 1
    return sortOrder.value === 'asc' ? cmp : -cmp
  })
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', key, sortOrder.value)
}

const getRowKeyValue = (row: Record<string, any>) => {
  return row[props.rowKey]
}
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="{ width: column.width, textAlign: column.align || 'left' }"
            class="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            :class="{ 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700': column.sortable }"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center gap-1" :class="{ 'justify-center': column.align === 'center', 'justify-end': column.align === 'right' }">
              {{ column.label }}
              <span v-if="column.sortable && sortKey === column.key" :class="sortOrder === 'asc' ? 'i-carbon-arrow-up' : 'i-carbon-arrow-down'" />
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
        <tr
          v-if="loading"
          v-for="i in 5"
          :key="i"
          class="animate-pulse"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3"
          >
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </td>
        </tr>
        <tr
          v-else-if="data.length === 0"
        >
          <td :colspan="columns.length" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            暂无数据
          </td>
        </tr>
        <tr
          v-else
          v-for="row in sortedData"
          :key="getRowKeyValue(row)"
          class="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
          @click="emit('row-click', row)"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
            :class="{ 'text-center': column.align === 'center', 'text-right': column.align === 'right' }"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="pagination && pagination.total > 0" class="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
      <div class="text-sm text-gray-500 dark:text-gray-400">
        共 {{ pagination.total }} 条
      </div>
      <div class="flex items-center gap-2">
        <select
          :value="pagination.pageSize"
          @change="emit('page-size-change', Number(($event.target as HTMLSelectElement).value))"
          class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option :value="10">10 条/页</option>
          <option :value="20">20 条/页</option>
          <option :value="50">50 条/页</option>
        </select>
        <div class="flex items-center gap-1">
          <button
            :disabled="pagination.page <= 1"
            class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="emit('page-change', pagination.page - 1)"
          >
            上一页
          </button>
          <span class="px-2 py-1 text-sm text-gray-700 dark:text-gray-300">
            {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.pageSize) }}
          </span>
          <button
            :disabled="pagination.page >= Math.ceil(pagination.total / pagination.pageSize)"
            class="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            @click="emit('page-change', pagination.page + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
