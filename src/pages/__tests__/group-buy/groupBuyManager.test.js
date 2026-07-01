import { beforeEach, describe, expect, it } from 'vitest'
import { generateInitialGroups, MOCK_GROUP_LEADERS, MOCK_PICKUP_POINTS, MOCK_PRODUCTS } from '../../group-buy/data/mockData'
import { AFTER_SALE_STATUS, GROUP_STATUS, ORDER_STATUS, PICKUP_POINT_STATUS } from '../../group-buy/types'
import {
    applyAfterSale,
    calculateGroupProgress,
    canApplyAfterSale,
    canJoinGroup,
    canPickupOrder,
    checkGroupExpiry,
    completeOrder,
    createNewGroup,
    createOrder,
    formatCountdown,
    formatDate,
    formatGroupDescription,
    formatPickupDeadline,
    formatPrice,
    getAfterSaleStatusText,
    getGroupMemberCount,
    getGroupTimeRemaining,
    getOngoingGroups,
    getProductGroups,
    getRemainingSlots,
    getSuccessfulGroups,
    isPickupPointAvailable,
    isUserInGroup,
    joinGroup,
    maskPhone,
    pickupOrder,
    sortGroupsByUrgency,
    validatePickupSelection
} from '../../group-buy/utils/groupBuyManager'

const createMockGroup = (overrides = {}) => {
  const now = Date.now()
  return {
    id: 'test-group',
    productId: 'prod-1',
    leaderId: 'leader-1',
    members: [
      { id: 'mem-1', isLeader: true, nickname: '团长', joinTime: now - 1000 }
    ],
    minGroupSize: 5,
    startTime: now - 1000,
    endTime: now + 3600000,
    status: GROUP_STATUS.ONGOING,
    ...overrides
  }
}

const createMockOrder = (overrides = {}) => {
  return {
    id: 'test-order',
    productId: 'prod-1',
    productName: '测试商品',
    productSpec: '测试规格',
    groupId: 'group-1',
    groupStatus: GROUP_STATUS.SUCCESS,
    pickupPoint: {
      id: 'pickup-1',
      name: '测试提货点',
      address: '测试地址',
      businessHours: '08:00-20:00',
      contactPhone: '138****8888'
    },
    userInfo: { id: 'user-1', nickname: '测试用户' },
    quantity: 1,
    unitPrice: 39.9,
    totalPrice: 39.9,
    verificationCode: 'TEST1234',
    status: ORDER_STATUS.PAID,
    createdAt: Date.now(),
    pickupDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000,
    ...overrides
  }
}

describe('groupBuyManager - Format Functions', () => {
  describe('formatPrice', () => {
    it('should format price correctly', () => {
      expect(formatPrice(10)).toBe('¥10.00')
      expect(formatPrice(10.5)).toBe('¥10.50')
      expect(formatPrice(0)).toBe('¥0.00')
      expect(formatPrice(99.99)).toBe('¥99.99')
    })

    it('should handle floating point numbers', () => {
      expect(formatPrice(10.25)).toBe('¥10.25')
      expect(formatPrice(100.8)).toBe('¥100.80')
    })
  })

  describe('formatCountdown', () => {
    it('should format countdown correctly', () => {
      expect(formatCountdown(0)).toBe('已结束')
      expect(formatCountdown(-1000)).toBe('已结束')
      expect(formatCountdown(3661000)).toBe('01:01:01')
      expect(formatCountdown(61000)).toBe('00:01:01')
      expect(formatCountdown(1000)).toBe('00:00:01')
    })

    it('should pad with leading zeros', () => {
      expect(formatCountdown(3600000)).toBe('01:00:00')
      expect(formatCountdown(60000)).toBe('00:01:00')
      expect(formatCountdown(1000)).toBe('00:00:01')
    })
  })

  describe('formatPickupDeadline', () => {
    it('should format deadline correctly', () => {
      const testDate = new Date('2025-07-15T14:30:00').getTime()
      const result = formatPickupDeadline(testDate)
      expect(result).toContain('7月15日')
      expect(result).toContain('14:30')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const testDate = new Date('2025-07-15T14:30:00').getTime()
      const result = formatDate(testDate)
      expect(result).toBe('2025-07-15 14:30')
    })
  })

  describe('maskPhone', () => {
    it('should mask phone number correctly', () => {
      expect(maskPhone('13812348888')).toBe('138****8888')
    })

    it('should handle short phone numbers', () => {
      expect(maskPhone('12345')).toBe('12345')
      expect(maskPhone(null)).toBe('')
      expect(maskPhone(undefined)).toBe('')
    })
  })
})

