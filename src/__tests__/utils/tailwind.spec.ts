import { describe, it, expect } from 'vitest'
import { cn } from '../../utils/tailwind'

describe('Tailwind Utils', () => {
  describe('cn function', () => {
    it('should merge class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500')
      expect(result).toBe('px-4 py-2 bg-blue-500')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const result = cn(
        'base-class',
        isActive && 'active-class',
        !isActive && 'inactive-class'
      )
      expect(result).toBe('base-class active-class')
    })

    it('should merge conflicting Tailwind classes', () => {
      // tailwind-merge should resolve conflicts by keeping the last one
      const result = cn('px-4', 'px-6')
      expect(result).toBe('px-6')
    })

    it('should handle objects with boolean values', () => {
      const result = cn({
        'text-red-500': true,
        'text-blue-500': false,
        'font-bold': true
      })
      expect(result).toBe('text-red-500 font-bold')
    })

    it('should handle arrays of classes', () => {
      const result = cn(['px-4', 'py-2'], ['bg-blue-500', 'text-white'])
      expect(result).toBe('px-4 py-2 bg-blue-500 text-white')
    })

    it('should handle mixed types', () => {
      const result = cn(
        'base-class',
        ['array-class'],
        { 'object-class': true, 'hidden-class': false },
        'final-class'
      )
      expect(result).toBe('base-class array-class object-class final-class')
    })

    it('should handle empty input', () => {
      const result = cn()
      expect(result).toBe('')
    })

    it('should handle null and undefined values', () => {
      const result = cn('base-class', null, undefined, 'end-class')
      expect(result).toBe('base-class end-class')
    })

    it('should properly merge responsive classes', () => {
      const result = cn('text-sm', 'md:text-base', 'lg:text-lg')
      expect(result).toBe('text-sm md:text-base lg:text-lg')
    })

    it('should resolve complex conflicting classes', () => {
      const result = cn(
        'p-4 bg-red-500 text-white',
        'p-6 bg-blue-500' // Should override p-4 and bg-red-500
      )
      expect(result).toBe('text-white p-6 bg-blue-500')
    })
  })
})
