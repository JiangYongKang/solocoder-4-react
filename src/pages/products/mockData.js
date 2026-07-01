import { PRODUCT_CATEGORIES, PRODUCT_STATUS } from './types'

let productIdCounter = 0

export const resetProductIdCounter = () => {
  productIdCounter = 0
}

export const generateProductId = () => {
  productIdCounter += 1
  const timestamp = Date.now().toString().slice(-8)
  const counter = productIdCounter.toString().padStart(4, '0')
  return `P${timestamp}${counter}`
}

export const MOCK_PRODUCTS = [
  {
    id: generateProductId(),
    name: 'iPhone 15 Pro Max 256GB',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    price: 9999,
    stock: 50,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: 'MacBook Air M2 13英寸',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    price: 8999,
    stock: 25,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '索尼 WH-1000XM5 降噪耳机',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    price: 2899,
    stock: 8,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: 'iPad Pro 12.9英寸',
    category: PRODUCT_CATEGORIES.ELECTRONICS,
    price: 9299,
    stock: 0,
    status: PRODUCT_STATUS.OFF_SHELF
  },
  {
    id: generateProductId(),
    name: '夏季纯棉T恤男款',
    category: PRODUCT_CATEGORIES.CLOTHING,
    price: 129,
    stock: 200,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '休闲牛仔长裤',
    category: PRODUCT_CATEGORIES.CLOTHING,
    price: 359,
    stock: 150,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '运动跑鞋 Air系列',
    category: PRODUCT_CATEGORIES.CLOTHING,
    price: 699,
    stock: 5,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '羽绒服加厚款',
    category: PRODUCT_CATEGORIES.CLOTHING,
    price: 1299,
    stock: 80,
    status: PRODUCT_STATUS.OFF_SHELF
  },
  {
    id: generateProductId(),
    name: '有机牛奶 1L*12盒',
    category: PRODUCT_CATEGORIES.FOOD,
    price: 99,
    stock: 300,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '进口巧克力礼盒装',
    category: PRODUCT_CATEGORIES.FOOD,
    price: 258,
    stock: 3,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '云南普洱茶叶礼盒',
    category: PRODUCT_CATEGORIES.FOOD,
    price: 498,
    stock: 60,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '进口咖啡豆 500g',
    category: PRODUCT_CATEGORIES.FOOD,
    price: 158,
    stock: 0,
    status: PRODUCT_STATUS.OFF_SHELF
  },
  {
    id: generateProductId(),
    name: '《代码大全》第二版',
    category: PRODUCT_CATEGORIES.BOOKS,
    price: 128,
    stock: 120,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '《JavaScript高级程序设计》',
    category: PRODUCT_CATEGORIES.BOOKS,
    price: 89,
    stock: 7,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '笔记本 A5 100页',
    category: PRODUCT_CATEGORIES.BOOKS,
    price: 25,
    stock: 500,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '精装钢笔礼盒',
    category: PRODUCT_CATEGORIES.BOOKS,
    price: 288,
    stock: 0,
    status: PRODUCT_STATUS.OFF_SHELF
  },
  {
    id: generateProductId(),
    name: '北欧风格台灯',
    category: PRODUCT_CATEGORIES.HOME,
    price: 299,
    stock: 45,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '记忆棉枕头',
    category: PRODUCT_CATEGORIES.HOME,
    price: 199,
    stock: 2,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '空气净化器家用版',
    category: PRODUCT_CATEGORIES.HOME,
    price: 1599,
    stock: 20,
    status: PRODUCT_STATUS.ON_SHELF
  },
  {
    id: generateProductId(),
    name: '智能扫地机器人',
    category: PRODUCT_CATEGORIES.HOME,
    price: 2499,
    stock: 15,
    status: PRODUCT_STATUS.OFF_SHELF
  }
]

export const getCategoryProducts = (products, category) => {
  if (!category || category === 'all') {
    return products
  }
  return products.filter(p => p.category === category)
}

export const createMockProduct = (overrides = {}) => {
  const categories = Object.values(PRODUCT_CATEGORIES)
  const statuses = Object.values(PRODUCT_STATUS)
  
  return {
    id: generateProductId(),
    name: overrides.name || `商品${Date.now().toString().slice(-6)}`,
    category: overrides.category || categories[Math.floor(Math.random() * categories.length)],
    price: overrides.price || Math.floor(Math.random() * 5000) + 10,
    stock: overrides.stock !== undefined ? overrides.stock : Math.floor(Math.random() * 200),
    status: overrides.status || statuses[Math.floor(Math.random() * statuses.length)]
  }
}
