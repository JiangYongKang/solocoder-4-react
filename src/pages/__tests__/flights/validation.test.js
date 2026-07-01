import { describe, it, expect } from 'vitest'
import { validateSearchForm, validatePassenger } from '../../flights/utils/validation'

describe('validateSearchForm', () => {
  it('单程有效表单应通过校验', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('往返有效表单应通过校验', () => {
    const result = validateSearchForm({
      tripType: 'roundTrip',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: '2025-07-15'
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('出发城市为空应报错', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: '',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.departure).toBe('请输入出发城市')
  })

  it('到达城市为空应报错', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: 'PEK',
      arrival: '',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.arrival).toBe('请输入到达城市')
  })

  it('出发和到达城市相同应报错', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: 'PEK',
      arrival: 'PEK',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.sameCity).toBe('出发城市和到达城市不能相同')
  })

  it('出发城市仅包含空格应报错', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: '   ',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.departure).toBe('请输入出发城市')
  })

  it('出发日期为空应报错', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.departureDate).toBe('请选择出发日期')
  })

  it('往返时返程日期为空应报错', () => {
    const result = validateSearchForm({
      tripType: 'roundTrip',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.returnDate).toBe('请选择返程日期')
  })

  it('往返时返程日期早于出发日期应报错', () => {
    const result = validateSearchForm({
      tripType: 'roundTrip',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-15',
      returnDate: '2025-07-10'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.dateOrder).toBe('返程日期不能早于出发日期')
  })

  it('往返时返程日期等于出发日期应通过', () => {
    const result = validateSearchForm({
      tripType: 'roundTrip',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: '2025-07-10'
    })
    expect(result.isValid).toBe(true)
  })

  it('单程时不需要返程日期', () => {
    const result = validateSearchForm({
      tripType: 'oneWay',
      departure: 'PEK',
      arrival: 'SHA',
      departureDate: '2025-07-10',
      returnDate: ''
    })
    expect(result.isValid).toBe(true)
    expect(result.errors.returnDate).toBeUndefined()
  })

  it('多个错误应同时返回', () => {
    const result = validateSearchForm({
      tripType: 'roundTrip',
      departure: '',
      arrival: '',
      departureDate: '',
      returnDate: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.departure).toBeDefined()
    expect(result.errors.arrival).toBeDefined()
    expect(result.errors.departureDate).toBeDefined()
    expect(result.errors.returnDate).toBeDefined()
  })
})

describe('validatePassenger', () => {
  const validPassenger = {
    name: '张三',
    idType: 'idcard',
    idNo: '110101199003071234',
    phone: '13800138000'
  }

  it('有效乘机人应通过校验', () => {
    const result = validatePassenger(validPassenger)
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('姓名为空应报错', () => {
    const result = validatePassenger({ ...validPassenger, name: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('请输入姓名')
  })

  it('姓名仅为空格应报错', () => {
    const result = validatePassenger({ ...validPassenger, name: '   ' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('请输入姓名')
  })

  it('姓名字符少于2位应报错', () => {
    const result = validatePassenger({ ...validPassenger, name: '张' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('姓名应为2-10个中文字符')
  })

  it('姓名字符多于10位应报错', () => {
    const result = validatePassenger({ ...validPassenger, name: '一二三四五六七八九十A' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('姓名应为2-10个中文字符')
  })

  it('姓名包含非中文应报错', () => {
    const result = validatePassenger({ ...validPassenger, name: 'Zhang三' })
    expect(result.isValid).toBe(false)
    expect(result.errors.name).toBe('姓名应为2-10个中文字符')
  })

  it('证件类型为空应报错', () => {
    const result = validatePassenger({ ...validPassenger, idType: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.idType).toBe('请选择证件类型')
  })

  it('证件号码为空应报错', () => {
    const result = validatePassenger({ ...validPassenger, idNo: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.idNo).toBe('请输入证件号码')
  })

  it('身份证号码格式错误应报错', () => {
    const result = validatePassenger({ ...validPassenger, idNo: '12345' })
    expect(result.isValid).toBe(false)
    expect(result.errors.idNo).toBe('请输入正确的18位身份证号')
  })

  it('身份证最后一位为X应通过', () => {
    const result = validatePassenger({ ...validPassenger, idNo: '11010119900307123X' })
    expect(result.isValid).toBe(true)
  })

  it('身份证最后一位为小写x应通过', () => {
    const result = validatePassenger({ ...validPassenger, idNo: '11010119900307123x' })
    expect(result.isValid).toBe(true)
  })

  it('护照号码为空应报错', () => {
    const result = validatePassenger({
      ...validPassenger,
      idType: 'passport',
      idNo: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.idNo).toBe('请输入证件号码')
  })

  it('护照号码格式错误应报错', () => {
    const result = validatePassenger({
      ...validPassenger,
      idType: 'passport',
      idNo: 'AB'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.idNo).toBe('护照号格式不正确')
  })

  it('有效护照号码应通过', () => {
    const result = validatePassenger({
      ...validPassenger,
      idType: 'passport',
      idNo: 'E12345678'
    })
    expect(result.isValid).toBe(true)
  })

  it('手机号为空应报错', () => {
    const result = validatePassenger({ ...validPassenger, phone: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.phone).toBe('请输入手机号')
  })

  it('手机号长度不对应报错', () => {
    const result = validatePassenger({ ...validPassenger, phone: '1380013' })
    expect(result.isValid).toBe(false)
    expect(result.errors.phone).toBe('请输入正确的11位手机号')
  })

  it('手机号非1开头应报错', () => {
    const result = validatePassenger({ ...validPassenger, phone: '23800138000' })
    expect(result.isValid).toBe(false)
    expect(result.errors.phone).toBe('请输入正确的11位手机号')
  })

  it('手机号第二位为0应报错', () => {
    const result = validatePassenger({ ...validPassenger, phone: '10800138000' })
    expect(result.isValid).toBe(false)
    expect(result.errors.phone).toBe('请输入正确的11位手机号')
  })

  it('有效手机号应通过', () => {
    const validPhones = ['13800138000', '15912345678', '19900001111', '17655556666']
    validPhones.forEach(phone => {
      const result = validatePassenger({ ...validPassenger, phone })
      expect(result.isValid).toBe(true)
    })
  })
})
