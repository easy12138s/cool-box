<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import adminApi, { type Log } from '@/api/admin'
import { type TableColumn, type Pagination } from '@/components/admin/DataTable.vue'

const data = ref<Log[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 20,
  total: 0
})

const projectId = ref<number | undefined>(undefined)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'project_id', label: '项目ID', width: '80px' },
  { key: 'endpoint', label: '接口', sortable: true },
  { key: 'method', label: '方法', width: '80px' },
  { key: 'ip', label: 'IP', width: '120px' },
  { key: 'status_code', label: '状态码', width: '80px' },
  { key: 'duration_ms', label: '耗时', width: '80px' },
  { key: 'created_at', label: '时间', width: '160px' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getLogs({
      project_id: projectId.value,
      skip: (pagination.value.page - 1) * pagination.value.pageSize,
      limit: pagination.value.pageSize
    })
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load logs:', error)
  } finally {
    loading.value = false
  }
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

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">日志查询</h2>
      <button
        @click="loadData"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        刷新
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #cell-method="{ value }">
        <span
          class="px-2 py-0.5 text-xs font-medium rounded"
          :class="{
            'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400': value === 'GET',
            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': value === 'POST',
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400': value === 'PUT',
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': value === 'DELETE'
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-status_code="{ value }">
        <span
          class="px-2 py-1 text-xs font-medium rounded"
          :class="{
            'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': value >= 200 && value < 300,
            'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': value >= 400
          }"
        >
          {{ value }}
        </span>
      </template>
      <template #cell-duration_ms="{ value }">
        <span :class="value > 1000 ? 'text-red-500' : value > 500 ? 'text-yellow-500' : ''">
          {{ value }}ms
        </span>
      </template>
      <template #cell-created_at="{ value }">
        {{ value ? value.replace('T', ' ').split('.')[0] : '-' }}
      </template>
    </DataTable>
  </div>
</template>
