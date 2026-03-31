<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import adminApi, { type Project } from '@/api/admin'
import DataTable from '@/components/admin/DataTable.vue'
import { type TableColumn } from '@/components/admin/DataTable.vue'

const router = useRouter()
const route = useRoute()

const project = ref<Project | null>(null)
const credentials = ref<any[]>([])
const loading = ref(true)

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '60px' },
  { key: 'api_key', label: 'API Key', width: '200px' },
  { key: 'is_active', label: '状态', width: '80px' },
  { key: 'created_at', label: '创建时间', width: '160px' }
]

const loadData = async () => {
  const id = Number(route.params.id)
  loading.value = true
  try {
    const [projectRes, credentialsRes] = await Promise.all([
      adminApi.getProject(id),
      adminApi.getProjectCredentials(id)
    ])
    project.value = projectRes
    credentials.value = credentialsRes.data
  } catch (error) {
    console.error('Failed to load project:', error)
    router.push('/admin/projects')
  } finally {
    loading.value = false
  }
}

const handleDeleteCredential = async (id: number) => {
  if (!confirm('确定要删除此凭证吗？')) return
  try {
    await adminApi.deleteCredential(id)
    loadData()
  } catch (error) {
    console.error('Failed to delete credential:', error)
    alert('删除失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button @click="router.push('/admin/projects')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <span class="i-carbon-arrow-left text-xl" />
      </button>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">项目详情</h2>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>

    <template v-else-if="project">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">{{ project.name }}</h3>
            <span
              class="px-2 py-1 text-xs font-medium rounded"
              :class="project.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
            >
              {{ project.is_active ? '活跃' : '禁用' }}
            </span>
          </div>
        </div>
        <div class="p-6 grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">项目代码</div>
            <div class="text-gray-900 dark:text-white font-mono">{{ project.code }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">项目ID</div>
            <div class="text-gray-900 dark:text-white">{{ project.id }}</div>
          </div>
          <div class="col-span-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">描述</div>
            <div class="text-gray-900 dark:text-white">{{ project.description || '-' }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">Token有效期</div>
            <div class="text-gray-900 dark:text-white">{{ project.token_expire_hours }} 小时</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">请求限流</div>
            <div class="text-gray-900 dark:text-white">{{ project.rate_limit }} 次/分钟</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">创建时间</div>
            <div class="text-gray-900 dark:text-white">{{ project.created_at }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">更新时间</div>
            <div class="text-gray-900 dark:text-white">{{ project.updated_at }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">凭证列表</h3>
        </div>
        <div class="p-6">
          <DataTable
            :columns="columns"
            :data="credentials"
            :pagination="{ page: 1, pageSize: credentials.length, total: credentials.length }"
          >
            <template #cell-api_key="{ value }">
              <code class="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono">{{ value }}</code>
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
              {{ value ? value.split('T')[0] : '-' }}
            </template>
            <template #cell-actions="{ row }">
              <button @click.stop="handleDeleteCredential(row.id)" class="text-red-600 hover:text-red-800 text-sm">删除</button>
            </template>
          </DataTable>
        </div>
      </div>
    </template>
  </div>
</template>
