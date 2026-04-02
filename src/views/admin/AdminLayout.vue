<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(true)
const serviceMenuOpen = ref(false)

const mainLinks = [
  { path: '/admin/dashboard', label: '仪表盘', icon: 'i-carbon-dashboard' },
  { path: '/admin/projects', label: '项目管理', icon: 'i-carbon-folder' },
  { path: '/admin/invitation-codes', label: '邀请码', icon: 'i-carbon-coupon' },
]

const serviceLinks = [
  { path: '/admin/service-types', label: '服务类型', icon: 'i-carbon-category' },
  { path: '/admin/service-configs', label: '服务配置', icon: 'i-carbon-settings' },
  { path: '/admin/service-call-logs', label: '服务日志', icon: 'i-carbon-data-table' },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const toggleServiceMenu = () => {
  serviceMenuOpen.value = !serviceMenuOpen.value
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100 dark:bg-gray-900">
    <aside
      :class="[
        'flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        <span v-if="sidebarOpen" class="font-bold text-lg text-gray-900 dark:text-white">管理后台</span>
        <button
          @click="sidebarOpen = !sidebarOpen"
          class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
        >
          <span :class="sidebarOpen ? 'i-carbon-chevron-left' : 'i-carbon-chevron-right'" />
        </button>
      </div>

      <nav class="flex-1 py-4 px-2 space-y-1">
        <RouterLink
          v-for="link in mainLinks"
          :key="link.path"
          :to="link.path"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
            isActive(link.path)
              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          ]"
        >
          <span :class="link.icon" />
          <span v-if="sidebarOpen">{{ link.label }}</span>
        </RouterLink>

        <div v-if="sidebarOpen">
          <button
            @click="toggleServiceMenu"
            :class="[
              'flex items-center justify-between w-full gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              route.path.startsWith('/admin/service')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <div class="flex items-center gap-3">
              <span class="i-carbon-services" />
              <span>服务管理</span>
            </div>
            <span :class="serviceMenuOpen ? 'i-carbon-chevron-up' : 'i-carbon-chevron-down'" />
          </button>
          <div v-if="serviceMenuOpen" class="ml-6 mt-1 space-y-1">
            <RouterLink
              v-for="link in serviceLinks"
              :key="link.path"
              :to="link.path"
              :class="[
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive(link.path)
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              <span :class="link.icon" />
              <span>{{ link.label }}</span>
            </RouterLink>
          </div>
        </div>

        <div v-else class="relative">
          <RouterLink
            to="/admin/service-configs"
            :class="[
              'flex items-center justify-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              route.path.startsWith('/admin/service')
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <span class="i-carbon-services" />
          </RouterLink>
        </div>
      </nav>

      <div class="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
        >
          <span class="i-carbon-logout" />
          <span v-if="sidebarOpen">退出登录</span>
        </button>
      </div>
    </aside>

    <main class="flex-1 overflow-auto">
      <div class="p-6">
        <RouterView />
      </div>
    </main>
  </div>
</template>
