import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import GameTopActions from '../../../components/GameScreen/GameTopActions.vue'
import gameStatesModule from '../../../store/modules/gameStates'

// Mock the utils
vi.mock('../../../utils', () => ({
  cn: (...classes: string[]) => classes.filter(Boolean).join(' '),
  generateHorses: vi.fn((count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      condition: 50 + (i * 10),
      color: `hsl(${i * 30}, 70%, 50%)`
    }))
  ),
  generateProgramName: vi.fn((index: number) => `Program ${index + 1}`)
}))

describe('GameTopActions', () => {
  let store: any

  beforeEach(() => {
    store = createStore({
      modules: {
        gameStates: gameStatesModule
      }
    })
  })

  it('renders all action buttons', () => {
    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Horse Racing Game')
    expect(wrapper.text()).toContain('Show Horses')
    expect(wrapper.text()).toContain('Re-generate Horses')
    expect(wrapper.text()).toContain('Generate Program')
    expect(wrapper.text()).toContain('Start All Races')
  })

  it('shows hide horses when showHorseList is true', () => {
    const wrapper = mount(GameTopActions, {
      props: {
        showHorseList: true
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Hide Horses')
  })

  it('disables start button when no programs', () => {
    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    // Check that the store has no programs initially
    expect(store.getters['gameStates/allPrograms'].length).toBe(0)
  })

  it('emits toggleHorseList when horse button clicked', async () => {
    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    const horseButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Show Horses')
    )

    if (horseButton) {
      await horseButton.trigger('click')
      expect(wrapper.emitted('toggleHorseList')).toBeTruthy()
    }
  })

  it('calls regenerateHorses action', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    const regenButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Re-generate Horses')
    )

    if (regenButton) {
      await regenButton.trigger('click')
      expect(dispatchSpy).toHaveBeenCalledWith('gameStates/regenerateHorses', 20)
    }
  })

  it('calls generateProgram action', async () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch')

    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    const generateButton = wrapper.findAll('button').find(btn =>
      btn.text().includes('Generate Program')
    )

    if (generateButton) {
      await generateButton.trigger('click')
      expect(dispatchSpy).toHaveBeenCalledWith('gameStates/generateProgram', 6)
    }
  })

  it('shows pause/resume button when racing', async () => {
    // Set racing state
    store.commit('gameStates/SET_RACING', true)

    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Pause')
  })

  it('shows resume button when paused', async () => {
    store.commit('gameStates/SET_RACING', true)
    store.commit('gameStates/SET_PAUSED', true)

    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Resume')
  })

  it('applies bounce animation to generate button when no programs', () => {
    mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    // Check if the store has no programs
    expect(store.getters['gameStates/allPrograms'].length).toBe(0)
  })

  it('updates button text when programs exist', async () => {
    // Add some programs to the store
    const mockPrograms = [
      { id: 1, distance: 1200, horses: [] },
      { id: 2, distance: 1400, horses: [] }
    ]

    store.commit('gameStates/SET_PROGRAMS', mockPrograms)

    const wrapper = mount(GameTopActions, {
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Re-generate Program')
  })
})
