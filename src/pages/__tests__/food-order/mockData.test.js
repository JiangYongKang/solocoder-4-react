import { describe, it, expect } from 'vitest'
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_DISCOUNT_RULES,
  MOCK_ADDRESSES,
  MOCK_STORE_INFO,
  generateOrderId
} from '../../food-order/data/mockData'

describe('mockData', () => {
  describe('MOCK_CATEGORIES', () => {
    it('should have correct number of categories', () => {
      expect(MOCK_CATEGORIES.length).toBe(6)
    })

    it('should have valid category structure', () => {
      MOCK_CATEGORIES.forEach((category) => {
        expect(category).toHaveProperty('id')
        expect(category).toHaveProperty('name')
        expect(typeof category.id).toBe('string')
        expect(typeof category.name).toBe('string')
      })
    })

    it('should have unique category ids', () => {
      const ids = MOCK_CATEGORIES.map((c) => c.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('MOCK_PRODUCTS', () => {
    it('should have correct number of products', () => {
      expect(MOCK_PRODUCTS.length).toBe(11)
    })

    it('should have valid product structure', () => {
      MOCK_PRODUCTS.forEach((product) => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('categoryId')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('description')
        expect(product).toHaveProperty('price')
        expect(product).toHaveProperty('originalPrice')
        expect(product).toHaveProperty('sales')
        expect(product).toHaveProperty('stock')
        expect(product).toHaveProperty('soldOut')
        expect(product).toHaveProperty('hasSpecs')
      })
    })

    it('should have products with and without specs', () => {
      const withSpecs = MOCK_PRODUCTS.filter((p) => p.hasSpecs)
      const withoutSpecs = MOCK_PRODUCTS.filter((p) => !p.hasSpecs)
      expect(withSpecs.length).toBeGreaterThan(0)
      expect(withoutSpecs.length).toBeGreaterThan(0)
    })

    it('should have one sold out product', () => {
      const soldOut = MOCK_PRODUCTS.filter((p) => p.soldOut)
      expect(soldOut.length).toBe(1)
      expect(soldOut[0].name).toBe('牛肉拉面')
    })

    it('should have valid spec groups for products with specs', () => {
      const withSpecs = MOCK_PRODUCTS.filter((p) => p.hasSpecs)
      withSpecs.forEach((product) => {
        expect(product).toHaveProperty('specGroups')
        expect(Array.isArray(product.specGroups)).toBe(true)
        product.specGroups.forEach((group) => {
          expect(group).toHaveProperty('id')
          expect(group).toHaveProperty('name')
          expect(group).toHaveProperty('type')
          expect(group).toHaveProperty('required')
          expect(group).toHaveProperty('options')
          expect(Array.isArray(group.options)).toBe(true)
          group.options.forEach((option) => {
            expect(option).toHaveProperty('id')
            expect(option).toHaveProperty('name')
            expect(option).toHaveProperty('price')
          })
        })
      })
    })
  })

  describe('MOCK_DISCOUNT_RULES', () => {
    it('should have correct number of discount rules', () => {
      expect(MOCK_DISCOUNT_RULES.length).toBe(4)
    })

    it('should have valid discount rule structure', () => {
      MOCK_DISCOUNT_RULES.forEach((rule) => {
        expect(rule).toHaveProperty('id')
        expect(rule).toHaveProperty('minAmount')
        expect(rule).toHaveProperty('discount')
        expect(rule).toHaveProperty('description')
        expect(rule.minAmount).toBeGreaterThan(0)
        expect(rule.discount).toBeGreaterThan(0)
      })
    })

    it('should have discount rules sorted by minAmount', () => {
      const minAmounts = MOCK_DISCOUNT_RULES.map((r) => r.minAmount)
      const sortedMinAmounts = [...minAmounts].sort((a, b) => a - b)
      expect(minAmounts).toEqual(sortedMinAmounts)
    })

    it('should have discount value less than minAmount', () => {
      MOCK_DISCOUNT_RULES.forEach((rule) => {
        expect(rule.discount).toBeLessThan(rule.minAmount)
      })
    })
  })

  describe('MOCK_ADDRESSES', () => {
    it('should have correct number of addresses', () => {
      expect(MOCK_ADDRESSES.length).toBe(3)
    })

    it('should have valid address structure', () => {
      MOCK_ADDRESSES.forEach((address) => {
        expect(address).toHaveProperty('id')
        expect(address).toHaveProperty('name')
        expect(address).toHaveProperty('phone')
        expect(address).toHaveProperty('province')
        expect(address).toHaveProperty('city')
        expect(address).toHaveProperty('district')
        expect(address).toHaveProperty('detail')
        expect(address).toHaveProperty('isDefault')
        expect(address).toHaveProperty('tag')
      })
    })

    it('should have exactly one default address', () => {
      const defaultAddresses = MOCK_ADDRESSES.filter((a) => a.isDefault)
      expect(defaultAddresses.length).toBe(1)
    })
  })

  describe('MOCK_STORE_INFO', () => {
    it('should have valid store info structure', () => {
      expect(MOCK_STORE_INFO).toHaveProperty('id')
      expect(MOCK_STORE_INFO).toHaveProperty('name')
      expect(MOCK_STORE_INFO).toHaveProperty('deliveryFee')
      expect(MOCK_STORE_INFO).toHaveProperty('minOrderAmount')
      expect(MOCK_STORE_INFO).toHaveProperty('estimatedDeliveryTime')
      expect(MOCK_STORE_INFO).toHaveProperty('rating')
      expect(MOCK_STORE_INFO).toHaveProperty('monthlySales')
    })

    it('should have positive values for fees and amounts', () => {
      expect(MOCK_STORE_INFO.deliveryFee).toBeGreaterThan(0)
      expect(MOCK_STORE_INFO.minOrderAmount).toBeGreaterThan(0)
      expect(MOCK_STORE_INFO.rating).toBeGreaterThan(0)
      expect(MOCK_STORE_INFO.monthlySales).toBeGreaterThan(0)
    })
  })

  describe('generateOrderId', () => {
    it('should generate unique order ids', () => {
      const id1 = generateOrderId()
      const id2 = generateOrderId()
      expect(id1).not.toBe(id2)
    })

    it('should generate order ids with correct format', () => {
      const id = generateOrderId()
      expect(id).toMatch(/^FD\d+[A-Z0-9]{6}$/)
    })
  })
})
