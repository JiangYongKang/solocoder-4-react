import { describe, it, expect } from 'vitest'
import {
  formatDate,
  getDateStr,
  getTimePeriod,
  filterFlights,
  sortFlights,
  calculateOrderPrice,
  generateOrderNo
} from '../../flights/utils/helpers'

const mockFlights = [
  {
    id: 'f1',
    flightNo: 'CA1001',
    airlineCode: 'CA',
    departureTime: '06:30',
    arrivalTime: '09:15',
    duration: 165,
    onTimeRate: 95,
    isDirect: true,
    cabins: [
      { type: 'economy', name: '经济舱', price: 680 },
      { type: 'premium', name: '超级经济舱', price: 1020 },
      { type: 'business', name: '公务舱', price: 2040 }
    ]
  },
  {
    id: 'f2',
    flightNo: 'MU2002',
    airlineCode: 'MU',
    departureTime: '13:50',
    arrivalTime: '16:35',
    duration: 165,
    onTimeRate: 88,
    isDirect: false,
    cabins: [
      { type: 'economy', name: '经济舱', price: 520 },
      { type: 'premium', name: '超级经济舱', price: 780 },
      { type: 'business', name: '公务舱', price: 1560 }
    ]
  },
  {
    id: 'f3',
    flightNo: 'CZ3003',
    airlineCode: 'CZ',
    departureTime: '19:45',
    arrivalTime: '22:30',
    duration: 165,
    onTimeRate: 92,
    isDirect: true,
    cabins: [
      { type: 'economy', name: '经济舱', price: 880 },
      { type: 'premium', name: '超级经济舱', price: 1320 },
      { type: 'business', name: '公务舱', price: 2640 }
    ]
  },
  {
    id: 'f4',
    flightNo: 'HU4004',
    airlineCode: 'HU',
    departureTime: '23:30',
    arrivalTime: '02:15',
    duration: 165,
    onTimeRate: 75,
    isDirect: true,
    cabins: [
      { type: 'economy', name: '经济舱', price: 450 },
      { type: 'premium', name: '超级经济舱', price: 675 },
      { type: 'business', name: '公务舱', price: 1350 }
    ]
  }
]

describe('formatDate', () => {
  it('应该正确格式化日期为YYYY-MM-DD 周X格式', () => {
    const result = formatDate('2025-07-01')
    expect(result).toMatch(/^2025-07-01 周[一二三四五六日]$/)
  })

  it('2025-07-01 应该是周二', () => {
    const result = formatDate('2025-07-01')
    expect(result).toBe('2025-07-01 周二')
  })

  it('2025-07-06 应该是周日', () => {
    const result = formatDate('2025-07-06')
    expect(result).toBe('2025-07-06 周日')
  })
})

describe('getDateStr', () => {
  it('offset为0应返回今天日期', () => {
    const result = getDateStr(0)
    const today = new Date().toISOString().split('T')[0]
    expect(result).toBe(today)
  })

  it('offset为正数应返回未来日期', () => {
    const result = getDateStr(3)
    const expected = new Date()
    expected.setDate(expected.getDate() + 3)
    expect(result).toBe(expected.toISOString().split('T')[0])
  })

  it('offset为负数应返回过去日期', () => {
    const result = getDateStr(-1)
    const expected = new Date()
    expected.setDate(expected.getDate() - 1)
    expect(result).toBe(expected.toISOString().split('T')[0])
  })
})

describe('getTimePeriod', () => {
  it('上午时段 06:00-12:00', () => {
    expect(getTimePeriod('06:30')).toBe('morning')
    expect(getTimePeriod('08:00')).toBe('morning')
    expect(getTimePeriod('11:59')).toBe('morning')
  })

  it('下午时段 12:00-18:00', () => {
    expect(getTimePeriod('12:00')).toBe('afternoon')
    expect(getTimePeriod('14:30')).toBe('afternoon')
    expect(getTimePeriod('17:59')).toBe('afternoon')
  })

  it('晚上时段 18:00-24:00', () => {
    expect(getTimePeriod('18:00')).toBe('evening')
    expect(getTimePeriod('20:30')).toBe('evening')
    expect(getTimePeriod('23:59')).toBe('evening')
  })

  it('凌晨时段 00:00-06:00', () => {
    expect(getTimePeriod('00:00')).toBe('night')
    expect(getTimePeriod('02:30')).toBe('night')
    expect(getTimePeriod('05:59')).toBe('night')
  })
})

