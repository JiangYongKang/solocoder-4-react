import { getCategoryProducts } from './mockData'
import { LOW_STOCK_THRESHOLD, PRODUCT_STATUS } from './types'

export const validateStockInput = (value) => {
  const trimmedValue = typeof value === 'string' ? value.trim() : value
  const num = Number(trimmedValue)
  
  if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
    return { valid: false, reason: '库存不能为空' }
  }
  
  if (Number.isNaN(num)) {
    return { valid: false, reason: '库存必须是数字' }
  }
  
  if (!Number.isFinite(num)) {
    return { valid: false, reason: '库存必须是有限数字' }
  }
  
  if (!Number.isInteger(num)) {
    return { valid: false, reason: '库存必须是整数' }
  }
  
  if (num < 0) {
    return { valid: false, reason: '库存不能为负数' }
  }
  
  if (num > 99999) {
    return { valid: false, reason: '库存不能超过99999' }
  }
  
  return { valid: true, value: num }
}

export const validatePriceInput = (value) => {
  const trimmedValue = typeof value === 'string' ? value.trim() : value
  const num = Number(trimmedValue)
  
  if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
    return { valid: false, reason: '价格不能为空' }
  }
  
  if (Number.isNaN(num)) {
    return { valid: false, reason: '价格必须是数字' }
  }
  
  if (!Number.isFinite(num)) {
    return { valid: false, reason: '价格必须是有限数字' }
  }
  
  if (num < 0) {
    return { valid: false, reason: '价格不能为负数' }
  }
  
  return { valid: true, value: num }
}

export const updateProductStock = (products, productId, newStock) => {
  const validation = validateStockInput(newStock)
  if (!validation.valid) {
    return { success: false, reason: validation.reason, products }
  }
  
  const updatedProducts = products.map(p =>
    p.id === productId ? { ...p, stock: validation.value } : p
  )
  
  return { success: true, products: updatedProducts }
}

export const toggleProductStatus = (products, productId) => {
  const updatedProducts = products.map(p => {
    if (p.id !== productId) return p
    
    const newStatus = p.status === PRODUCT_STATUS.ON_SHELF
      ? PRODUCT_STATUS.OFF_SHELF
      : PRODUCT_STATUS.ON_SHELF
    
    return { ...p, status: newStatus }
  })
  
  return updatedProducts
}

export const setProductStatus = (products, productId, status) => {
  const updatedProducts = products.map(p =>
    p.id === productId ? { ...p, status } : p
  )
  
  return updatedProducts
}

export const batchSetStatus = (products, productIds, status) => {
  const idSet = new Set(productIds)
  let affectedCount = 0
  const updatedProducts = products.map(p => {
    if (!idSet.has(p.id)) return p
    if (p.status === status) return p
    affectedCount += 1
    return { ...p, status }
  })
  
  return { products: updatedProducts, affectedCount }
}

export const batchOnShelf = (products, productIds) => {
  return batchSetStatus(products, productIds, PRODUCT_STATUS.ON_SHELF)
}

export const batchOffShelf = (products, productIds) => {
  return batchSetStatus(products, productIds, PRODUCT_STATUS.OFF_SHELF)
}

export const batchDelete = (products, productIds) => {
  const idSet = new Set(productIds)
  const deletedCount = products.filter(p => idSet.has(p.id)).length
  const remainingProducts = products.filter(p => !idSet.has(p.id))
  
  return { products: remainingProducts, deletedCount }
}

export const calculateStatistics = (products) => {
  const totalCount = products.length
  const onShelfCount = products.filter(p => p.status === PRODUCT_STATUS.ON_SHELF).length
  const lowStockCount = products.filter(p => p.stock < LOW_STOCK_THRESHOLD).length
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
  
  return {
    totalCount,
    onShelfCount,
    lowStockCount,
    totalStock,
    offShelfCount: totalCount - onShelfCount
  }
}

export const filterProducts = (products, { category, keyword, status } = {}) => {
  let filtered = getCategoryProducts(products, category)
  
  if (keyword && keyword.trim()) {
    const kw = keyword.trim().toLowerCase()
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(kw)
    )
  }
  
  if (status && status !== 'all') {
    filtered = filtered.filter(p => p.status === status)
  }
  
  return filtered
}

export const isLowStock = (stock) => {
  return stock < LOW_STOCK_THRESHOLD
}

export const formatPrice = (price) => {
  return `¥${price.toFixed(2)}`
}

export const getFilterDescription = ({ category, keyword, status } = {}, categoryConfig, statusConfig) => {
  const parts = []
  
  if (category && category !== 'all') {
    const catConfig = categoryConfig[category]
    if (catConfig) {
      parts.push(`分类: ${catConfig.name}`)
    }
  }
  
  if (status && status !== 'all') {
    const stConfig = statusConfig[status]
    if (stConfig) {
      parts.push(`状态: ${stConfig.text}`)
    }
  }
  
  if (keyword && keyword.trim()) {
    parts.push(`关键词: "${keyword.trim()}"`)
  }
  
  return parts.length > 0 ? parts.join(' | ') : '全部商品'
}
