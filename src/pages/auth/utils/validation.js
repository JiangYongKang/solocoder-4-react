export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return '请输入邮箱'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return '邮箱格式不正确'
  }
  return ''
}

export const validatePassword = (password) => {
  if (!password) {
    return '请输入密码'
  }
  if (password.length < 6) {
    return '密码长度至少为6位'
  }
  return ''
}

export const validatePasswordStrength = (password) => {
  if (!password) {
    return { isValid: false, message: '请输入密码', level: 0 }
  }
  if (password.length < 6) {
    return { isValid: false, message: '密码长度至少为6位', level: 0 }
  }

  let level = 0
  const hasLowerCase = /[a-z]/.test(password)
  const hasUpperCase = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length >= 8) level++
  if (hasLowerCase) level++
  if (hasUpperCase) level++
  if (hasNumber) level++
  if (hasSpecial) level++

  if (level < 2) {
    return { isValid: false, message: '密码强度太弱，建议包含字母和数字', level }
  }

  return { isValid: true, message: '', level }
}

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) {
    return '请确认密码'
  }
  if (password !== confirmPassword) {
    return '两次输入的密码不一致'
  }
  return ''
}

export const validateNickname = (nickname) => {
  if (!nickname || !nickname.trim()) {
    return '请输入昵称'
  }
  const trimmed = nickname.trim()
  if (trimmed.length < 2) {
    return '昵称长度至少为2个字符'
  }
  if (trimmed.length > 20) {
    return '昵称长度不能超过20个字符'
  }
  return ''
}

export const validateLoginForm = (formData) => {
  const errors = {}
  const { email, password } = formData

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordError = validatePassword(password)
  if (passwordError) errors.password = passwordError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateRegisterForm = (formData) => {
  const errors = {}
  const { email, password, confirmPassword, nickname } = formData

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  const passwordCheck = validatePasswordStrength(password)
  if (!passwordCheck.isValid) errors.password = passwordCheck.message

  const confirmError = validateConfirmPassword(password, confirmPassword)
  if (confirmError) errors.confirmPassword = confirmError

  const nicknameError = validateNickname(nickname)
  if (nicknameError) errors.nickname = nicknameError

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordLevel: passwordCheck.level
  }
}

export const validateForgotPasswordForm = (formData) => {
  const errors = {}
  const { email } = formData

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const validateChangePasswordForm = (formData) => {
  const errors = {}
  const { oldPassword, newPassword, confirmNewPassword } = formData

  if (!oldPassword) {
    errors.oldPassword = '请输入旧密码'
  }

  const newPasswordCheck = validatePasswordStrength(newPassword)
  if (!newPasswordCheck.isValid) errors.newPassword = newPasswordCheck.message

  const confirmError = validateConfirmPassword(newPassword, confirmNewPassword)
  if (confirmError) errors.confirmNewPassword = confirmError

  if (oldPassword && newPassword && oldPassword === newPassword) {
    errors.newPassword = '新密码不能与旧密码相同'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    passwordLevel: newPasswordCheck.level
  }
}
