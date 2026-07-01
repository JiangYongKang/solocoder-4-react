import { describe, it, expect } from 'vitest'
import {
  validateStockInput,
  validatePriceInput,
  updateProductStock,
  toggleProductStatus,
  setProductStatus,
  batchOnShelf,
  batchOffShelf,
  batchDelete,
  calculateStatistics,
  filterProducts,
  isLowStock,
  formatPrice,
  getFilterDescription
} from '../../products/productManager'
import { PRODUCT_STATUS, LOW_STOCK_THRESHOLD, CATEGORY_CONFIG, STATUS_CONFIG, PRODUCT_CATEGORIES } from '../../products/types'

const createTestProducts = () => [
  { id: '1', name: 'Product 1', category: PRODUCT_CATEGORIES.ELECTRONICS, price: 1000, stock: 50, status: PRODUCT_STATUS.ON_SHELF },
  { id: '2', name: 'Product 2', category: PRODUCT_CATEGORIES.CLOTHING, price: 200, stock: 5, status: PRODUCT_STATUS.ON_SHELF },
  { id: '3', name: 'Product 3', category: PRODUCT_CATEGORIES.ELECTRONICS, price: 500, stock: 0, status: PRODUCT_STATUS.OFF_SHELF },
  { id: '4', name: 'Product 4', category: PRODUCT_CATEGORIES.FOOD, price: 50, stock: 200, status: PRODUCT_STATUS.ON_SHELF },
  { id: '5', name: 'Product 5', category: PRODUCT_CATEGORIES.BOOKS, price: 80, stock: 8, status: PRODUCT_STATUS.OFF_SHELF }
]