describe('groupBuyManager - Group Progress Functions', () => {
  describe('calculateGroupProgress', () => {
    it('should calculate progress correctly', () => {
      expect(calculateGroupProgress(3, 10)).toBe(30)
      expect(calculateGroupProgress(5, 5)).toBe(100)
      expect(calculateGroupProgress(10, 5)).toBe(100)
      expect(calculateGroupProgress(0, 5)).toBe(0)
    })

    it('should handle invalid minGroupSize', () => {
      expect(calculateGroupProgress(5, 0)).toBe(0)
      expect(calculateGroupProgress(5, -1)).toBe(0)
    })
  })

  describe('getRemainingSlots', () => {
    it('should calculate remaining slots correctly', () => {
      expect(getRemainingSlots(3, 10)).toBe(7)
      expect(getRemainingSlots(5, 5)).toBe(0)
      expect(getRemainingSlots(10, 5)).toBe(0)
    })
  })

  describe('getGroupMemberCount', () => {
    it('should return correct member count', () => {
      const group = createMockGroup({
        members: [
          { id: '1', isLeader: true, nickname: 'A', joinTime: Date.now() },
          { id: '2', isLeader: false, nickname: 'B', joinTime: Date.now() }
        ]
      })
      expect(getGroupMemberCount(group)).toBe(2)
    })
  })
})

