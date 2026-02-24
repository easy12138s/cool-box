import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
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
    }
  ]
})

export default router
