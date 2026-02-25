import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { parse } from 'yaml'
import type { SiteConfig } from '@/types'

// @ts-ignore
import siteConfigRaw from '/config/site.yml?raw'

export type Theme = 'light' | 'dark' | 'auto'

export const useSiteStore = defineStore('site', () => {
  const config = ref<SiteConfig>(parse(siteConfigRaw))

  const locale = ref<'zh' | 'en'>('zh')
  const theme = useLocalStorage<Theme>('cool-box-theme', 'auto')
  const isDark = ref(false)

  const updateDarkClass = () => {
    if (theme.value === 'auto') {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    } else {
      isDark.value = theme.value === 'dark'
    }
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
    updateDarkClass()
  }

  const toggleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme.value)
    setTheme(themes[(currentIndex + 1) % themes.length])
  }

  const t = computed(() => (key: string) => {
    return key
  })

  const setLocale = (newLocale: 'zh' | 'en') => {
    locale.value = newLocale
  }

  if (typeof window !== 'undefined') {
    updateDarkClass()
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateDarkClass)
  }

  return {
    config,
    locale,
    theme,
    isDark,
    t,
    setLocale,
    setTheme,
    toggleTheme
  }
})
