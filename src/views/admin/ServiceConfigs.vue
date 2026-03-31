<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import DataForm from '@/components/admin/DataForm.vue'
import adminApi, { type ServiceConfig, type CreateServiceConfigData } from '@/api/admin'
import type { FormField } from '@/components/admin/DataForm.vue'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<ServiceConfig[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const editingItem = ref<ServiceConfig | null>(null)
const formLoading = ref(false)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'code_id', label: '关联邀请码ID', width: '120px' },
  { key: 'config_json', label: '配置', width: '200px' },
  { key: 'created_at', label: '创建时间', width: '160px' },
  { key: 'updated_at', label: '更新时间', width: '160px' }
]

const fields: FormField[] = [
  { key: 'code_id', label: '关联邀请码ID', type: 'number', required: true },
  { key: 'config_json', label: '配置JSON', type: 'textarea', required: true, placeholder: '{"llm":{"api_key":"xxx","base_url":"xxx","model":"xxx"}}' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getServiceConfigs()
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load service configs:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingItem.value = null
  showForm.value = true
}

const handleEdit = (row: ServiceConfig) => {
  editingItem.value = row
  showForm.value = true
}

const handleDelete = async (row: ServiceConfig) => {
  if (!confirm(`确定要删除此配置吗？`)) return
  try {
    await adminApi.deleteServiceConfig(row.id)
    loadData()
  } catch (error) {
    console.error('Failed to delete service config:', error)
    alert('删除失败')
  }
}

const handleFormSubmit = async (values: Record<string, any>) => {
  formLoading.value = true
  try {
    if (editingItem.value) {
      await adminApi.updateServiceConfig(editingItem.value.id, values)
    } else {
      await adminApi.createServiceConfig(values as CreateServiceConfigData)
    }
    showForm.value = false
    loadData()
  } catch (error) {
    console.error('Failed to save service config:', error)
    alert('保存失败')
  } finally {
    formLoading.value = false
  }
}

onMounted(() => {
  loadData()
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
        创建配置
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="() => {}"
      @page-size-change="() => {}"
      @row-click="(row) => handleEdit(row as ServiceConfig)"
    >
      <template #cell-config_json="{ value }">
        <code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded block max-w-xs truncate">{{ value }}</code>
      </template>
      <template #cell-created_at="{ value }">
        {{ value ? value.split('T')[0] : '-' }}
      </template>
      <template #cell-updated_at="{ value }">
        {{ value ? value.split('T')[0] : '-' }}
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button @click.stop="handleEdit(row as ServiceConfig)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as ServiceConfig)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingItem ? '编辑配置' : '创建配置' }}
        </h3>
        <DataForm
          :fields="fields"
          :initial-values="editingItem ? {
            code_id: editingItem.code_id,
            config_json: editingItem.config_json
          } : undefined"
          :loading="formLoading"
          @submit="handleFormSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>
