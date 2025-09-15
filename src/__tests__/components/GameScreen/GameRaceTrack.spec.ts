import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import GameRaceTrack from '../../../components/GameScreen/GameRaceTrack.vue'
import gameStatesModule from '../../../store/modules/gameStates'
import type { Horse, RaceProgram } from '../../../types'

describe('GameRaceTrack', () => {
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
      { id: 2, name: 'Lightning', condition: 72, color: 'blue' }
    ]

    mockProgram = {
      id: 1,
      distance: 1200,
      horses: mockHorses
    }

    // Set up store with test data
    store.commit('gameStates/SET_PROGRAMS', [mockProgram])
  })

  it('renders race track for all horses', () => {
    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    expect(wrapper.text()).toContain('Thunder')
    expect(wrapper.text()).toContain('Lightning')
    expect(wrapper.text()).toContain('Condition: 85%')
    expect(wrapper.text()).toContain('Condition: 72%')
  })

  it('displays horse positions correctly', () => {
    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should show position numbers
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('2')
  })

  it('shows horse positions on track', () => {
    // Set some horse positions
    const positions = {
      '1-1': 25, // Horse 1 at 25% of track
      '1-2': 50  // Horse 2 at 50% of track
    }

    store.state.gameStates.horsePositions = positions

    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Check that horses are positioned on the track
    const horseContainers = wrapper.findAll('[style*="left"]')
    expect(horseContainers.length).toBeGreaterThan(0)
  })

  it('shows finish line', () => {
    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should have finish line styling
    const finishLine = wrapper.find('.bg-red-500')
    expect(finishLine.exists()).toBe(true)
  })

  it('displays track markings', () => {
    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should have track markings (10 sections)
    const trackMarkings = wrapper.findAll('.border-r')
    expect(trackMarkings.length).toBeGreaterThan(0)
  })

  it('handles racing state correctly', () => {
    store.commit('gameStates/SET_RACING', true)
    store.state.gameStates.runningPrograms.add(1)

    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Should pass racing state to RaceHorse components
    const raceHorses = wrapper.findAllComponents({ name: 'RaceHorse' })
    expect(raceHorses.length).toBe(2)
  })

  it('limits horse position to maximum 95%', () => {
    // Set horse position beyond finish line
    const positions = {
      '1-1': 100, // Horse at 100%
      '1-2': 120  // Horse beyond 100%
    }

    store.state.gameStates.horsePositions = positions

    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    // Positions should be capped at 95%
    const horseContainers = wrapper.findAll('[style*="left: 95%"]')
    expect(horseContainers.length).toBeGreaterThan(0)
  })

  it('handles missing program gracefully', () => {
    expect(() => {
      mount(GameRaceTrack, {
        props: {
          programId: 999 // Non-existent program
        },
        global: {
          plugins: [store]
        }
      })
    }).toThrow('Program with ID 999 not found')
  })

  it('passes correct props to RaceHorse components', () => {
    store.commit('gameStates/SET_RACING', true)
    store.state.gameStates.runningPrograms.add(1)
    store.state.gameStates.horsePositions = { '1-1': 30, '1-2': 60 }

    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    const raceHorses = wrapper.findAllComponents({ name: 'RaceHorse' })

    // Check first horse props
    expect(raceHorses[0].props('horse')).toEqual(mockHorses[0])
    expect(raceHorses[0].props('isRunning')).toBe(true)

    // Check second horse props
    expect(raceHorses[1].props('horse')).toEqual(mockHorses[1])
    expect(raceHorses[1].props('isRunning')).toBe(true)
  })

  it('stops running animation when horse finishes', () => {
    store.commit('gameStates/SET_RACING', true)
    store.state.gameStates.runningPrograms.add(1)

    // Set horse at finish line
    store.state.gameStates.horsePositions = { '1-1': 95, '1-2': 30 }

    const wrapper = mount(GameRaceTrack, {
      props: {
        programId: 1
      },
      global: {
        plugins: [store]
      }
    })

    const raceHorses = wrapper.findAllComponents({ name: 'RaceHorse' })

    // First horse should not be running (finished)
    expect(raceHorses[0].props('isRunning')).toBe(false)

    // Second horse should still be running
    expect(raceHorses[1].props('isRunning')).toBe(true)
  })
})
