<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import adminApi, { type ServiceConfig, type ServiceType, type CreateServiceConfigData } from '@/api/admin'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<ServiceConfig[]>([])
const serviceTypes = ref<ServiceType[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const showDetailModal = ref(false)
const editingConfig = ref<ServiceConfig | null>(null)
const selectedConfig = ref<ServiceConfig | null>(null)
const formLoading = ref(false)

const serviceTypeFilter = ref<number | undefined>(undefined)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'name', label: '配置名称', sortable: true },
  { key: 'service_type', label: '服务类型', width: '100px' },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'created_at', label: '创建时间', width: '160px' }
]

const formData = ref({
  service_type_id: 0,
  name: '',
  config_data: '',
  is_active: true
})

const llmFormData = ref({
  base_url: '',
  api_key: '',
  model: ''
})

const asrFormData = ref({
  app_id: '',
  api_key: '',
  secret_key: ''
})

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getServiceConfigs({
      service_type_id: serviceTypeFilter.value,
      skip: (pagination.value.page - 1) * pagination.value.pageSize,
      limit: pagination.value.pageSize
    })
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load service configs:', error)
  } finally {
    loading.value = false
  }
}

const loadServiceTypes = async () => {
  try {
    const result = await adminApi.getServiceTypes()
    serviceTypes.value = result.data
  } catch (error) {
    console.error('Failed to load service types:', error)
  }
}

const handleFilterChange = () => {
  pagination.value.page = 1
  loadData()
}

const handleRowClick = (row: ServiceConfig) => {
  selectedConfig.value = row
  showDetailModal.value = true
}

const handleCreate = () => {
  formData.value = {
    service_type_id: serviceTypes.value[0]?.id || 0,
    name: '',
    config_data: '',
    is_active: true
  }
  llmFormData.value = { base_url: '', api_key: '', model: '' }
  asrFormData.value = { app_id: '', api_key: '', secret_key: '' }
  editingConfig.value = null
  showForm.value = true
}

const handleEdit = (row: ServiceConfig) => {
  editingConfig.value = row
  formData.value = {
    service_type_id: row.service_type_id,
    name: row.name,
    config_data: row.config_data,
    is_active: row.is_active
  }
  
  try {
    const parsed = JSON.parse(row.config_data)
    if (row.service_type?.code === 'llm') {
      llmFormData.value = {
        base_url: parsed.base_url || '',
        api_key: parsed.api_key || '',
        model: parsed.model || ''
      }
    } else if (row.service_type?.code === 'asr') {
      asrFormData.value = {
        app_id: parsed.app_id || '',
        api_key: parsed.api_key || '',
        secret_key: parsed.secret_key || ''
      }
    }
  } catch {}
  
  showForm.value = true
}

const handleDelete = async (row: ServiceConfig) => {
  if (!confirm(`确定要删除配置 "${row.name}" 吗？`)) return
  try {
    await adminApi.deleteServiceConfig(row.id)
    loadData()
  } catch (error: any) {
    console.error('Failed to delete service config:', error)
    alert(error.response?.data?.detail || '删除失败')
  }
}

const getConfigDataFromForm = () => {
  const serviceType = serviceTypes.value.find(t => t.id === formData.value.service_type_id)
  if (serviceType?.code === 'llm') {
    return JSON.stringify(llmFormData.value)
  } else if (serviceType?.code === 'asr') {
    return JSON.stringify(asrFormData.value)
  }
  return formData.value.config_data
}

