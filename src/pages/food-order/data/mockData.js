export const MOCK_CATEGORIES = [
  { id: 'cat-1', name: '热销推荐' },
  { id: 'cat-2', name: '超值套餐' },
  { id: 'cat-3', name: '主食' },
  { id: 'cat-4', name: '小吃' },
  { id: 'cat-5', name: '饮品' },
  { id: 'cat-6', name: '甜点' }
]

export const MOCK_PRODUCTS = [
  {
    id: 'prod-1',
    categoryId: 'cat-1',
    name: '招牌红烧肉饭',
    description: '精选五花肉，秘制酱汁，肥而不腻',
    image: '',
    price: 28,
    originalPrice: 35,
    sales: 999,
    stock: 50,
    soldOut: false,
    hasSpecs: false
  },
  {
    id: 'prod-2',
    categoryId: 'cat-1',
    name: '香辣鸡腿堡套餐',
    description: '香辣鸡腿堡+薯条+可乐',
    image: '',
    price: 35,
    originalPrice: 45,
    sales: 856,
    stock: 30,
    soldOut: false,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-size',
        name: '套餐规格',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-1', name: '单人餐', price: 0 },
          { id: 'opt-2', name: '双人餐', price: 25 },
          { id: 'opt-3', name: '家庭餐', price: 50 }
        ]
      },
      {
        id: 'spec-spicy',
        name: '辣度',
        type: 'single',
        required: false,
        options: [
          { id: 'opt-4', name: '不辣', price: 0 },
          { id: 'opt-5', name: '微辣', price: 0 },
          { id: 'opt-6', name: '中辣', price: 0 },
          { id: 'opt-7', name: '特辣', price: 0 }
        ]
      },
      {
        id: 'spec-addon',
        name: '加料',
        type: 'multiple',
        required: false,
        options: [
          { id: 'opt-8', name: '加芝士', price: 5 },
          { id: 'opt-9', name: '加培根', price: 6 },
          { id: 'opt-10', name: '加蛋', price: 3 }
        ]
      }
    ]
  },
  {
    id: 'prod-3',
    categoryId: 'cat-2',
    name: '商务午餐套餐',
    description: '主菜+配菜+汤品+饮料',
    image: '',
    price: 45,
    originalPrice: 58,
    sales: 520,
    stock: 20,
    soldOut: false,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-main',
        name: '主菜选择',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-11', name: '黑椒牛柳', price: 0 },
          { id: 'opt-12', name: '香煎鸡排', price: 0 },
          { id: 'opt-13', name: '清蒸鲈鱼', price: 10 }
        ]
      },
      {
        id: 'spec-soup',
        name: '汤品',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-14', name: '番茄蛋汤', price: 0 },
          { id: 'opt-15', name: '紫菜蛋花汤', price: 0 },
          { id: 'opt-16', name: '玉米排骨汤', price: 5 }
        ]
      }
    ]
  },
  {
    id: 'prod-4',
    categoryId: 'cat-3',
    name: '扬州炒饭',
    description: '经典扬州风味，粒粒分明',
    image: '',
    price: 18,
    originalPrice: 22,
    sales: 680,
    stock: 100,
    soldOut: false,
    hasSpecs: false
  },
  {
    id: 'prod-5',
    categoryId: 'cat-3',
    name: '牛肉拉面',
    description: '手工拉面，大片牛肉',
    image: '',
    price: 25,
    originalPrice: 30,
    sales: 750,
    stock: 0,
    soldOut: true,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-noodle',
        name: '面型',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-17', name: '细面', price: 0 },
          { id: 'opt-18', name: '粗面', price: 0 },
          { id: 'opt-19', name: '宽面', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'prod-6',
    categoryId: 'cat-4',
    name: '香酥鸡翅',
    description: '外酥里嫩，6只装',
    image: '',
    price: 20,
    originalPrice: 25,
    sales: 890,
    stock: 40,
    soldOut: false,
    hasSpecs: false
  },
  {
    id: 'prod-7',
    categoryId: 'cat-4',
    name: '黄金薯条',
    description: '现炸金黄酥脆',
    image: '',
    price: 12,
    originalPrice: 15,
    sales: 1200,
    stock: 60,
    soldOut: false,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-size',
        name: '份量',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-20', name: '小份', price: 0 },
          { id: 'opt-21', name: '中份', price: 5 },
          { id: 'opt-22', name: '大份', price: 10 }
        ]
      }
    ]
  },
  {
    id: 'prod-8',
    categoryId: 'cat-5',
    name: '珍珠奶茶',
    description: '香浓奶茶，Q弹珍珠',
    image: '',
    price: 15,
    originalPrice: 18,
    sales: 2000,
    stock: 80,
    soldOut: false,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-temp',
        name: '温度',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-23', name: '热', price: 0 },
          { id: 'opt-24', name: '温', price: 0 },
          { id: 'opt-25', name: '冰', price: 0 }
        ]
      },
      {
        id: 'spec-sugar',
        name: '糖度',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-26', name: '无糖', price: 0 },
          { id: 'opt-27', name: '三分糖', price: 0 },
          { id: 'opt-28', name: '五分糖', price: 0 },
          { id: 'opt-29', name: '七分糖', price: 0 },
          { id: 'opt-30', name: '全糖', price: 0 }
        ]
      },
      {
        id: 'spec-size',
        name: '杯型',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-31', name: '中杯', price: 0 },
          { id: 'opt-32', name: '大杯', price: 5 }
        ]
      }
    ]
  },
  {
    id: 'prod-9',
    categoryId: 'cat-5',
    name: '美式咖啡',
    description: '现磨咖啡豆，香醇浓郁',
    image: '',
    price: 18,
    originalPrice: 22,
    sales: 560,
    stock: 45,
    soldOut: false,
    hasSpecs: true,
    specGroups: [
      {
        id: 'spec-size',
        name: '杯型',
        type: 'single',
        required: true,
        options: [
          { id: 'opt-33', name: '中杯', price: 0 },
          { id: 'opt-34', name: '大杯', price: 5 },
          { id: 'opt-35', name: '超大杯', price: 10 }
        ]
      }
    ]
  },
  {
    id: 'prod-10',
    categoryId: 'cat-6',
    name: '提拉米苏',
    description: '意式经典甜品',
    image: '',
    price: 28,
    originalPrice: 35,
    sales: 340,
    stock: 15,
    soldOut: false,
    hasSpecs: false
  },
  {
    id: 'prod-11',
    categoryId: 'cat-6',
    name: '芒果班戟',
    description: '新鲜芒果，奶油绵密',
    image: '',
    price: 22,
    originalPrice: 28,
    sales: 450,
    stock: 25,
    soldOut: false,
    hasSpecs: false
  }
]

