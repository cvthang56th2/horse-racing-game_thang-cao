<template>
  <component
    :is="tag"
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="tag === 'button' ? type : undefined"
    v-bind="$attrs"
    @click="handleClick"
  >
    <div v-if="loading" class="spinner mr-2 h-4 w-4" />
    <slot v-if="!loading" name="icon" />
    <span v-if="$slots.default" :class="{ 'ml-2': $slots.icon && !loading }">
      <slot />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/shared/lib/utils'

interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost' | 'link'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  tag?: 'button' | 'a' | 'router-link'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  rounded?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  tag: 'button',
  type: 'button',
  disabled: false,
  loading: false,
  rounded: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: [event: Event]
}>()

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const buttonClasses = computed(() => {
  const baseClasses = 'btn-base'

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-blue-300 text-white hover:bg-blue-400 active:bg-blue-400',
    success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
    warning: 'bg-yellow-500 text-white hover:bg-yellow-600 active:bg-yellow-700',
    error: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 active:bg-gray-100',
    ghost: 'text-gray-900 hover:bg-gray-100 active:bg-gray-200',
    link: 'text-blue-500 underline-offset-4 hover:underline active:text-blue-600',
  }

  const sizeClasses = {
    xs: 'h-6 px-2 text-xs',
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
    xl: 'h-14 px-8 text-lg',
  }

  return cn(
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    {
      'w-full': props.fullWidth,
      'rounded-full': props.rounded,
      'cursor-not-allowed opacity-60': props.disabled,
      'cursor-wait': props.loading,
    }
  )
})
</script>
