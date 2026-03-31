<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DataTable from '@/components/admin/DataTable.vue'
import DataForm from '@/components/admin/DataForm.vue'
import adminApi, { type Project, type CreateProjectData } from '@/api/admin'
import type { FormField } from '@/components/admin/DataForm.vue'
import type { TableColumn, Pagination } from '@/components/admin/DataTable.vue'

const router = useRouter()

const data = ref<Project[]>([])
const loading = ref(false)
const pagination = ref<Pagination>({
  page: 1,
  pageSize: 10,
  total: 0
})

const showForm = ref(false)
const editingProject = ref<Project | null>(null)
const formLoading = ref(false)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'code', label: '项目代码', sortable: true },
  { key: 'name', label: '名称', sortable: true },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'rate_limit', label: '限流', width: '80px' },
  { key: 'token_expire_hours', label: 'Token有效期', width: '100px' },
  { key: 'updated_at', label: '更新时间', width: '160px' }
]

const fields: FormField[] = [
  { key: 'code', label: '项目代码', type: 'text', required: true },
  { key: 'name', label: '项目名称', type: 'text', required: true },
  { key: 'description', label: '描述', type: 'textarea' },
  { key: 'token_expire_hours', label: 'Token有效期(小时)', type: 'number' },
  { key: 'rate_limit', label: '限流(次/分)', type: 'number' }
]

const loadData = async () => {
  loading.value = true
  try {
    const result = await adminApi.getProjects({
      skip: (pagination.value.page - 1) * pagination.value.pageSize,
      limit: pagination.value.pageSize
    })
    data.value = result.data
    pagination.value.total = result.count
  } catch (error) {
    console.error('Failed to load projects:', error)
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
  router.push(`/admin/projects/${row.id}`)
}

const handleCreate = () => {
  editingProject.value = null
  showForm.value = true
}

const handleEdit = (row: Project) => {
  editingProject.value = row
  showForm.value = true
}

const handleDelete = async (row: Project) => {
  if (!confirm(`确定要删除项目 "${row.name}" 吗？`)) return
  try {
    await adminApi.deleteProject(row.id)
    loadData()
  } catch (error) {
    console.error('Failed to delete project:', error)
    alert('删除失败')
  }
}

const handleFormSubmit = async (values: Record<string, any>) => {
  formLoading.value = true
  try {
    if (editingProject.value) {
      await adminApi.updateProject(editingProject.value.id, values)
    } else {
      await adminApi.createProject(values as CreateProjectData)
    }
    showForm.value = false
    loadData()
  } catch (error) {
    console.error('Failed to save project:', error)
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
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">项目管理</h2>
      <button
        @click="handleCreate"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
      >
        新建项目
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
          {{ value ? '活跃' : '禁用' }}
        </span>
      </template>
      <template #cell-rate_limit="{ value }">
        {{ value }}/分
      </template>
      <template #cell-token_expire_hours="{ value }">
        {{ value }}h
      </template>
      <template #cell-updated_at="{ value }">
        {{ value ? value.split('T')[0] : '-' }}
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-2">
          <button @click.stop="handleEdit(row as Project)" class="text-primary-600 hover:text-primary-800 text-sm">编辑</button>
          <button @click.stop="handleDelete(row as Project)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
        </div>
      </template>
    </DataTable>

    <div v-if="showForm" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="showForm = false">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {{ editingProject ? '编辑项目' : '新建项目' }}
        </h3>
        <DataForm
          :fields="fields"
          :initial-values="editingProject || undefined"
          :loading="formLoading"
          @submit="handleFormSubmit"
          @cancel="showForm = false"
        />
      </div>
    </div>
  </div>
</template>