describe('groupBuyManager - Group Join/Create Functions', () => {
  describe('canJoinGroup', () => {
    it('should allow joining ongoing group with slots', () => {
      const group = createMockGroup()
      expect(canJoinGroup(group, 'new-user')).toBe(true)
    })

    it('should not allow joining non-ongoing group', () => {
      const group = createMockGroup({ status: GROUP_STATUS.SUCCESS })
      expect(canJoinGroup(group)).toBe(false)
    })

    it('should not allow joining full group', () => {
      const group = createMockGroup({
        members: Array.from({ length: 5 }, (_, i) => ({
          id: `mem-${i}`,
          isLeader: i === 0,
          nickname: `用户${i}`,
          joinTime: Date.now()
        }))
      })
      expect(canJoinGroup(group)).toBe(false)
    })

    it('should not allow joining expired group', () => {
      const group = createMockGroup({
        endTime: Date.now() - 1000
      })
      expect(canJoinGroup(group)).toBe(false)
    })

    it('should not allow same user to join twice', () => {
      const group = createMockGroup()
      expect(canJoinGroup(group, 'mem-1')).toBe(false)
    })
  })

  describe('createNewGroup', () => {
    it('should create a valid new group', () => {
      const product = MOCK_PRODUCTS[0]
      const leader = MOCK_GROUP_LEADERS[0]
      const group = createNewGroup(product, leader)

      expect(group.id).toMatch(/^group-/)
      expect(group.productId).toBe(product.id)
      expect(group.leaderId).toBe(leader.id)
      expect(group.minGroupSize).toBe(product.minGroupSize)
      expect(group.members.length).toBe(1)
      expect(group.members[0].isLeader).toBe(true)
      expect(group.members[0].nickname).toBe(leader.nickname)
      expect(group.status).toBe(GROUP_STATUS.ONGOING)
      expect(group.startTime).toBeLessThanOrEqual(Date.now())
      expect(group.endTime).toBeGreaterThan(Date.now())
    })

    it('should generate unique group ids with counter and random parts', () => {
      const product = MOCK_PRODUCTS[0]
      const leader = MOCK_GROUP_LEADERS[0]
      const ids = new Set()
      const memberIds = new Set()

      for (let i = 0; i < 50; i++) {
        const group = createNewGroup(product, leader)
        ids.add(group.id)
        memberIds.add(group.members[0].id)

        expect(group.id).toMatch(/^group-\d+-[0-9a-z]+-[0-9a-z]+$/)
        expect(group.members[0].id).toMatch(/^mem-\d+-[0-9a-z]+-[0-9a-z]+$/)
      }

      expect(ids.size).toBe(50)
      expect(memberIds.size).toBe(50)
    })
  })

  describe('joinGroup', () => {
    it('should add member to group successfully', () => {
      const group = createMockGroup()
      const result = joinGroup(group, { id: 'new-mem', nickname: '新用户' })

      expect(result.success).toBe(true)
      expect(result.group.members.length).toBe(2)
      expect(result.group.members[1].nickname).toBe('新用户')
      expect(result.group.members[1].isLeader).toBe(false)
    })

    it('should mark group as success when full', () => {
      const group = createMockGroup({
        minGroupSize: 2,
        members: [
          { id: 'mem-1', isLeader: true, nickname: '团长', joinTime: Date.now() }
        ]
      })
      const result = joinGroup(group, { id: 'mem-2', nickname: '新用户' })

      expect(result.success).toBe(true)
      expect(result.isGroupFull).toBe(true)
      expect(result.group.status).toBe(GROUP_STATUS.SUCCESS)
      expect(result.message).toContain('成团')
    })

    it('should fail to join invalid group', () => {
      const group = createMockGroup({ status: GROUP_STATUS.SUCCESS })
      const result = joinGroup(group, { id: 'new-mem', nickname: '新用户' })

      expect(result.success).toBe(false)
      expect(result.group).toBe(group)
    })

    it('should generate member id when not provided', () => {
      const group = createMockGroup()
      const result = joinGroup(group, { nickname: '匿名用户' })

      expect(result.success).toBe(true)
      expect(result.group.members[1].id).toMatch(/^mem-/)
    })

    it('should generate unique member ids across joins', () => {
      const memberIds = new Set()

      for (let i = 0; i < 30; i++) {
        const group = createMockGroup({
          members: [
            { id: `leader-${i}`, isLeader: true, nickname: '团长', joinTime: Date.now() }
          ]
        })
        const result = joinGroup(group, { nickname: `用户${i}` })
        expect(result.success).toBe(true)
        memberIds.add(result.group.members[1].id)
      }

      expect(memberIds.size).toBe(30)
    })
  })
})

describe('groupBuyManager - Group Expiry Functions', () => {
  describe('checkGroupExpiry', () => {
    it('should mark expired group as failed if not full', () => {
      const group = createMockGroup({
        endTime: Date.now() - 1000,
        status: GROUP_STATUS.ONGOING,
        members: [
          { id: 'mem-1', isLeader: true, nickname: '团长', joinTime: Date.now() }
        ],
        minGroupSize: 5
      })
      const result = checkGroupExpiry(group)
      expect(result.status).toBe(GROUP_STATUS.FAILED)
    })

    it('should mark expired group as success if full', () => {
      const group = createMockGroup({
        endTime: Date.now() - 1000,
        status: GROUP_STATUS.ONGOING,
        members: Array.from({ length: 5 }, (_, i) => ({
          id: `mem-${i}`,
          isLeader: i === 0,
          nickname: `用户${i}`,
          joinTime: Date.now()
        })),
        minGroupSize: 5
      })
      const result = checkGroupExpiry(group)
      expect(result.status).toBe(GROUP_STATUS.SUCCESS)
    })

    it('should not change status of non-ongoing group', () => {
      const group = createMockGroup({ status: GROUP_STATUS.SUCCESS })
      const result = checkGroupExpiry(group)
      expect(result.status).toBe(GROUP_STATUS.SUCCESS)
    })

    it('should not change status of unexpired group', () => {
      const group = createMockGroup()
      const result = checkGroupExpiry(group)
      expect(result.status).toBe(GROUP_STATUS.ONGOING)
    })
  })

  describe('getGroupTimeRemaining', () => {
    it('should return correct remaining time', () => {
      const futureTime = Date.now() + 5000
      const group = createMockGroup({ endTime: futureTime })
      const remaining = getGroupTimeRemaining(group)
      expect(remaining).toBeGreaterThan(0)
      expect(remaining).toBeLessThanOrEqual(5000)
    })

    it('should return 0 for non-ongoing group', () => {
      const group = createMockGroup({ status: GROUP_STATUS.SUCCESS })
      expect(getGroupTimeRemaining(group)).toBe(0)
    })
  })
})

