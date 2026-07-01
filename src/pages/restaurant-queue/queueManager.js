import { QUEUE_STATUS, TABLE_TYPE_CONFIG } from './types'
import { generateQueueNumber, simulateQueueUpdate, simulateQueueNumberStatus } from './mockData'

export const createQueueNumber = (storeId, tableType, queueOverview) => {
  const number = generateQueueNumber(storeId, tableType)
  const tableConfig = TABLE_TYPE_CONFIG[tableType]
  const waitingCount = queueOverview[tableType]?.waitingCount || 0
  const estimatedWaitTime = waitingCount * tableConfig.avgWaitTime
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 9)

  return {
    id: `queue-${timestamp}-${random}`,
    number,
    tableType,
    storeId,
    status: QUEUE_STATUS.WAITING,
    waitingCount,
    estimatedWaitTime,
    createdAt: timestamp,
    calledAt: null,
    expiredAt: null
  }
}

export const calculateEstimatedCallTime = (queueNumber) => {
  const { createdAt, estimatedWaitTime } = queueNumber
  return new Date(createdAt + estimatedWaitTime * 60 * 1000)
}

export const formatTime = (date) => {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

export const formatWaitTime = (minutes) => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

export const updateQueueNumberStatus = (queueNumber, queueOverview) => {
  if (queueNumber.status === QUEUE_STATUS.CANCELLED || 
      queueNumber.status === QUEUE_STATUS.EXPIRED) {
    return queueNumber
  }

  const waitingCount = queueOverview[queueNumber.tableType]?.waitingCount || 0
  const newStatus = simulateQueueNumberStatus(queueNumber.status, waitingCount)
  
  let updatedNumber = {
    ...queueNumber,
    status: newStatus,
    waitingCount
  }

  if (newStatus === QUEUE_STATUS.CALLED && !queueNumber.calledAt) {
    updatedNumber.calledAt = Date.now()
  }

  if (newStatus === QUEUE_STATUS.EXPIRED && !queueNumber.expiredAt) {
    updatedNumber.expiredAt = Date.now()
  }

  return updatedNumber
}

export const refreshQueueOverview = (currentQueue, storeId) => {
  return simulateQueueUpdate(currentQueue, storeId)
}

export const cancelQueueNumber = (queueNumber) => {
  return {
    ...queueNumber,
    status: QUEUE_STATUS.CANCELLED
  }
}

export const requeueAfterExpired = (queueNumber, queueOverview) => {
  const newQueueNumber = createQueueNumber(
    queueNumber.storeId,
    queueNumber.tableType,
    queueOverview
  )
  return {
    ...newQueueNumber,
    isRequeue: true,
    originalNumber: queueNumber.number
  }
}

export const getTotalWaitingCount = (queueOverview) => {
  return Object.values(queueOverview).reduce((total, item) => total + item.waitingCount, 0)
}

export const canTakeNumber = (store, tableType) => {
  if (!store || store.status !== 'open') {
    return { canTake: false, reason: '门店已打烊' }
  }
  if (!tableType) {
    return { canTake: false, reason: '请选择桌型' }
  }
  return { canTake: true }
}

export const updateEstimatedWaitTime = (queueNumber, queueOverview) => {
  const tableConfig = TABLE_TYPE_CONFIG[queueNumber.tableType]
  const waitingCount = queueOverview[queueNumber.tableType]?.waitingCount || 0
  const estimatedWaitTime = waitingCount * tableConfig.avgWaitTime
  
  return {
    ...queueNumber,
    waitingCount,
    estimatedWaitTime
  }
}
