<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSiteStore } from '@/stores/site'
import type { ProjectMeta } from '@/types'

const props = defineProps<{
  project: ProjectMeta
}>()

const router = useRouter()
const siteStore = useSiteStore()

const goToProject = () => {
  router.push(`/projects/${props.project.slug}`)
}
</script>

<template>
  <article 
    class="card cursor-pointer hover:shadow-xl transition-all duration-300 group"
    @click="goToProject"
  >
    <div v-if="project.thumbnail" class="aspect-video overflow-hidden">
      <img 
        :src="project.thumbnail" 
        :alt="project.title[siteStore.locale]"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div class="p-5">
      <div class="flex items-start justify-between gap-2 mb-2">
        <h3 class="font-semibold text-lg group-hover:text-primary transition-colors">
          {{ project.title[siteStore.locale] }}
        </h3>
        <span 
          class="shrink-0 px-2 py-0.5 text-xs rounded-full"
          :class="{
            'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300': project.status === 'active',
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300': project.status === 'wip',
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': project.status === 'archived'
          }"
        >
          {{ project.status }}
        </span>
      </div>
      
      <p class="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {{ project.description[siteStore.locale] }}
      </p>
      
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="tag in project.tags" 
          :key="tag"
          class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </article>
</template>
