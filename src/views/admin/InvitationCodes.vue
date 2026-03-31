<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import DataForm from '@/components/admin/DataForm.vue'
import adminApi, { type InvitationCode, type CreateInvitationCodeData } from '@/api/admin'
import type { FormField } from '@/components/admin/DataForm.vue'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<InvitationCode[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const editingItem = ref<InvitationCode | null>(null)
const formLoading = ref(false)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'code', label: '邀请码', sortable: true },
  { key: 'max_uses', label: '可用次数', width: '100px' },
  { key: 'used_count', label: '已使用', width: '100px' },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'expires_at', label: '过期时间', width: '120px' },
  { key: 'created_at', label: '创建时间', width: '120px' }
]

const fields: FormField[] = [
  { key: 'code', label: '邀请码', type: 'text', required: true, placeholder: '输入邀请码' },
  { key: 'max_uses', label: '最大使用次数', type: 'number' },
  { key: 'is_active', label: '是否启用', type: 'switch', placeholder: '启用后邀请码可正常使用' },
  { key: 'expires_at', label: '过期时间', type: 'date', placeholder: '格式: YYYY-MM-DD' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getInvitationCodes({
      skip: (pagination.value.page - 1) * pagination.value.pageSize,
      limit: pagination.value.pageSize
    })
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load invitation codes:', error)
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

const handleRowClick = (row: Record<string, any>) => {
  handleEdit(row as InvitationCode)
}

const handleCreate = () => {
  editingItem.value = null
  showForm.value = true
}

const handleEdit = (row: InvitationCode) => {
  editingItem.value = row
  showForm.value = true
}

const handleDelete = async (row: InvitationCode) => {
  if (!confirm(`确定要删除邀请码 "${row.code}" 吗？`)) return
  try {
    await adminApi.deleteInvitationCode(row.id)
    loadData()
  } catch (error) {
    console.error('Failed to delete invitation code:', error)
    alert('删除失败')
  }
}

const handleFormSubmit = async (values: Record<string, any>) => {
  formLoading.value = true
  try {
    if (editingItem.value) {
      await adminApi.updateInvitationCode(editingItem.value.id, values)
    } else {
      await adminApi.createInvitationCode(values as CreateInvitationCodeData)
    }
    showForm.value = false
    loadData()
  } catch (error) {
    console.error('Failed to save invitation code:', error)
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
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">邀请码管理</h2>
      <button
        @click="handleCreate"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
      >
        创建邀请码
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
    >
      <template #cell-is_active="{ value }">
        <span
          class="px-2 py-1 text-xs font-medium rounded"
          :class="value ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
        >
          {{ value ? '启用' : '禁用' }}
        </span>
      </template>
      <template #cell-expires_at="{ value }">
        {{ value ? value.split('T')[0] : '-' }}
      </template>
      <template #cell-created_at="{ value }">
        {{ value ? value.split('T')[0] : '-' }}
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button @click.stop="handleEdit(row as InvitationCode)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as InvitationCode)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingItem ? '编辑邀请码' : '创建邀请码' }}
        </h3>
        <DataForm
          :fields="fields"
          :initial-values="editingItem ? {
            code: editingItem.code,
            max_uses: editingItem.max_uses,
            is_active: editingItem.is_active,
            expires_at: editingItem.expires_at ? editingItem.expires_at.split('T')[0] : ''
          } : undefined"
          :loading="formLoading"
          @submit="handleFormSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>
