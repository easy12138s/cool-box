import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/projects',
    name: 'projects',
    component: () => import('@/views/Projects.vue')
  },
  {
    path: '/projects/:slug',
    name: 'project-detail',
    component: () => import('@/views/ProjectDetail.vue')
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/Links.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'admin-index',
        component: () => import('@/views/admin/AdminIndex.vue')
      },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'projects',
        name: 'admin-projects',
        component: () => import('@/views/admin/Projects.vue')
      },
      {
        path: 'projects/:id',
        name: 'admin-project-detail',
        component: () => import('@/views/admin/ProjectDetail.vue')
      },
      {
        path: 'invitation-codes',
        name: 'admin-invitation-codes',
        component: () => import('@/views/admin/InvitationCodes.vue')
      },
      {
        path: 'service-configs',
        name: 'admin-service-configs',
        component: () => import('@/views/admin/ServiceConfigs.vue')
      },
      {
        path: 'service-configs/:id',
        name: 'admin-service-config-detail',
        component: () => import('@/views/admin/ServiceConfigDetail.vue')
      },
      {
        path: 'service-call-logs',
        name: 'admin-service-call-logs',
        component: () => import('@/views/admin/ServiceLogs.vue')
      },
      {
        path: 'logs',
        name: 'admin-logs',
        component: () => import('@/views/admin/Logs.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'admin-dashboard' })
  } else {
    next()
  }
})

export default router
