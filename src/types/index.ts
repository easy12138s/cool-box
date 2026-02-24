export interface ProjectMeta {
  slug: string
  title: { zh: string; en: string }
  description: { zh: string; en: string }
  thumbnail?: string
  tags: string[]
  status: 'active' | 'archived' | 'wip'
  links?: {
    github?: string
    demo?: string
    docs?: string
    npm?: string
  }
  createdAt: string
  updatedAt?: string
  hidden: boolean
  order: number
}

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

export type Locale = 'zh' | 'en'

export interface NavItem {
  path: string
  label: { zh: string; en: string }
}
