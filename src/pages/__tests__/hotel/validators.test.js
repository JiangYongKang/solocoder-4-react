import { describe, expect, it } from 'vitest';
import {
    calculateNights,
    calculatePriceDetail,
    filterRooms,
    formatDate,
    validateGuestInfo,
    validateSearchParams,
} from '../../hotel/utils/validators';

describe('validateSearchParams - 搜索参数验证', () => {
  it('城市为空时返回错误', () => {
    const result = validateSearchParams({
      city: '',
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('请输入城市');
  });

  it('城市仅包含空格时返回错误', () => {
    const result = validateSearchParams({
      city: '   ',
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('请输入城市');
  });

  it('入住日期为空时返回错误', () => {
    const result = validateSearchParams({
      city: '北京',
      checkIn: '',
      checkOut: '2025-01-12',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('请选择入住日期');
  });

  it('离店日期为空时返回错误', () => {
    const result = validateSearchParams({
      city: '北京',
      checkIn: '2025-01-10',
      checkOut: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('请选择离店日期');
  });

  it('离店日期早于入住日期时返回错误', () => {
    const result = validateSearchParams({
      city: '北京',
      checkIn: '2025-01-12',
      checkOut: '2025-01-10',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('离店日期必须晚于入住日期');
  });

  it('离店日期等于入住日期时返回错误', () => {
    const result = validateSearchParams({
      city: '北京',
      checkIn: '2025-01-10',
      checkOut: '2025-01-10',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('离店日期必须晚于入住日期');
  });

  it('所有参数正确时验证通过', () => {
    const result = validateSearchParams({
      city: '北京',
      checkIn: '2025-01-10',
      checkOut: '2025-01-12',
    });
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('多个错误时返回所有错误信息', () => {
    const result = validateSearchParams({
      city: '',
      checkIn: '',
      checkOut: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('validateGuestInfo - 入住人信息验证', () => {
  it('姓名为空时返回错误', () => {
    const result = validateGuestInfo({
      name: '',
      phone: '13800138000',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('请输入入住人姓名');
  });

  it('姓名少于2个字符时返回错误', () => {
    const result = validateGuestInfo({
      name: '张',
      phone: '13800138000',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('姓名至少2个字符');
  });

  it('手机号为空时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBe('请输入手机号');
  });

  it('手机号格式错误时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '12345',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBe('请输入正确的11位手机号');
  });

  it('手机号不是1开头时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '23800138000',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBe('请输入正确的11位手机号');
  });

  it('正确手机号（1开头+9位数字）验证通过', () => {
    const validPhones = [
      '13800138000',
      '15912345678',
      '18600001111',
      '19912345678',
      '13011112222',
    ];
    validPhones.forEach((phone) => {
      const result = validateGuestInfo({
        name: '张三',
        phone,
        idCard: '110101199001011234',
      });
      expect(result.errors.phone).toBeUndefined();
    });
  });

  it('证件号为空时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.idCard).toBe('请输入证件号');
  });

  it('15位身份证号验证通过', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '110101900101123',
    });
    expect(result.errors.idCard).toBeUndefined();
  });

  it('18位身份证号验证通过', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '110101199001011234',
    });
    expect(result.errors.idCard).toBeUndefined();
  });

  it('身份证号最后一位为X时验证通过', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '11010119900101123X',
    });
    expect(result.errors.idCard).toBeUndefined();
  });

  it('身份证号最后一位为小写x时验证通过', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '11010119900101123x',
    });
    expect(result.errors.idCard).toBeUndefined();
  });

  it('证件号格式错误（10位数字）时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '1234567890',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.idCard).toBe('请输入正确的15或18位证件号');
  });

  it('证件号包含字母时返回错误', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '11010119900101123Y',
    });
    expect(result.isValid).toBe(false);
  });

  it('所有信息正确时验证通过', () => {
    const result = validateGuestInfo({
      name: '张三',
      phone: '13800138000',
      idCard: '110101199001011234',
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('所有字段错误时返回全部错误', () => {
    const result = validateGuestInfo({
      name: '',
      phone: '',
      idCard: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBeDefined();
    expect(result.errors.phone).toBeDefined();
    expect(result.errors.idCard).toBeDefined();
  });
});

describe('calculateNights - 入住晚数计算', () => {
  it('2025-01-10入住，2025-01-12离店，共2晚', () => {
    expect(calculateNights('2025-01-10', '2025-01-12')).toBe(2);
  });

  it('入住离店同日返回0', () => {
    expect(calculateNights('2025-01-10', '2025-01-10')).toBe(0);
  });

  it('离店早于入住返回0', () => {
    expect(calculateNights('2025-01-12', '2025-01-10')).toBe(0);
  });

  it('跨年日期计算正确', () => {
    expect(calculateNights('2024-12-30', '2025-01-02')).toBe(3);
  });

  it('单晚计算正确', () => {
    expect(calculateNights('2025-01-10', '2025-01-11')).toBe(1);
  });

  it('参数为空返回0', () => {
    expect(calculateNights('', '')).toBe(0);
    expect(calculateNights(null, null)).toBe(0);
    expect(calculateNights(undefined, undefined)).toBe(0);
  });

  it('跨月计算正确（1月31日到2月3日）', () => {
    expect(calculateNights('2025-01-31', '2025-02-03')).toBe(3);
  });
});

describe('calculatePriceDetail - 价格明细计算', () => {
  it('1晚1间基础价格计算正确', () => {
    const result = calculatePriceDetail(1000, 1, 1);
    expect(result.roomTotal).toBe(1000);
    expect(result.nights).toBe(1);
    expect(result.quantity).toBe(1);
    expect(result.tax).toBe(60);
    expect(result.serviceFee).toBe(40);
    expect(result.subtotal).toBe(1100);
    expect(result.discount).toBe(0);
    expect(result.finalTotal).toBe(1100);
  });

  it('2晚2间价格计算正确', () => {
    const result = calculatePriceDetail(1000, 2, 2);
    expect(result.roomTotal).toBe(4000);
    expect(result.tax).toBe(240);
    expect(result.serviceFee).toBe(160);
    expect(result.subtotal).toBe(4400);
    expect(result.discount).toBe(0);
    expect(result.finalTotal).toBe(4400);
  });

  it('满3晚享受9折优惠', () => {
    const result = calculatePriceDetail(1000, 3, 1);
    expect(result.nights).toBe(3);
    expect(result.roomTotal).toBe(3000);
    expect(result.tax).toBe(180);
    expect(result.serviceFee).toBe(120);
    expect(result.subtotal).toBe(3300);
    expect(result.discount).toBe(330);
    expect(result.finalTotal).toBe(2970);
  });

  it('5晚享受优惠计算正确', () => {
    const result = calculatePriceDetail(500, 5, 2);
    expect(result.roomTotal).toBe(5000);
    expect(result.subtotal).toBe(5500);
    expect(result.discount).toBe(550);
    expect(result.finalTotal).toBe(4950);
  });

  it('quantity默认为1', () => {
    const result1 = calculatePriceDetail(1000, 2);
    const result2 = calculatePriceDetail(1000, 2, 1);
    expect(result1.finalTotal).toBe(result2.finalTotal);
  });

  it('计算结果保留两位小数', () => {
    const result = calculatePriceDetail(333, 1, 1);
    expect(result.tax).toBeCloseTo(19.98, 2);
    expect(result.serviceFee).toBeCloseTo(13.32, 2);
    const decimals = [result.tax, result.serviceFee, result.subtotal, result.finalTotal];
    decimals.forEach((val) => {
      const str = val.toFixed(2);
      expect(str.split('.')[1]?.length || 0).toBeLessThanOrEqual(2);
    });
  });
});

describe('filterRooms - 房型筛选', () => {
  const mockRooms = [
    { id: '1', name: '大床房', bedType: '大床', price: 800, hasBreakfast: true, maxGuests: 2 },
    { id: '2', name: '双床房', bedType: '双床', price: 900, hasBreakfast: false, maxGuests: 2 },
    { id: '3', name: '单人间', bedType: '单床', price: 500, hasBreakfast: false, maxGuests: 1 },
    { id: '4', name: '豪华套房', bedType: '大床', price: 2000, hasBreakfast: true, maxGuests: 4 },
    { id: '5', name: '家庭房', bedType: '多床', price: 1500, hasBreakfast: true, maxGuests: 4 },
  ];

  it('无筛选条件时返回全部房型', () => {
    const result = filterRooms(mockRooms, {});
    expect(result).toHaveLength(5);
  });

  it('按最低价格筛选', () => {
    const result = filterRooms(mockRooms, { minPrice: 900 });
    expect(result).toHaveLength(3);
    expect(result.every((r) => r.price >= 900)).toBe(true);
  });

  it('按最高价格筛选', () => {
    const result = filterRooms(mockRooms, { maxPrice: 800 });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.price <= 800)).toBe(true);
  });

  it('按价格区间筛选', () => {
    const result = filterRooms(mockRooms, { minPrice: 500, maxPrice: 900 });
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id).sort()).toEqual(['1', '2', '3']);
  });

  it('筛选单个床型', () => {
    const result = filterRooms(mockRooms, { bedTypes: ['大床'] });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.bedType === '大床')).toBe(true);
  });

  it('筛选多个床型', () => {
    const result = filterRooms(mockRooms, { bedTypes: ['大床', '双床'] });
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.id).sort()).toEqual(['1', '2', '4']);
  });

  it('筛选含早餐房型', () => {
    const result = filterRooms(mockRooms, { hasBreakfast: true });
    expect(result).toHaveLength(3);
    expect(result.every((r) => r.hasBreakfast)).toBe(true);
  });

  it('综合条件筛选（价格+床型+早餐）', () => {
    const result = filterRooms(mockRooms, {
      minPrice: 700,
      maxPrice: 2000,
      bedTypes: ['大床'],
      hasBreakfast: true,
    });
    expect(result).toHaveLength(2);
    expect(result.every((r) => r.bedType === '大床' && r.hasBreakfast)).toBe(true);
  });

  it('条件不匹配时返回空数组', () => {
    const result = filterRooms(mockRooms, {
      minPrice: 3000,
    });
    expect(result).toHaveLength(0);
  });

  it('bedTypes为空数组时忽略床型筛选', () => {
    const result = filterRooms(mockRooms, { bedTypes: [] });
    expect(result).toHaveLength(5);
  });

  it('hasBreakfast为false时忽略早餐筛选', () => {
    const result = filterRooms(mockRooms, { hasBreakfast: false });
    expect(result).toHaveLength(5);
  });
});

describe('formatDate - 日期格式化', () => {
  it('格式化正确日期字符串', () => {
    expect(formatDate('2025-01-10')).toBe('2025-01-10');
  });

  it('月份和日期补零', () => {
    expect(formatDate('2025-3-5')).toBe('2025-03-05');
  });

  it('格式化日期对象格式的字符串', () => {
    expect(formatDate('2025-12-31')).toBe('2025-12-31');
  });

  it('空参数返回空字符串', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });
});

describe('generateOrderNo - 订单号生成', () => {
  async function getFreshGenerateOrderNo() {
    vi.resetModules();
    const mod = await import('../../hotel/utils/validators');
    return mod.generateOrderNo;
  }

  it('订单号以HTL开头', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const orderNo = generateOrderNo();
    expect(orderNo.startsWith('HTL')).toBe(true);
  });

  it('订单号不包含随机数字符串，仅使用时间戳和计数器', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const orderNo = generateOrderNo();
    const timestamp = orderNo.slice(3, 16);
    const counter = orderNo.slice(16, 24);
    expect(/^\d+$/.test(timestamp)).toBe(true);
    expect(/^\d+$/.test(counter)).toBe(true);
    expect(orderNo.length).toBe(24);
  });

  it('订单号包含时间戳部分', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const before = Date.now();
    const orderNo = generateOrderNo();
    const after = Date.now();
    const timestampPart = Number(orderNo.slice(3, 16));
    expect(timestampPart).toBeGreaterThanOrEqual(before);
    expect(timestampPart).toBeLessThanOrEqual(after + 1000);
  });

  it('订单号长度固定（HTL + 13位时间戳 + 8位计数器）', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const orderNo = generateOrderNo();
    expect(orderNo.length).toBe(3 + 13 + 8);
  });

  it('订单号计数器部分为8位，不足时补零', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const orderNo = generateOrderNo();
      const counterPart = orderNo.slice(16, 24);
      expect(counterPart).toHaveLength(8);
      expect(counterPart).toBe('00000000');
    } finally {
      Date.now = originalNow;
    }
  });

  it('订单号包含计数器部分，连续生成时递增', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const orderNo1 = generateOrderNo();
      const orderNo2 = generateOrderNo();
      const orderNo3 = generateOrderNo();
      const counter1 = Number(orderNo1.slice(16, 24));
      const counter2 = Number(orderNo2.slice(16, 24));
      const counter3 = Number(orderNo3.slice(16, 24));
      expect(counter1).toBe(0);
      expect(counter2).toBe(1);
      expect(counter3).toBe(2);
    } finally {
      Date.now = originalNow;
    }
  });

  it('时间戳变化时计数器重置为0', async () => {
    const originalNow = Date.now;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      Date.now = () => 1700000000000;
      const orderNo1 = generateOrderNo();
      const orderNo2 = generateOrderNo();
      expect(Number(orderNo1.slice(16, 24))).toBe(0);
      expect(Number(orderNo2.slice(16, 24))).toBe(1);
      Date.now = () => 1700000000001;
      const orderNo3 = generateOrderNo();
      expect(Number(orderNo3.slice(16, 24))).toBe(0);
    } finally {
      Date.now = originalNow;
    }
  });

  it('生成的订单号不重复（连续100次）', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const set = new Set();
    for (let i = 0; i < 100; i++) {
      set.add(generateOrderNo());
    }
    expect(set.size).toBe(100);
  });

  it('生成的订单号不重复（连续1000次）', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const set = new Set();
    for (let i = 0; i < 1000; i++) {
      set.add(generateOrderNo());
    }
    expect(set.size).toBe(1000);
  });

  it('同一毫秒内生成10000个订单号不重复（模拟高并发）', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const set = new Set();
      for (let i = 0; i < 10000; i++) {
        set.add(generateOrderNo());
      }
      expect(set.size).toBe(10000);
    } finally {
      Date.now = originalNow;
    }
  });

  it('同一毫秒内生成100000个订单号不重复（高压力测试）', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const set = new Set();
      for (let i = 0; i < 100000; i++) {
        set.add(generateOrderNo());
      }
      expect(set.size).toBe(100000);
    } finally {
      Date.now = originalNow;
    }
  });

  it('同一毫秒内连续生成的订单号计数器部分严格递增', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const counters = [];
      for (let i = 0; i < 100; i++) {
        const orderNo = generateOrderNo();
        counters.push(Number(orderNo.slice(16, 24)));
      }
      for (let i = 0; i < 100; i++) {
        expect(counters[i]).toBe(i);
      }
    } finally {
      Date.now = originalNow;
    }
  });

  it('不同毫秒生成的订单号时间戳部分不同', async () => {
    const originalNow = Date.now;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      Date.now = () => 1700000000000;
      const orderNo1 = generateOrderNo();
      Date.now = () => 1700000000001;
      const orderNo2 = generateOrderNo();
      expect(orderNo1.slice(3, 16)).not.toBe(orderNo2.slice(3, 16));
    } finally {
      Date.now = originalNow;
    }
  });

  it('同一毫秒内生成的订单号仅计数器部分不同，时间戳部分完全相同（验证不依赖随机数）', async () => {
    const mockNow = 1700000000000;
    const originalNow = Date.now;
    Date.now = () => mockNow;
    try {
      const generateOrderNo = await getFreshGenerateOrderNo();
      const orderNos = [];
      for (let i = 0; i < 100; i++) {
        orderNos.push(generateOrderNo());
      }
      const expectedTimestamp = '1700000000000';
      for (let i = 0; i < 100; i++) {
        const timestampPart = orderNos[i].slice(3, 16);
        expect(timestampPart).toBe(expectedTimestamp);
      }
      const counters = orderNos.map((o) => Number(o.slice(16, 24)));
      for (let i = 0; i < 100; i++) {
        expect(counters[i]).toBe(i);
      }
      const randomPart = orderNos.map((o) => o.slice(24));
      expect(randomPart.every((p) => p === '')).toBe(true);
    } finally {
      Date.now = originalNow;
    }
  });

  it('生成的订单号完全由时间戳和递增计数器组成，不含任何随机成分', async () => {
    const generateOrderNo = await getFreshGenerateOrderNo();
    const orderNo = generateOrderNo();
    expect(orderNo.startsWith('HTL')).toBe(true);
    expect(orderNo.length).toBe(24);
    const body = orderNo.slice(3);
    expect(/^\d+$/.test(body)).toBe(true);
    const parts = [
      orderNo.slice(3, 16),
      orderNo.slice(16, 24),
    ];
    parts.forEach((p) => expect(/^\d+$/.test(p)).toBe(true));
  });



  it('不同测试用例通过模块重加载获得独立的计数器状态', async () => {
    const generateOrderNo1 = await getFreshGenerateOrderNo();
    const orderNo1 = generateOrderNo1();
    generateOrderNo1();
    generateOrderNo1();
    expect(Number(orderNo1.slice(16, 24))).toBe(0);
    const generateOrderNo2 = await getFreshGenerateOrderNo();
    const orderNo2 = generateOrderNo2();
    expect(Number(orderNo2.slice(16, 24))).toBe(0);
  });
});
