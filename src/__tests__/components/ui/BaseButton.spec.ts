import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import BaseButton from '../../../components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders button with default props', () => {
    const wrapper = mount(BaseButton)

    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.attributes('type')).toBe('button')
    expect(button.attributes('disabled')).toBeUndefined()
  })

  it('renders button content', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(BaseButton)

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')

    expect(wrapper.emitted('click')).toBeUndefined()
  })

  it('applies custom classes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        class: 'custom-class bg-red-500'
      }
    })

    const button = wrapper.find('button')
    expect(button.classes()).toContain('custom-class')
    expect(button.classes()).toContain('bg-red-500')
  })

  it('supports different button types', () => {
    const wrapper = mount(BaseButton, {
      attrs: {
        type: 'submit'
      }
    })

    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('handles loading state if supported', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Loading...'
      }
    })

    expect(wrapper.text()).toBe('Loading...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('passes through all other attributes', () => {
    const wrapper = mount(BaseButton, {
      attrs: {
        'data-testid': 'test-button',
        'aria-label': 'Test button'
      }
    })

    const button = wrapper.find('button')
    expect(button.attributes('data-testid')).toBe('test-button')
    expect(button.attributes('aria-label')).toBe('Test button')
  })
})
