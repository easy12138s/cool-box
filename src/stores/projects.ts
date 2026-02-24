import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useProjects } from '@/composables/useProjects'

export const useProjectsStore = defineStore('projects', () => {
  const { projects, fetchProjects, getProjectBySlug, getProjectContent, getProjectHasVuePage, loaded } = useProjects()

  const loading = ref(false)

  const loadProjects = async () => {
    loading.value = true
    await fetchProjects()
    loading.value = false
  }

  return {
    projects,
    loading,
    loadProjects,
    fetchProjects,
    getProjectBySlug,
    getProjectContent,
    getProjectHasVuePage,
    loaded
  }
})
