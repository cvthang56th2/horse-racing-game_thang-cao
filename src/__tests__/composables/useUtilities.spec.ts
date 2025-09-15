import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useDebounce } from '../../composables/useUtilities'

describe('useUtilities', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('useDebounce', () => {
    it('should delay function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 100)

      debouncedFn('test')

      // Function should not be called immediately
      expect(mockFn).not.toHaveBeenCalled()

      // Fast-forward time
      vi.advanceTimersByTime(100)

      // Function should be called after delay
      expect(mockFn).toHaveBeenCalledWith('test')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should cancel previous timeout when called multiple times', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 100)

      debouncedFn('first')
      vi.advanceTimersByTime(50)

      debouncedFn('second')
      vi.advanceTimersByTime(50)

      // Only 100ms total, but second call reset the timer
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)

      // Now the second call should execute
      expect(mockFn).toHaveBeenCalledWith('second')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple arguments', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 100)

      debouncedFn('arg1', 'arg2', 123)
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2', 123)
    })

    it('should work with different delay values', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 500)

      debouncedFn('test')

      vi.advanceTimersByTime(400)
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should preserve function context and return type', () => {
      const mockFn = vi.fn().mockReturnValue('result')
      const debouncedFn = useDebounce(mockFn, 100)

      // The debounced function doesn't return the result immediately
      const result = debouncedFn('test')
      expect(result).toBeUndefined()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should handle zero delay', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 0)

      debouncedFn('test')

      vi.advanceTimersByTime(0)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('should cleanup previous timeouts when called rapidly', () => {
      const mockFn = vi.fn()
      const debouncedFn = useDebounce(mockFn, 100)

      // Call multiple times rapidly
      for (let i = 0; i < 5; i++) {
        debouncedFn(`call-${i}`)
        vi.advanceTimersByTime(20)
      }

      // Only the last call should be pending
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('call-4')
    })
  })
})