describe('filterFlights', () => {
  it('无筛选条件时应返回全部航班', () => {
    const result = filterFlights(mockFlights, {})
    expect(result.length).toBe(4)
  })

  it('按上午时段筛选', () => {
    const result = filterFlights(mockFlights, { timePeriods: ['morning'] })
    expect(result.length).toBe(1)
    expect(result[0].id).toBe('f1')
  })

  it('按下午和晚上时段筛选', () => {
    const result = filterFlights(mockFlights, { timePeriods: ['afternoon', 'evening'] })
    expect(result.length).toBe(3)
    expect(result.map(f => f.id)).toContain('f2')
    expect(result.map(f => f.id)).toContain('f3')
    expect(result.map(f => f.id)).toContain('f4')
  })

  it('按单个航司筛选', () => {
    const result = filterFlights(mockFlights, { airlines: ['CA'] })
    expect(result.length).toBe(1)
    expect(result[0].airlineCode).toBe('CA')
  })

  it('按多个航司筛选', () => {
    const result = filterFlights(mockFlights, { airlines: ['CA', 'MU'] })
    expect(result.length).toBe(2)
    expect(result.every(f => ['CA', 'MU'].includes(f.airlineCode))).toBe(true)
  })

  it('按价格区间最小值筛选', () => {
    const result = filterFlights(mockFlights, { priceRange: { min: 700 } })
    expect(result.every(f => Math.min(...f.cabins.map(c => c.price)) >= 700)).toBe(true)
    expect(result.length).toBe(1)
  })

  it('按价格区间最大值筛选', () => {
    const result = filterFlights(mockFlights, { priceRange: { max: 600 } })
    expect(result.every(f => Math.min(...f.cabins.map(c => c.price)) <= 600)).toBe(true)
    expect(result.length).toBe(2)
  })

  it('按价格区间范围筛选', () => {
    const result = filterFlights(mockFlights, { priceRange: { min: 500, max: 700 } })
    expect(result.every(f => {
      const minPrice = Math.min(...f.cabins.map(c => c.price))
      return minPrice >= 500 && minPrice <= 700
    })).toBe(true)
  })

  it('仅看直飞', () => {
    const result = filterFlights(mockFlights, { directOnly: true })
    expect(result.length).toBe(3)
    expect(result.every(f => f.isDirect)).toBe(true)
  })

  it('组合筛选：直飞 + 国航', () => {
    const result = filterFlights(mockFlights, { directOnly: true, airlines: ['CA'] })
    expect(result.length).toBe(1)
    expect(result[0].isDirect).toBe(true)
    expect(result[0].airlineCode).toBe('CA')
  })

  it('组合筛选：晚上时段 + 价格上限900', () => {
    const result = filterFlights(mockFlights, {
      timePeriods: ['evening'],
      priceRange: { max: 900 }
    })
    expect(result.every(f => {
      const period = getTimePeriod(f.departureTime)
      const minPrice = Math.min(...f.cabins.map(c => c.price))
      return period === 'evening' && minPrice <= 900
    })).toBe(true)
  })
})