describe('productManager', () => {
  describe('validateStockInput', () => {
    it('should accept valid zero stock', () => {
      const result = validateStockInput(0)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should accept valid positive integer stock', () => {
      const result = validateStockInput(150)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(150)
    })

    it('should accept string number input', () => {
      const result = validateStockInput('42')
      expect(result.valid).toBe(true)
      expect(result.value).toBe(42)
    })

    it('should accept maximum stock value', () => {
      const result = validateStockInput(99999)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(99999)
    })

    it('should reject empty string', () => {
      const result = validateStockInput('')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存不能为空')
    })

    it('should reject null', () => {
      const result = validateStockInput(null)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存不能为空')
    })

    it('should reject undefined', () => {
      const result = validateStockInput(undefined)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存不能为空')
    })

    it('should reject non-numeric string', () => {
      const result = validateStockInput('abc')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存必须是数字')
    })

    it('should reject negative numbers', () => {
      const result = validateStockInput(-5)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存不能为负数')
    })

    it('should reject decimal numbers', () => {
      const result = validateStockInput(3.14)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存必须是整数')
    })

    it('should reject string decimal numbers', () => {
      const result = validateStockInput('3.5')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存必须是整数')
    })

    it('should reject stock exceeding maximum', () => {
      const result = validateStockInput(100000)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存不能超过99999')
    })

    it('should reject NaN', () => {
      const result = validateStockInput(NaN)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('库存必须是数字')
    })
  })

  describe('validatePriceInput', () => {
    it('should accept valid zero price', () => {
      const result = validatePriceInput(0)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(0)
    })

    it('should accept valid positive price', () => {
      const result = validatePriceInput(99.99)
      expect(result.valid).toBe(true)
      expect(result.value).toBe(99.99)
    })

    it('should accept string number input', () => {
      const result = validatePriceInput('199.50')
      expect(result.valid).toBe(true)
      expect(result.value).toBe(199.5)
    })

    it('should reject empty string', () => {
      const result = validatePriceInput('')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('价格不能为空')
    })

    it('should reject null', () => {
      const result = validatePriceInput(null)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('价格不能为空')
    })

    it('should reject non-numeric string', () => {
      const result = validatePriceInput('not a price')
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('价格必须是数字')
    })

    it('should reject negative price', () => {
      const result = validatePriceInput(-10)
      expect(result.valid).toBe(false)
      expect(result.reason).toBe('价格不能为负数')
    })
  })

  describe('updateProductStock', () => {
    it('should update stock for specified product', () => {
      const products = createTestProducts()
      const result = updateProductStock(products, '1', 75)
      expect(result.success).toBe(true)
      const updatedProduct = result.products.find(p => p.id === '1')
      expect(updatedProduct.stock).toBe(75)
    })

    it('should not affect other products', () => {
      const products = createTestProducts()
      const result = updateProductStock(products, '1', 75)
      expect(result.products[1].stock).toBe(5)
      expect(result.products[2].stock).toBe(0)
    })

    it('should not mutate original products array', () => {
      const products = createTestProducts()
      const originalStock = products[0].stock
      updateProductStock(products, '1', 75)
      expect(products[0].stock).toBe(originalStock)
    })

    it('should return failure for invalid stock', () => {
      const products = createTestProducts()
      const result = updateProductStock(products, '1', -5)
      expect(result.success).toBe(false)
      expect(result.reason).toBe('库存不能为负数')
      expect(result.products).toBe(products)
    })

    it('should handle non-existing product id', () => {
      const products = createTestProducts()
      const result = updateProductStock(products, 'non-existent', 50)
      expect(result.success).toBe(true)
      const product = result.products.find(p => p.id === '1')
      expect(product.stock).toBe(50)
    })
  })

  describe('toggleProductStatus', () => {
    it('should toggle on-shelf to off-shelf', () => {
      const products = createTestProducts()
      const result = toggleProductStatus(products, '1')
      const product = result.find(p => p.id === '1')
      expect(product.status).toBe(PRODUCT_STATUS.OFF_SHELF)
    })

    it('should toggle off-shelf to on-shelf', () => {
      const products = createTestProducts()
      const result = toggleProductStatus(products, '3')
      const product = result.find(p => p.id === '3')
      expect(product.status).toBe(PRODUCT_STATUS.ON_SHELF)
    })

    it('should not affect other products', () => {
      const products = createTestProducts()
      const result = toggleProductStatus(products, '1')
      expect(result[1].status).toBe(PRODUCT_STATUS.ON_SHELF)
      expect(result[2].status).toBe(PRODUCT_STATUS.OFF_SHELF)
    })

    it('should not mutate original products', () => {
      const products = createTestProducts()
      const originalStatus = products[0].status
      toggleProductStatus(products, '1')
      expect(products[0].status).toBe(originalStatus)
    })
  })

  describe('setProductStatus', () => {
    it('should set status to on-shelf', () => {
      const products = createTestProducts()
      const result = setProductStatus(products, '3', PRODUCT_STATUS.ON_SHELF)
      const product = result.find(p => p.id === '3')
      expect(product.status).toBe(PRODUCT_STATUS.ON_SHELF)
    })

    it('should set status to off-shelf', () => {
      const products = createTestProducts()
      const result = setProductStatus(products, '1', PRODUCT_STATUS.OFF_SHELF)
      const product = result.find(p => p.id === '1')
      expect(product.status).toBe(PRODUCT_STATUS.OFF_SHELF)
    })

    it('should keep status unchanged if already same', () => {
      const products = createTestProducts()
      const result = setProductStatus(products, '1', PRODUCT_STATUS.ON_SHELF)
      const product = result.find(p => p.id === '1')
      expect(product.status).toBe(PRODUCT_STATUS.ON_SHELF)
    })
  })

  describe('batchOnShelf', () => {
    it('should set status to on-shelf for multiple products', () => {
      const products = createTestProducts()
      const result = batchOnShelf(products, ['3', '5'])
      expect(result.products.find(p => p.id === '3').status).toBe(PRODUCT_STATUS.ON_SHELF)
      expect(result.products.find(p => p.id === '5').status).toBe(PRODUCT_STATUS.ON_SHELF)
      expect(result.affectedCount).toBe(2)
    })

    it('should not affect non-selected products', () => {
      const products = createTestProducts()
      const result = batchOnShelf(products, ['3'])
      expect(result.products.find(p => p.id === '5').status).toBe(PRODUCT_STATUS.OFF_SHELF)
    })

    it('should handle empty ids array', () => {
      const products = createTestProducts()
      const result = batchOnShelf(products, [])
      expect(result.affectedCount).toBe(0)
      expect(result.products).toEqual(products)
    })
  })

  describe('batchOffShelf', () => {
    it('should set status to off-shelf for multiple products', () => {
      const products = createTestProducts()
      const result = batchOffShelf(products, ['1', '2', '4'])
      expect(result.products.find(p => p.id === '1').status).toBe(PRODUCT_STATUS.OFF_SHELF)
      expect(result.products.find(p => p.id === '2').status).toBe(PRODUCT_STATUS.OFF_SHELF)
      expect(result.products.find(p => p.id === '4').status).toBe(PRODUCT_STATUS.OFF_SHELF)
      expect(result.affectedCount).toBe(3)
    })

    it('should not affect non-selected products', () => {
      const products = createTestProducts()
      const result = batchOffShelf(products, ['1'])
      expect(result.products.find(p => p.id === '2').status).toBe(PRODUCT_STATUS.ON_SHELF)
    })
  })

  describe('batchDelete', () => {
    it('should delete multiple products', () => {
      const products = createTestProducts()
      const result = batchDelete(products, ['1', '3', '5'])
      expect(result.products).toHaveLength(2)
      expect(result.products.find(p => p.id === '1')).toBeUndefined()
      expect(result.products.find(p => p.id === '2')).toBeDefined()
      expect(result.deletedCount).toBe(3)
    })

    it('should return empty array when all products deleted', () => {
      const products = createTestProducts()
      const allIds = products.map(p => p.id)
      const result = batchDelete(products, allIds)
      expect(result.products).toHaveLength(0)
      expect(result.deletedCount).toBe(5)
    })

    it('should handle empty ids array', () => {
      const products = createTestProducts()
      const result = batchDelete(products, [])
      expect(result.products).toHaveLength(5)
      expect(result.deletedCount).toBe(0)
    })

    it('should not mutate original products array', () => {
      const products = createTestProducts()
      batchDelete(products, ['1'])
      expect(products).toHaveLength(5)
    })
  })

  describe('calculateStatistics', () => {
    it('should calculate correct statistics', () => {
      const products = createTestProducts()
      const stats = calculateStatistics(products)
      expect(stats.totalCount).toBe(5)
      expect(stats.onShelfCount).toBe(3)
      expect(stats.offShelfCount).toBe(2)
      expect(stats.totalStock).toBe(50 + 5 + 0 + 200 + 8)
    })

    it('should count low stock correctly', () => {
      const products = createTestProducts()
      const stats = calculateStatistics(products)
      expect(stats.lowStockCount).toBe(3)
    })

    it('should return zeros for empty product list', () => {
      const stats = calculateStatistics([])
      expect(stats.totalCount).toBe(0)
      expect(stats.onShelfCount).toBe(0)
      expect(stats.offShelfCount).toBe(0)
      expect(stats.lowStockCount).toBe(0)
      expect(stats.totalStock).toBe(0)
    })

    it('should handle all off-shelf products', () => {
      const products = createTestProducts().map(p => ({
        ...p,
        status: PRODUCT_STATUS.OFF_SHELF
      }))
      const stats = calculateStatistics(products)
      expect(stats.onShelfCount).toBe(0)
      expect(stats.offShelfCount).toBe(5)
    })
  })

  describe('filterProducts', () => {
    const products = createTestProducts()

    it('should return all products without filters', () => {
      const result = filterProducts(products, {})
      expect(result).toHaveLength(5)
    })

    it('should filter by category', () => {
      const result = filterProducts(products, { category: PRODUCT_CATEGORIES.ELECTRONICS })
      expect(result).toHaveLength(2)
      expect(result.every(p => p.category === PRODUCT_CATEGORIES.ELECTRONICS)).toBe(true)
    })

    it('should filter by status', () => {
      const result = filterProducts(products, { status: PRODUCT_STATUS.ON_SHELF })
      expect(result).toHaveLength(3)
      expect(result.every(p => p.status === PRODUCT_STATUS.ON_SHELF)).toBe(true)
    })

    it('should filter by keyword (case insensitive)', () => {
      const result = filterProducts(products, { keyword: 'product 1' })
      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Product 1')
    })

    it('should filter by partial keyword match', () => {
      const result = filterProducts(products, { keyword: 'prod' })
      expect(result).toHaveLength(5)
    })

    it('should filter by category and status together', () => {
      const result = filterProducts(products, {
        category: PRODUCT_CATEGORIES.ELECTRONICS,
        status: PRODUCT_STATUS.OFF_SHELF
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('3')
    })

    it('should filter by all parameters', () => {
      const result = filterProducts(products, {
        category: PRODUCT_CATEGORIES.CLOTHING,
        status: PRODUCT_STATUS.ON_SHELF,
        keyword: 'Product'
      })
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('2')
    })

    it('should handle all category filter', () => {
      const result = filterProducts(products, { category: 'all' })
      expect(result).toHaveLength(5)
    })

    it('should handle all status filter', () => {
      const result = filterProducts(products, { status: 'all' })
      expect(result).toHaveLength(5)
    })

    it('should handle empty keyword', () => {
      const result = filterProducts(products, { keyword: '' })
      expect(result).toHaveLength(5)
    })

    it('should handle whitespace-only keyword', () => {
      const result = filterProducts(products, { keyword: '   ' })
      expect(result).toHaveLength(5)
    })

    it('should handle empty products array', () => {
      const result = filterProducts([], { category: PRODUCT_CATEGORIES.ELECTRONICS })
      expect(result).toHaveLength(0)
    })

    it('should return empty for non-matching filters', () => {
      const result = filterProducts(products, { keyword: 'nonexistent' })
      expect(result).toHaveLength(0)
    })
  })

  describe('isLowStock', () => {
    it('should return true for stock below threshold', () => {
      expect(isLowStock(LOW_STOCK_THRESHOLD - 1)).toBe(true)
      expect(isLowStock(0)).toBe(true)
      expect(isLowStock(5)).toBe(true)
    })

    it('should return false for stock at or above threshold', () => {
      expect(isLowStock(LOW_STOCK_THRESHOLD)).toBe(false)
      expect(isLowStock(LOW_STOCK_THRESHOLD + 1)).toBe(false)
      expect(isLowStock(100)).toBe(false)
    })
  })

  describe('formatPrice', () => {
    it('should format integer price correctly', () => {
      expect(formatPrice(100)).toBe('¥100.00')
    })

    it('should format decimal price correctly', () => {
      expect(formatPrice(99.9)).toBe('¥99.90')
      expect(formatPrice(199.99)).toBe('¥199.99')
    })

    it('should format zero price correctly', () => {
      expect(formatPrice(0)).toBe('¥0.00')
    })

    it('should format large price correctly', () => {
      expect(formatPrice(9999.99)).toBe('¥9999.99')
    })
  })

  describe('getFilterDescription', () => {
    it('should return default description when no filters', () => {
      const desc = getFilterDescription({}, CATEGORY_CONFIG, STATUS_CONFIG)
      expect(desc).toBe('全部商品')
    })

    it('should include category in description', () => {
      const desc = getFilterDescription(
        { category: PRODUCT_CATEGORIES.ELECTRONICS },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toContain('电子产品')
    })

    it('should include status in description', () => {
      const desc = getFilterDescription(
        { status: PRODUCT_STATUS.ON_SHELF },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toContain('上架中')
    })

    it('should include keyword in description', () => {
      const desc = getFilterDescription(
        { keyword: 'iPhone' },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toContain('iPhone')
    })

    it('should combine multiple filters', () => {
      const desc = getFilterDescription(
        {
          category: PRODUCT_CATEGORIES.ELECTRONICS,
          status: PRODUCT_STATUS.ON_SHELF,
          keyword: 'Mac'
        },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toContain('电子产品')
      expect(desc).toContain('上架中')
      expect(desc).toContain('Mac')
    })

    it('should not include "all" category filter', () => {
      const desc = getFilterDescription(
        { category: 'all' },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toBe('全部商品')
    })

    it('should not include "all" status filter', () => {
      const desc = getFilterDescription(
        { status: 'all' },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toBe('全部商品')
    })

    it('should not include empty keyword', () => {
      const desc = getFilterDescription(
        { keyword: '   ' },
        CATEGORY_CONFIG,
        STATUS_CONFIG
      )
      expect(desc).toBe('全部商品')
    })
  })
})
