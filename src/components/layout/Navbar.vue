<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSiteStore } from '@/stores/site'

const router = useRouter()
const route = useRoute()
const siteStore = useSiteStore()

const isMenuOpen = ref(false)

const navLinks = [
  { path: '/', label: { zh: '首页', en: 'Home' } },
  { path: '/projects', label: { zh: '项目', en: 'Projects' } },
  { path: '/links', label: { zh: '链接', en: 'Links' } }
]

const toggleLocale = () => {
  siteStore.setLocale(siteStore.locale === 'zh' ? 'en' : 'zh')
}
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <nav class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="text-xl font-bold text-primary">
        {{ siteStore.config.site.title }}
      </router-link>
      
      <!-- Desktop Nav -->
      <div class="hidden md:flex items-center gap-6">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="transition-colors"
          :class="route.path === link.path ? 'text-primary font-medium' : 'hover:text-primary'"
        >
          {{ link.label[siteStore.locale] }}
        </router-link>
        
        <button 
          @click="toggleLocale"
          class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary transition-colors"
        >
          {{ siteStore.locale === 'zh' ? 'EN' : '中' }}
        </button>
      </div>
      
      <!-- Mobile Menu Button -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-2xl">
        <div :class="isMenuOpen ? 'i-carbon-close' : 'i-carbon-menu'" />
      </button>
    </nav>
    
    <!-- Mobile Menu -->
    <div v-if="isMenuOpen" class="md:hidden border-t border-gray-200 dark:border-gray-800">
      <div class="container mx-auto px-4 py-4 flex flex-col gap-4">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          @click="isMenuOpen = false"
          class="py-2"
        >
          {{ link.label[siteStore.locale] }}
        </router-link>
        <button 
          @click="toggleLocale"
          class="py-2 text-left border border-gray-300 dark:border-gray-600 rounded-lg px-3"
        >
          {{ siteStore.locale === 'zh' ? '切换到英文' : 'Switch to Chinese' }}
        </button>
      </div>
    </div>
  </header>
</template>
