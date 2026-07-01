import { beforeEach, describe, expect, it } from 'vitest'
import {
    createMockProduct,
    generateProductId,
    getCategoryProducts,
    MOCK_PRODUCTS,
    resetProductIdCounter
} from '../../products/mockData'
import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from '../../products/types'

describe('mockData', () => {
  beforeEach(() => {
    resetProductIdCounter()
  })

  describe('generateProductId', () => {
    it('should generate product id with correct format', () => {
      const id = generateProductId()
      expect(id).toMatch(/^P\d{8}\d{4}$/)
    })

    it('should start with P prefix', () => {
      const id = generateProductId()
      expect(id.startsWith('P')).toBe(true)
    })

    it('should generate unique ids', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateProductId())
      }
      expect(ids.size).toBe(100)
    })

    it('should increment counter part sequentially', () => {
      const id1 = generateProductId()
      const id2 = generateProductId()
      const counter1 = id1.slice(-4)
      const counter2 = id2.slice(-4)
      expect(parseInt(counter2, 10)).toBe(parseInt(counter1, 10) + 1)
    })
  })

  describe('getCategoryProducts', () => {
    const testProducts = [
      { id: '1', name: 'Product 1', category: PRODUCT_CATEGORIES.ELECTRONICS },
      { id: '2', name: 'Product 2', category: PRODUCT_CATEGORIES.CLOTHING },
      { id: '3', name: 'Product 3', category: PRODUCT_CATEGORIES.ELECTRONICS },
      { id: '4', name: 'Product 4', category: PRODUCT_CATEGORIES.FOOD }
    ]

    it('should return all products when category is all', () => {
      const result = getCategoryProducts(testProducts, 'all')
      expect(result).toHaveLength(4)
      expect(result).toEqual(testProducts)
    })

    it('should return all products when category is falsy', () => {
      const result = getCategoryProducts(testProducts, '')
      expect(result).toHaveLength(4)
    })

    it('should return all products when category is null', () => {
      const result = getCategoryProducts(testProducts, null)
      expect(result).toHaveLength(4)
    })

    it('should filter by electronics category', () => {
      const result = getCategoryProducts(testProducts, PRODUCT_CATEGORIES.ELECTRONICS)
      expect(result).toHaveLength(2)
      expect(result.every(p => p.category === PRODUCT_CATEGORIES.ELECTRONICS)).toBe(true)
    })

    it('should filter by clothing category', () => {
      const result = getCategoryProducts(testProducts, PRODUCT_CATEGORIES.CLOTHING)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should return empty array for non-existing products', () => {
      const result = getCategoryProducts(testProducts, PRODUCT_CATEGORIES.BOOKS)
      expect(result).toHaveLength(0)
    })

    it('should handle empty product list', () => {
      const result = getCategoryProducts([], PRODUCT_CATEGORIES.ELECTRONICS)
      expect(result).toHaveLength(0)
    })
  })

  describe('createMockProduct', () => {
    it('should create product with all required fields', () => {
      const product = createMockProduct()
      expect(product).toHaveProperty('id')
      expect(product).toHaveProperty('name')
      expect(product).toHaveProperty('category')
      expect(product).toHaveProperty('price')
      expect(product).toHaveProperty('stock')
      expect(product).toHaveProperty('status')
    })

    it('should generate valid product id', () => {
      const product = createMockProduct()
      expect(product.id).toMatch(/^P\d{8}\d{4}$/)
    })

    it('should have category from valid categories', () => {
      const validCategories = Object.values(PRODUCT_CATEGORIES)
      for (let i = 0; i < 50; i++) {
        const product = createMockProduct()
        expect(validCategories).toContain(product.category)
      }
    })

    it('should have status from valid statuses', () => {
      const validStatuses = Object.values(PRODUCT_STATUS)
      for (let i = 0; i < 50; i++) {
        const product = createMockProduct()
        expect(validStatuses).toContain(product.status)
      }
    })

    it('should have non-negative price', () => {
      for (let i = 0; i < 50; i++) {
        const product = createMockProduct()
        expect(product.price).toBeGreaterThanOrEqual(0)
      }
    })

    it('should have non-negative stock', () => {
      for (let i = 0; i < 50; i++) {
        const product = createMockProduct()
        expect(product.stock).toBeGreaterThanOrEqual(0)
      }
    })

    it('should allow overriding name', () => {
      const product = createMockProduct({ name: 'Test Product' })
      expect(product.name).toBe('Test Product')
    })

    it('should allow overriding category', () => {
      const product = createMockProduct({ category: PRODUCT_CATEGORIES.BOOKS })
      expect(product.category).toBe(PRODUCT_CATEGORIES.BOOKS)
    })

    it('should allow overriding price', () => {
      const product = createMockProduct({ price: 999 })
      expect(product.price).toBe(999)
    })

    it('should allow overriding stock', () => {
      const product = createMockProduct({ stock: 150 })
      expect(product.stock).toBe(150)
    })

    it('should allow overriding status', () => {
      const product = createMockProduct({ status: PRODUCT_STATUS.ON_SHELF })
      expect(product.status).toBe(PRODUCT_STATUS.ON_SHELF)
    })

    it('should allow overriding all fields', () => {
      const overrides = {
        name: 'Custom Product',
        category: PRODUCT_CATEGORIES.HOME,
        price: 500,
        stock: 25,
        status: PRODUCT_STATUS.OFF_SHELF
      }
      const product = createMockProduct(overrides)
      expect(product.name).toBe('Custom Product')
      expect(product.category).toBe(PRODUCT_CATEGORIES.HOME)
      expect(product.price).toBe(500)
      expect(product.stock).toBe(25)
      expect(product.status).toBe(PRODUCT_STATUS.OFF_SHELF)
      expect(product.id).toBeDefined()
    })
  })

  describe('MOCK_PRODUCTS', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(MOCK_PRODUCTS)).toBe(true)
      expect(MOCK_PRODUCTS.length).toBeGreaterThan(0)
    })

    it('should have products with all required fields', () => {
      MOCK_PRODUCTS.forEach(product => {
        expect(product).toHaveProperty('id')
        expect(product).toHaveProperty('name')
        expect(product).toHaveProperty('category')
        expect(product).toHaveProperty('price')
        expect(product).toHaveProperty('stock')
        expect(product).toHaveProperty('status')
      })
    })

    it('should have valid categories for all products', () => {
      const validCategories = Object.values(PRODUCT_CATEGORIES)
      MOCK_PRODUCTS.forEach(product => {
        expect(validCategories).toContain(product.category)
      })
    })

    it('should have valid statuses for all products', () => {
      const validStatuses = Object.values(PRODUCT_STATUS)
      MOCK_PRODUCTS.forEach(product => {
        expect(validStatuses).toContain(product.status)
      })
    })

    it('should have unique product ids', () => {
      const ids = MOCK_PRODUCTS.map(p => p.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })

    it('should have non-negative prices', () => {
      MOCK_PRODUCTS.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(0)
      })
    })

    it('should have non-negative stocks', () => {
      MOCK_PRODUCTS.forEach(product => {
        expect(product.stock).toBeGreaterThanOrEqual(0)
      })
    })

    it('should include products from all categories', () => {
      const allCategories = Object.values(PRODUCT_CATEGORIES)
      const productCategories = new Set(MOCK_PRODUCTS.map(p => p.category))
      allCategories.forEach(cat => {
        expect(productCategories).toContain(cat)
      })
    })

    it('should include both on-shelf and off-shelf products', () => {
      const hasOnShelf = MOCK_PRODUCTS.some(p => p.status === PRODUCT_STATUS.ON_SHELF)
      const hasOffShelf = MOCK_PRODUCTS.some(p => p.status === PRODUCT_STATUS.OFF_SHELF)
      expect(hasOnShelf).toBe(true)
      expect(hasOffShelf).toBe(true)
    })
  })
})
