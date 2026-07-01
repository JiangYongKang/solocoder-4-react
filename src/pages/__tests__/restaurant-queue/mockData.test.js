import { describe, it, expect, beforeEach } from 'vitest'
import { generateQueueNumber, simulateQueueUpdate, simulateQueueNumberStatus, resetNumberCounter } from '../../restaurant-queue/mockData'
import { TABLE_TYPES, QUEUE_STATUS } from '../../restaurant-queue/types'

describe('mockData', () => {
  beforeEach(() => {
    resetNumberCounter()
  })

  describe('generateQueueNumber', () => {
    it('should generate queue number with correct format', () => {
      const number = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      
      expect(number).toMatch(/^001S\d{6}$/)
    })

    it('should include correct table type prefix', () => {
      resetNumberCounter('store-001')
      resetNumberCounter('store-002')
      const smallNumber = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const mediumNumber = generateQueueNumber('store-001', TABLE_TYPES.MEDIUM)
      const largeNumber = generateQueueNumber('store-001', TABLE_TYPES.LARGE)
      
      expect(smallNumber).toContain('S')
      expect(mediumNumber).toContain('M')
      expect(largeNumber).toContain('L')
    })

    it('should include store id suffix', () => {
      resetNumberCounter('store-001')
      resetNumberCounter('store-002')
      const number1 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const number2 = generateQueueNumber('store-002', TABLE_TYPES.SMALL)
      
      expect(number1).toContain('001')
      expect(number2).toContain('002')
    })

    it('should generate unique numbers for same store', () => {
      const numbers = new Set()
      for (let i = 0; i < 100; i++) {
        numbers.add(generateQueueNumber('store-001', TABLE_TYPES.SMALL))
      }
      expect(numbers.size).toBe(100)
    })

    it('should generate monotonically increasing numbers for same store', () => {
      resetNumberCounter('store-001')
      const number1 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const number2 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const number3 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      
      expect(number1).toBe('001S000001')
      expect(number2).toBe('001S000002')
      expect(number3).toBe('001S000003')
    })

    it('should generate unique numbers across different stores', () => {
      resetNumberCounter('store-001')
      resetNumberCounter('store-002')
      const number1 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const number2 = generateQueueNumber('store-002', TABLE_TYPES.SMALL)
      
      expect(number1).toBe('001S000001')
      expect(number2).toBe('002S000001')
      expect(number1).not.toBe(number2)
    })

    it('should maintain independent counters for each store', () => {
      resetNumberCounter('store-001')
      resetNumberCounter('store-002')
      
      generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      const store1Number3 = generateQueueNumber('store-001', TABLE_TYPES.SMALL)
      
      generateQueueNumber('store-002', TABLE_TYPES.SMALL)
      const store2Number2 = generateQueueNumber('store-002', TABLE_TYPES.SMALL)
      
      expect(store1Number3).toBe('001S000003')
      expect(store2Number2).toBe('002S000002')
    })

    it('should not generate duplicate numbers across different stores even with same sequence', () => {
      resetNumberCounter('store-001')
      resetNumberCounter('store-002')
      
      const numbers = new Set()
      for (let i = 0; i < 100; i++) {
        numbers.add(generateQueueNumber('store-001', TABLE_TYPES.SMALL))
        numbers.add(generateQueueNumber('store-002', TABLE_TYPES.SMALL))
      }
      expect(numbers.size).toBe(200)
    })
  })

  describe('simulateQueueUpdate', () => {
    it('should return queue overview with all table types', () => {
      const currentQueue = {
        [TABLE_TYPES.SMALL]: { waitingCount: 5 },
        [TABLE_TYPES.MEDIUM]: { waitingCount: 8 },
        [TABLE_TYPES.LARGE]: { waitingCount: 3 }
      }
      
      const result = simulateQueueUpdate(currentQueue, 'store-001')
      
      expect(result).toHaveProperty(TABLE_TYPES.SMALL)
      expect(result).toHaveProperty(TABLE_TYPES.MEDIUM)
      expect(result).toHaveProperty(TABLE_TYPES.LARGE)
    })

    it('should have non-negative waiting counts', () => {
      const currentQueue = {
        [TABLE_TYPES.SMALL]: { waitingCount: 0 },
        [TABLE_TYPES.MEDIUM]: { waitingCount: 0 },
        [TABLE_TYPES.LARGE]: { waitingCount: 0 }
      }
      
      const result = simulateQueueUpdate(currentQueue, 'store-001')
      
      expect(result[TABLE_TYPES.SMALL].waitingCount).toBeGreaterThanOrEqual(0)
      expect(result[TABLE_TYPES.MEDIUM].waitingCount).toBeGreaterThanOrEqual(0)
      expect(result[TABLE_TYPES.LARGE].waitingCount).toBeGreaterThanOrEqual(0)
    })

    it('should maintain queue overview structure', () => {
      const currentQueue = {
        [TABLE_TYPES.SMALL]: { waitingCount: 5 },
        [TABLE_TYPES.MEDIUM]: { waitingCount: 8 },
        [TABLE_TYPES.LARGE]: { waitingCount: 3 }
      }
      
      const result = simulateQueueUpdate(currentQueue, 'store-001')
      
      expect(typeof result[TABLE_TYPES.SMALL].waitingCount).toBe('number')
      expect(typeof result[TABLE_TYPES.MEDIUM].waitingCount).toBe('number')
      expect(typeof result[TABLE_TYPES.LARGE].waitingCount).toBe('number')
    })
  })

  describe('simulateQueueNumberStatus', () => {
    it('should return soon when waiting count is 3 or less', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.WAITING, 3)
      expect(result).toBe(QUEUE_STATUS.SOON)
    })

    it('should return called when waiting count is 0', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.WAITING, 0)
      expect(result).toBe(QUEUE_STATUS.CALLED)
    })

    it('should return waiting when waiting count is high', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.WAITING, 10)
      expect(result).toBe(QUEUE_STATUS.WAITING)
    })

    it('should not change status for cancelled', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.CANCELLED, 0)
      expect(result).toBe(QUEUE_STATUS.CANCELLED)
    })

    it('should not change status for expired', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.EXPIRED, 0)
      expect(result).toBe(QUEUE_STATUS.EXPIRED)
    })

    it('should not change status for called', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.CALLED, 10)
      expect(result).toBe(QUEUE_STATUS.CALLED)
    })

    it('should not change from cancelled to waiting when waiting count is high', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.CANCELLED, 10)
      expect(result).toBe(QUEUE_STATUS.CANCELLED)
    })

    it('should not change from expired to called when waiting count is 0', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.EXPIRED, 0)
      expect(result).toBe(QUEUE_STATUS.EXPIRED)
    })

    it('should not change from called to soon when waiting count is 3', () => {
      const result = simulateQueueNumberStatus(QUEUE_STATUS.CALLED, 3)
      expect(result).toBe(QUEUE_STATUS.CALLED)
    })
  })
})
