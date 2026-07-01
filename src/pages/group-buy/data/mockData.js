import { GROUP_STATUS, PICKUP_POINT_STATUS, PRODUCT_STATUS } from '../types'

const TWO_HOURS = 2 * 60 * 60 * 1000
const ONE_HOUR = 60 * 60 * 1000
const THIRTY_MINUTES = 30 * 60 * 1000

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    name: '新西兰进口奇异果',
    spec: '12个装 / 单果约120g',
    groupPrice: 39.9,
    originalPrice: 68,
    stock: 500,
    minGroupSize: 5,
    status: PRODUCT_STATUS.ON_SALE,
    image: '',
    description: '新西兰进口黄金奇异果，果肉金黄，酸甜可口，富含维生素C'
  },
  {
    id: 'prod-2',
    name: '山东烟台红富士苹果',
    spec: '5斤装 / 约10-12个',
    groupPrice: 29.9,
    originalPrice: 45,
    stock: 300,
    minGroupSize: 3,
    status: PRODUCT_STATUS.ON_SALE,
    image: '',
    description: '正宗烟台红富士，脆甜多汁，果型端正，产地直供'
  },
  {
    id: 'prod-3',
    name: '海南金钻凤梨',
    spec: '2个装 / 单果约1.5kg',
    groupPrice: 45.8,
    originalPrice: 78,
    stock: 0,
    minGroupSize: 4,
    status: PRODUCT_STATUS.SOLD_OUT,
    image: '',
    description: '海南金钻凤梨，无需挖眼，香甜多汁，自然成熟'
  },
  {
    id: 'prod-4',
    name: '云南高原蓝莓',
    spec: '4盒 / 每盒125g',
    groupPrice: 59.9,
    originalPrice: 99,
    stock: 200,
    minGroupSize: 6,
    status: PRODUCT_STATUS.ON_SALE,
    image: '',
    description: '云南高原种植，果粒饱满，花青素丰富，酸甜适中'
  },
  {
    id: 'prod-5',
    name: '四川丑橘',
    spec: '8斤装 / 约15-18个',
    groupPrice: 36.8,
    originalPrice: 58,
    stock: 400,
    minGroupSize: 3,
    status: PRODUCT_STATUS.ON_SALE,
    image: '',
    description: '四川不知火丑橘，果肉脆嫩，化渣多汁，甜度高'
  },
  {
    id: 'prod-6',
    name: '智利进口车厘子',
    spec: '2斤装 / J级大果',
    groupPrice: 89.9,
    originalPrice: 158,
    stock: 0,
    minGroupSize: 5,
    status: PRODUCT_STATUS.OFF_SHELF,
    image: '',
    description: '智利进口JJ级车厘子，果大核小，脆甜爽口'
  }
]

export const MOCK_GROUP_LEADERS = [
  {
    id: 'leader-1',
    nickname: '水果达人小王',
    phone: '138****6688',
    avatar: '',
    storeName: '小王优选生鲜店',
    storeDescription: '专注优质水果10年，产地直采，品质保证',
    totalGroups: 156,
    successRate: 98
  },
  {
    id: 'leader-2',
    nickname: '健康生活李姐',
    phone: '139****8899',
    avatar: '',
    storeName: '李姐健康生活馆',
    storeDescription: '精选优质生鲜，服务社区居民，满意100%',
    totalGroups: 203,
    successRate: 99
  },
  {
    id: 'leader-3',
    nickname: '美食家老张',
    phone: '136****3322',
    avatar: '',
    storeName: '老张品质食材铺',
    storeDescription: '只做高品质食材，每一样都亲自挑选',
    totalGroups: 89,
    successRate: 96
  }
]

