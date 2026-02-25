<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSiteStore } from '@/stores/site'
import { useProjectsStore } from '@/stores/projects'
import ProjectCard from '@/components/project/ProjectCard.vue'

const siteStore = useSiteStore()
const projectsStore = useProjectsStore()

onMounted(async () => {
  if (!projectsStore.loaded) {
    await projectsStore.loadProjects()
  }
})

const featuredProjects = computed(() => {
  // If config has home.featured list, use it to filter and sort
  const featuredSlugs = siteStore.config.home?.featured
  
  if (featuredSlugs && Array.isArray(featuredSlugs) && featuredSlugs.length > 0) {
    return featuredSlugs
      .map(slug => projectsStore.projects.find(p => p.slug === slug))
      .filter(p => !!p)
  }
  
  // Fallback to first 6 projects if no config
  return projectsStore.projects.slice(0, 6)
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative pt-20 pb-32 overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div class="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div class="container mx-auto px-4 relative z-10 text-center">
        <div class="inline-block p-1 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-8 backdrop-blur-sm">
          <div class="w-32 h-32 rounded-full bg-white dark:bg-gray-800 overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            <img 
              :src="siteStore.config.author.avatar" 
              :alt="siteStore.config.author.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          {{ siteStore.config.author.name }}
        </h1>
        
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          {{ siteStore.config.author.bio[siteStore.locale] }}
        </p>
        
        <!-- Social Links -->
        <div class="flex justify-center items-center gap-6 mb-12">
          <a 
            v-if="siteStore.config.social.github"
            :href="siteStore.config.social.github"
            target="_blank"
            class="group relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="GitHub"
          >
            <div class="i-carbon-logo-github text-2xl text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </a>
          <a 
            v-if="siteStore.config.social.twitter"
            :href="siteStore.config.social.twitter"
            target="_blank"
            class="group relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="Twitter"
          >
            <div class="i-carbon-logo-twitter text-2xl text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </a>
          <a 
            v-if="siteStore.config.social.blog"
            :href="siteStore.config.social.blog"
            target="_blank"
            class="group relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="Blog"
          >
            <div class="i-carbon-earth text-2xl text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </a>
          <a 
            v-if="siteStore.config.social.email"
            :href="siteStore.config.social.email"
            class="group relative p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300"
            aria-label="Email"
          >
            <div class="i-carbon-email text-2xl text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors" />
          </a>
        </div>

        <div class="flex justify-center gap-4">
          <router-link to="/projects" class="btn-primary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
            <span class="i-carbon-rocket mr-2"></span>
            {{ siteStore.locale === 'zh' ? '探索项目' : 'Explore Projects' }}
          </router-link>
          <a v-if="siteStore.config.social.github" :href="siteStore.config.social.github" target="_blank" class="btn-secondary text-lg px-8 py-3 rounded-full shadow-lg hover:shadow-gray-400/20 hover:-translate-y-0.5 transition-all">
            <span class="i-carbon-logo-github mr-2"></span>
            GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section v-if="featuredProjects.length > 0" class="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4 relative inline-block">
            {{ siteStore.locale === 'zh' ? '精选项目' : 'Featured Projects' }}
            <div class="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-70"></div>
          </h2>
          <p class="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            {{ siteStore.locale === 'zh' ? '这里展示了我最得意的作品，每一个都倾注了心血与创意' : 'A selection of my best works, crafted with passion and creativity' }}
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <ProjectCard 
            v-for="project in featuredProjects" 
            :key="project.slug" 
            :project="project"
            class="h-full transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
          />
        </div>
        
        <div class="text-center mt-16">
          <router-link to="/projects" class="inline-flex items-center gap-2 text-primary hover:text-secondary font-medium text-lg transition-colors group">
            {{ siteStore.locale === 'zh' ? '查看全部项目' : 'View All Projects' }}
            <span class="i-carbon-arrow-right group-hover:translate-x-1 transition-transform"></span>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.2;
  }
}
</style>
