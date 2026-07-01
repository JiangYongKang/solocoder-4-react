import { describe, it, expect } from 'vitest'
import {
  generateCartItemId,
  calculateSpecPrice,
  calculateCartItemPrice,
  buildSpecDescription,
  buildFullProductName,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  calculateSubtotal,
  calculateTotalItems,
  findApplicableDiscount,
  calculateDiscount,
  calculateTotalPrice,
  canCheckout,
  validateSpecSelection,
  getDefaultSpecSelection,
  submitOrder,
  formatPrice
} from '../../food-order/utils/cartManager'
import { MOCK_DISCOUNT_RULES, MOCK_PRODUCTS, MOCK_ADDRESSES } from '../../food-order/data/mockData'

const productWithoutSpecs = MOCK_PRODUCTS.find((p) => !p.hasSpecs && !p.soldOut)
const productWithSpecs = MOCK_PRODUCTS.find((p) => p.hasSpecs && !p.soldOut)
const mockAddress = MOCK_ADDRESSES[0]

describe('cartManager', () => {
  describe('generateCartItemId', () => {
    it('should generate consistent ids for same product and specs', () => {
      const specs = { 'spec-group-1': 'opt-1' }
      const id1 = generateCartItemId('prod-1', specs)
      const id2 = generateCartItemId('prod-1', specs)
      expect(id1).toBe(id2)
    })

    it('should generate different ids for different products', () => {
      const specs = { 'spec-group-1': 'opt-1' }
      const id1 = generateCartItemId('prod-1', specs)
      const id2 = generateCartItemId('prod-2', specs)
      expect(id1).not.toBe(id2)
    })

    it('should generate different ids for different specs', () => {
      const specs1 = { 'spec-group-1': 'opt-1' }
      const specs2 = { 'spec-group-1': 'opt-2' }
      const id1 = generateCartItemId('prod-1', specs1)
      const id2 = generateCartItemId('prod-1', specs2)
      expect(id1).not.toBe(id2)
    })

    it('should handle null specs', () => {
      const id = generateCartItemId('prod-1', null)
      expect(id).toContain('prod-1')
    })
  })

  describe('calculateSpecPrice', () => {
    it('should return 0 for products without specs', () => {
      const price = calculateSpecPrice(productWithoutSpecs, null)
      expect(price).toBe(0)
    })

    it('should return 0 when no specs selected', () => {
      const price = calculateSpecPrice(productWithSpecs, {})
      expect(price).toBe(0)
    })

    it('should calculate correct spec price for single selection', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            options: [
              { id: 's', name: '小', price: 0 },
              { id: 'm', name: '中', price: 5 }
            ]
          }
        ]
      }
      const specs = { size: 'm' }
      const price = calculateSpecPrice(product, specs)
      expect(price).toBe(5)
    })

    it('should calculate correct spec price for multiple selection', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'addon',
            options: [
              { id: 'cheese', name: '芝士', price: 5 },
              { id: 'bacon', name: '培根', price: 6 }
            ]
          }
        ]
      }
      const specs = { addon: ['cheese', 'bacon'] }
      const price = calculateSpecPrice(product, specs)
      expect(price).toBe(11)
    })
  })

  describe('calculateCartItemPrice', () => {
    it('should return base price for products without specs', () => {
      const price = calculateCartItemPrice(productWithoutSpecs, null)
      expect(price).toBe(productWithoutSpecs.price)
    })

    it('should add spec price to base price', () => {
      const product = {
        id: 'test',
        price: 20,
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            options: [{ id: 'm', name: '中', price: 5 }]
          }
        ]
      }
      const specs = { size: 'm' }
      const price = calculateCartItemPrice(product, specs)
      expect(price).toBe(25)
    })
  })

  describe('buildSpecDescription', () => {
    it('should return empty string for products without specs', () => {
      const desc = buildSpecDescription(productWithoutSpecs, null)
      expect(desc).toBe('')
    })

    it('should build correct description for single specs', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            name: '尺寸',
            options: [{ id: 'm', name: '中份', price: 0 }]
          },
          {
            id: 'spicy',
            name: '辣度',
            options: [{ id: 'mid', name: '中辣', price: 0 }]
          }
        ]
      }
      const specs = { size: 'm', spicy: 'mid' }
      const desc = buildSpecDescription(product, specs)
      expect(desc).toContain('中份')
      expect(desc).toContain('中辣')
    })
  })

  describe('buildFullProductName', () => {
    it('should return just product name without specs', () => {
      const name = buildFullProductName(productWithoutSpecs, null)
      expect(name).toBe(productWithoutSpecs.name)
    })

    it('should include spec description in name', () => {
      const product = {
        id: 'test',
        name: '奶茶',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            name: '杯型',
            options: [{ id: 'l', name: '大杯', price: 0 }]
          }
        ]
      }
      const specs = { size: 'l' }
      const name = buildFullProductName(product, specs)
      expect(name).toBe('奶茶 (大杯)')
    })
  })

  describe('addToCart', () => {
    it('should add new item to empty cart', () => {
      const cart = []
      const newCart = addToCart(cart, productWithoutSpecs, null, 1)
      expect(newCart.length).toBe(1)
      expect(newCart[0].productId).toBe(productWithoutSpecs.id)
      expect(newCart[0].quantity).toBe(1)
    })

    it('should increase quantity for existing item', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      const newCart = addToCart(cart, productWithoutSpecs, null, 2)
      expect(newCart.length).toBe(1)
      expect(newCart[0].quantity).toBe(3)
    })

    it('should add item with correct unit price', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      expect(cart[0].unitPrice).toBe(productWithoutSpecs.price)
    })
  })

  describe('updateCartItemQuantity', () => {
    it('should update quantity for existing item', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      const itemId = cart[0].id
      const newCart = updateCartItemQuantity(cart, itemId, 5)
      expect(newCart[0].quantity).toBe(5)
    })

    it('should remove item when quantity is 0', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      const itemId = cart[0].id
      const newCart = updateCartItemQuantity(cart, itemId, 0)
      expect(newCart.length).toBe(0)
    })

    it('should remove item when quantity is negative', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      const itemId = cart[0].id
      const newCart = updateCartItemQuantity(cart, itemId, -1)
      expect(newCart.length).toBe(0)
    })
  })

  describe('removeFromCart', () => {
    it('should remove item from cart', () => {
      let cart = addToCart([], productWithoutSpecs, null, 1)
      const itemId = cart[0].id
      cart = removeFromCart(cart, itemId)
      expect(cart.length).toBe(0)
    })

    it('should not affect other items', () => {
      let cart = addToCart([], productWithoutSpecs, null, 1)
      const product2 = { ...productWithoutSpecs, id: 'prod-2', price: 30 }
      cart = addToCart(cart, product2, null, 1)
      expect(cart.length).toBe(2)

      const itemIdToRemove = cart[0].id
      cart = removeFromCart(cart, itemIdToRemove)
      expect(cart.length).toBe(1)
      expect(cart[0].productId).toBe('prod-2')
    })
  })

  describe('clearCart', () => {
    it('should return empty array', () => {
      const result = clearCart()
      expect(result).toEqual([])
    })
  })

  describe('calculateSubtotal', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateSubtotal([])).toBe(0)
    })

    it('should calculate correct subtotal', () => {
      let cart = addToCart([], productWithoutSpecs, null, 2)
      const product2 = { ...productWithoutSpecs, id: 'prod-2', price: 30 }
      cart = addToCart(cart, product2, null, 1)

      const expected = productWithoutSpecs.price * 2 + 30
      expect(calculateSubtotal(cart)).toBe(expected)
    })
  })

  describe('calculateTotalItems', () => {
    it('should return 0 for empty cart', () => {
      expect(calculateTotalItems([])).toBe(0)
    })

    it('should sum all quantities', () => {
      let cart = addToCart([], productWithoutSpecs, null, 2)
      const product2 = { ...productWithoutSpecs, id: 'prod-2' }
      cart = addToCart(cart, product2, null, 3)
      expect(calculateTotalItems(cart)).toBe(5)
    })
  })

  describe('findApplicableDiscount', () => {
    it('should return null when no rules', () => {
      const result = findApplicableDiscount(100, [])
      expect(result).toBeNull()
    })

    it('should return null when amount is below minimum', () => {
      const result = findApplicableDiscount(10, MOCK_DISCOUNT_RULES)
      expect(result).toBeNull()
    })

    it('should return highest applicable discount', () => {
      const result = findApplicableDiscount(100, MOCK_DISCOUNT_RULES)
      expect(result.minAmount).toBe(100)
      expect(result.discount).toBe(35)
    })

    it('should return correct discount for boundary values', () => {
      const result = findApplicableDiscount(20, MOCK_DISCOUNT_RULES)
      expect(result.minAmount).toBe(20)
      expect(result.discount).toBe(5)
    })
  })

  describe('calculateDiscount', () => {
    it('should return 0 when no applicable discount', () => {
      const discount = calculateDiscount(10, MOCK_DISCOUNT_RULES)
      expect(discount).toBe(0)
    })

    it('should return correct discount amount', () => {
      const discount = calculateDiscount(50, MOCK_DISCOUNT_RULES)
      expect(discount).toBe(12)
    })
  })

  describe('calculateTotalPrice', () => {
    it('should calculate total correctly', () => {
      const total = calculateTotalPrice(100, 20, 5)
      expect(total).toBe(85)
    })

    it('should not return negative total', () => {
      const total = calculateTotalPrice(10, 20, 5)
      expect(total).toBe(0)
    })
  })

  describe('canCheckout', () => {
    it('should not allow checkout with empty cart', () => {
      const result = canCheckout([], 0, 30)
      expect(result.canCheckout).toBe(false)
      expect(result.reason).toBe('购物车是空的')
    })

    it('should not allow checkout when below min order amount', () => {
      const cart = addToCart([], productWithoutSpecs, null, 1)
      const subtotal = calculateSubtotal(cart)
      const result = canCheckout(cart, subtotal, 100)
      expect(result.canCheckout).toBe(false)
      expect(result.reason).toContain('起送')
    })

    it('should allow checkout when conditions are met', () => {
      const cart = addToCart([], productWithoutSpecs, null, 5)
      const subtotal = calculateSubtotal(cart)
      const result = canCheckout(cart, subtotal, 30)
      expect(result.canCheckout).toBe(true)
    })
  })

  describe('validateSpecSelection', () => {
    it('should return valid for products without specs', () => {
      const result = validateSpecSelection(productWithoutSpecs, null)
      expect(result.valid).toBe(true)
    })

    it('should return invalid when required specs are missing', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            name: '尺寸',
            type: 'single',
            required: true,
            options: [{ id: 'm', name: '中', price: 0 }]
          }
        ]
      }
      const result = validateSpecSelection(product, {})
      expect(result.valid).toBe(false)
      expect(result.reason).toContain('尺寸')
    })

    it('should return valid when all required specs are selected', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            name: '尺寸',
            type: 'single',
            required: true,
            options: [{ id: 'm', name: '中', price: 0 }]
          }
        ]
      }
      const result = validateSpecSelection(product, { size: 'm' })
      expect(result.valid).toBe(true)
    })

    it('should return invalid for empty multiple selection when required', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'addon',
            name: '加料',
            type: 'multiple',
            required: true,
            options: [{ id: 'cheese', name: '芝士', price: 0 }]
          }
        ]
      }
      const result = validateSpecSelection(product, { addon: [] })
      expect(result.valid).toBe(false)
    })
  })

  describe('getDefaultSpecSelection', () => {
    it('should return null for products without specs', () => {
      const result = getDefaultSpecSelection(productWithoutSpecs)
      expect(result).toBeNull()
    })

    it('should select first option for single type', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'size',
            type: 'single',
            options: [
              { id: 's', name: '小', price: 0 },
              { id: 'm', name: '中', price: 0 }
            ]
          }
        ]
      }
      const result = getDefaultSpecSelection(product)
      expect(result.size).toBe('s')
    })

    it('should return empty array for multiple type', () => {
      const product = {
        id: 'test',
        hasSpecs: true,
        specGroups: [
          {
            id: 'addon',
            type: 'multiple',
            options: [{ id: 'cheese', name: '芝士', price: 0 }]
          }
        ]
      }
      const result = getDefaultSpecSelection(product)
      expect(result.addon).toEqual([])
    })
  })

  describe('submitOrder', () => {
    it('should fail when no address provided', () => {
      const result = submitOrder([], null, '', 100, 10, 5, 95)
      expect(result.success).toBe(false)
      expect(result.message).toContain('地址')
    })

    it('should submit order successfully', () => {
      const cart = addToCart([], productWithoutSpecs, null, 2)
      const subtotal = calculateSubtotal(cart)
      const discount = calculateDiscount(subtotal, MOCK_DISCOUNT_RULES)
      const total = calculateTotalPrice(subtotal, discount, 5)

      const result = submitOrder(
        cart,
        mockAddress,
        '少辣',
        subtotal,
        discount,
        5,
        total
      )

      expect(result.success).toBe(true)
      expect(result.order).toBeDefined()
      expect(result.order.id).toMatch(/^FD/)
      expect(result.order.items.length).toBe(1)
      expect(result.order.address.id).toBe(mockAddress.id)
      expect(result.order.remark).toBe('少辣')
      expect(result.order.priceDetail.subtotal).toBe(subtotal)
      expect(result.order.priceDetail.discount).toBe(discount)
      expect(result.order.priceDetail.total).toBe(total)
    })
  })

  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(10)).toBe('¥10.00')
      expect(formatPrice(10.5)).toBe('¥10.50')
      expect(formatPrice(0)).toBe('¥0.00')
    })
  })
})
