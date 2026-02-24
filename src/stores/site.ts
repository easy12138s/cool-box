import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export type Theme = 'light' | 'dark' | 'auto'

export interface SiteConfig {
  author: {
    name: string
    avatar: string
    bio: { zh: string; en: string }
    location?: string
  }
  social: {
    github?: string
    blog?: string
    twitter?: string
    email?: string
  }
  site: {
    title: string
    description: { zh: string; en: string }
  }
}

export const useSiteStore = defineStore('site', () => {
  const config = ref<SiteConfig>({
    author: {
      name: 'Your Name',
      avatar: '/images/avatar.png',
      bio: {
        zh: '一段中文介绍',
        en: 'A brief introduction'
      }
    },
    social: {
      github: 'https://github.com/username'
    },
    site: {
      title: 'Cool Box',
      description: {
        zh: '我的项目展示空间',
        en: 'My Project Showcase'
      }
    }
  })

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
