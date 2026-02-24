import { ref } from 'vue'
import type { ProjectMeta } from '@/types'

const projects = ref<ProjectMeta[]>([])
const loaded = ref(false)

export function useProjects() {
  const fetchProjects = async () => {
    if (loaded.value) return

    const modules = import.meta.glob('/content/projects/*/meta.yml', {
      eager: true,
      query: '?raw',
      import: 'default'
    })

    const projectList: ProjectMeta[] = []

    for (const path in modules) {
      const match = path.match(/\/content\/projects\/([^/]+)\/meta\.yml/)
      if (!match) continue

      const slug = match[1]
      const yamlContent = modules[path] as string
      const meta = parseYaml(yamlContent)
      
      projectList.push({
        slug,
        title: meta.title || { zh: slug, en: slug },
        description: meta.description || { zh: '', en: '' },
        thumbnail: meta.thumbnail,
        tags: meta.tags || [],
        status: meta.status || 'active',
        links: meta.links,
        createdAt: meta.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: meta.updatedAt,
        hidden: meta.hidden ?? false,
        order: meta.order ?? 999
      })
    }

    projects.value = projectList.sort((a, b) => a.order - b.order)
    loaded.value = true
  }

  const getProjectBySlug = (slug: string) => {
    return projects.value.find(p => p.slug === slug)
  }

  const getProjectContent = async (slug: string, locale: string) => {
    const paths = [
      `/content/projects/${slug}/index.${locale}.md`,
      `/content/projects/${slug}/index.md`
    ]

    const modules = import.meta.glob('/content/projects/*/index*.md', {
      query: '?raw',
      import: 'default',
      eager: false
    }) as Record<string, () => Promise<unknown>>

    for (const p of paths) {
      if (modules[p]) {
        const content = await modules[p]()
        return content as string
      }
    }
    return ''
  }

  const getProjectHasVuePage = async (slug: string) => {
    const modules = import.meta.glob('/content/projects/*/page.vue')
    const vuePath = `/content/projects/${slug}/page.vue`
    return !!modules[vuePath]
  }

  return {
    projects,
    fetchProjects,
    getProjectBySlug,
    getProjectContent,
    getProjectHasVuePage,
    loaded
  }
}

function parseYaml(content: string): Record<string, any> {
  const result: Record<string, any> = {}
  const lines = content.split('\n')

  for (const rawLine of lines) {
    const line = rawLine.replace(/\t/g, '  ')
    const indent = line.search(/\S/)

    if (indent < 0 || line.trim().startsWith('#')) continue

    const isArrayItem = line.trim().startsWith('-')
    const lineContent = isArrayItem ? line.trim().slice(1).trim() : line
    const colonIndex = lineContent.indexOf(':')

    if (colonIndex === -1) continue

    const key = lineContent.slice(0, colonIndex).trim()
    const value = lineContent.slice(colonIndex + 1).trim()

    const level = Math.floor(indent / 2)

    if (level === 0) {
      if (value === '' || value === '|') {
        result[key] = key === 'links' ? {} : { zh: '', en: '' }
      } else if (value.startsWith('[')) {
        result[key] = parseArray(value)
      } else {
        result[key] = parseValue(value)
      }
    } else if (level === 1) {
      if (!result[key]) {
        result[key] = key === 'links' ? {} : { zh: '', en: '' }
      }
      if (value === '' || value === '|') {
        // nested object
      } else if (value.startsWith('[')) {
        result[key] = parseArray(value)
      } else if (key === 'zh' || key === 'en') {
        result[key] = parseValue(value)
      } else {
        result[key] = parseValue(value)
      }
    }
  }

  return result
}

function parseValue(value: string): any {
  if (!value) return ''
  if (value === 'true') return true
  if (value === 'false') return false
  return value.replace(/^["']|["']$/g, '')
}

function parseArray(value: string): string[] {
  const content = value.slice(1, -1).trim()
  if (!content) return []
  return content.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
}
