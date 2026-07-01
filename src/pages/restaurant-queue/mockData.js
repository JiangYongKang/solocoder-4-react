import { STORE_STATUS, TABLE_TYPES } from './types'

export const MOCK_STORES = [
  {
    id: 'store-001',
    name: '美味轩（中关村店）',
    address: '北京市海淀区中关村大街1号',
    status: STORE_STATUS.OPEN,
    businessHours: '10:00 - 22:00',
    queueOverview: {
      [TABLE_TYPES.SMALL]: { waitingCount: 8 },
      [TABLE_TYPES.MEDIUM]: { waitingCount: 12 },
      [TABLE_TYPES.LARGE]: { waitingCount: 5 }
    }
  },
  {
    id: 'store-002',
    name: '美味轩（朝阳大悦城店）',
    address: '北京市朝阳区朝阳北路101号',
    status: STORE_STATUS.OPEN,
    businessHours: '10:30 - 21:30',
    queueOverview: {
      [TABLE_TYPES.SMALL]: { waitingCount: 5 },
      [TABLE_TYPES.MEDIUM]: { waitingCount: 9 },
      [TABLE_TYPES.LARGE]: { waitingCount: 3 }
    }
  },
  {
    id: 'store-003',
    name: '美味轩（望京SOHO店）',
    address: '北京市朝阳区望京街9号',
    status: STORE_STATUS.CLOSED,
    businessHours: '10:00 - 22:00',
    queueOverview: {
      [TABLE_TYPES.SMALL]: { waitingCount: 0 },
      [TABLE_TYPES.MEDIUM]: { waitingCount: 0 },
      [TABLE_TYPES.LARGE]: { waitingCount: 0 }
    }
  },
  {
    id: 'store-004',
    name: '美味轩（西单店）',
    address: '北京市西城区西单北大街120号',
    status: STORE_STATUS.OPEN,
    businessHours: '09:30 - 22:30',
    queueOverview: {
      [TABLE_TYPES.SMALL]: { waitingCount: 15 },
      [TABLE_TYPES.MEDIUM]: { waitingCount: 20 },
      [TABLE_TYPES.LARGE]: { waitingCount: 8 }
    }
  }
]

let numberCounter = 0

export const resetNumberCounter = () => {
  numberCounter = 0
}

export const generateQueueNumber = (storeId, tableType) => {
  const prefix = storeId.slice(-3).toUpperCase()
  const typePrefix = tableType === TABLE_TYPES.SMALL ? 'S' : tableType === TABLE_TYPES.MEDIUM ? 'M' : 'L'
  const timestamp = Date.now().toString().slice(-6)
  numberCounter = (numberCounter + 1) % 10000
  const counter = numberCounter.toString().padStart(4, '0')
  return `${prefix}${typePrefix}${timestamp}${counter}`
}

export const simulateQueueUpdate = (currentQueue, storeId) => {
  const updatedQueue = { ...currentQueue }
  const change = Math.floor(Math.random() * 5) - 2
  
  Object.keys(updatedQueue).forEach(tableType => {
    const newCount = Math.max(0, updatedQueue[tableType].waitingCount + change + Math.floor(Math.random() * 3) - 1)
    updatedQueue[tableType] = {
      ...updatedQueue[tableType],
      waitingCount: newCount
    }
  })
  
  return updatedQueue
}

export const simulateQueueNumberStatus = (currentStatus, waitingCount) => {
  if (currentStatus === 'cancelled' || currentStatus === 'expired') {
    return currentStatus
  }
  if (waitingCount <= 3 && waitingCount > 0) {
    return 'soon'
  }
  if (waitingCount === 0) {
    return 'called'
  }
  if (Math.random() < 0.05 && currentStatus === 'waiting' && waitingCount < 10) {
    return 'expired'
  }
  return currentStatus
}
