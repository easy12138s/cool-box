import { ref, computed } from 'vue'
import MiniSearch from 'minisearch'
import { useProjects } from './useProjects'
import type { ProjectMeta } from '@/types'

const searchIndex = ref<MiniSearch | null>(null)
const initialized = ref(false)

export function useSearch() {
  const { projects } = useProjects()

  const initSearch = async () => {
    if (initialized.value) return

    searchIndex.value = new MiniSearch({
      fields: ['titleZh', 'titleEn', 'descriptionZh', 'descriptionEn', 'tags'],
      storeFields: ['slug'],
      searchOptions: {
        boost: { titleZh: 2, titleEn: 2, tags: 1.5 },
        fuzzy: 0.2,
        prefix: true
      }
    })

    const documents = projects.value.map(p => ({
      slug: p.slug,
      titleZh: p.title.zh,
      titleEn: p.title.en,
      descriptionZh: p.description.zh,
      descriptionEn: p.description.en,
      tags: p.tags.join(' ')
    }))

    searchIndex.value.addAll(documents)
    initialized.value = true
  }

  const search = (query: string, locale: string = 'zh') => {
    if (!searchIndex.value) return []

    const results = searchIndex.value.search(query)
    return results.map(r => r.slug)
  }

  return {
    searchIndex,
    initSearch,
    search
  }
}
