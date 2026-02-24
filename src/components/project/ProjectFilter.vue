<script setup lang="ts">
import { useSiteStore } from '@/stores/site'

const props = defineProps<{
  tags: string[]
  selected: string | null
}>()

const emit = defineEmits<{
  select: [tag: string | null]
}>()

const siteStore = useSiteStore()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      @click="emit('select', null)"
      class="px-3 py-1.5 text-sm rounded-full transition-all"
      :class="selected === null 
        ? 'bg-primary text-white' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
    >
      {{ siteStore.locale === 'zh' ? '全部' : 'All' }}
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      @click="emit('select', tag)"
      class="px-3 py-1.5 text-sm rounded-full transition-all"
      :class="selected === tag 
        ? 'bg-primary text-white' 
        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'"
    >
      {{ tag }}
    </button>
  </div>
</template>
