export const PRODUCT_CATEGORIES = {
  ELECTRONICS: 'electronics',
  CLOTHING: 'clothing',
  FOOD: 'food',
  BOOKS: 'books',
  HOME: 'home'
}

export const CATEGORY_CONFIG = {
  [PRODUCT_CATEGORIES.ELECTRONICS]: {
    name: '电子产品',
    color: '#1677ff'
  },
  [PRODUCT_CATEGORIES.CLOTHING]: {
    name: '服装鞋帽',
    color: '#722ed1'
  },
  [PRODUCT_CATEGORIES.FOOD]: {
    name: '食品饮料',
    color: '#fa8c16'
  },
  [PRODUCT_CATEGORIES.BOOKS]: {
    name: '图书文具',
    color: '#13c2c2'
  },
  [PRODUCT_CATEGORIES.HOME]: {
    name: '家居生活',
    color: '#52c41a'
  }
}

export const PRODUCT_STATUS = {
  ON_SHELF: 'on_shelf',
  OFF_SHELF: 'off_shelf'
}

export const STATUS_CONFIG = {
  [PRODUCT_STATUS.ON_SHELF]: {
    text: '上架中',
    color: '#52c41a',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f'
  },
  [PRODUCT_STATUS.OFF_SHELF]: {
    text: '已下架',
    color: '#8c8c8c',
    bgColor: '#fafafa',
    borderColor: '#d9d9d9'
  }
}

export const LOW_STOCK_THRESHOLD = 10

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}
