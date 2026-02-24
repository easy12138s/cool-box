import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

  const t = computed(() => (key: string) => {
    // 简单的翻译辅助函数
    return key
  })

  const setLocale = (newLocale: 'zh' | 'en') => {
    locale.value = newLocale
  }

  return {
    config,
    locale,
    t,
    setLocale
  }
})
