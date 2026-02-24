<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectsStore } from '@/stores/projects'
import { useSiteStore } from '@/stores/site'
import ProjectLinks from '@/components/project/ProjectLinks.vue'

const route = useRoute()
const projectsStore = useProjectsStore()
const siteStore = useSiteStore()

const slug = computed(() => route.params.slug as string)
const project = computed(() => projectsStore.getProjectBySlug(slug.value))

onMounted(() => {
  if (projectsStore.projects.length === 0) {
    projectsStore.fetchProjects()
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <div v-if="project" class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div 
          v-if="project.thumbnail"
          class="w-full h-64 md:h-80 mb-6 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700"
        >
          <img :src="project.thumbnail" :alt="project.title[siteStore.locale]" class="w-full h-full object-cover" />
        </div>
        
        <h1 class="text-3xl md:text-4xl font-bold mb-4">
          {{ project.title[siteStore.locale] }}
        </h1>
        
        <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          {{ project.description[siteStore.locale] }}
        </p>
        
        <!-- Tags -->
        <div class="flex flex-wrap justify-center gap-2 mb-6">
          <span 
            v-for="tag in project.tags" 
            :key="tag"
            class="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            {{ tag }}
          </span>
        </div>
        
        <!-- Status Badge -->
        <div class="mb-6">
          <span 
            class="px-3 py-1 text-sm rounded-full"
            :class="{
              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200': project.status === 'active',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200': project.status === 'wip',
              'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': project.status === 'archived'
            }"
          >
            {{ project.status }}
          </span>
        </div>
        
        <!-- Links -->
        <ProjectLinks v-if="project.links" :links="project.links" />
      </div>
      
      <!-- Content -->
      <div class="prose dark:prose-invert max-w-none">
        <!-- TODO: 动态加载 Markdown 或 Vue 组件 -->
        <div class="text-center py-12 text-gray-500">
          <p>{{ siteStore.locale === 'zh' ? '项目详情内容加载中...' : 'Loading project details...' }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <p class="text-xl text-gray-500">{{ siteStore.locale === 'zh' ? '项目不存在' : 'Project not found' }}</p>
      <router-link to="/projects" class="btn-primary mt-4 inline-block">
        {{ siteStore.locale === 'zh' ? '返回项目列表' : 'Back to Projects' }}
      </router-link>
    </div>
  </div>
</template>
