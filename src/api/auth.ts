import apiClient from './client'
import type { LoginResponse } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export const authApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return apiClient.post<LoginResponse>('/admin/login', data)
  },

  logout: (): Promise<void> => {
    return apiClient.post<void>('/admin/logout')
  }
}

export default authApi
