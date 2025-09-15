import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import App from '../App.vue'
import gameStatesModule from '../store/modules/gameStates'

// Mock router
const mockRouter = {
  push: vi.fn(),
  currentRoute: { value: { path: '/' } }
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter,
  useRoute: () => mockRouter.currentRoute.value
}))

describe('App', () => {
  it('renders properly', () => {
    const store = createStore({
      modules: {

        gameStates: gameStatesModule
      }
    })

    const wrapper = mount(App, {
      global: {
        plugins: [store],
        mocks: {
          $router: mockRouter,
          $route: mockRouter.currentRoute.value
        }
      }
    })

    expect(wrapper.find('div').exists()).toBe(true)
  })
})