export const MOCK_DISCOUNT_RULES = [
  { id: 'discount-1', minAmount: 20, discount: 5, description: '满20减5' },
  { id: 'discount-2', minAmount: 40, discount: 12, description: '满40减12' },
  { id: 'discount-3', minAmount: 60, discount: 20, description: '满60减20' },
  { id: 'discount-4', minAmount: 100, discount: 35, description: '满100减35' }
]

export const MOCK_ADDRESSES = [
  {
    id: 'addr-1',
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '朝阳区',
    detail: '建国路88号SOHO现代城A座1201室',
    isDefault: true,
    tag: '公司'
  },
  {
    id: 'addr-2',
    name: '张三',
    phone: '138****8888',
    province: '北京市',
    city: '北京市',
    district: '海淀区',
    detail: '中关村大街1号海龙大厦15层1503',
    isDefault: false,
    tag: '家'
  },
  {
    id: 'addr-3',
    name: '李四',
    phone: '139****9999',
    province: '北京市',
    city: '北京市',
    district: '西城区',
    detail: '金融街15号鑫茂大厦8层',
    isDefault: false,
    tag: ''
  }
]

export const MOCK_STORE_INFO = {
  id: 'store-001',
  name: '美味轩餐厅',
  logo: '',
  deliveryFee: 5,
  minOrderAmount: 30,
  estimatedDeliveryTime: '30-45分钟',
  rating: 4.8,
  monthlySales: 5680
}

export const generateOrderId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 6).toUpperCase()
  return `FD${timestamp}${random}`
}