describe('groupBuyManager - Pickup Point Functions', () => {
  describe('isPickupPointAvailable', () => {
    it('should return true for available pickup point', () => {
      const point = { ...MOCK_PICKUP_POINTS[0], status: PICKUP_POINT_STATUS.AVAILABLE }
      expect(isPickupPointAvailable(point)).toBe(true)
    })

    it('should return false for other statuses', () => {
      expect(isPickupPointAvailable({ status: PICKUP_POINT_STATUS.FULL })).toBe(false)
      expect(isPickupPointAvailable({ status: PICKUP_POINT_STATUS.CLOSED })).toBe(false)
    })
  })

  describe('validatePickupSelection', () => {
    it('should validate available pickup point', () => {
      const point = { ...MOCK_PICKUP_POINTS[0], status: PICKUP_POINT_STATUS.AVAILABLE }
      const result = validatePickupSelection(point)
      expect(result.valid).toBe(true)
    })

    it('should reject null pickup point', () => {
      const result = validatePickupSelection(null)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('选择')
    })

    it('should reject full pickup point', () => {
      const point = { status: PICKUP_POINT_STATUS.FULL }
      const result = validatePickupSelection(point)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('满')
    })

    it('should reject closed pickup point', () => {
      const point = { status: PICKUP_POINT_STATUS.CLOSED }
      const result = validatePickupSelection(point)
      expect(result.valid).toBe(false)
      expect(result.message).toContain('关闭')
    })
  })
})

