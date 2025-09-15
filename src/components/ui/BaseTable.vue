<template>
  <div :class="tableWrapperClasses">
    <table :class="tableClasses">
      <thead :class="headerClasses">
        <tr>
          <th
            v-for="(column, index) in columns"
            :key="column.key || index"
            :class="getColumnClasses(column)"
            :style="getColumnStyles(column)"
          >
            <div class="flex items-center" :class="getHeaderAlignmentClass(column)">
              <slot
                :name="`header-${column.key}`"
                :column="column"
                :index="index"
              >
                {{ column.title || column.label }}
              </slot>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-400">
        <tr
          v-for="(row, rowIndex) in data"
          :key="getRowKey(row, rowIndex)"
          @click="handleRowClick(row, rowIndex)"
          class="hover:bg-gray-200"
        >
          <td
            v-for="(column, colIndex) in columns"
            :key="column.key || colIndex"
            :class="getCellClasses(column)"
            :style="getColumnStyles(column)"
          >
            <slot
              :name="`cell-${column.key}`"
              :row="row"
              :column="column"
              :value="getCellValue(row, column)"
              :rowIndex="rowIndex"
              :colIndex="colIndex"
            >
              <div :class="getCellAlignmentClass(column)">
                {{ formatCellValue(getCellValue(row, column), row, column) }}
              </div>
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty State -->
    <div v-if="!data.length" class="bg-white border-t border-gray-200">
      <slot name="empty">
        <div class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m8-4v4m4-4v4" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">{{ emptyMessage }}</h3>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils'
import { computed } from 'vue'

export interface TableColumn {
  key: string
  title?: string
  label?: string
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  formatter?: (value: unknown, row: Record<string, unknown>) => string
  class?: string
}

interface Props {
  data: Record<string, unknown>[]
  columns: TableColumn[]
  rowKey?: string | ((row: Record<string, unknown>, index: number) => string | number)
  emptyMessage?: string
  loading?: boolean
  stickyHeader?: boolean
  responsive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rowKey: 'id',
  emptyMessage: 'No data available',
  loading: false,
  stickyHeader: false,
  responsive: true,
})

const emit = defineEmits<{
  rowClick: [{ row: Record<string, unknown>; index: number }]
}>()

const tableWrapperClasses = computed(() => {
  return cn(
    'table-wrapper',
    {
      'overflow-x-auto': props.responsive,
      'relative': props.stickyHeader,
    }
  )
})


const tableClasses = computed(() => {
  const baseClasses = 'min-w-full table-auto'

  return cn(
    baseClasses,
    {
      'table-fixed': !props.responsive,
    }
  )
})


const headerClasses = computed(() => {
  return cn(
    'bg-gray-50',
    {
      'sticky top-0 z-10': props.stickyHeader,
    }
  )
})

const getColumnClasses = (column: TableColumn) => {
  return cn(
    'text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-1 border-b border-b-gray-400',
    column.class
  )
}

const getHeaderAlignmentClass = (column: TableColumn) => {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }

  return alignmentClasses[column.align || 'left']
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getRowKey = (row: any, index: number): string | number => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row, index)
  }
  return row[props.rowKey] || index
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRowClick = (row: any, index: number) => {
  emit('rowClick', { row, index })
}


const getCellClasses = (column: TableColumn) => {
  return cn(
    'text-sm text-gray-900 whitespace-nowrap px-2 py-1',
    column.class
  )
}

const getColumnStyles = (column: TableColumn) => {
  const styles: Record<string, string> = {}

  if (column.width) {
    styles.width = typeof column.width === 'number' ? `${column.width}px` : column.width
  }
  if (column.minWidth) {
    styles.minWidth = typeof column.minWidth === 'number' ? `${column.minWidth}px` : column.minWidth
  }
  if (column.maxWidth) {
    styles.maxWidth = typeof column.maxWidth === 'number' ? `${column.maxWidth}px` : column.maxWidth
  }

  return styles
}

const getCellValue = (row: Record<string, unknown>, column: TableColumn | { key: string }) => {
  return row[column.key]
}

const getCellAlignmentClass = (column: TableColumn) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return alignmentClasses[column.align || 'left']
}

const formatCellValue = (value: unknown, row: Record<string, unknown>, column: TableColumn) => {
  if (column.formatter) {
    return column.formatter(value, row)
  }
  return value?.toString() || ''
}

</script>

<style scoped>
.table-wrapper {
  @apply relative;
}

</style>
