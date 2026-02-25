<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useSiteStore } from '@/stores/site'
import Navbar from '@/components/layout/Navbar.vue'
import Footer from '@/components/layout/Footer.vue'

const siteStore = useSiteStore()
const route = useRoute()

onMounted(() => {
  document.documentElement.classList.toggle('dark', siteStore.isDark)
})

// Check if we should show the layout chrome (Navbar/Footer)
// Logic:
// 1. If NOT on a project detail page -> Always show
// 2. If on a project detail page -> Only show if history.state.fromApp is true
const showLayout = computed(() => {
  if (route.name !== 'project-detail') return true
  
  // In Vue Router 4, history.state is available via window.history.state
  // But we should be careful about reactivity.
  // When route changes, this computed re-evaluates.
  // We check if the navigation came from within the app.
  return !!history.state?.fromApp
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <Navbar v-if="showLayout" />
    <main class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <Footer v-if="showLayout" />
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
