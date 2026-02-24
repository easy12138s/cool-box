<script setup lang="ts">
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 dark:border-gray-800 py-8">
    <div class="container mx-auto px-4 text-center">
      <p class="text-gray-600 dark:text-gray-400">
        © {{ currentYear }} {{ siteStore.config.author.name }}. 
        {{ siteStore.locale === 'zh' ? '保留所有权利。' : 'All rights reserved.' }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Built with Vue 3 + Vite
      </p>
    </div>
  </footer>
</template>
