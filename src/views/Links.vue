<script setup lang="ts">
import { computed } from 'vue'
import { useSiteStore } from '@/stores/site'

const siteStore = useSiteStore()

const socialLinks = computed(() => {
  const { social } = siteStore.config
  const links = []
  
  if (social.github) links.push({ icon: 'i-carbon-logo-github', label: 'GitHub', url: social.github })
  if (social.twitter) links.push({ icon: 'i-carbon-logo-twitter', label: 'Twitter', url: social.twitter })
  if (social.blog) links.push({ icon: 'i-carbon-earth', label: 'Blog', url: social.blog })
  if (social.email) links.push({ icon: 'i-carbon-email', label: 'Email', url: social.email })
  
  return links
})
</script>

<template>
  <div class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold text-center mb-12">
      {{ siteStore.locale === 'zh' ? '链接' : 'Links' }}
    </h1>
    
    <div class="max-w-2xl mx-auto space-y-6">
      <a
        v-for="link in socialLinks"
        :key="link.url"
        :href="link.url"
        target="_blank"
        class="card flex items-center gap-4 p-6 hover:shadow-lg transition-shadow"
      >
        <div :class="link.icon" class="text-3xl" />
        <span class="font-medium">{{ link.label }}</span>
        <div class="i-carbon-arrow-right ml-auto" />
      </a>
    </div>
  </div>
</template>
