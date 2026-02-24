<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  duration?: number
  delay?: number
}>(), {
  duration: 500,
  delay: 0
})

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, props.delay)
})
</script>

<template>
  <Transition
    enter-active-class="transition-all ease-out"
    :style="{ transitionDuration: `${duration}ms` }"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
  >
    <slot v-if="isVisible" />
  </Transition>
</template>
