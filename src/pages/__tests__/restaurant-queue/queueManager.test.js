import { describe, it, expect, beforeEach } from 'vitest'
import {
  createQueueNumber,
  calculateEstimatedCallTime,
  formatTime,
  formatWaitTime,
  updateQueueNumberStatus,
  refreshQueueOverview,
  cancelQueueNumber,
  requeueAfterExpired,
  getTotalWaitingCount,
  canTakeNumber,
  updateEstimatedWaitTime
} from '../../restaurant-queue/queueManager'
import { QUEUE_STATUS, TABLE_TYPES, STORE_STATUS } from '../../restaurant-queue/types'

const mockQueueOverview = {
  [TABLE_TYPES.SMALL]: { waitingCount: 5 },
  [TABLE_TYPES.MEDIUM]: { waitingCount: 8 },
  [TABLE_TYPES.LARGE]: { waitingCount: 3 }
}

const mockStore = {
  id: 'store-001',
  name: 'Test Store',
  status: STORE_STATUS.OPEN,
  queueOverview: mockQueueOverview
}

describe('queueManager', () => {
  describe('createQueueNumber', () => {
    it('should create a queue number with correct properties', () => {
      const queueNumber = createQueueNumber('store-001', TABLE_TYPES.SMALL, mockQueueOverview)
      
      expect(queueNumber).toHaveProperty('id')
      expect(queueNumber).toHaveProperty('number')
      expect(queueNumber).toHaveProperty('tableType', TABLE_TYPES.SMALL)
      expect(queueNumber).toHaveProperty('storeId', 'store-001')
      expect(queueNumber).toHaveProperty('status', QUEUE_STATUS.WAITING)
      expect(queueNumber).toHaveProperty('waitingCount', 5)
      expect(queueNumber).toHaveProperty('estimatedWaitTime', 75)
      expect(queueNumber).toHaveProperty('createdAt')
      expect(queueNumber.calledAt).toBeNull()
      expect(queueNumber.expiredAt).toBeNull()
    })

    it('should generate different queue numbers for different stores', () => {
      const queue1 = createQueueNumber('store-001', TABLE_TYPES.SMALL, mockQueueOverview)
      const queue2 = createQueueNumber('store-002', TABLE_TYPES.SMALL, mockQueueOverview)
      
      expect(queue1.id).not.toBe(queue2.id)
    })

    it('should handle missing table type in queueOverview', () => {
      const emptyOverview = {}
      const queueNumber = createQueueNumber('store-001', TABLE_TYPES.SMALL, emptyOverview)
      
      expect(queueNumber.waitingCount).toBe(0)
      expect(queueNumber.estimatedWaitTime).toBe(0)
    })
  })

  describe('calculateEstimatedCallTime', () => {
    it('should calculate correct estimated call time', () => {
      const now = Date.now()
      const queueNumber = {
        createdAt: now,
        estimatedWaitTime: 30
      }
      
      const estimatedTime = calculateEstimatedCallTime(queueNumber)
      const expectedTime = new Date(now + 30 * 60 * 1000)
      
      expect(estimatedTime.getTime()).toBe(expectedTime.getTime())
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date(2024, 0, 1, 14, 30)
      expect(formatTime(date)).toBe('14:30')
    })

    it('should pad single digit hours and minutes', () => {
      const date = new Date(2024, 0, 1, 9, 5)
      expect(formatTime(date)).toBe('09:05')
    })
  })

  describe('formatWaitTime', () => {
    it('should format minutes less than 60', () => {
      expect(formatWaitTime(30)).toBe('30分钟')
      expect(formatWaitTime(59)).toBe('59分钟')
    })

    it('should format hours without minutes', () => {
      expect(formatWaitTime(60)).toBe('1小时')
      expect(formatWaitTime(120)).toBe('2小时')
    })

    it('should format hours with minutes', () => {
      expect(formatWaitTime(75)).toBe('1小时15分钟')
      expect(formatWaitTime(130)).toBe('2小时10分钟')
    })
  })

  describe('updateQueueNumberStatus', () => {
    it('should not update status for cancelled queue numbers', () => {
      const queueNumber = {
        status: QUEUE_STATUS.CANCELLED,
        tableType: TABLE_TYPES.SMALL
      }
      
      const result = updateQueueNumberStatus(queueNumber, mockQueueOverview)
      expect(result.status).toBe(QUEUE_STATUS.CANCELLED)
    })

    it('should not update status for expired queue numbers', () => {
      const queueNumber = {
        status: QUEUE_STATUS.EXPIRED,
        tableType: TABLE_TYPES.SMALL
      }
      
      const result = updateQueueNumberStatus(queueNumber, mockQueueOverview)
      expect(result.status).toBe(QUEUE_STATUS.EXPIRED)
    })

    it('should update waiting count based on queue overview', () => {
      const queueNumber = {
        status: QUEUE_STATUS.WAITING,
        tableType: TABLE_TYPES.SMALL,
        waitingCount: 10
      }
      
      const result = updateQueueNumberStatus(queueNumber, mockQueueOverview)
      expect(result.waitingCount).toBe(5)
    })

    it('should set calledAt when status becomes called', () => {
      const queueNumber = {
        status: QUEUE_STATUS.WAITING,
        tableType: TABLE_TYPES.SMALL,
        calledAt: null
      }
      
      const overviewWithZero = {
        [TABLE_TYPES.SMALL]: { waitingCount: 0 }
      }
      
      const result = updateQueueNumberStatus(queueNumber, overviewWithZero)
      expect(result.status).toBe(QUEUE_STATUS.CALLED)
      expect(result.calledAt).not.toBeNull()
    })

    it('should set expiredAt when status becomes expired', () => {
      const queueNumber = {
        status: QUEUE_STATUS.WAITING,
        tableType: TABLE_TYPES.SMALL,
        expiredAt: null
      }
      
      const overviewWithLow = {
        [TABLE_TYPES.SMALL]: { waitingCount: 5 }
      }
      
      let result
      for (let i = 0; i < 100; i++) {
        result = updateQueueNumberStatus(queueNumber, overviewWithLow)
        if (result.status === QUEUE_STATUS.EXPIRED) break
      }
      
      if (result.status === QUEUE_STATUS.EXPIRED) {
        expect(result.expiredAt).not.toBeNull()
      }
    })
  })

  describe('refreshQueueOverview', () => {
    it('should return updated queue overview', () => {
      const result = refreshQueueOverview(mockQueueOverview, 'store-001')
      
      expect(result).toHaveProperty(TABLE_TYPES.SMALL)
      expect(result).toHaveProperty(TABLE_TYPES.MEDIUM)
      expect(result).toHaveProperty(TABLE_TYPES.LARGE)
      expect(result[TABLE_TYPES.SMALL].waitingCount).toBeGreaterThanOrEqual(0)
    })
  })

  describe('cancelQueueNumber', () => {
    it('should set status to cancelled', () => {
      const queueNumber = {
        status: QUEUE_STATUS.WAITING,
        number: 'A001'
      }
      
      const result = cancelQueueNumber(queueNumber)
      expect(result.status).toBe(QUEUE_STATUS.CANCELLED)
      expect(result.number).toBe('A001')
    })
  })

  describe('requeueAfterExpired', () => {
    it('should create a new queue number with requeue flag', () => {
      const expiredQueue = {
        id: 'old-id',
        number: 'OLD001',
        tableType: TABLE_TYPES.SMALL,
        storeId: 'store-001',
        status: QUEUE_STATUS.EXPIRED
      }
      
      const result = requeueAfterExpired(expiredQueue, mockQueueOverview)
      
      expect(result.id).not.toBe('old-id')
      expect(result.isRequeue).toBe(true)
      expect(result.originalNumber).toBe('OLD001')
      expect(result.status).toBe(QUEUE_STATUS.WAITING)
      expect(result.tableType).toBe(TABLE_TYPES.SMALL)
      expect(result.storeId).toBe('store-001')
    })
  })

  describe('getTotalWaitingCount', () => {
    it('should calculate total waiting count correctly', () => {
      const result = getTotalWaitingCount(mockQueueOverview)
      expect(result).toBe(16)
    })

    it('should return 0 for empty overview', () => {
      const result = getTotalWaitingCount({})
      expect(result).toBe(0)
    })
  })

  describe('canTakeNumber', () => {
    it('should return true for open store and selected table type', () => {
      const result = canTakeNumber(mockStore, TABLE_TYPES.SMALL)
      expect(result.canTake).toBe(true)
    })

    it('should return false when store is closed', () => {
      const closedStore = { ...mockStore, status: STORE_STATUS.CLOSED }
      const result = canTakeNumber(closedStore, TABLE_TYPES.SMALL)
      expect(result.canTake).toBe(false)
      expect(result.reason).toBe('门店已打烊')
    })

    it('should return false when no store is selected', () => {
      const result = canTakeNumber(null, TABLE_TYPES.SMALL)
      expect(result.canTake).toBe(false)
      expect(result.reason).toBe('门店已打烊')
    })

    it('should return false when no table type is selected', () => {
      const result = canTakeNumber(mockStore, null)
      expect(result.canTake).toBe(false)
      expect(result.reason).toBe('请选择桌型')
    })
  })

  describe('updateEstimatedWaitTime', () => {
    it('should update waiting count and estimated time', () => {
      const queueNumber = {
        tableType: TABLE_TYPES.SMALL,
        waitingCount: 10,
        estimatedWaitTime: 150
      }
      
      const result = updateEstimatedWaitTime(queueNumber, mockQueueOverview)
      expect(result.waitingCount).toBe(5)
      expect(result.estimatedWaitTime).toBe(75)
    })

    it('should handle missing table type in overview', () => {
      const queueNumber = {
        tableType: TABLE_TYPES.SMALL,
        waitingCount: 10,
        estimatedWaitTime: 150
      }
      
      const result = updateEstimatedWaitTime(queueNumber, {})
      expect(result.waitingCount).toBe(0)
      expect(result.estimatedWaitTime).toBe(0)
    })
  })
})
