<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import adminApi, { type ServiceCallLog, type ServiceCallLogDetail } from '@/api/admin'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<ServiceCallLog[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 15,
  total: 0
})
const totalPages = ref(1)

const serviceTypeFilter = ref<string>('')
const showDetailModal = ref(false)
const selectedLog = ref<ServiceCallLogDetail | null>(null)
const detailLoading = ref(false)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'service_type', label: '服务类型', width: '100px' },
  { key: 'endpoint', label: '接口', sortable: true },
  { key: 'duration_ms', label: '耗时', width: '80px' },
  { key: 'status_code', label: '状态码', width: '80px' },
  { key: 'ip', label: 'IP', width: '120px' },
  { key: 'created_at', label: '时间', width: '160px' }
]

const serviceTypeOptions = [
  { label: '全部', value: '' },
  { label: 'LLM 服务', value: 'llm' },
  { label: '语音识别服务', value: 'asr' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getServiceCallLogs({
      service_type: serviceTypeFilter.value || undefined,
      page: pagination.value.page,
      page_size: pagination.value.pageSize
    })
    data.value = result.data
    pagination.value.total = result.count
    totalPages.value = result.total_pages
  } catch (error) {
    console.error('Failed to load service call logs:', error)
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

const handleFilterChange = () => {
  pagination.value.page = 1
  loadData()
}

const handleRowClick = async (row: ServiceCallLog) => {
  detailLoading.value = true
  showDetailModal.value = true
  selectedLog.value = null
  try {
    selectedLog.value = await adminApi.getServiceCallLogDetail(row.id)
  } catch (error) {
    console.error('Failed to load log detail:', error)
    showDetailModal.value = false
  } finally {
    detailLoading.value = false
  }
}

const formatJson = (str: string | null) => {
  if (!str) return '-'
  try {
    return JSON.stringify(JSON.parse(str), null, 2)
  } catch {
    return str
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">服务日志</h2>
      <button
        @click="loadData"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        刷新
      </button>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-700 dark:text-gray-300">服务类型:</label>
        <select
          v-model="serviceTypeFilter"
          @change="handleFilterChange"
          class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option v-for="opt in serviceTypeOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @row-click="(row) => handleRowClick(row as ServiceCallLog)"
    >
      <template #cell-service_type="{ value }">
        <span
          class="px-2 py-1 text-xs font-medium rounded"
          :class="value === 'llm' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'"
        >
          {{ value === 'llm' ? 'LLM' : 'ASR' }}
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
        <span :class="value > 3000 ? 'text-red-500' : value > 1000 ? 'text-yellow-500' : ''">
          {{ value }}ms
        </span>
      </template>
      <template #cell-created_at="{ value }">
        {{ value ? value.replace('T', ' ').split('.')[0] : '-' }}
      </template>
    </DataTable>

    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDetailModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">日志详情</h3>
          <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <span class="i-carbon-close text-xl" />
          </button>
        </div>
        <div class="p-6 overflow-auto max-h-[calc(80vh-60px)]">
          <div v-if="detailLoading" class="flex items-center justify-center py-8">
            <span class="i-carbon-loading animate-spin text-2xl" />
          </div>
          <div v-else-if="selectedLog" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">ID</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.id }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">服务类型</div>
                <div class="text-gray-900 dark:text-white">
                  <span
                    class="px-2 py-1 text-xs font-medium rounded"
                    :class="selectedLog.service_type === 'llm' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'"
                  >
                    {{ selectedLog.service_type === 'llm' ? 'LLM' : 'ASR' }}
                  </span>
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">状态码</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.status_code }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">耗时</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.duration_ms }}ms</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">IP</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.ip }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">时间</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.created_at }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">项目ID</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.project_id }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500 dark:text-gray-400">凭证ID</div>
                <div class="text-gray-900 dark:text-white">{{ selectedLog.credential_id }}</div>
              </div>
            </div>

            <div v-if="selectedLog.error_message">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">错误信息</div>
              <div class="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded">
                {{ selectedLog.error_message }}
              </div>
            </div>

            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">请求数据</div>
              <pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-xs text-gray-900 dark:text-gray-100 max-h-64">{{ formatJson(selectedLog.request_data) }}</pre>
            </div>

            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">响应数据</div>
              <pre class="bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto text-xs text-gray-900 dark:text-gray-100 max-h-64">{{ formatJson(selectedLog.response_data) }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
