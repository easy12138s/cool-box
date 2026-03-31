<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">管理后台</h1>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        欢迎回来，管理员
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <p class="text-gray-600 dark:text-gray-300">
        这是一个基于 Cool Box 的管理后台。
      </p>
      <p class="text-gray-500 dark:text-gray-400 mt-2 text-sm">
        从左侧菜单选择功能模块开始管理。
      </p>
    </div>
  </div>
</template>
