export const TABLE_TYPES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
}

export const TABLE_TYPE_CONFIG = {
  [TABLE_TYPES.SMALL]: {
    name: '小桌',
    seats: '1-2人',
    avgWaitTime: 15
  },
  [TABLE_TYPES.MEDIUM]: {
    name: '中桌',
    seats: '3-4人',
    avgWaitTime: 25
  },
  [TABLE_TYPES.LARGE]: {
    name: '大桌',
    seats: '5-8人',
    avgWaitTime: 40
  }
}

export const QUEUE_STATUS = {
  WAITING: 'waiting',
  SOON: 'soon',
  CALLED: 'called',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled'
}

export const QUEUE_STATUS_CONFIG = {
  [QUEUE_STATUS.WAITING]: {
    text: '等待中',
    color: '#1677ff'
  },
  [QUEUE_STATUS.SOON]: {
    text: '即将叫号',
    color: '#faad14'
  },
  [QUEUE_STATUS.CALLED]: {
    text: '已叫号',
    color: '#52c41a'
  },
  [QUEUE_STATUS.EXPIRED]: {
    text: '已过号',
    color: '#ff4d4f'
  },
  [QUEUE_STATUS.CANCELLED]: {
    text: '已取消',
    color: '#8c8c8c'
  }
}

export const STORE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed'
}

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
}
