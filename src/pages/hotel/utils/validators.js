export function validateSearchParams(params) {
  const errors = [];
  const { city, checkIn, checkOut } = params;

  if (!city || city.trim() === '') {
    errors.push('请输入城市');
  }

  if (!checkIn) {
    errors.push('请选择入住日期');
  }

  if (!checkOut) {
    errors.push('请选择离店日期');
  }

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      errors.push('离店日期必须晚于入住日期');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateGuestInfo(info) {
  const errors = {};
  const { name, phone, idCard } = info;

  if (!name || name.trim() === '') {
    errors.name = '请输入入住人姓名';
  } else if (name.trim().length < 2) {
    errors.name = '姓名至少2个字符';
  }

  if (!phone || phone.trim() === '') {
    errors.phone = '请输入手机号';
  } else if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
    errors.phone = '请输入正确的11位手机号';
  }

  if (!idCard || idCard.trim() === '') {
    errors.idCard = '请输入证件号';
  } else if (!/(^\d{15}$)|(^\d{17}[\dXx]$)/.test(idCard.trim())) {
    errors.idCard = '请输入正确的15或18位证件号';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}

export function calculatePriceDetail(roomPrice, nights, quantity = 1) {
  const roomTotal = roomPrice * nights * quantity;
  const taxRate = 0.06;
  const serviceFeeRate = 0.04;
  const tax = Math.round(roomTotal * taxRate * 100) / 100;
  const serviceFee = Math.round(roomTotal * serviceFeeRate * 100) / 100;
  const subtotal = Math.round((roomTotal + tax + serviceFee) * 100) / 100;
  const discount = nights >= 3 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const finalTotal = Math.round((subtotal - discount) * 100) / 100;

  return {
    roomTotal,
    nights,
    quantity,
    tax,
    serviceFee,
    subtotal,
    discount,
    finalTotal,
  };
}

export function filterRooms(rooms, filters) {
  const { minPrice, maxPrice, bedTypes, hasBreakfast } = filters;

  return rooms.filter((room) => {
    if (minPrice !== undefined && room.price < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && room.price > maxPrice) {
      return false;
    }
    if (bedTypes && bedTypes.length > 0 && !bedTypes.includes(room.bedType)) {
      return false;
    }
    if (hasBreakfast === true && !room.hasBreakfast) {
      return false;
    }
    return true;
  });
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

let orderNoCounter = 0;
let orderNoLastTimestamp = 0;

export function resetOrderNoCounter() {
  orderNoCounter = 0;
  orderNoLastTimestamp = 0;
}

export function generateOrderNo() {
  const now = Date.now();
  if (now !== orderNoLastTimestamp) {
    orderNoCounter = 0;
    orderNoLastTimestamp = now;
  } else {
    orderNoCounter = (orderNoCounter + 1) % 10000;
  }
  const timestamp = now.toString();
  const counter = orderNoCounter.toString().padStart(4, '0');
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `HTL${timestamp}${counter}${random}`;
}
