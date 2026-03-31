<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import adminApi, { type Stats, type ProjectStat, type DailyStat } from '@/api/admin'

const router = useRouter()
const authStore = useAuthStore()

const stats = ref<Stats | null>(null)
const projectStats = ref<ProjectStat[]>([])
const dailyStats = ref<DailyStat[]>([])
const loading = ref(true)

const loadStats = async () => {
  loading.value = true
  try {
    const [statsRes, projectStatsRes, dailyStatsRes] = await Promise.all([
      adminApi.getStats(),
      adminApi.getProjectStats(),
      adminApi.getDailyStats({ days: 7 })
    ])
    stats.value = statsRes
    projectStats.value = projectStatsRes.data
    dailyStats.value = dailyStatsRes.data
  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  loadStats()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
      <button
        @click="loadStats"
        class="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        刷新
      </button>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    </div>

    <div v-else-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm text-gray-500 dark:text-gray-400">总调用次数</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.total_calls.toLocaleString() }}</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm text-gray-500 dark:text-gray-400">成功率</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.success_rate.toFixed(2) }}%</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm text-gray-500 dark:text-gray-400">平均耗时</div>
        <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ stats.avg_duration_ms.toFixed(0) }}ms</div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="text-sm text-gray-500 dark:text-gray-400">统计周期</div>
        <div class="text-lg font-medium text-gray-900 dark:text-white mt-1">{{ stats.date_range.start }} ~ {{ stats.date_range.end }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">项目统计</h2>
        </div>
        <div class="p-6">
          <div v-if="projectStats.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
            暂无项目
          </div>
          <div v-else class="space-y-4">
            <div v-for="project in projectStats" :key="project.id" class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.name }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ project.code }}</div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ project.total_calls.toLocaleString() }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ project.registered_devices }} 设备</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">每日调用趋势</h2>
        </div>
        <div class="p-6">
          <div v-if="dailyStats.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
            暂无数据
          </div>
          <div v-else class="space-y-3">
            <div v-for="day in dailyStats" :key="day.date" class="flex items-center justify-between">
              <span class="text-sm text-gray-700 dark:text-gray-300">{{ day.date }}</span>
              <div class="flex items-center gap-4">
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ day.calls.toLocaleString() }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ day.success_rate.toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-lg font-medium text-gray-900 dark:text-white">状态码分布</h2>
      </div>
      <div class="p-6">
        <div v-if="stats && Object.keys(stats.by_status).length > 0" class="flex flex-wrap gap-4">
          <div v-for="(count, status) in stats.by_status" :key="status" class="flex items-center gap-2">
            <span class="px-2 py-1 text-xs font-medium rounded" :class="{
              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400': status === '200',
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400': status.startsWith('4') || status.startsWith('5')
            }">
              {{ status }}
            </span>
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ count.toLocaleString() }}</span>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 dark:text-gray-400 py-4">
          暂无数据
        </div>
      </div>
    </div>
  </div>
</template>
