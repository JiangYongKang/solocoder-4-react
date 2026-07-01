import { generateAfterSaleId, generateOrderId, generateVerificationCode } from '../data/mockData'
import { AFTER_SALE_STATUS, GROUP_STATUS, ORDER_STATUS, PICKUP_POINT_STATUS } from '../types'

let idCounter = 0
const generateUniqueId = (prefix) => {
  idCounter += 1
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 10)
  const counter = idCounter.toString(36).padStart(4, '0')
  return `${prefix}-${timestamp}-${counter}-${random}`
}

export const formatPrice = (price) => {
  return `¥${price.toFixed(2)}`
}

export const formatCountdown = (ms) => {
  if (ms <= 0) return '已结束'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export const calculateGroupProgress = (currentSize, minGroupSize) => {
  if (minGroupSize <= 0) return 0
  const percentage = Math.min(100, Math.round((currentSize / minGroupSize) * 100))
  return percentage
}

export const getRemainingSlots = (currentSize, minGroupSize) => {
  return Math.max(0, minGroupSize - currentSize)
}

export const canJoinGroup = (group, currentUserId = null) => {
  if (group.status !== GROUP_STATUS.ONGOING) return false
  if (group.members.length >= group.minGroupSize) return false
  if (Date.now() >= group.endTime) return false
  if (currentUserId && group.members.some(m => m.id === currentUserId)) return false
  return true
}

export const createNewGroup = (product, leader) => {
  const now = Date.now()
  const defaultDuration = 2 * 60 * 60 * 1000
  const memberId = generateUniqueId('mem')

  return {
    id: generateUniqueId('group'),
    productId: product.id,
    leaderId: leader.id,
    members: [
      {
        id: memberId,
        isLeader: true,
        nickname: leader.nickname,
        joinTime: now
      }
    ],
    minGroupSize: product.minGroupSize,
    startTime: now,
    endTime: now + defaultDuration,
    status: GROUP_STATUS.ONGOING
  }
}

export const joinGroup = (group, userInfo) => {
  if (!canJoinGroup(group)) {
    return { success: false, message: '无法加入该团', group }
  }

  const newMember = {
    id: userInfo.id || generateUniqueId('mem'),
    isLeader: false,
    nickname: userInfo.nickname || '新用户',
    joinTime: Date.now()
  }

  const updatedMembers = [...group.members, newMember]
  const isGroupFull = updatedMembers.length >= group.minGroupSize

  const updatedGroup = {
    ...group,
    members: updatedMembers,
    status: isGroupFull ? GROUP_STATUS.SUCCESS : group.status
  }

  return {
    success: true,
    message: isGroupFull ? '恭喜！成团成功！' : '加入成功！',
    group: updatedGroup,
    isGroupFull
  }
}

export const checkGroupExpiry = (group) => {
  if (group.status !== GROUP_STATUS.ONGOING) return group

  const now = Date.now()
  if (now >= group.endTime) {
    const isFull = group.members.length >= group.minGroupSize
    return {
      ...group,
      status: isFull ? GROUP_STATUS.SUCCESS : GROUP_STATUS.FAILED
    }
  }

  return group
}

export const getGroupTimeRemaining = (group) => {
  if (group.status !== GROUP_STATUS.ONGOING) return 0
  return Math.max(0, group.endTime - Date.now())
}

export const isPickupPointAvailable = (pickupPoint) => {
  return pickupPoint.status === PICKUP_POINT_STATUS.AVAILABLE
}

export const validatePickupSelection = (pickupPoint) => {
  if (!pickupPoint) {
    return { valid: false, message: '请选择提货点' }
  }
  if (!isPickupPointAvailable(pickupPoint)) {
    if (pickupPoint.status === PICKUP_POINT_STATUS.FULL) {
      return { valid: false, message: '该提货点已满，请选择其他提货点' }
    }
    if (pickupPoint.status === PICKUP_POINT_STATUS.CLOSED) {
      return { valid: false, message: '该提货点已关闭，请选择其他提货点' }
    }
  }
  return { valid: true }
}

export const createOrder = (product, group, pickupPoint, userInfo, quantity = 1) => {
  if (quantity <= 0) {
    return { success: false, message: '购买数量必须大于0', order: null }
  }

  if (product.stock <= 0) {
    return { success: false, message: '商品已售罄，无法下单', order: null }
  }

  if (quantity > product.stock) {
    return {
      success: false,
      message: `库存不足，当前库存${product.stock}件，请减少购买数量`,
      order: null
    }
  }

  const pickupValidation = validatePickupSelection(pickupPoint)
  if (!pickupValidation.valid) {
    return { success: false, message: pickupValidation.message, order: null }
  }

  if (group.status === GROUP_STATUS.FAILED || group.status === GROUP_STATUS.ENDED) {
    return { success: false, message: '该团已结束，无法下单', order: null }
  }

  const orderId = generateOrderId()
  const verificationCode = generateVerificationCode()
  const unitPrice = product.groupPrice
  const totalPrice = unitPrice * quantity

  const order = {
    id: orderId,
    productId: product.id,
    productName: product.name,
    productSpec: product.spec,
    groupId: group.id,
    groupStatus: group.status,
    pickupPoint: { ...pickupPoint },
    userInfo: { ...userInfo },
    quantity,
    unitPrice,
    totalPrice,
    verificationCode,
    status: ORDER_STATUS.PAID,
    createdAt: Date.now(),
    pickupDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    remainingStock: product.stock - quantity
  }

  return {
    success: true,
    message: '下单成功',
    order
  }
}

export const pickupOrder = (order) => {
  if (order.status !== ORDER_STATUS.PAID) {
    return { success: false, message: '订单状态不支持提货操作', order }
  }

  if (Date.now() > order.pickupDeadline) {
    return { success: false, message: '提货时间已过，请申请售后', order }
  }

  return {
    success: true,
    message: '提货成功！',
    order: {
      ...order,
      status: ORDER_STATUS.PICKED_UP,
      pickedUpAt: Date.now()
    }
  }
}

export const completeOrder = (order) => {
  if (order.status !== ORDER_STATUS.PICKED_UP) {
    return { success: false, message: '请先提货后再确认收货', order }
  }

  return {
    success: true,
    message: '订单已完成！',
    order: {
      ...order,
      status: ORDER_STATUS.COMPLETED,
      completedAt: Date.now()
    }
  }
}

export const canApplyAfterSale = (order) => {
  const allowedStatuses = [ORDER_STATUS.PAID, ORDER_STATUS.PICKED_UP]
  return allowedStatuses.includes(order.status)
}

export const applyAfterSale = (order, reasonId, reasonText, description = '') => {
  if (!canApplyAfterSale(order)) {
    return {
      success: false,
      message: '当前订单状态不支持申请售后',
      afterSale: null
    }
  }

  if (!reasonId && !reasonText) {
    return {
      success: false,
      message: '请选择或填写售后原因',
      afterSale: null
    }
  }

  const afterSaleId = generateAfterSaleId()
  const afterSale = {
    id: afterSaleId,
    orderId: order.id,
    productName: order.productName,
    reasonId,
    reasonText,
    description,
    status: AFTER_SALE_STATUS.PENDING,
    appliedAt: Date.now(),
    refundAmount: order.totalPrice
  }

  return {
    success: true,
    message: '售后申请已提交',
    afterSale,
    updatedOrder: {
      ...order,
      status: ORDER_STATUS.AFTER_SALE
    }
  }
}

export const getAfterSaleStatusText = (status) => {
  const config = {
    [AFTER_SALE_STATUS.PENDING]: '客服正在处理您的申请，请耐心等待',
    [AFTER_SALE_STATUS.PROCESSING]: '售后申请处理中，预计1-3个工作日完成',
    [AFTER_SALE_STATUS.COMPLETED]: '售后处理完成，退款已原路返回',
    [AFTER_SALE_STATUS.REJECTED]: '售后申请被拒绝，请联系客服了解详情'
  }
  return config[status] || '未知状态'
}

export const canPickupOrder = (order) => {
  if (order.status !== ORDER_STATUS.PAID) return false
  if (Date.now() > order.pickupDeadline) return false
  return true
}

export const formatPickupDeadline = (deadline) => {
  const date = new Date(deadline)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}月${day}日 ${hours}:${minutes}`
}

export const getProductGroups = (groups, productId) => {
  return groups.filter(g => g.productId === productId)
}

export const sortGroupsByUrgency = (groups) => {
  return [...groups].sort((a, b) => {
    const timeA = a.status === GROUP_STATUS.ONGOING ? a.endTime - Date.now() : Infinity
    const timeB = b.status === GROUP_STATUS.ONGOING ? b.endTime - Date.now() : Infinity
    return timeA - timeB
  })
}

export const getOngoingGroups = (groups) => {
  return groups.filter(g => g.status === GROUP_STATUS.ONGOING)
}

export const getSuccessfulGroups = (groups) => {
  return groups.filter(g => g.status === GROUP_STATUS.SUCCESS)
}

export const getLeaderNickname = (group, leaders) => {
  const leader = group.members.find(m => m.isLeader)
  return leader ? leader.nickname : '未知团长'
}

export const isUserInGroup = (group, userId) => {
  if (!userId) return false
  return group.members.some(m => m.id === userId)
}

export const getGroupMemberCount = (group) => {
  return group.members.length
}

export const formatGroupDescription = (group) => {
  const leader = group.members.find(m => m.isLeader)
  const leaderName = leader ? leader.nickname : '团长'
  const remaining = getRemainingSlots(group.members.length, group.minGroupSize)
  if (group.status === GROUP_STATUS.SUCCESS) {
    return `${leaderName}的团，已成团`
  }
  if (group.status === GROUP_STATUS.FAILED) {
    return `${leaderName}的团，拼团失败`
  }
  return `${leaderName}的团，还差${remaining}人成团`
}

export const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

export const maskPhone = (phone) => {
  if (!phone || phone.length < 11) return phone || ''
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}
