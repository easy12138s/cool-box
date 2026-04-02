<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import adminApi, { type ServiceConfig } from '@/api/admin'

const router = useRouter()
const route = useRoute()

const config = ref<ServiceConfig | null>(null)
const loading = ref(true)

const parsedConfig = computed(() => {
  if (!config.value?.config_json) return null
  try {
    return JSON.parse(config.value.config_json)
  } catch {
    return null
  }
})

const loadData = async () => {
  const id = Number(route.params.id)
  loading.value = true
  try {
    const result = await adminApi.getServiceConfigs()
    config.value = result.data.find(c => c.id === id) || null
    if (!config.value) {
      router.push('/admin/service-configs')
    }
  } catch (error) {
    console.error('Failed to load service config:', error)
    router.push('/admin/service-configs')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <button @click="router.push('/admin/service-configs')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
        <span class="i-carbon-arrow-left text-xl" />
      </button>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">服务配置详情</h2>
    </div>

    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>

    <template v-else-if="config">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">配置信息</h3>
        </div>
        <div class="p-6 grid grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">配置ID</div>
            <div class="text-gray-900 dark:text-white font-mono">{{ config.id }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">关联邀请码ID</div>
            <div class="text-gray-900 dark:text-white">{{ config.code_id }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">创建时间</div>
            <div class="text-gray-900 dark:text-white">{{ config.created_at }}</div>
          </div>
          <div>
            <div class="text-sm text-gray-500 dark:text-gray-400">更新时间</div>
            <div class="text-gray-900 dark:text-white">{{ config.updated_at }}</div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">配置内容</h3>
        </div>
        <div class="p-6">
          <div v-if="parsedConfig">
            <div v-for="(serviceConfig, serviceName) in parsedConfig" :key="serviceName" class="mb-6 last:mb-0">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase">
                {{ serviceName }}
              </h4>
              <div class="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-auto">
                <pre class="text-sm text-gray-900 dark:text-gray-100">{{ JSON.stringify(serviceConfig, null, 2) }}</pre>
              </div>
            </div>
          </div>
          <div v-else>
            <pre class="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-auto">{{ config.config_json }}</pre>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