describe('groupBuyManager - Order Functions', () => {
  const validPickup = { ...MOCK_PICKUP_POINTS[0], status: PICKUP_POINT_STATUS.AVAILABLE }
  const validProduct = MOCK_PRODUCTS[0]
  const validGroup = createMockGroup({ status: GROUP_STATUS.SUCCESS })

  describe('createOrder', () => {
    it('should create order successfully', () => {
      const result = createOrder(validProduct, validGroup, validPickup, { id: 'user-1', nickname: '用户' }, 2)

      expect(result.success).toBe(true)
      expect(result.order).toBeDefined()
      expect(result.order.id).toMatch(/^GB/)
      expect(result.order.verificationCode).toMatch(/^[0-9A-Z]{8}$/)
      expect(result.order.quantity).toBe(2)
      expect(result.order.unitPrice).toBe(validProduct.groupPrice)
      expect(result.order.totalPrice).toBeCloseTo(validProduct.groupPrice * 2)
      expect(result.order.status).toBe(ORDER_STATUS.PAID)
      expect(result.order.pickupPoint.id).toBe(validPickup.id)
    })

    it('should fail with invalid pickup point', () => {
      const result = createOrder(validProduct, validGroup, { status: PICKUP_POINT_STATUS.CLOSED }, {})
      expect(result.success).toBe(false)
      expect(result.message).toBeDefined()
    })

    it('should fail with failed/ended group', () => {
      const failedGroup = createMockGroup({ status: GROUP_STATUS.FAILED })
      const result = createOrder(validProduct, failedGroup, validPickup, {})
      expect(result.success).toBe(false)
    })

    it('should fail when quantity is zero or negative', () => {
      const result1 = createOrder(validProduct, validGroup, validPickup, {}, 0)
      expect(result1.success).toBe(false)
      expect(result1.message).toContain('大于0')

      const result2 = createOrder(validProduct, validGroup, validPickup, {}, -5)
      expect(result2.success).toBe(false)
    })

    it('should fail when product stock is zero', () => {
      const noStockProduct = { ...validProduct, stock: 0 }
      const result = createOrder(noStockProduct, validGroup, validPickup, {}, 1)
      expect(result.success).toBe(false)
      expect(result.message).toContain('售罄')
    })

    it('should fail when quantity exceeds stock', () => {
      const lowStockProduct = { ...validProduct, stock: 3 }
      const result = createOrder(lowStockProduct, validGroup, validPickup, {}, 5)
      expect(result.success).toBe(false)
      expect(result.message).toContain('库存不足')
      expect(result.message).toContain('3')
    })

    it('should calculate remaining stock correctly after order', () => {
      const stockProduct = { ...validProduct, stock: 10 }
      const result = createOrder(stockProduct, validGroup, validPickup, {}, 3)
      expect(result.success).toBe(true)
      expect(result.order.remainingStock).toBe(7)
    })
  })

  describe('pickupOrder', () => {
    it('should mark order as picked up', () => {
      const order = createMockOrder()
      const result = pickupOrder(order)

      expect(result.success).toBe(true)
      expect(result.order.status).toBe(ORDER_STATUS.PICKED_UP)
      expect(result.order.pickedUpAt).toBeDefined()
    })

    it('should not pickup non-paid order', () => {
      const order = createMockOrder({ status: ORDER_STATUS.COMPLETED })
      const result = pickupOrder(order)
      expect(result.success).toBe(false)
    })

    it('should not pickup after deadline', () => {
      const order = createMockOrder({ pickupDeadline: Date.now() - 1000 })
      const result = pickupOrder(order)
      expect(result.success).toBe(false)
      expect(result.message).toContain('时间已过')
    })
  })

  describe('completeOrder', () => {
    it('should complete picked up order', () => {
      const order = createMockOrder({ status: ORDER_STATUS.PICKED_UP })
      const result = completeOrder(order)

      expect(result.success).toBe(true)
      expect(result.order.status).toBe(ORDER_STATUS.COMPLETED)
      expect(result.order.completedAt).toBeDefined()
    })

    it('should not complete non-picked-up order', () => {
      const order = createMockOrder({ status: ORDER_STATUS.PAID })
      const result = completeOrder(order)
      expect(result.success).toBe(false)
    })
  })

  describe('canPickupOrder', () => {
    it('should allow pickup of valid paid order', () => {
      const order = createMockOrder()
      expect(canPickupOrder(order)).toBe(true)
    })

    it('should not pickup other statuses', () => {
      expect(canPickupOrder(createMockOrder({ status: ORDER_STATUS.PICKED_UP }))).toBe(false)
      expect(canPickupOrder(createMockOrder({ status: ORDER_STATUS.COMPLETED }))).toBe(false)
    })

    it('should not pickup expired order', () => {
      const order = createMockOrder({ pickupDeadline: Date.now() - 1000 })
      expect(canPickupOrder(order)).toBe(false)
    })
  })
})

describe('groupBuyManager - After Sale Functions', () => {
  describe('canApplyAfterSale', () => {
    it('should allow after sale for paid and picked_up orders', () => {
      expect(canApplyAfterSale(createMockOrder({ status: ORDER_STATUS.PAID }))).toBe(true)
      expect(canApplyAfterSale(createMockOrder({ status: ORDER_STATUS.PICKED_UP }))).toBe(true)
    })

    it('should not allow after sale for other statuses', () => {
      expect(canApplyAfterSale(createMockOrder({ status: ORDER_STATUS.COMPLETED }))).toBe(false)
      expect(canApplyAfterSale(createMockOrder({ status: ORDER_STATUS.CANCELLED }))).toBe(false)
    })
  })

  describe('applyAfterSale', () => {
    it('should apply after sale successfully', () => {
      const order = createMockOrder()
      const result = applyAfterSale(order, 'reason-1', '商品质量问题', '描述')

      expect(result.success).toBe(true)
      expect(result.afterSale).toBeDefined()
      expect(result.afterSale.id).toMatch(/^AS/)
      expect(result.afterSale.orderId).toBe(order.id)
      expect(result.afterSale.reasonText).toBe('商品质量问题')
      expect(result.afterSale.status).toBe(AFTER_SALE_STATUS.PENDING)
      expect(result.afterSale.refundAmount).toBe(order.totalPrice)
      expect(result.updatedOrder.status).toBe(ORDER_STATUS.AFTER_SALE)
    })

    it('should fail with invalid order status', () => {
      const order = createMockOrder({ status: ORDER_STATUS.COMPLETED })
      const result = applyAfterSale(order, 'reason-1', '原因')
      expect(result.success).toBe(false)
    })

    it('should fail without reason', () => {
      const order = createMockOrder()
      const result = applyAfterSale(order, null, '', '')
      expect(result.success).toBe(false)
      expect(result.message).toContain('原因')
    })
  })

  describe('getAfterSaleStatusText', () => {
    it('should return correct status text', () => {
      expect(getAfterSaleStatusText(AFTER_SALE_STATUS.PENDING)).toContain('客服正在处理')
      expect(getAfterSaleStatusText(AFTER_SALE_STATUS.PROCESSING)).toContain('处理中')
      expect(getAfterSaleStatusText(AFTER_SALE_STATUS.COMPLETED)).toContain('完成')
      expect(getAfterSaleStatusText(AFTER_SALE_STATUS.REJECTED)).toContain('拒绝')
    })
  })
})

