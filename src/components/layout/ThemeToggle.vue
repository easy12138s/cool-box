<script setup lang="ts">
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

const themeIcon = {
  light: 'i-carbon-sun',
  dark: 'i-carbon-moon',
  auto: 'i-carbon-automatic'
}

const themeLabel = {
  light: 'Light',
  dark: 'Dark',
  auto: 'Auto'
}
</script>

<template>
  <button
    @click="siteStore.toggleTheme"
    class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    :title="themeLabel[siteStore.theme]"
  >
    <div :class="themeIcon[siteStore.theme]" class="text-xl" />
  </button>
</template>
