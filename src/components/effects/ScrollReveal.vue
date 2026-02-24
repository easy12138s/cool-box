<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  threshold?: number
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}>(), {
  threshold: 0.1,
  delay: 0,
  direction: 'up'
})

const el = ref<HTMLElement>()
const isVisible = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            isVisible.value = true
          }, props.delay)
          observer?.disconnect()
        }
      })
    },
    { threshold: props.threshold }
  )

  if (el.value) {
    observer.observe(el.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

const transform = {
  up: 'translateY(30px)',
  down: 'translateY(-30px)',
  left: 'translateX(30px)',
  right: 'translateX(-30px)'
}
</script>

<template>
  <div
    ref="el"
    class="transition-all duration-500 ease-out"
    :class="isVisible ? 'opacity-100' : 'opacity-0'"
    :style="isVisible ? {} : { transform: transform[direction] }"
  >
    <slot />
  </div>
</template>
