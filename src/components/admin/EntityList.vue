<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable, { type TableColumn, type Pagination } from './DataTable.vue'

export interface EntityListConfig {
  title: string
  entityName: string
  columns: TableColumn[]
  fetchData: (params?: { page?: number; pageSize?: number; search?: string }) => Promise<{ data: Record<string, any>[]; total: number }>
  onRowClick?: (row: Record<string, any>) => void
}

const props = defineProps<EntityListConfig>()

const router = useRouter()

const data = ref<Record<string, any>[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})
const search = ref('')
const searchInput = ref('')

const loadData = async () => {
  loading.value = true
  try {
    const result = await props.fetchData({
      page: pagination.value.page,
      pageSize: pagination.value.pageSize,
      search: search.value
    })
    data.value = result.data
    pagination.value.total = result.total
  } catch (error) {
    console.error('Failed to load data:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  search.value = searchInput.value
  pagination.value.page = 1
  loadData()
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadData()
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.page = 1
  loadData()
}

const handleRowClick = (row: Record<string, any>) => {
  if (props.onRowClick) {
    props.onRowClick(row)
  } else {
    const id = row.id ?? row._id
    if (id !== undefined) {
      router.push(`/admin/${props.entityName}/${id}`)
    }
  }
}

onMounted(() => {
  loadData()
})

defineExpose({ reload: loadData })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ props.title }}</h2>
      <button
        @click="router.push(`/admin/${props.entityName}/new`)"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        新建
      </button>
    </div>

    <div class="flex items-center gap-2">
      <input
        v-model="searchInput"
        type="text"
        placeholder="搜索..."
        class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
        @keyup.enter="handleSearch"
      />
      <button
        @click="handleSearch"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        搜索
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @row-click="handleRowClick"
    />
  </div>
</template>
