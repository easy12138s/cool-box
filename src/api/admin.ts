import apiClient, { type ListResponse } from './client'

export interface Project {
  id: number
  code: string
  name: string
  description: string
  is_active: boolean
  rate_limit: number
  token_expire_hours: number
  created_at: string
  updated_at: string
}

export interface InvitationCode {
  id: number
  code: string
  max_uses: number
  used_count: number
  is_active: boolean
  created_at: string
  expires_at: string
}

export interface ServiceConfig {
  id: number
  code_id: number
  config_json: string
  created_at: string
  updated_at: string
}

export interface Log {
  id: number
  credential_id: number
  project_id: number
  endpoint: string
  method: string
  ip: string
  status_code: number
  duration_ms: number
  created_at: string
}

export interface ServiceCallLog {
  id: number
  service_type: 'llm' | 'asr'
  endpoint: string
  duration_ms: number
  status_code: number
  ip: string
  error_message: string | null
  created_at: string
}

export interface ServiceCallLogDetail extends ServiceCallLog {
  request_data: string
  response_data: string
  credential_id: number
  project_id: number
}

export interface ServiceCallLogListResponse {
  data: ServiceCallLog[]
  count: number
  page: number
  page_size: number
  total_pages: number
}

export interface Stats {
  total_calls: number
  success_rate: number
  avg_duration_ms: number
  by_endpoint: Record<string, number>
  by_status: Record<string, number>
  date_range: {
    start: string
    end: string
  }
}

export interface DailyStat {
  date: string
  calls: number
  success_rate: number
}

export interface ProjectStat {
  id: number
  code: string
  name: string
  is_active: boolean
  registered_devices: number
  total_calls: number
  avg_duration_ms: number
}

export interface InvitationCodeStat {
  id: number
  code: string
  registered_devices: number
  total_calls: number
  max_uses: number
  used_count: number
  is_active: boolean
  expires_at: string
  last_used_at: string | null
}

export interface CreateProjectData {
  code: string
  name: string
  description?: string
  token_expire_hours?: number
  rate_limit?: number
}

export interface CreateInvitationCodeData {
  code: string
  max_uses?: number
  is_active?: boolean
  expires_at?: string
}

export interface CreateServiceConfigData {
  code_id: number
  config_json: string
}

export const adminApi = {
  getProjects: (params?: { skip?: number; limit?: number }) => {
    return apiClient.get<ListResponse<Project>>('/admin/projects', { params })
  },

  getProject: (id: number) => {
    return apiClient.get<Project>(`/admin/projects/${id}`)
  },

  createProject: (data: CreateProjectData) => {
    return apiClient.post<Project>('/admin/projects', data)
  },

  updateProject: (id: number, data: Partial<CreateProjectData>) => {
    return apiClient.put<Project>(`/admin/projects/${id}`, data)
  },

  deleteProject: (id: number) => {
    return apiClient.delete<void>(`/admin/projects/${id}`)
  },

  getCredentials: (params?: { skip?: number; limit?: number }) => {
    return apiClient.get<ListResponse<any>>('/admin/credentials', { params })
  },

  getProjectCredentials: (projectId: number) => {
    return apiClient.get<ListResponse<any>>(`/admin/projects/${projectId}/credentials`)
  },

  deleteCredential: (id: number) => {
    return apiClient.delete<void>(`/admin/credentials/${id}`)
  },

  getInvitationCodes: (params?: { skip?: number; limit?: number }) => {
    return apiClient.get<ListResponse<InvitationCode>>('/admin/invitation-codes', { params })
  },

  createInvitationCode: (data: CreateInvitationCodeData) => {
    return apiClient.post<InvitationCode>('/admin/invitation-codes', data)
  },

  updateInvitationCode: (id: number, data: Partial<CreateInvitationCodeData>) => {
    return apiClient.put<InvitationCode>(`/admin/invitation-codes/${id}`, data)
  },

  deleteInvitationCode: (id: number) => {
    return apiClient.delete<void>(`/admin/invitation-codes/${id}`)
  },

  getServiceConfigs: () => {
    return apiClient.get<ListResponse<ServiceConfig>>('/admin/service-configs')
  },

  createServiceConfig: (data: CreateServiceConfigData) => {
    return apiClient.post<ServiceConfig>('/admin/service-configs', data)
  },

  updateServiceConfig: (id: number, data: Partial<CreateServiceConfigData>) => {
    return apiClient.put<ServiceConfig>(`/admin/service-configs/${id}`, data)
  },

  deleteServiceConfig: (id: number) => {
    return apiClient.delete<void>(`/admin/service-configs/${id}`)
  },

  getLogs: (params?: { project_id?: number; skip?: number; limit?: number }) => {
    return apiClient.get<ListResponse<Log>>('/admin/logs', { params })
  },

  getServiceCallLogs: (params?: { service_type?: string; project_id?: number; page?: number; page_size?: number }) => {
    return apiClient.get<ServiceCallLogListResponse>('/admin/service-call-logs', { params })
  },

  getServiceCallLogDetail: (id: number) => {
    return apiClient.get<ServiceCallLogDetail>(`/admin/service-call-logs/${id}`)
  },

  getStats: (params?: { project_id?: number; start_date?: string; end_date?: string }) => {
    return apiClient.get<Stats>('/admin/stats', { params })
  },

  getDailyStats: (params?: { project_id?: number; days?: number }) => {
    return apiClient.get<{ data: DailyStat[]; days: number }>('/admin/stats/daily', { params })
  },

  getProjectStats: () => {
    return apiClient.get<{ data: ProjectStat[] }>('/admin/stats/projects')
  },

  getInvitationCodeStats: (params?: { project_id?: number }) => {
    return apiClient.get<{ data: InvitationCodeStat[] }>('/admin/stats/invitation-codes', { params })
  }
}

export default adminApi
