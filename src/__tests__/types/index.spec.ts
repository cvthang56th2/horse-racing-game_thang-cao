import { describe, it, expect } from 'vitest'
import type { Horse, RaceProgram, RaceResult, LiveRaceResult } from '../../types'

describe('Type Definitions', () => {
  describe('Horse type', () => {
    it('should have correct properties', () => {
      const horse: Horse = {
        id: 1,
        name: 'Thunder',
        condition: 85,
        color: 'red'
      }

      expect(horse.id).toBe(1)
      expect(horse.name).toBe('Thunder')
      expect(horse.condition).toBe(85)
      expect(horse.color).toBe('red')
    })

    it('should enforce number type for id and condition', () => {
      const horse: Horse = {
        id: 123,
        name: 'Lightning',
        condition: 72,
        color: 'blue'
      }

      expect(typeof horse.id).toBe('number')
      expect(typeof horse.condition).toBe('number')
      expect(typeof horse.name).toBe('string')
      expect(typeof horse.color).toBe('string')
    })
  })

  describe('RaceProgram type', () => {
    it('should have correct properties', () => {
      const horses: Horse[] = [
        { id: 1, name: 'Horse 1', condition: 80, color: 'red' },
        { id: 2, name: 'Horse 2', condition: 70, color: 'blue' }
      ]

      const program: RaceProgram = {
        id: 1,
        distance: 1200,
        horses: horses
      }

      expect(program.id).toBe(1)
      expect(program.distance).toBe(1200)
      expect(program.horses).toHaveLength(2)
      expect(program.horses[0]).toEqual(horses[0])
    })

    it('should enforce array type for horses', () => {
      const program: RaceProgram = {
        id: 1,
        distance: 1000,
        horses: []
      }

      expect(Array.isArray(program.horses)).toBe(true)
    })
  })

  describe('RaceResult type', () => {
    it('should have correct structure', () => {
      const result: RaceResult = {
        programId: 1,
        result: [
          { horseId: 1, position: 1 },
          { horseId: 2, position: 2 },
          { horseId: 3, position: 3 }
        ]
      }

      expect(result.programId).toBe(1)
      expect(result.result).toHaveLength(3)
      expect(result.result[0].horseId).toBe(1)
      expect(result.result[0].position).toBe(1)
    })

    it('should allow empty results', () => {
      const result: RaceResult = {
        programId: 1,
        result: []
      }

      expect(result.result).toHaveLength(0)
    })
  })

  describe('LiveRaceResult type', () => {
    it('should extend RaceResult with additional properties', () => {
      const liveResult: LiveRaceResult = {
        programId: 1,
        result: [
          { horseId: 1, position: 1, isFinished: false },
          { horseId: 2, position: 2, isFinished: true }
        ],
        isLive: true
      }

      expect(liveResult.programId).toBe(1)
      expect(liveResult.isLive).toBe(true)
      expect(liveResult.result[0].isFinished).toBe(false)
      expect(liveResult.result[1].isFinished).toBe(true)
    })

    it('should have isFinished property for each horse result', () => {
      const liveResult: LiveRaceResult = {
        programId: 1,
        result: [
          { horseId: 1, position: 1, isFinished: true }
        ],
        isLive: true
      }

      expect(typeof liveResult.result[0].isFinished).toBe('boolean')
    })
  })

  describe('Type compatibility', () => {
    it('should allow Horse in RaceProgram horses array', () => {
      const horse: Horse = {
        id: 1,
        name: 'Test Horse',
        condition: 75,
        color: 'green'
      }

      const program: RaceProgram = {
        id: 1,
        distance: 1500,
        horses: [horse]
      }

      expect(program.horses[0]).toBe(horse)
    })

    it('should maintain type safety for result positions', () => {
      const result: RaceResult = {
        programId: 1,
        result: [
          { horseId: 1, position: 1 },
          { horseId: 2, position: 2 }
        ]
      }

      // Positions should be numbers
      result.result.forEach(r => {
        expect(typeof r.position).toBe('number')
        expect(typeof r.horseId).toBe('number')
      })
    })

    it('should handle live result conversion', () => {
      const baseResult = {
        horseId: 1,
        position: 1
      }

      const liveResult = {
        ...baseResult,
        isFinished: false
      }

      expect(liveResult.horseId).toBe(baseResult.horseId)
      expect(liveResult.position).toBe(baseResult.position)
      expect(liveResult.isFinished).toBe(false)
    })
  })
})
