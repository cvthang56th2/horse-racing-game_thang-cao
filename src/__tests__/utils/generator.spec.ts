import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateRandomHorseName,
  generateRandomColor,
  generateRandomNumber,
  generateHorses,
  generateProgramName
} from '../../utils/generator'
import { faker } from '@faker-js/faker'

// Mock faker
vi.mock('@faker-js/faker', () => ({
  faker: {
    animal: {
      horse: vi.fn()
    }
  }
}))

describe('Generator Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateRandomHorseName', () => {
    it('should generate a horse name with at most 2 words', () => {
      // Mock faker to return a predictable name
      vi.mocked(faker.animal.horse).mockReturnValue('Thunder Lightning Storm')

      const name = generateRandomHorseName()

      expect(name).toBe('Thunder Lightning')
      expect(faker.animal.horse).toHaveBeenCalledOnce()
    })

    it('should handle single word horse names', () => {
      vi.mocked(faker.animal.horse).mockReturnValue('Thunder')

      const name = generateRandomHorseName()

      expect(name).toBe('Thunder')
    })

    it('should handle empty names gracefully', () => {
      vi.mocked(faker.animal.horse).mockReturnValue('')

      const name = generateRandomHorseName()

      expect(name).toBe('')
    })
  })

  describe('generateRandomColor', () => {
    it('should generate a valid HSL color string', () => {
      const color = generateRandomColor()

      expect(color).toMatch(/^hsl\(\d+, \d+%, \d+%\)$/)
    })

    it('should generate colors within specified ranges', () => {
      // Mock Math.random to return predictable values
      const mockRandom = vi.spyOn(Math, 'random')
      mockRandom.mockReturnValueOnce(0.5) // hue = 180
      mockRandom.mockReturnValueOnce(0.5) // saturation = 75
      mockRandom.mockReturnValueOnce(0.5) // lightness = 50

      const color = generateRandomColor()

      expect(color).toBe('hsl(180, 75%, 50%)')

      mockRandom.mockRestore()
    })

    it('should generate different colors on multiple calls', () => {
      const colors = Array.from({ length: 10 }, () => generateRandomColor())
      const uniqueColors = new Set(colors)

      // Should have some variety (not all the same)
      expect(uniqueColors.size).toBeGreaterThan(1)
    })
  })

  describe('generateRandomNumber', () => {
    it('should generate number within specified range', () => {
      const min = 10
      const max = 20
      const number = generateRandomNumber(min, max)

      expect(number).toBeGreaterThanOrEqual(min)
      expect(number).toBeLessThanOrEqual(max)
      expect(Number.isInteger(number)).toBe(true)
    })

    it('should handle single value range', () => {
      const number = generateRandomNumber(5, 5)
      expect(number).toBe(5)
    })

    it('should work with negative numbers', () => {
      const number = generateRandomNumber(-10, -5)
      expect(number).toBeGreaterThanOrEqual(-10)
      expect(number).toBeLessThanOrEqual(-5)
    })
  })

  describe('generateHorses', () => {
    beforeEach(() => {
      // Mock faker to return predictable names
      vi.mocked(faker.animal.horse)
        .mockReturnValueOnce('Thunder')
        .mockReturnValueOnce('Lightning')
        .mockReturnValueOnce('Storm')
    })

    it('should generate the correct number of horses', () => {
      const count = 3
      const horses = generateHorses(count)

      expect(horses).toHaveLength(count)
    })

    it('should generate horses with required properties', () => {
      const horses = generateHorses(2)

      horses.forEach((horse, index) => {
        expect(horse).toHaveProperty('id', index + 1)
        expect(horse).toHaveProperty('name')
        expect(horse).toHaveProperty('condition')
        expect(horse).toHaveProperty('color')

        expect(typeof horse.name).toBe('string')
        expect(typeof horse.condition).toBe('number')
        expect(typeof horse.color).toBe('string')
        expect(horse.condition).toBeGreaterThanOrEqual(1)
        expect(horse.condition).toBeLessThanOrEqual(100)
      })
    })

    it('should generate unique horse names', () => {
      const horses = generateHorses(3)
      const names = horses.map(h => h.name)
      const uniqueNames = new Set(names)

      expect(uniqueNames.size).toBe(names.length)
    })

    it('should generate unique horse colors', () => {
      const horses = generateHorses(3)
      const colors = horses.map(h => h.color)
      const uniqueColors = new Set(colors)

      expect(uniqueColors.size).toBe(colors.length)
    })

    it('should handle empty count', () => {
      const horses = generateHorses(0)
      expect(horses).toHaveLength(0)
    })
  })

  describe('generateProgramName', () => {
    it('should generate correct name for index 0', () => {
      const name = generateProgramName(0)
      expect(name).toBe('1.st Lap 1200m')
    })

    it('should generate correct name for index 1', () => {
      const name = generateProgramName(1)
      expect(name).toBe('2.nd Lap 1400m')
    })

    it('should generate correct name for index 2', () => {
      const name = generateProgramName(2)
      expect(name).toBe('3.rd Lap 1600m')
    })

    it('should generate correct name for higher indices', () => {
      expect(generateProgramName(3)).toBe('4th Lap 1800m')
      expect(generateProgramName(4)).toBe('5th Lap 2000m')
      expect(generateProgramName(10)).toBe('11th Lap 3200m')
    })

    it('should calculate distance correctly', () => {
      // Distance formula: 1200 + index * 200
      expect(generateProgramName(0)).toContain('1200m')
      expect(generateProgramName(1)).toContain('1400m')
      expect(generateProgramName(5)).toContain('2200m')
    })
  })
})
