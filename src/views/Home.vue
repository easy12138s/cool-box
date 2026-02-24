<script setup lang="ts">
import { useSiteStore } from '@/stores/site'
import { useProjectsStore } from '@/stores/projects'
import { onMounted } from 'vue'
import ProjectCard from '@/components/project/ProjectCard.vue'

const siteStore = useSiteStore()
const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.fetchProjects()
})

const featuredProjects = projectsStore.projects.slice(0, 4)
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
        <div class="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img 
            :src="siteStore.config.author.avatar" 
            :alt="siteStore.config.author.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      
      <h1 class="text-4xl font-bold mb-4">{{ siteStore.config.author.name }}</h1>
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-xl mx-auto">
        {{ siteStore.config.author.bio[siteStore.locale] }}
      </p>
      
      <!-- Social Links -->
      <div class="flex justify-center gap-4 mb-8">
        <a 
          v-if="siteStore.config.social.github"
          :href="siteStore.config.social.github"
          target="_blank"
          class="i-carbon-logo-github text-2xl hover:text-primary transition-colors"
        />
        <a 
          v-if="siteStore.config.social.twitter"
          :href="siteStore.config.social.twitter"
          target="_blank"
          class="i-carbon-logo-twitter text-2xl hover:text-primary transition-colors"
        />
        <a 
          v-if="siteStore.config.social.blog"
          :href="siteStore.config.social.blog"
          target="_blank"
          class="i-carbon-earth text-2xl hover:text-primary transition-colors"
        />
        <a 
          v-if="siteStore.config.social.email"
          :href="siteStore.config.social.email"
          class="i-carbon-email text-2xl hover:text-primary transition-colors"
        />
      </div>
    </section>

    <!-- Featured Projects -->
    <section v-if="featuredProjects.length > 0" class="py-12">
      <h2 class="text-2xl font-bold text-center mb-8">
        {{ siteStore.locale === 'zh' ? '精选项目' : 'Featured Projects' }}
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <ProjectCard 
          v-for="project in featuredProjects" 
          :key="project.slug" 
          :project="project"
        />
      </div>
      <div class="text-center mt-8">
        <router-link to="/projects" class="btn-primary">
          {{ siteStore.locale === 'zh' ? '查看全部项目' : 'View All Projects' }}
        </router-link>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="py-12 text-center">
      <div class="flex justify-center gap-6">
        <router-link to="/projects" class="card p-6 hover:shadow-lg transition-shadow">
          <div class="i-carbon-folder-details text-3xl mb-2 text-primary" />
          <div class="font-medium">{{ siteStore.locale === 'zh' ? '项目' : 'Projects' }}</div>
        </router-link>
        <router-link to="/links" class="card p-6 hover:shadow-lg transition-shadow">
          <div class="i-carbon-link text-3xl mb-2 text-secondary" />
          <div class="font-medium">{{ siteStore.locale === 'zh' ? '链接' : 'Links' }}</div>
        </router-link>
      </div>
    </section>
  </div>
</template>
