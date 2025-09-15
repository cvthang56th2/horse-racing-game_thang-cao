import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import GameProgramStats from '../../../components/GameScreen/GameProgramStats.vue'
import gameStatesModule from '../../../store/modules/gameStates'
import type { Horse, RaceProgram } from '../../../types'

describe('GameProgramStats', () => {
  let store: any
  let mockProgram: RaceProgram
  let mockHorses: Horse[]

  beforeEach(() => {
    store = createStore({
      modules: {
        gameStates: gameStatesModule
      }
    })

    mockHorses = [
      { id: 1, name: 'Thunder', condition: 85, color: 'red' },
      { id: 2, name: 'Lightning', condition: 72, color: 'blue' },
      { id: 3, name: 'Storm', condition: 90, color: 'green' }
    ]

    mockProgram = {
      id: 1,
      distance: 1200,
      horses: mockHorses
    }

    // Set up store with test data
    store.commit('gameStates/SET_HORSES', mockHorses)
    store.commit('gameStates/SET_PROGRAMS', [mockProgram])
  })

  it('renders program information', () => {
    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Program')
    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Lightning')
    expect(wrapper.text()).toContain('Storm')
  })

  it('shows horse positions in program table', () => {
    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should show horses with their positions (1, 2, 3)
    const tables = wrapper.findAllComponents({ name: 'BaseTable' })
    expect(tables.length).toBeGreaterThanOrEqual(1)
  })

  it('displays results title correctly for no results', () => {
    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Results')
  })

  it('displays live results during race', async () => {
    // Add live results
    const liveResult = {
      programId: 1,
      result: [
        { horseId: 1, position: 1, isFinished: false },
        { horseId: 2, position: 2, isFinished: false }
      ],
      isLive: true
    }

    store.commit('gameStates/SET_RACING', true)
    store.commit('gameStates/UPDATE_LIVE_RESULT', liveResult)

    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Live Results')
  })

  it('displays final results after race completion', async () => {
    // Add final results
    const finalResult = {
      programId: 1,
      result: [
        { horseId: 1, position: 1 },
        { horseId: 2, position: 2 },
        { horseId: 3, position: 3 }
      ]
    }

    store.commit('gameStates/ADD_RESULT', finalResult)

    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Final Results')
  })

  it('handles missing program gracefully', () => {
    expect(() => {
      mount(GameProgramStats, {
        props: {
          programId: 999 // Non-existent program
        },
        global: {
          plugins: [store]
        }
      })
    }).toThrow('Program with ID 999 not found')
  })

  it('shows correct horse names in results', () => {
    const finalResult = {
      programId: 1,
      result: [
        { horseId: 1, position: 1 },
        { horseId: 2, position: 2 }
      ]
    }

    store.commit('gameStates/ADD_RESULT', finalResult)

    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should show horse names, not just IDs
    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Lightning')
  })

  it('applies correct CSS classes for live results', () => {
    const liveResult = {
      programId: 1,
      result: [{ horseId: 1, position: 1, isFinished: false }],
      isLive: true
    }

    store.commit('gameStates/SET_RACING', true)
    store.commit('gameStates/UPDATE_LIVE_RESULT', liveResult)

    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should have live results styling classes
    const h4Elements = wrapper.findAll('h4')
    expect(h4Elements.length).toBeGreaterThanOrEqual(2)

    // The second h4 should be the results title with live results classes
    const resultsTitle = h4Elements[1]
    const classes = resultsTitle.classes()
    expect(classes).toContain('text-red-600')
    expect(classes).toContain('animate-pulse')
  })

  it('sorts results by position', () => {
    const finalResult = {
      programId: 1,
      result: [
        { horseId: 2, position: 3 },
        { horseId: 1, position: 1 },
        { horseId: 3, position: 2 }
      ]
    }

    store.commit('gameStates/ADD_RESULT', finalResult)

    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })    // Results should be sorted by position
    // The component should handle sorting internally
    const vm = wrapper.vm as unknown as { getProgramResults: (id: number) => Array<{ position: number }> }
    const programResults = vm.getProgramResults(1)

    if (programResults.length > 1) {
      expect(programResults[0].position).toBeLessThan(programResults[1].position)
    }
  })

  it('handles empty results', () => {
    const wrapper = mount(GameProgramStats, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('No results yet')
  })
})
