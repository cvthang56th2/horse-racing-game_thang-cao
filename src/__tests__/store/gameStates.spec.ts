import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createStore } from 'vuex'
import gameStatesModule, { type GameStatesData } from '../../store/modules/gameStates'
import type { Horse, RaceProgram, RaceResult, LiveRaceResult } from '../../types'

// Mock the generator utils
vi.mock('../../utils/generator', () => ({
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

describe('GameStates Store Module', () => {
  let store: any

  beforeEach(() => {
    vi.useFakeTimers()
    store = createStore({
      modules: {
        gameStates: gameStatesModule
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
    // Clear any running intervals
    const state = store.state.gameStates as GameStatesData
    Object.values(state.raceIntervals).forEach(interval => {
      clearInterval(interval)
    })
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = store.state.gameStates as GameStatesData

      expect(state.horses).toHaveLength(20)
      expect(state.programs).toHaveLength(0)
      expect(state.runningPrograms.size).toBe(0)
      expect(state.horsePositions).toEqual({})
      expect(state.raceResults).toEqual({})
      expect(state.raceIntervals).toEqual({})
      expect(state.results).toHaveLength(0)
      expect(state.liveResults).toHaveLength(0)
      expect(state.isRacing).toBe(false)
      expect(state.isPaused).toBe(false)
    })
  })

  describe('Mutations', () => {
    it('should set horses', () => {
      const horses: Horse[] = [
        { id: 1, name: 'Test Horse', condition: 80, color: 'red' }
      ]

      store.commit('gameStates/SET_HORSES', horses)

      expect(store.state.gameStates.horses).toEqual(horses)
    })

    it('should set programs', () => {
      const programs: RaceProgram[] = [
        { id: 1, distance: 1200, horses: [] }
      ]

      store.commit('gameStates/SET_PROGRAMS', programs)

      expect(store.state.gameStates.programs).toEqual(programs)
    })

    it('should add result', () => {
      const result: RaceResult = {
        programId: 1,
        result: [{ horseId: 1, position: 1 }]
      }

      store.commit('gameStates/ADD_RESULT', result)

      expect(store.state.gameStates.results).toHaveLength(1)
      expect(store.state.gameStates.results[0]).toEqual(result)
    })

    it('should remove result by program id', () => {
      const result1: RaceResult = { programId: 1, result: [] }
      const result2: RaceResult = { programId: 2, result: [] }

      store.commit('gameStates/ADD_RESULT', result1)
      store.commit('gameStates/ADD_RESULT', result2)
      store.commit('gameStates/REMOVE_RESULT', 1)

      expect(store.state.gameStates.results).toHaveLength(1)
      expect(store.state.gameStates.results[0].programId).toBe(2)
    })

    it('should clear all results', () => {
      store.commit('gameStates/ADD_RESULT', { programId: 1, result: [] })
      store.commit('gameStates/CLEAR_ALL_RESULTS')

      expect(store.state.gameStates.results).toHaveLength(0)
    })

    it('should update live result', () => {
      const liveResult: LiveRaceResult = {
        programId: 1,
        result: [{ horseId: 1, position: 1, isFinished: false }],
        isLive: true
      }

      store.commit('gameStates/UPDATE_LIVE_RESULT', liveResult)

      expect(store.state.gameStates.liveResults).toHaveLength(1)
      expect(store.state.gameStates.liveResults[0]).toEqual(liveResult)
    })

    it('should update existing live result', () => {
      const initialLiveResult: LiveRaceResult = {
        programId: 1,
        result: [{ horseId: 1, position: 1, isFinished: false }],
        isLive: true
      }

      const updatedLiveResult: LiveRaceResult = {
        programId: 1,
        result: [{ horseId: 1, position: 2, isFinished: true }],
        isLive: true
      }

      store.commit('gameStates/UPDATE_LIVE_RESULT', initialLiveResult)
      store.commit('gameStates/UPDATE_LIVE_RESULT', updatedLiveResult)

      expect(store.state.gameStates.liveResults).toHaveLength(1)
      expect(store.state.gameStates.liveResults[0]).toEqual(updatedLiveResult)
    })

    it('should toggle racing state', () => {
      expect(store.state.gameStates.isRacing).toBe(false)

      store.commit('gameStates/TOGGLE_RACING')
      expect(store.state.gameStates.isRacing).toBe(true)

      store.commit('gameStates/TOGGLE_RACING')
      expect(store.state.gameStates.isRacing).toBe(false)
    })

    it('should set racing state', () => {
      store.commit('gameStates/SET_RACING', true)
      expect(store.state.gameStates.isRacing).toBe(true)

      store.commit('gameStates/SET_RACING', false)
      expect(store.state.gameStates.isRacing).toBe(false)
    })

    it('should toggle pause state', () => {
      store.commit('gameStates/TOGGLE_PAUSE')
      expect(store.state.gameStates.isPaused).toBe(true)

      store.commit('gameStates/TOGGLE_PAUSE')
      expect(store.state.gameStates.isPaused).toBe(false)
    })

    it('should set pause state', () => {
      store.commit('gameStates/SET_PAUSED', true)
      expect(store.state.gameStates.isPaused).toBe(true)

      store.commit('gameStates/SET_PAUSED', false)
      expect(store.state.gameStates.isPaused).toBe(false)
    })
  })

  describe('Actions', () => {
    beforeEach(() => {
      // Setup some horses for testing
      const horses: Horse[] = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Horse ${i + 1}`,
        condition: 50 + i * 5,
        color: `color-${i}`
      }))
      store.commit('gameStates/SET_HORSES', horses)
    })

    it('should regenerate horses', async () => {
      await store.dispatch('gameStates/regenerateHorses', 5)

      expect(store.state.gameStates.horses).toHaveLength(5)
    })

    it('should generate programs', async () => {
      await store.dispatch('gameStates/generateProgram', 3)

      const programs = store.state.gameStates.programs
      expect(programs).toHaveLength(3)
      programs.forEach((program: RaceProgram, index: number) => {
        expect(program.id).toBe(index + 1)
        expect(program.distance).toBe(1200 + index * 200)
        expect(program.horses).toHaveLength(10)
      })
    })

    it('should not generate programs if no horses available', async () => {
      store.commit('gameStates/SET_HORSES', [])
      await store.dispatch('gameStates/generateProgram', 3)

      expect(store.state.gameStates.programs).toHaveLength(0)
    })

    it('should start a race', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [
          { id: 1, name: 'Horse 1', condition: 80, color: 'red' },
          { id: 2, name: 'Horse 2', condition: 70, color: 'blue' }
        ]
      }

      await store.dispatch('gameStates/startRace', program)

      expect(store.state.gameStates.isRacing).toBe(true)
      expect(store.state.gameStates.runningPrograms.has(1)).toBe(true)
      expect(store.state.gameStates.raceIntervals[1]).toBeDefined()
    })

    it('should not start race if already running', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [{ id: 1, name: 'Horse 1', condition: 80, color: 'red' }]
      }

      store.state.gameStates.runningPrograms.add(1)
      const intervalsBefore = Object.keys(store.state.gameStates.raceIntervals).length

      await store.dispatch('gameStates/startRace', program)

      const intervalsAfter = Object.keys(store.state.gameStates.raceIntervals).length
      expect(intervalsAfter).toBe(intervalsBefore)
    })

    it('should reset a race', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [{ id: 1, name: 'Horse 1', condition: 80, color: 'red' }]
      }

      // Start race first
      await store.dispatch('gameStates/startRace', program)
      expect(store.state.gameStates.runningPrograms.has(1)).toBe(true)

      // Reset race
      await store.dispatch('gameStates/resetRace', 1)

      expect(store.state.gameStates.runningPrograms.has(1)).toBe(false)
      expect(store.state.gameStates.raceIntervals[1]).toBeUndefined()
      expect(store.state.gameStates.isRacing).toBe(false)
    })

    it('should start all races', async () => {
      const programs: RaceProgram[] = [
        { id: 1, distance: 1200, horses: [{ id: 1, name: 'Horse 1', condition: 80, color: 'red' }] },
        { id: 2, distance: 1400, horses: [{ id: 2, name: 'Horse 2', condition: 70, color: 'blue' }] }
      ]

      store.commit('gameStates/SET_PROGRAMS', programs)
      await store.dispatch('gameStates/startAllRaces')

      expect(store.state.gameStates.runningPrograms.has(1)).toBe(true)
      expect(store.state.gameStates.runningPrograms.has(2)).toBe(true)
      expect(store.state.gameStates.isRacing).toBe(true)
    })

    it('should reset all races', async () => {
      // Setup and start some races
      const programs: RaceProgram[] = [
        { id: 1, distance: 1200, horses: [{ id: 1, name: 'Horse 1', condition: 80, color: 'red' }] },
        { id: 2, distance: 1400, horses: [{ id: 2, name: 'Horse 2', condition: 70, color: 'blue' }] }
      ]

      store.commit('gameStates/SET_PROGRAMS', programs)
      await store.dispatch('gameStates/startAllRaces')

      // Add some results
      store.commit('gameStates/ADD_RESULT', { programId: 1, result: [] })
      store.commit('gameStates/UPDATE_LIVE_RESULT', { programId: 1, result: [], isLive: true })

      // Reset all
      await store.dispatch('gameStates/resetAllRaces')

      expect(store.state.gameStates.runningPrograms.size).toBe(0)
      expect(store.state.gameStates.results).toHaveLength(0)
      expect(store.state.gameStates.liveResults).toHaveLength(0)
      expect(store.state.gameStates.isPaused).toBe(false)
      expect(store.state.gameStates.isRacing).toBe(false)
    })

    it('should toggle pause races', async () => {
      await store.dispatch('gameStates/togglePauseRaces')
      expect(store.state.gameStates.isPaused).toBe(true)

      await store.dispatch('gameStates/togglePauseRaces')
      expect(store.state.gameStates.isPaused).toBe(false)
    })
  })

  describe('Getters', () => {
    beforeEach(() => {
      const horses: Horse[] = [
        { id: 1, name: 'Horse 1', condition: 80, color: 'red' },
        { id: 2, name: 'Horse 2', condition: 70, color: 'blue' }
      ]
      const programs: RaceProgram[] = [
        { id: 1, distance: 1200, horses: [horses[0]] },
        { id: 2, distance: 1400, horses: [horses[1]] }
      ]

      store.commit('gameStates/SET_HORSES', horses)
      store.commit('gameStates/SET_PROGRAMS', programs)
    })

    it('should get all horses', () => {
      const horses = store.getters['gameStates/allHorses']
      expect(horses).toHaveLength(2)
      expect(horses[0].name).toBe('Horse 1')
    })

    it('should get all programs', () => {
      const programs = store.getters['gameStates/allPrograms']
      expect(programs).toHaveLength(2)
      expect(programs[0].id).toBe(1)
    })

    it('should get program by id', () => {
      const program = store.getters['gameStates/getProgramById'](1)
      expect(program).toBeDefined()
      expect(program.id).toBe(1)
      expect(program.distance).toBe(1200)
    })

    it('should return undefined for non-existent program', () => {
      const program = store.getters['gameStates/getProgramById'](999)
      expect(program).toBeUndefined()
    })

    it('should get racing state', () => {
      expect(store.getters['gameStates/isRacing']).toBe(false)

      store.commit('gameStates/SET_RACING', true)
      expect(store.getters['gameStates/isRacing']).toBe(true)
    })

    it('should get pause state', () => {
      expect(store.getters['gameStates/isPaused']).toBe(false)

      store.commit('gameStates/SET_PAUSED', true)
      expect(store.getters['gameStates/isPaused']).toBe(true)
    })

    it('should get all results', () => {
      const result: RaceResult = { programId: 1, result: [] }
      store.commit('gameStates/ADD_RESULT', result)

      const results = store.getters['gameStates/allResults']
      expect(results).toHaveLength(1)
      expect(results[0]).toEqual(result)
    })

    it('should get all live results', () => {
      const liveResult: LiveRaceResult = { programId: 1, result: [], isLive: true }
      store.commit('gameStates/UPDATE_LIVE_RESULT', liveResult)

      const liveResults = store.getters['gameStates/allLiveResults']
      expect(liveResults).toHaveLength(1)
      expect(liveResults[0]).toEqual(liveResult)
    })
  })

  describe('Race Simulation', () => {
    it('should simulate race progress over time', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [
          { id: 1, name: 'Fast Horse', condition: 90, color: 'red' },
          { id: 2, name: 'Slow Horse', condition: 30, color: 'blue' }
        ]
      }

      await store.dispatch('gameStates/startRace', program)

      // Advance time to let the race progress
      vi.advanceTimersByTime(1000) // 1 second

      // Check that live results are being updated
      const liveResults = store.getters['gameStates/allLiveResults']
      expect(liveResults).toHaveLength(1)
      expect(liveResults[0].programId).toBe(1)
      expect(liveResults[0].isLive).toBe(true)

      // Check that horse positions are being tracked
      const positions = store.getters['gameStates/allHorsePositions']
      expect(positions['1-1']).toBeDefined()
      expect(positions['1-2']).toBeDefined()
    })

    it('should handle race completion', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [{ id: 1, name: 'Super Fast Horse', condition: 100, color: 'red' }]
      }

      await store.dispatch('gameStates/startRace', program)

      // Advance time significantly to complete the race
      vi.advanceTimersByTime(60000) // 60 seconds (max race time)

      // Race should be complete
      expect(store.state.gameStates.runningPrograms.has(1)).toBe(false)
      expect(store.state.gameStates.isRacing).toBe(false)

      // Should have final results
      const results = store.getters['gameStates/allResults']
      expect(results.length).toBeGreaterThan(0)
    })

    it('should handle pause during race', async () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: [{ id: 1, name: 'Horse', condition: 80, color: 'red' }]
      }

      await store.dispatch('gameStates/startRace', program)

      // Get initial position
      vi.advanceTimersByTime(500)
      const initialPosition = store.state.gameStates.horsePositions['1-1']

      // Pause the race
      store.commit('gameStates/SET_PAUSED', true)

      // Advance time while paused
      vi.advanceTimersByTime(1000)

      // Position should not have changed much (race is paused)
      const pausedPosition = store.state.gameStates.horsePositions['1-1']
      expect(pausedPosition).toBe(initialPosition)

      // Resume race
      store.commit('gameStates/SET_PAUSED', false)

      // Advance time
      vi.advanceTimersByTime(500)

      // Position should update again
      const resumedPosition = store.state.gameStates.horsePositions['1-1']
      expect(resumedPosition).toBeGreaterThanOrEqual(pausedPosition)
    })
  })
})
