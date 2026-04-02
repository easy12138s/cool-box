<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from '@/components/admin/DataTable.vue'
import adminApi, { type InvitationCode, type ServiceConfig, type ServiceConfigAssociation, type CreateInvitationCodeData } from '@/api/admin'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const data = ref<InvitationCode[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const showDetailModal = ref(false)
const editingItem = ref<InvitationCode | null>(null)
const selectedCode = ref<InvitationCode | null>(null)
const formLoading = ref(false)

const associatedConfigs = ref<ServiceConfigAssociation[]>([])
const availableConfigs = ref<ServiceConfig[]>([])
const configsLoading = ref(false)
const showAddConfigModal = ref(false)

// 表单数据
const formData = ref({
  code: '',
  max_uses: 100,
  is_active: true,
  expires_at: ''
})

// 新建时选中的配置
const selectedConfigIds = ref<number[]>([])

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'code', label: '邀请码', sortable: true },
  { key: 'max_uses', label: '可用次数', width: '100px' },
  { key: 'used_count', label: '已使用', width: '100px' },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'expires_at', label: '过期时间', width: '120px' },
  { key: 'created_at', label: '创建时间', width: '120px' },
  { key: 'actions', label: '操作', width: '100px' }
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

const loadAvailableConfigs = async () => {
  try {
    const result = await adminApi.getServiceConfigs()
    availableConfigs.value = result.data.filter(c => c.is_active)
  } catch (error) {
    console.error('Failed to load available configs:', error)
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

const handleRowClick = async (row: InvitationCode) => {
  selectedCode.value = row
  await loadAssociatedConfigs(row.id)
  showDetailModal.value = true
}

const loadAssociatedConfigs = async (codeId: number) => {
  configsLoading.value = true
  try {
    const result = await adminApi.getInvitationCodeConfigs(codeId)
    associatedConfigs.value = result.data
  } catch (error) {
    console.error('Failed to load associated configs:', error)
    associatedConfigs.value = []
  } finally {
    configsLoading.value = false
  }
}

const handleCreate = () => {
  editingItem.value = null
  formData.value = {
    code: '',
    max_uses: 100,
    is_active: true,
    expires_at: ''
  }
  selectedConfigIds.value = []
  loadAvailableConfigs()
  showForm.value = true
}

const handleEdit = (row: InvitationCode) => {
  editingItem.value = row
  formData.value = {
    code: row.code,
    max_uses: row.max_uses,
    is_active: row.is_active,
    expires_at: row.expires_at ? row.expires_at.split('T')[0] : ''
  }
  selectedConfigIds.value = []
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

const handleFormSubmit = async () => {
  if (!formData.value.code) {
    alert('请填写邀请码')
    return
  }
  
  formLoading.value = true
  try {
    if (editingItem.value) {
      await adminApi.updateInvitationCode(editingItem.value.id, {
        code: formData.value.code,
        max_uses: formData.value.max_uses,
        is_active: formData.value.is_active,
        expires_at: formData.value.expires_at || undefined
      })
    } else {
      const newCode = await adminApi.createInvitationCode({
        code: formData.value.code,
        max_uses: formData.value.max_uses,
        is_active: formData.value.is_active,
        expires_at: formData.value.expires_at || undefined
      } as CreateInvitationCodeData)
      
      if (selectedConfigIds.value.length > 0 && newCode.id) {
        for (const configId of selectedConfigIds.value) {
          try {
            await adminApi.createInvitationCodeConfig(newCode.id, {
              service_config_id: configId,
              is_active: true
            })
          } catch (e) {
            console.error('Failed to associate config:', configId, e)
          }
        }
      }
    }
    showForm.value = false
    loadData()
  } catch (error: any) {
    console.error('Failed to save invitation code:', error)
    alert(error.response?.data?.detail || '保存失败')
  } finally {
    formLoading.value = false
  }
}

const openAddConfigModal = async () => {
  try {
    const result = await adminApi.getServiceConfigs()
    availableConfigs.value = result.data.filter(c => c.is_active)
    showAddConfigModal.value = true
  } catch (error) {
    console.error('Failed to load available configs:', error)
  }
}

const selectedConfigId = ref<number | null>(null)

const handleAddConfig = async () => {
  if (!selectedConfigId.value || !selectedCode.value) return
  try {
    await adminApi.createInvitationCodeConfig(selectedCode.value.id, {
      service_config_id: selectedConfigId.value,
      is_active: true
    })
    showAddConfigModal.value = false
    selectedConfigId.value = null
    await loadAssociatedConfigs(selectedCode.value.id)
  } catch (error: any) {
    console.error('Failed to add config:', error)
    alert(error.response?.data?.detail || '添加失败')
  }
}

const handleToggleConfig = async (assoc: ServiceConfigAssociation) => {
  try {
    await adminApi.updateInvitationCodeConfig(selectedCode.value!.id, assoc.id, {
      is_active: !assoc.is_active
    })
    await loadAssociatedConfigs(selectedCode.value!.id)
  } catch (error) {
    console.error('Failed to toggle config:', error)
    alert('更新失败')
  }
}

const handleRemoveConfig = async (assoc: ServiceConfigAssociation) => {
  if (!confirm(`确定要解除 "${assoc.config.name}" 的关联吗？`)) return
  try {
    await adminApi.deleteInvitationCodeConfig(selectedCode.value!.id, assoc.id)
    await loadAssociatedConfigs(selectedCode.value!.id)
  } catch (error) {
    console.error('Failed to remove config:', error)
    alert('解除关联失败')
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
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
      @row-click="(row) => handleRowClick(row as InvitationCode)"
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
          <button @click.stop="handleEdit(row as InvitationCode)" class="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as InvitationCode)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-auto">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingItem ? '编辑邀请码' : '创建邀请码' }}
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              邀请码 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.code"
              type="text"
              autocomplete="off"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="输入邀请码"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              最大使用次数
            </label>
            <input
              v-model.number="formData.max_uses"
              type="number"
              autocomplete="off"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="100"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              过期时间
            </label>
            <input
              v-model="formData.expires_at"
              type="date"
              autocomplete="off"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="formData.is_active" class="w-4 h-4 text-blue-600 border-gray-300 rounded" />
              <span class="text-sm text-gray-700 dark:text-gray-300">启用邀请码</span>
            </label>
          </div>

          <div v-if="!editingItem" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              关联服务配置（可选）
            </label>
            <div v-if="availableConfigs.length === 0" class="text-sm text-gray-500">
              暂无可用的服务配置
            </div>
            <div v-else class="space-y-2 max-h-48 overflow-auto">
              <label
                v-for="config in availableConfigs"
                :key="config.id"
                class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="config.id"
                  v-model="selectedConfigIds"
                  class="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <div class="flex-1">
                  <div class="text-sm text-gray-900 dark:text-white">{{ config.name }}</div>
                  <div class="text-xs text-gray-500">{{ config.service_type?.name }}</div>
                </div>
              </label>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              @click="showForm = false"
              class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500"
            >
              取消
            </button>
            <button
              @click="handleFormSubmit"
              :disabled="formLoading"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm"
            >
              <span v-if="formLoading">保存中...</span>
              <span v-else>保存</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal && selectedCode" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showDetailModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">邀请码详情</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ selectedCode.code }}</p>
          </div>
          <button @click="showDetailModal = false" class="text-gray-500 hover:text-gray-700">
            <span class="i-carbon-close text-xl" />
          </button>
        </div>
        <div class="p-6 overflow-auto max-h-[calc(80vh-60px)]">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">关联的服务配置</h4>
              <button
                @click="openAddConfigModal"
                class="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                添加配置
              </button>
            </div>

            <div v-if="configsLoading" class="text-center text-gray-500 py-4">
              加载中...
            </div>
            <div v-else-if="associatedConfigs.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
              暂无关联配置
            </div>
            <div v-else class="space-y-2">
              <div
                v-for="assoc in associatedConfigs"
                :key="assoc.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ assoc.config.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ assoc.service_type_name }}</div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="handleToggleConfig(assoc)"
                    class="px-2 py-1 text-xs rounded"
                    :class="assoc.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
                  >
                    {{ assoc.is_active ? '启用' : '禁用' }}
                  </button>
                  <button
                    @click="handleRemoveConfig(assoc)"
                    class="text-red-600 hover:text-red-800 text-sm"
                  >
                    解除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddConfigModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showAddConfigModal = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">添加服务配置</h3>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择配置</label>
          <select
            v-model="selectedConfigId"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option :value="null">请选择</option>
            <option v-for="config in availableConfigs" :key="config.id" :value="config.id">
              {{ config.name }} ({{ config.service_type?.name }})
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-3">
          <button
            @click="showAddConfigModal = false"
            class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            取消
          </button>
          <button
            @click="handleAddConfig"
            :disabled="!selectedConfigId"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            添加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
