import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  MOCK_PRODUCTS,
  MOCK_GROUP_LEADERS,
  generateInitialGroups,
  MOCK_PICKUP_POINTS,
  generateOrderId,
  generateVerificationCode,
  generateAfterSaleId
} from '../../group-buy/data/mockData'
import { GROUP_STATUS, PICKUP_POINT_STATUS } from '../../group-buy/types'

describe('mockData', () => {
  describe('MOCK_PRODUCTS', () => {
    it('should have valid products with required fields', () => {
      expect(MOCK_PRODUCTS.length).toBeGreaterThan(0)
      MOCK_PRODUCTS.forEach((product) => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('spec')
        expect(product).toHaveProperty('groupPrice')
        expect(product).toHaveProperty('originalPrice')
        expect(product).toHaveProperty('stock')
        expect(product).toHaveProperty('minGroupSize')
        expect(product).toHaveProperty('status')
        expect(typeof product.id).toBe('string')
        expect(typeof product.name).toBe('string')
        expect(typeof product.groupPrice).toBe('number')
        expect(typeof product.originalPrice).toBe('number')
        expect(typeof product.stock).toBe('number')
        expect(typeof product.minGroupSize).toBe('number')
        expect(product.groupPrice).toBeGreaterThan(0)
        expect(product.originalPrice).toBeGreaterThan(product.groupPrice)
        expect(product.minGroupSize).toBeGreaterThan(0)
      })
    })

    it('should include products with different statuses', () => {
      const statuses = MOCK_PRODUCTS.map(p => p.status)
      expect(statuses).toContain('on_sale')
      expect([...new Set(statuses)].length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('MOCK_GROUP_LEADERS', () => {
    it('should have valid leaders with required fields', () => {
      expect(MOCK_GROUP_LEADERS.length).toBeGreaterThan(0)
      MOCK_GROUP_LEADERS.forEach((leader) => {
        expect(leader).toHaveProperty('id')
        expect(leader).toHaveProperty('nickname')
        expect(leader).toHaveProperty('phone')
        expect(leader).toHaveProperty('storeName')
        expect(leader).toHaveProperty('storeDescription')
        expect(leader).toHaveProperty('totalGroups')
        expect(leader).toHaveProperty('successRate')
        expect(typeof leader.nickname).toBe('string')
        expect(typeof leader.totalGroups).toBe('number')
        expect(typeof leader.successRate).toBe('number')
        expect(leader.successRate).toBeGreaterThan(0)
        expect(leader.successRate).toBeLessThanOrEqual(100)
      })
    })
  })

  describe('generateInitialGroups', () => {
    let groups
    beforeEach(() => {
      groups = generateInitialGroups()
    })

    it('should generate valid groups', () => {
      expect(groups.length).toBeGreaterThan(0)
      groups.forEach((group) => {
        expect(group).toHaveProperty('id')
        expect(group).toHaveProperty('productId')
        expect(group).toHaveProperty('leaderId')
        expect(group).toHaveProperty('members')
        expect(group).toHaveProperty('minGroupSize')
        expect(group).toHaveProperty('startTime')
        expect(group).toHaveProperty('endTime')
        expect(group).toHaveProperty('status')
        expect(Array.isArray(group.members)).toBe(true)
        expect(group.members.length).toBeGreaterThan(0)
        expect(group.members[0].isLeader).toBe(true)
        expect(group.startTime).toBeLessThan(group.endTime)
      })
    })

    it('should include groups with different statuses', () => {
      const statuses = groups.map(g => g.status)
      expect(statuses).toContain(GROUP_STATUS.ONGOING)
      expect([
        GROUP_STATUS.SUCCESS,
        GROUP_STATUS.FAILED
      ].some(s => statuses.includes(s))).toBe(true)
    })

    it('should generate consistent groups on each call', () => {
      const groups1 = generateInitialGroups()
      const groups2 = generateInitialGroups()
      expect(groups1.length).toBe(groups2.length)
      expect(groups1[0].minGroupSize).toBe(groups2[0].minGroupSize)
    })
  })

  describe('MOCK_PICKUP_POINTS', () => {
    it('should have valid pickup points with required fields', () => {
      expect(MOCK_PICKUP_POINTS.length).toBeGreaterThan(0)
      MOCK_PICKUP_POINTS.forEach((point) => {
        expect(point).toHaveProperty('id')
        expect(point).toHaveProperty('name')
        expect(point).toHaveProperty('address')
        expect(point).toHaveProperty('businessHours')
        expect(point).toHaveProperty('status')
        expect(point).toHaveProperty('distance')
        expect(point).toHaveProperty('contactPhone')
        expect(typeof point.name).toBe('string')
        expect(typeof point.address).toBe('string')
      })
    })

    it('should include different pickup point statuses', () => {
      const statuses = MOCK_PICKUP_POINTS.map(p => p.status)
      expect(statuses).toContain(PICKUP_POINT_STATUS.AVAILABLE)
      expect([
        PICKUP_POINT_STATUS.FULL,
        PICKUP_POINT_STATUS.CLOSED
      ].some(s => statuses.includes(s))).toBe(true)
    })
  })

  describe('generateOrderId', () => {
    it('should generate unique order ids with correct prefix', () => {
      const id1 = generateOrderId()
      const id2 = generateOrderId()
      expect(id1).toMatch(/^GB/)
      expect(id2).toMatch(/^GB/)
      expect(id1).not.toBe(id2)
    })

    it('should generate ids that include timestamp', () => {
      const before = Date.now()
      const id = generateOrderId()
      const after = Date.now()
      const timestampStr = id.slice(2, 15)
      const timestamp = parseInt(timestampStr, 10)
      expect(timestamp).toBeGreaterThanOrEqual(before)
      expect(timestamp).toBeLessThanOrEqual(after + 1)
    })
  })

  describe('generateVerificationCode', () => {
    it('should generate 8-character codes', () => {
      const code = generateVerificationCode()
      expect(code.length).toBe(8)
    })

    it('should only contain uppercase letters and numbers', () => {
      const code = generateVerificationCode()
      expect(code).toMatch(/^[0-9A-Z]{8}$/)
    })

    it('should generate unique codes', () => {
      const codes = new Set()
      for (let i = 0; i < 100; i++) {
        codes.add(generateVerificationCode())
      }
      expect(codes.size).toBeGreaterThan(90)
    })
  })

  describe('generateAfterSaleId', () => {
    it('should generate ids with correct prefix', () => {
      const id = generateAfterSaleId()
      expect(id).toMatch(/^AS/)
    })

    it('should generate unique ids', () => {
      const id1 = generateAfterSaleId()
      const id2 = generateAfterSaleId()
      expect(id1).not.toBe(id2)
    })
  })
})
