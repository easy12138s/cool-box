<script setup lang="ts">
defineProps<{
  links: {
    github?: string
    demo?: string
    docs?: string
    npm?: string
  }
}>()
</script>

<template>
  <div class="flex flex-wrap justify-center gap-3">
    <a
      v-if="links.github"
      :href="links.github"
      target="_blank"
      class="btn bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
    >
      <div class="i-carbon-logo-github mr-2" />
      GitHub
    </a>
    <a
      v-if="links.demo"
      :href="links.demo"
      target="_blank"
      class="btn bg-primary text-white hover:bg-primary/80"
    >
      <div class="i-carbon-launch mr-2" />
      Demo
    </a>
    <a
      v-if="links.docs"
      :href="links.docs"
      target="_blank"
      class="btn bg-secondary text-white hover:bg-secondary/80"
    >
      <div class="i-carbon-document mr-2" />
      Docs
    </a>
    <a
      v-if="links.npm"
      :href="links.npm"
      target="_blank"
      class="btn bg-red-500 text-white hover:bg-red-600"
    >
      <div class="i-carbon-npm mr-2" />
      NPM
    </a>
  </div>
</template>
