<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import DataForm from '@/components/admin/DataForm.vue'
import adminApi, { type ServiceType, type CreateServiceTypeData } from '@/api/admin'
import type { FormField } from '@/components/admin/DataForm.vue'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<ServiceType[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const editingItem = ref<ServiceType | null>(null)
const formLoading = ref(false)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'code', label: '代码', sortable: true },
  { key: 'name', label: '名称', sortable: true },
  { key: 'description', label: '描述' },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'created_at', label: '创建时间', width: '160px' }
]

const fields: FormField[] = [
  { key: 'code', label: '代码', type: 'text', required: true, placeholder: '如: llm, asr' },
  { key: 'name', label: '名称', type: 'text', required: true, placeholder: '如: 大模型, 语音识别' },
  { key: 'description', label: '描述', type: 'textarea', placeholder: '服务类型描述' },
  { key: 'is_active', label: '是否启用', type: 'switch', placeholder: '启用后该服务类型可正常使用' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getServiceTypes()
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load service types:', error)
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  editingItem.value = null
  showForm.value = true
}

const handleEdit = (row: ServiceType) => {
  editingItem.value = row
  showForm.value = true
}

const handleDelete = async (row: ServiceType) => {
  if (!confirm(`确定要删除服务类型 "${row.name}" 吗？`)) return
  try {
    await adminApi.deleteServiceType(row.id)
    loadData()
  } catch (error: any) {
    console.error('Failed to delete service type:', error)
    alert(error.response?.data?.detail || '删除失败，该服务类型可能有关联配置')
  }
}

const handleFormSubmit = async (values: Record<string, any>) => {
  formLoading.value = true
  try {
    if (editingItem.value) {
      await adminApi.updateServiceType(editingItem.value.id, values)
    } else {
      await adminApi.createServiceType(values as CreateServiceTypeData)
    }
    showForm.value = false
    loadData()
  } catch (error: any) {
    console.error('Failed to save service type:', error)
    alert(error.response?.data?.detail || '保存失败')
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
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">服务类型管理</h2>
      <button
        @click="handleCreate"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 border border-blue-600 shadow-sm"
      >
        新建服务类型
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @page-change="() => {}"
      @page-size-change="() => {}"
      @row-click="(row) => handleEdit(row as ServiceType)"
    >
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
          <button @click.stop="handleEdit(row as ServiceType)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as ServiceType)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingItem ? '编辑服务类型' : '新建服务类型' }}
        </h3>
        <DataForm
          :fields="fields"
          :initial-values="editingItem ? {
            code: editingItem.code,
            name: editingItem.name,
            description: editingItem.description,
            is_active: editingItem.is_active
          } : undefined"
          :loading="formLoading"
          @submit="handleFormSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>
