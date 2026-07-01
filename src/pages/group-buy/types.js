export const PRODUCT_STATUS = {
  ON_SALE: 'on_sale',
  SOLD_OUT: 'sold_out',
  OFF_SHELF: 'off_shelf'
}

export const PRODUCT_STATUS_CONFIG = {
  [PRODUCT_STATUS.ON_SALE]: {
    text: '团购中',
    color: '#52c41a'
  },
  [PRODUCT_STATUS.SOLD_OUT]: {
    text: '已售罄',
    color: '#8c8c8c'
  },
  [PRODUCT_STATUS.OFF_SHELF]: {
    text: '已下架',
    color: '#ff4d4f'
  }
}

export const GROUP_STATUS = {
  ONGOING: 'ongoing',
  SUCCESS: 'success',
  FAILED: 'failed',
  ENDED: 'ended'
}

export const GROUP_STATUS_CONFIG = {
  [GROUP_STATUS.ONGOING]: {
    text: '拼团中',
    color: '#1677ff'
  },
  [GROUP_STATUS.SUCCESS]: {
    text: '已成团',
    color: '#52c41a'
  },
  [GROUP_STATUS.FAILED]: {
    text: '拼团失败',
    color: '#ff4d4f'
  },
  [GROUP_STATUS.ENDED]: {
    text: '已结束',
    color: '#8c8c8c'
  }
}

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  PICKED_UP: 'picked_up',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  AFTER_SALE: 'after_sale'
}

export const ORDER_STATUS_CONFIG = {
  [ORDER_STATUS.PENDING]: {
    text: '待付款',
    color: '#faad14'
  },
  [ORDER_STATUS.PAID]: {
    text: '待提货',
    color: '#1677ff'
  },
  [ORDER_STATUS.PICKED_UP]: {
    text: '已提货',
    color: '#722ed1'
  },
  [ORDER_STATUS.COMPLETED]: {
    text: '已完成',
    color: '#52c41a'
  },
  [ORDER_STATUS.CANCELLED]: {
    text: '已取消',
    color: '#8c8c8c'
  },
  [ORDER_STATUS.AFTER_SALE]: {
    text: '售后中',
    color: '#ff4d4f'
  }
}

export const AFTER_SALE_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
}

export const AFTER_SALE_STATUS_CONFIG = {
  [AFTER_SALE_STATUS.PENDING]: {
    text: '待处理',
    color: '#faad14'
  },
  [AFTER_SALE_STATUS.PROCESSING]: {
    text: '处理中',
    color: '#1677ff'
  },
  [AFTER_SALE_STATUS.COMPLETED]: {
    text: '已完成',
    color: '#52c41a'
  },
  [AFTER_SALE_STATUS.REJECTED]: {
    text: '已拒绝',
    color: '#ff4d4f'
  }
}

export const AFTER_SALE_REASONS = [
  { id: 'reason-1', text: '商品质量问题' },
  { id: 'reason-2', text: '商品与描述不符' },
  { id: 'reason-3', text: '商品缺件/漏发' },
  { id: 'reason-4', text: '物流损坏' },
  { id: 'reason-5', text: '不想要了' },
  { id: 'reason-6', text: '其他原因' }
]

export const PICKUP_POINT_STATUS = {
  AVAILABLE: 'available',
  FULL: 'full',
  CLOSED: 'closed'
}
