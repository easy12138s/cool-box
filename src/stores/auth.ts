import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export interface User {
  id: string | number
  username: string
  email?: string
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useLocalStorage<string | null>('admin_access_token', null)

  const isAuthenticated = computed(() => !!accessToken.value)

  const setToken = (token: string) => {
    accessToken.value = token
  }

  const logout = () => {
    accessToken.value = null
  }

  return {
    accessToken,
    isAuthenticated,
    setToken,
    logout
  }
})