describe('sortFlights', () => {
  it('推荐排序应保持原顺序', () => {
    const result = sortFlights(mockFlights, 'recommend')
    expect(result.map(f => f.id)).toEqual(['f1', 'f2', 'f3', 'f4'])
  })

  it('价格从低到高排序', () => {
    const result = sortFlights(mockFlights, 'price_asc')
    const prices = result.map(f => Math.min(...f.cabins.map(c => c.price)))
    expect(prices).toEqual([450, 520, 680, 880])
  })

  it('价格从高到低排序', () => {
    const result = sortFlights(mockFlights, 'price_desc')
    const prices = result.map(f => Math.min(...f.cabins.map(c => c.price)))
    expect(prices).toEqual([880, 680, 520, 450])
  })

  it('起飞时间从早到晚排序', () => {
    const result = sortFlights(mockFlights, 'time_asc')
    const times = result.map(f => f.departureTime)
    const sorted = [...times].sort((a, b) => a.localeCompare(b))
    expect(times).toEqual(sorted)
  })

  it('起飞时间从晚到早排序', () => {
    const result = sortFlights(mockFlights, 'time_desc')
    const times = result.map(f => f.departureTime)
    const sorted = [...times].sort((a, b) => b.localeCompare(a))
    expect(times).toEqual(sorted)
  })

  it('飞行时长从短到长排序（相同时长保持原顺序）', () => {
    const result = sortFlights(mockFlights, 'duration_asc')
    expect(result.length).toBe(4)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].duration).toBeGreaterThanOrEqual(result[i - 1].duration)
    }
  })

  it('准点率从高到低排序', () => {
    const result = sortFlights(mockFlights, 'ontime_desc')
    const rates = result.map(f => f.onTimeRate)
    expect(rates).toEqual([95, 92, 88, 75])
  })
})

describe('calculateOrderPrice', () => {
  const mockSelections = [
    {
      type: 'departure',
      flight: mockFlights[0],
      cabin: { type: 'economy', name: '经济舱', price: 680 }
    }
  ]

  const mockPassengers = [
    { id: 'p1', name: '张三' },
    { id: 'p2', name: '李四' }
  ]

  it('单程2人经济舱价格计算', () => {
    const result = calculateOrderPrice(mockSelections, mockPassengers)
    expect(result.flightTotal).toBe(680 * 2)
    expect(result.fuelTax).toBe(50)
    expect(result.airportTax).toBe(90)
    expect(result.perPersonTax).toBe(140)
    expect(result.taxTotal).toBe(140 * 2 * 1)
    expect(result.insuranceTotal).toBe(30 * 2 * 1)
    expect(result.total).toBe(680 * 2 + 140 * 2 + 60)
  })

  it('往返1人公务舱价格计算', () => {
    const selections = [
      {
        type: 'departure',
        flight: mockFlights[0],
        cabin: { type: 'business', name: '公务舱', price: 2040 }
      },
      {
        type: 'return',
        flight: mockFlights[1],
        cabin: { type: 'business', name: '公务舱', price: 1560 }
      }
    ]
    const passengers = [{ id: 'p1', name: '张三' }]
    const result = calculateOrderPrice(selections, passengers)
    expect(result.flightTotal).toBe(2040 + 1560)
    expect(result.taxTotal).toBe(140 * 1 * 2)
    expect(result.insuranceTotal).toBe(30 * 1 * 2)
    expect(result.total).toBe(3600 + 280 + 60)
  })

  it('无选择航班时总价为0', () => {
    const result = calculateOrderPrice([], mockPassengers)
    expect(result.flightTotal).toBe(0)
    expect(result.taxTotal).toBe(0)
    expect(result.insuranceTotal).toBe(0)
    expect(result.total).toBe(0)
  })

  it('无选择航班有乘客不影响机票总价', () => {
    const emptySelections = [{ type: 'departure', flight: null, cabin: null }]
    const result = calculateOrderPrice(emptySelections, mockPassengers)
    expect(result.flightTotal).toBe(0)
  })
})

describe('generateOrderNo', () => {
  it('应生成以FL开头的订单号', () => {
    const orderNo = generateOrderNo()
    expect(orderNo.startsWith('FL')).toBe(true)
  })

  it('生成的订单号应唯一', () => {
    const orderNos = new Set()
    for (let i = 0; i < 100; i++) {
      orderNos.add(generateOrderNo())
    }
    expect(orderNos.size).toBe(100)
  })

  it('订单号长度应足够', () => {
    const orderNo = generateOrderNo()
    expect(orderNo.length).toBeGreaterThan(15)
  })
})
