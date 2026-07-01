export const CITIES = [
  { code: 'PEK', name: '北京', airport: '首都国际机场' },
  { code: 'SHA', name: '上海', airport: '虹桥国际机场' },
  { code: 'PVG', name: '上海', airport: '浦东国际机场' },
  { code: 'CAN', name: '广州', airport: '白云国际机场' },
  { code: 'SZX', name: '深圳', airport: '宝安国际机场' },
  { code: 'HGH', name: '杭州', airport: '萧山国际机场' },
  { code: 'CTU', name: '成都', airport: '双流国际机场' },
  { code: 'CKG', name: '重庆', airport: '江北国际机场' },
  { code: 'XMN', name: '厦门', airport: '高崎国际机场' },
  { code: 'NKG', name: '南京', airport: '禄口国际机场' },
  { code: 'WUH', name: '武汉', airport: '天河国际机场' },
  { code: 'XIY', name: '西安', airport: '咸阳国际机场' }
]

export const AIRLINES = [
  { code: 'CA', name: '中国国际航空', logo: '国航' },
  { code: 'MU', name: '中国东方航空', logo: '东航' },
  { code: 'CZ', name: '中国南方航空', logo: '南航' },
  { code: 'HU', name: '海南航空', logo: '海航' },
  { code: 'MF', name: '厦门航空', logo: '厦航' },
  { code: '3U', name: '四川航空', logo: '川航' }
]

const generateFlights = (departure, arrival, date) => {
  const flights = []
  const airlines = AIRLINES
  const timeSlots = [
    ['06:30', '09:15'], ['07:45', '10:30'], ['08:20', '11:05'],
    ['09:30', '12:20'], ['10:15', '13:00'], ['11:40', '14:25'],
    ['12:30', '15:15'], ['13:50', '16:35'], ['14:20', '17:10'],
    ['15:30', '18:20'], ['16:45', '19:30'], ['17:20', '20:10'],
    ['18:30', '21:20'], ['19:45', '22:30'], ['20:30', '23:20']
  ]
  const durationMap = {
    'PEK-SHA': 135, 'SHA-CAN': 150, 'PEK-CAN': 195, 'PEK-SZX': 200,
    'SHA-CTU': 180, 'CAN-HGH': 120, 'PEK-HGH': 125, 'SHA-XMN': 100
  }
  const key = `${departure}-${arrival}`
  const baseDuration = durationMap[key] || 150

  timeSlots.forEach((slot, idx) => {
    const airline = airlines[idx % airlines.length]
    const flightNo = airline.code + (1000 + Math.floor(Math.random() * 9000))
    const basePrice = 500 + Math.floor(Math.random() * 2000)
    const isDirect = idx % 4 !== 0
    const duration = baseDuration + Math.floor(Math.random() * 60) - 30
    const hours = Math.floor(duration / 60)
    const mins = duration % 60

    flights.push({
      id: `${flightNo}-${date}-${idx}`,
      flightNo,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      departureCity: departure,
      arrivalCity: arrival,
      departureAirport: CITIES.find(c => c.code === departure)?.airport || departure,
      arrivalAirport: CITIES.find(c => c.code === arrival)?.airport || arrival,
      departureTime: slot[0],
      arrivalTime: slot[1],
      duration,
      durationText: `${hours}小时${mins}分`,
      onTimeRate: 80 + Math.floor(Math.random() * 20),
      isDirect,
      stopCity: isDirect ? null : (Math.random() > 0.5 ? 'HGH' : 'NKG'),
      date,
      cabins: [
        {
          type: 'economy',
          name: '经济舱',
          price: basePrice,
          stock: 10 + Math.floor(Math.random() * 20),
          refund: '起飞前2小时免费退票，之后扣除30%手续费',
          change: '起飞前4小时免费改签，之后扣除10%手续费',
          baggage: '免费托运20kg，随身2件共10kg'
        },
        {
          type: 'premium',
          name: '超级经济舱',
          price: Math.floor(basePrice * 1.5),
          stock: 3 + Math.floor(Math.random() * 8),
          refund: '起飞前24小时免费退票，之后扣除20%手续费',
          change: '起飞前12小时免费改签，之后扣除5%手续费',
          baggage: '免费托运30kg，随身2件共10kg'
        },
        {
          type: 'business',
          name: '公务舱',
          price: Math.floor(basePrice * 3),
          stock: 1 + Math.floor(Math.random() * 5),
          refund: '起飞前2小时免费退票',
          change: '免费改签不限次数',
          baggage: '免费托运40kg，随身2件共15kg，优先登机'
        }
      ]
    })
  })

  return flights
}

export const getMockFlights = (departure, arrival, departureDate, returnDate = null) => {
  const departureFlights = generateFlights(departure, arrival, departureDate)
  let returnFlights = []
  if (returnDate) {
    returnFlights = generateFlights(arrival, departure, returnDate)
  }
  return { departureFlights, returnFlights }
}

export const TAX_RATE = {
  fuel: 50,
  airport: 90,
  insurance: 30
}