export const generateInitialGroups = () => {
  const now = Date.now()
  return [
    {
      id: 'group-1',
      productId: 'prod-1',
      leaderId: 'leader-1',
      members: [
        { id: 'mem-1', isLeader: true, nickname: '水果达人小王', joinTime: now - THIRTY_MINUTES },
        { id: 'mem-2', isLeader: false, nickname: '社区居民A', joinTime: now - TWENTY_MINUTES() },
        { id: 'mem-3', isLeader: false, nickname: '美食爱好者', joinTime: now - TEN_MINUTES() }
      ],
      minGroupSize: 5,
      startTime: now - THIRTY_MINUTES,
      endTime: now + ONE_HOUR * 1.5,
      status: GROUP_STATUS.ONGOING
    },
    {
      id: 'group-2',
      productId: 'prod-2',
      leaderId: 'leader-2',
      members: [
        { id: 'mem-4', isLeader: true, nickname: '健康生活李姐', joinTime: now - ONE_HOUR },
        { id: 'mem-5', isLeader: false, nickname: '小李', joinTime: now - FORTY_MINUTES() },
        { id: 'mem-6', isLeader: false, nickname: '水果控', joinTime: now - THIRTY_MINUTES - TEN_MINUTES() }
      ],
      minGroupSize: 3,
      startTime: now - ONE_HOUR,
      endTime: now + TWO_HOURS,
      status: GROUP_STATUS.ONGOING
    },
    {
      id: 'group-3',
      productId: 'prod-4',
      leaderId: 'leader-3',
      members: [
        { id: 'mem-7', isLeader: true, nickname: '美食家老张', joinTime: now - FORTY_FIVE_MINUTES() },
        { id: 'mem-8', isLeader: false, nickname: '蓝莓爱好者', joinTime: now - THIRTY_MINUTES },
        { id: 'mem-9', isLeader: false, nickname: '养生达人', joinTime: now - TEN_MINUTES() },
        { id: 'mem-10', isLeader: false, nickname: '新用户123', joinTime: now - FIVE_MINUTES() }
      ],
      minGroupSize: 6,
      startTime: now - FORTY_FIVE_MINUTES(),
      endTime: now + ONE_HOUR,
      status: GROUP_STATUS.ONGOING
    },
    {
      id: 'group-4',
      productId: 'prod-5',
      leaderId: 'leader-1',
      members: [
        { id: 'mem-11', isLeader: true, nickname: '水果达人小王', joinTime: now - ONE_HOUR * 2 },
        { id: 'mem-12', isLeader: false, nickname: '丑橘粉丝', joinTime: now - ONE_HOUR * 2 + FIVE_MINUTES() },
        { id: 'mem-13', isLeader: false, nickname: '爱吃水果', joinTime: now - ONE_HOUR * 2 + TEN_MINUTES() }
      ],
      minGroupSize: 3,
      startTime: now - ONE_HOUR * 2,
      endTime: now - THIRTY_MINUTES,
      status: GROUP_STATUS.SUCCESS
    },
    {
      id: 'group-5',
      productId: 'prod-1',
      leaderId: 'leader-2',
      members: [
        { id: 'mem-14', isLeader: true, nickname: '健康生活李姐', joinTime: now - TWO_HOURS }
      ],
      minGroupSize: 5,
      startTime: now - TWO_HOURS,
      endTime: now - TEN_MINUTES(),
      status: GROUP_STATUS.FAILED
    }
  ]
}

function TWENTY_MINUTES() { return 20 * 60 * 1000 }
function TEN_MINUTES() { return 10 * 60 * 1000 }
function FORTY_MINUTES() { return 40 * 60 * 1000 }
function FORTY_FIVE_MINUTES() { return 45 * 60 * 1000 }
function FIVE_MINUTES() { return 5 * 60 * 1000 }

export const MOCK_PICKUP_POINTS = [
  {
    id: 'pickup-1',
    name: '小王优选生鲜店（建国路店）',
    address: '北京市朝阳区建国路88号SOHO现代城A座底商101',
    businessHours: '08:00 - 21:00',
    status: PICKUP_POINT_STATUS.AVAILABLE,
    distance: '0.5km',
    contactPhone: '138****6688'
  },
  {
    id: 'pickup-2',
    name: '李姐健康生活馆（中关村店）',
    address: '北京市海淀区中关村大街1号海龙大厦B1层',
    businessHours: '09:00 - 20:30',
    status: PICKUP_POINT_STATUS.AVAILABLE,
    distance: '2.3km',
    contactPhone: '139****8899'
  },
  {
    id: 'pickup-3',
    name: '老张品质食材铺（金融街店）',
    address: '北京市西城区金融街15号鑫茂大厦底商',
    businessHours: '08:30 - 20:00',
    status: PICKUP_POINT_STATUS.FULL,
    distance: '3.8km',
    contactPhone: '136****3322'
  },
  {
    id: 'pickup-4',
    name: '便民自提点（望京店）',
    address: '北京市朝阳区望京SOHO T1座快递驿站',
    businessHours: '10:00 - 19:00',
    status: PICKUP_POINT_STATUS.CLOSED,
    distance: '5.2km',
    contactPhone: '137****5566'
  }
]

export const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `GB${timestamp}${random}`
}

export const generateVerificationCode = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export const generateAfterSaleId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 4).toUpperCase()
  return `AS${timestamp}${random}`
}
