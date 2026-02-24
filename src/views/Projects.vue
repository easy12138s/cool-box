<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '@/stores/projects'
import { useSiteStore } from '@/stores/site'
import ProjectCard from '@/components/project/ProjectCard.vue'
import ProjectFilter from '@/components/project/ProjectFilter.vue'

const projectsStore = useProjectsStore()
const siteStore = useSiteStore()

const selectedTag = ref<string | null>(null)
const searchQuery = ref('')

onMounted(() => {
  projectsStore.fetchProjects()
})

const allTags = computed(() => {
  const tags = new Set<string>()
  projectsStore.projects.forEach(p => p.tags.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
})

const filteredProjects = computed(() => {
  let result = projectsStore.projects.filter(p => !p.hidden)
  
  if (selectedTag.value) {
    result = result.filter(p => p.tags.includes(selectedTag.value!))
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(p => 
      p.title[siteStore.locale].toLowerCase().includes(query) ||
      p.description[siteStore.locale].toLowerCase().includes(query)
    )
  }
  
  return result.sort((a, b) => a.order - b.order)
})
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-center mb-8">
      {{ siteStore.locale === 'zh' ? '所有项目' : 'All Projects' }}
    </h1>
    
    <!-- Filter & Search -->
    <div class="max-w-3xl mx-auto mb-8">
      <div class="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="siteStore.locale === 'zh' ? '搜索项目...' : 'Search projects...'"
          class="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <ProjectFilter 
        :tags="allTags" 
        :selected="selectedTag"
        @select="selectedTag = $event"
      />
    </div>
    
    <!-- Projects Grid -->
    <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <ProjectCard 
        v-for="project in filteredProjects" 
        :key="project.slug" 
        :project="project"
      />
    </div>
    
    <div v-else class="text-center py-20 text-gray-500">
      <div class="i-carbon-search text-4xl mb-4" />
      <p>{{ siteStore.locale === 'zh' ? '没有找到匹配的项目' : 'No projects found' }}</p>
    </div>
  </div>
</template>
