import { defineStore } from 'pinia'
import { ref } from 'vue'

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

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<ProjectMeta[]>([])
  const loading = ref(false)

  const fetchProjects = async () => {
    loading.value = true
    // TODO: 扫描 content/projects 目录，解析 meta.yml
    // 临时使用静态数据
    projects.value = [
      {
        slug: 'demo-project',
        title: { zh: '示例项目', en: 'Demo Project' },
        description: { zh: '这是一个示例项目', en: 'This is a demo project' },
        tags: ['Vue', 'TypeScript'],
        status: 'active',
        createdAt: '2024-01-15',
        hidden: false,
        order: 1
      }
    ]
    loading.value = false
  }

  const getProjectBySlug = (slug: string) => {
    return projects.value.find(p => p.slug === slug)
  }

  return {
    projects,
    loading,
    fetchProjects,
    getProjectBySlug
  }
})