describe('groupBuyManager - Group Query Functions', () => {
  let allGroups

  beforeEach(() => {
    allGroups = generateInitialGroups()
  })

  describe('getProductGroups', () => {
    it('should filter groups by product id', () => {
      const productGroups = getProductGroups(allGroups, allGroups[0].productId)
      productGroups.forEach(g => {
        expect(g.productId).toBe(allGroups[0].productId)
      })
    })

    it('should return empty array for unknown product', () => {
      expect(getProductGroups(allGroups, 'unknown-id')).toEqual([])
    })
  })

  describe('getOngoingGroups', () => {
    it('should filter only ongoing groups', () => {
      const ongoing = getOngoingGroups(allGroups)
      ongoing.forEach(g => {
        expect(g.status).toBe(GROUP_STATUS.ONGOING)
      })
    })
  })

  describe('getSuccessfulGroups', () => {
    it('should filter only successful groups', () => {
      const successful = getSuccessfulGroups(allGroups)
      successful.forEach(g => {
        expect(g.status).toBe(GROUP_STATUS.SUCCESS)
      })
    })
  })

  describe('sortGroupsByUrgency', () => {
    it('should sort groups by remaining time ascending', () => {
      const sorted = sortGroupsByUrgency(allGroups)
      const ongoingSorted = sorted.filter(g => g.status === GROUP_STATUS.ONGOING)

      for (let i = 0; i < ongoingSorted.length - 1; i++) {
        const timeA = ongoingSorted[i].endTime - Date.now()
        const timeB = ongoingSorted[i + 1].endTime - Date.now()
        expect(timeA).toBeLessThanOrEqual(timeB)
      }
    })
  })

  describe('isUserInGroup', () => {
    it('should detect user in group', () => {
      const group = createMockGroup()
      expect(isUserInGroup(group, 'mem-1')).toBe(true)
      expect(isUserInGroup(group, 'unknown')).toBe(false)
    })

    it('should handle null user id', () => {
      const group = createMockGroup()
      expect(isUserInGroup(group, null)).toBe(false)
    })
  })

  describe('formatGroupDescription', () => {
    it('should format description for ongoing group', () => {
      const group = createMockGroup({
        members: [
          { id: 'mem-1', isLeader: true, nickname: '团长小王', joinTime: Date.now() }
        ],
        minGroupSize: 5
      })
      const desc = formatGroupDescription(group)
      expect(desc).toContain('团长小王')
      expect(desc).toContain('4')
    })

    it('should format description for successful group', () => {
      const group = createMockGroup({
        status: GROUP_STATUS.SUCCESS,
        members: [
          { id: 'mem-1', isLeader: true, nickname: '团长小王', joinTime: Date.now() }
        ]
      })
      const desc = formatGroupDescription(group)
      expect(desc).toContain('已成团')
    })

    it('should format description for failed group', () => {
      const group = createMockGroup({
        status: GROUP_STATUS.FAILED,
        members: [
          { id: 'mem-1', isLeader: true, nickname: '团长小王', joinTime: Date.now() }
        ]
      })
      const desc = formatGroupDescription(group)
      expect(desc).toContain('拼团失败')
    })
  })
})
