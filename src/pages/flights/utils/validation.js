export const validateSearchForm = (formData) => {
  const errors = {}
  const { tripType, departure, arrival, departureDate, returnDate } = formData

  if (!departure || !departure.trim()) {
    errors.departure = '请输入出发城市'
  }
  if (!arrival || !arrival.trim()) {
    errors.arrival = '请输入到达城市'
  }
  if (departure && arrival && departure === arrival) {
    errors.sameCity = '出发城市和到达城市不能相同'
  }
  if (!departureDate) {
    errors.departureDate = '请选择出发日期'
  }
  if (tripType === 'roundTrip') {
    if (!returnDate) {
      errors.returnDate = '请选择返程日期'
    } else if (departureDate && returnDate && new Date(returnDate) < new Date(departureDate)) {
      errors.dateOrder = '返程日期不能早于出发日期'
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validatePassenger = (passenger) => {
  const errors = {}
  const { name, idType, idNo, phone } = passenger

  if (!name || !name.trim()) {
    errors.name = '请输入姓名'
  } else if (!/^[\u4e00-\u9fa5]{2,10}$/.test(name.trim())) {
    errors.name = '姓名应为2-10个中文字符'
  }

  if (!idType) {
    errors.idType = '请选择证件类型'
  }

  if (!idNo || !idNo.trim()) {
    errors.idNo = '请输入证件号码'
  } else {
    if (idType === 'idcard') {
      const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (!idCardRegex.test(idNo.trim())) {
        errors.idNo = '请输入正确的18位身份证号'
      }
    } else if (idType === 'passport') {
      if (!/^[A-Za-z0-9]{6,20}$/.test(idNo.trim())) {
        errors.idNo = '护照号格式不正确'
      }
    }
  }

  if (!phone || !phone.trim()) {
    errors.phone = '请输入手机号'
  } else if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
    errors.phone = '请输入正确的11位手机号'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