const handleFormSubmit = async () => {
  if (!formData.value.name) {
    alert('请填写配置名称')
    return
  }
  
  formLoading.value = true
  try {
    const submitData: CreateServiceConfigData = {
      service_type_id: formData.value.service_type_id,
      name: formData.value.name,
      config_data: getConfigDataFromForm(),
      is_active: formData.value.is_active
    }
    
    if (editingConfig.value) {
      await adminApi.updateServiceConfig(editingConfig.value.id, submitData)
    } else {
      await adminApi.createServiceConfig(submitData)
    }
    showForm.value = false
    loadData()
  } catch (error: any) {
    console.error('Failed to save service config:', error)
    alert(error.response?.data?.detail || '保存失败')
  } finally {
    formLoading.value = false
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
  loadServiceTypes()
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">服务配置</h2>
      <button
        @click="handleCreate"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
      >
        新建配置
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
          <option :value="undefined">全部</option>
          <option v-for="st in serviceTypes" :key="st.id" :value="st.id">
            {{ st.name }}
          </option>
        </select>
      </div>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="handleFilterChange"
      @page-size-change="handleFilterChange"
      @row-click="(row) => handleRowClick(row as ServiceConfig)"
    >
      <template #cell-service_type="{ row }">
        <span
          class="px-2 py-1 text-xs font-medium rounded"
          :class="row.service_type?.code === 'llm' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'"
        >
          {{ row.service_type?.name || row.service_type_id }}
        </span>
      </template>
      <template #cell-is_active="{ value }">
        <span
          class="px-2 py-1 text-xs font-medium rounded"
          :class="value ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
        >
          {{ value ? '启用' : '禁用' }}
        </span>
      </template>
      <template #cell-created_at="{ value }">
        {{ value ? value.replace('T', ' ').split('.')[0] : '-' }}
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button @click.stop="handleEdit(row as ServiceConfig)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as ServiceConfig)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-auto">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingConfig ? '编辑配置' : '新建配置' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              服务类型 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="formData.service_type_id"
              :disabled="!!editingConfig"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50"
            >
              <option v-for="st in serviceTypes" :key="st.id" :value="st.id">
                {{ st.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              配置名称 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="如: COOL2026-LLM"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              是否启用
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="formData.is_active" class="w-4 h-4 text-primary-600 border-gray-300 rounded" />
              <span class="text-sm text-gray-600 dark:text-gray-400">启用后该配置可正常使用</span>
            </label>
          </div>

          <div v-if="serviceTypes.find(t => t.id === formData.service_type_id)?.code === 'llm'" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">LLM 配置</h4>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Base URL</label>
              <input v-model="llmFormData.base_url" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="https://api.example.com/v1" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">API Key</label>
              <input v-model="llmFormData.api_key" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="sk-xxx" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Model</label>
              <input v-model="llmFormData.model" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="gpt-4" />
            </div>
          </div>

          <div v-else-if="serviceTypes.find(t => t.id === formData.service_type_id)?.code === 'asr'" class="space-y-3">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">ASR 配置</h4>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">App ID</label>
              <input v-model="asrFormData.app_id" type="text" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="123456" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">API Key</label>
              <input v-model="asrFormData.api_key" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
            <div>
              <label class="block text-sm text-gray-600 dark:text-gray-400 mb-1">Secret Key</label>
              <input v-model="asrFormData.secret_key" type="password" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="showForm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              取消
            </button>
            <button
              @click="handleFormSubmit"
              :disabled="formLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {{ formLoading ? '保存中...' : '保存' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal && selectedConfig" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDetailModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">配置详情</h3>
          <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="i-carbon-close text-xl" />
          </button>
        </div>
        <div class="p-6 overflow-auto max-h-[calc(80vh-60px)]">
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">配置名称</div>
              <div class="text-gray-900 dark:text-white">{{ selectedConfig.name }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">服务类型</div>
              <div class="text-gray-900 dark:text-white">{{ selectedConfig.service_type?.name }}</div>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">状态</div>
              <span
                class="px-2 py-1 text-xs font-medium rounded"
                :class="selectedConfig.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
              >
                {{ selectedConfig.is_active ? '启用' : '禁用' }}
              </span>
            </div>
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">创建时间</div>
              <div class="text-gray-900 dark:text-white">{{ selectedConfig.created_at }}</div>
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">配置内容</div>
            <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg text-sm text-gray-900 dark:text-gray-100 overflow-auto">{{ formatJson(selectedConfig.config_data) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
