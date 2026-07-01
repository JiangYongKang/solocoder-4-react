import { TAX_RATE } from '../data/mockData'

export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const weekDay = weekDays[date.getDay()]
  return `${year}-${month}-${day} ${weekDay}`
}

export const getDateStr = (offset = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

export const getTimePeriod = (timeStr) => {
  const hour = parseInt(timeStr.split(':')[0], 10)
  if (hour >= 6 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 24) return 'evening'
  return 'night'
}

export const TIME_PERIODS = [
  { key: 'morning', label: '上午 06:00-12:00' },
  { key: 'afternoon', label: '下午 12:00-18:00' },
  { key: 'evening', label: '晚上 18:00-24:00' },
  { key: 'night', label: '凌晨 00:00-06:00' }
]

export const filterFlights = (flights, filters) => {
  return flights.filter(flight => {
    if (filters.timePeriods && filters.timePeriods.length > 0) {
      const period = getTimePeriod(flight.departureTime)
      if (!filters.timePeriods.includes(period)) {
        return false
      }
    }

    if (filters.airlines && filters.airlines.length > 0) {
      if (!filters.airlines.includes(flight.airlineCode)) {
        return false
      }
    }

    if (filters.priceRange) {
      const minPrice = Math.min(...flight.cabins.map(c => c.price))
      if (filters.priceRange.min != null && minPrice < filters.priceRange.min) {
        return false
      }
      if (filters.priceRange.max != null && minPrice > filters.priceRange.max) {
        return false
      }
    }

    if (filters.directOnly && !flight.isDirect) {
      return false
    }

    return true
  })
}

export const sortFlights = (flights, sortBy) => {
  const sorted = [...flights]
  switch (sortBy) {
    case 'price_asc':
      sorted.sort((a, b) => {
        const minA = Math.min(...a.cabins.map(c => c.price))
        const minB = Math.min(...b.cabins.map(c => c.price))
        return minA - minB
      })
      break
    case 'price_desc':
      sorted.sort((a, b) => {
        const minA = Math.min(...a.cabins.map(c => c.price))
        const minB = Math.min(...b.cabins.map(c => c.price))
        return minB - minA
      })
      break
    case 'time_asc':
      sorted.sort((a, b) => a.departureTime.localeCompare(b.departureTime))
      break
    case 'time_desc':
      sorted.sort((a, b) => b.departureTime.localeCompare(a.departureTime))
      break
    case 'duration_asc':
      sorted.sort((a, b) => a.duration - b.duration)
      break
    case 'ontime_desc':
      sorted.sort((a, b) => b.onTimeRate - a.onTimeRate)
      break
    default:
      break
  }
  return sorted
}

export const SORT_OPTIONS = [
  { key: 'recommend', label: '推荐排序' },
  { key: 'price_asc', label: '价格从低到高' },
  { key: 'price_desc', label: '价格从高到低' },
  { key: 'time_asc', label: '起飞时间从早到晚' },
  { key: 'time_desc', label: '起飞时间从晚到早' },
  { key: 'duration_asc', label: '飞行时长从短到长' },
  { key: 'ontime_desc', label: '准点率从高到低' }
]

export const calculateOrderPrice = (selections, passengers) => {
  const perPersonTax = TAX_RATE.fuel + TAX_RATE.airport
  const validSelections = selections.filter(sel => sel.flight && sel.cabin)
  const validCount = validSelections.length
  const passengerCount = passengers.length

  const flightTotal = validSelections.reduce((sum, sel) => {
    return sum + sel.cabin.price * passengerCount
  }, 0)
  const taxTotal = perPersonTax * validCount * passengerCount
  const insuranceTotal = TAX_RATE.insurance * passengerCount * validCount
  const total = flightTotal + taxTotal + insuranceTotal

  return {
    flightTotal,
    taxTotal,
    insuranceTotal,
    perPersonTax,
    validSelectionCount: validCount,
    fuelTax: TAX_RATE.fuel,
    airportTax: TAX_RATE.airport,
    insurancePerPerson: TAX_RATE.insurance,
    total
  }
}

let _orderCounter = 0
export const generateOrderNo = () => {
  _orderCounter = (_orderCounter + 1) % 1000000
  const timestamp = Date.now().toString()
  const counter = _orderCounter.toString().padStart(6, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return 'FL' + timestamp + counter + random
}
