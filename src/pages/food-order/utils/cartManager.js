import { generateOrderId } from '../data/mockData'
import { ORDER_STATUS } from '../types'

export const generateCartItemId = (productId, selectedSpecs) => {
  const specEntries = Object.entries(selectedSpecs || {}).filter(([, optionIds]) => {
    if (Array.isArray(optionIds)) {
      return optionIds.length > 0
    }
    return optionIds !== undefined && optionIds !== null
  })

  if (specEntries.length === 0) {
    return productId
  }

  const specKey = specEntries
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([groupId, optionIds]) => {
      const sortedIds = Array.isArray(optionIds) ? [...optionIds].sort() : [optionIds]
      return `${groupId}:${sortedIds.join(',')}`
    })
    .join('|')
  return `${productId}|${specKey}`
}

export const calculateSpecPrice = (product, selectedSpecs) => {
  if (!product.hasSpecs || !selectedSpecs) return 0

  let specPrice = 0
  product.specGroups.forEach((group) => {
    const selected = selectedSpecs[group.id]
    if (!selected) return

    const optionIds = Array.isArray(selected) ? selected : [selected]
    optionIds.forEach((optionId) => {
      const option = group.options.find((opt) => opt.id === optionId)
      if (option) {
        specPrice += option.price
      }
    })
  })

  return specPrice
}

export const calculateCartItemPrice = (product, selectedSpecs) => {
  const specPrice = calculateSpecPrice(product, selectedSpecs)
  return product.price + specPrice
}

export const buildSpecDescription = (product, selectedSpecs) => {
  if (!product.hasSpecs || !selectedSpecs) return ''

  const parts = []
  product.specGroups.forEach((group) => {
    const selected = selectedSpecs[group.id]
    if (!selected) return

    const optionIds = Array.isArray(selected) ? selected : [selected]
    const optionNames = optionIds
      .map((optionId) => {
        const option = group.options.find((opt) => opt.id === optionId)
        return option ? option.name : ''
      })
      .filter(Boolean)

    if (optionNames.length > 0) {
      parts.push(optionNames.join('/'))
    }
  })

  return parts.join(' · ')
}

export const buildFullProductName = (product, selectedSpecs) => {
  const specDesc = buildSpecDescription(product, selectedSpecs)
  return specDesc ? `${product.name} (${specDesc})` : product.name
}

export const addToCart = (cart, product, selectedSpecs, quantity = 1) => {
  const itemId = generateCartItemId(product.id, selectedSpecs)
  const unitPrice = calculateCartItemPrice(product, selectedSpecs)
  const specDescription = buildSpecDescription(product, selectedSpecs)
  const fullName = buildFullProductName(product, selectedSpecs)

  const existingItem = cart.find((item) => item.id === itemId)

  if (existingItem) {
    return cart.map((item) =>
      item.id === itemId
        ? { ...item, quantity: item.quantity + quantity }
        : item
    )
  }

  const newItem = {
    id: itemId,
    productId: product.id,
    name: product.name,
    fullName,
    specDescription,
    selectedSpecs,
    unitPrice,
    quantity,
    image: product.image
  }

  return [...cart, newItem]
}

export const updateCartItemQuantity = (cart, itemId, quantity) => {
  if (quantity <= 0) {
    return removeFromCart(cart, itemId)
  }
  return cart.map((item) =>
    item.id === itemId ? { ...item, quantity } : item
  )
}

export const removeFromCart = (cart, itemId) => {
  return cart.filter((item) => item.id !== itemId)
}

export const clearCart = () => {
  return []
}

export const calculateSubtotal = (cart) => {
  return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0)
}

export const calculateTotalItems = (cart) => {
  return cart.reduce((total, item) => total + item.quantity, 0)
}

export const findApplicableDiscount = (subtotal, discountRules) => {
  if (!discountRules || discountRules.length === 0) return null

  const sortedRules = [...discountRules].sort((a, b) => b.minAmount - a.minAmount)
  return sortedRules.find((rule) => subtotal >= rule.minAmount) || null
}

export const calculateDiscount = (subtotal, discountRules) => {
  const applicableRule = findApplicableDiscount(subtotal, discountRules)
  return applicableRule ? applicableRule.discount : 0
}

export const calculateTotalPrice = (subtotal, discount, deliveryFee) => {
  return Math.max(0, subtotal - discount + deliveryFee)
}

export const canCheckout = (cart, subtotal, minOrderAmount) => {
  if (cart.length === 0) {
    return { canCheckout: false, reason: '购物车是空的' }
  }
  if (subtotal < minOrderAmount) {
    return {
      canCheckout: false,
      reason: `还差 ¥${(minOrderAmount - subtotal).toFixed(2)} 起送`
    }
  }
  return { canCheckout: true }
}

export const validateSpecSelection = (product, selectedSpecs) => {
  if (!product.hasSpecs) {
    return { valid: true }
  }

  const missingRequired = []
  product.specGroups.forEach((group) => {
    if (group.required) {
      const selected = selectedSpecs?.[group.id]
      if (!selected || (Array.isArray(selected) && selected.length === 0)) {
        missingRequired.push(group.name)
      }
    }
  })

  if (missingRequired.length > 0) {
    return {
      valid: false,
      reason: `请选择 ${missingRequired.join('、')}`
    }
  }

  return { valid: true }
}

export const getDefaultSpecSelection = (product) => {
  if (!product.hasSpecs) return null

  const selection = {}
  product.specGroups.forEach((group) => {
    if (group.type === 'single' && group.options.length > 0) {
      selection[group.id] = group.options[0].id
    } else if (group.type === 'multiple') {
      selection[group.id] = []
    }
  })

  return selection
}

export const submitOrder = (cart, address, remark, subtotal, discount, deliveryFee, total) => {
  if (!address) {
    return { success: false, order: null, message: '请选择配送地址' }
  }

  const orderId = generateOrderId()
  const order = {
    id: orderId,
    items: [...cart],
    address: { ...address },
    remark,
    priceDetail: {
      subtotal,
      discount,
      deliveryFee,
      total
    },
    createdAt: Date.now(),
    status: ORDER_STATUS.PENDING
  }

  return {
    success: true,
    order,
    message: '订单提交成功'
  }
}

export const formatPrice = (price) => {
  return `¥${price.toFixed(2)}`
}
