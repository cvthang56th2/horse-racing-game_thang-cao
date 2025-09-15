import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { TableColumn } from '../../../components/ui/BaseTable.vue'
import BaseTable from '../../../components/ui/BaseTable.vue'

describe('BaseTable', () => {
  const mockData = [
    { id: 1, name: 'Item 1', status: 'active' },
    { id: 2, name: 'Item 2', status: 'inactive' },
    { id: 3, name: 'Item 3', status: 'pending' }
  ]

  const mockColumns: TableColumn[] = [
    { key: 'id', title: 'ID', width: '60px' },
    { key: 'name', title: 'Name' },
    { key: 'status', title: 'Status', formatter: (value: unknown) => String(value).toUpperCase() }
  ]

  it('renders table with data and columns', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: mockData,
        rowKey: 'id'
      }
    })

    expect(wrapper.find('table').exists()).toBe(true)

    // Check headers
    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toBe('ID')
    expect(headers[1].text()).toBe('Name')
    expect(headers[2].text()).toBe('Status')

    // Check data rows
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('applies column formatting', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: mockData,
        rowKey: 'id'
      }
    })

    const statusCells = wrapper.findAll('tbody tr td:nth-child(3)')
    expect(statusCells[0].text()).toBe('ACTIVE')
    expect(statusCells[1].text()).toBe('INACTIVE')
    expect(statusCells[2].text()).toBe('PENDING')
  })

  it('shows empty message when no data', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: [],
        rowKey: 'id',
        emptyMessage: 'No items found'
      }
    })

    expect(wrapper.text()).toContain('No items found')
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
  })

  it('uses default empty message', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: [],
        rowKey: 'id'
      }
    })

    expect(wrapper.text()).toContain('No data available')
  })

  it('applies column widths', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: mockData,
        rowKey: 'id'
      }
    })

    const firstHeader = wrapper.find('th')
    expect(firstHeader.attributes('style')).toContain('width: 60px')
  })

  it('handles missing column titles', () => {
    const columnsWithoutTitles: TableColumn[] = [
      { key: 'id' },
      { key: 'name', label: 'Product Name' },
      { key: 'status' }
    ]

    const wrapper = mount(BaseTable, {
      props: {
        columns: columnsWithoutTitles,
        data: mockData,
        rowKey: 'id'
      }
    })

    const headers = wrapper.findAll('th')
    expect(headers[0].text()).toBe('') // No title or label
    expect(headers[1].text()).toBe('Product Name') // Uses label
    expect(headers[2].text()).toBe('') // No title or label
  })

  it('handles custom row keys', () => {
    const dataWithCustomKey = [
      { customId: 'a1', name: 'Item A' },
      { customId: 'b2', name: 'Item B' }
    ]

    const wrapper = mount(BaseTable, {
      props: {
        columns: [{ key: 'name', title: 'Name' }],
        data: dataWithCustomKey,
        rowKey: 'customId'
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('handles formatters with row context', () => {
    const columnsWithRowFormatter: TableColumn[] = [
      {
        key: 'name',
        title: 'Name',
        formatter: (value: unknown, row: Record<string, unknown>) =>
          `${value} (${row.status})`
      }
    ]

    const wrapper = mount(BaseTable, {
      props: {
        columns: columnsWithRowFormatter,
        data: mockData,
        rowKey: 'id'
      }
    })

    const nameCells = wrapper.findAll('tbody tr td')
    expect(nameCells[0].text()).toBe('Item 1 (active)')
    expect(nameCells[1].text()).toBe('Item 2 (inactive)')
  })

  it('handles undefined or null values', () => {
    const dataWithNulls = [
      { id: 1, name: null, status: undefined },
      { id: 2, name: 'Item 2', status: 'active' }
    ]

    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: dataWithNulls,
        rowKey: 'id'
      }
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)

    // Should handle null/undefined gracefully
    expect(wrapper.html()).not.toContain('null')
    expect(wrapper.html()).not.toContain('undefined')
  })

  it('applies table classes correctly', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: mockData,
        rowKey: 'id'
      }
    })

    const table = wrapper.find('table')
    expect(table.classes()).toContain('min-w-full')
    const tableBody = wrapper.find('tbody')
    expect(tableBody.classes()).toContain('divide-y')
  })

  it('renders custom empty slot', () => {
    const wrapper = mount(BaseTable, {
      props: {
        columns: mockColumns,
        data: [],
        rowKey: 'id'
      },
      slots: {
        empty: '<div class="custom-empty">Custom empty state</div>'
      }
    })

    expect(wrapper.html()).toContain('Custom empty state')
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })
})
