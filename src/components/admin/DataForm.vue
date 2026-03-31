<script setup lang="ts">
import { ref, watch } from 'vue'

export interface FormField {
  key: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'date' | 'datetime' | 'switch' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { label: string; value: any }[]
  rules?: ((value: any) => string | null)[]
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  fields: FormField[]
  initialValues?: Record<string, any>
  loading?: boolean
}>(), {
  loading: false
})

const emit = defineEmits<{
  (e: 'submit', values: Record<string, any>): void
  (e: 'cancel'): void
}>()

const values = ref<Record<string, any>>({ ...props.initialValues })

watch(() => props.initialValues, (newVal) => {
  if (newVal) {
    values.value = { ...newVal }
  }
}, { immediate: true })

const errors = ref<Record<string, string>>({})

const validate = (): boolean => {
  errors.value = {}
  
  for (const field of props.fields) {
    const value = values.value[field.key]
    
    if (field.required && (value === undefined || value === null || value === '')) {
      errors.value[field.key] = `${field.label}不能为空`
      continue
    }
    
    if (field.rules && value !== undefined && value !== null && value !== '') {
      for (const rule of field.rules) {
        const error = rule(value)
        if (error) {
          errors.value[field.key] = error
          break
        }
      }
    }
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (validate()) {
    emit('submit', values.value)
  }
}

const handleReset = () => {
  values.value = { ...props.initialValues }
  errors.value = {}
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      v-for="field in fields"
      :key="field.key"
      class="space-y-1"
    >
      <label :for="field.key" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {{ field.label }}
        <span v-if="field.required" class="text-red-500">*</span>
      </label>

      <input
        v-if="field.type === 'text' || field.type === 'email' || field.type === 'password' || field.type === 'number' || field.type === 'date' || field.type === 'datetime'"
        :id="field.key"
        v-model="values[field.key]"
        :type="field.type"
        :placeholder="field.placeholder"
        :disabled="field.disabled || loading"
        class="block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
      />

      <textarea
        v-else-if="field.type === 'textarea'"
        :id="field.key"
        v-model="values[field.key]"
        :placeholder="field.placeholder"
        :disabled="field.disabled || loading"
        rows="4"
        class="block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
      />

      <select
        v-else-if="field.type === 'select'"
        :id="field.key"
        v-model="values[field.key]"
        :disabled="field.disabled || loading"
        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
      >
        <option value="">请选择</option>
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>

      <label v-else-if="field.type === 'switch'" class="flex items-center gap-2">
        <input
          type="checkbox"
          v-model="values[field.key]"
          :disabled="field.disabled || loading"
          class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <span class="text-sm text-gray-500 dark:text-gray-400">{{ field.placeholder }}</span>
      </label>

      <p v-if="errors[field.key]" class="text-sm text-red-500">
        {{ errors[field.key] }}
      </p>
    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
      <button
        type="button"
        @click="emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        取消
      </button>
      <button
        type="submit"
        :disabled="loading"
        class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">保存中...</span>
        <span v-else>保存</span>
      </button>
    </div>
  </form>
</template>
