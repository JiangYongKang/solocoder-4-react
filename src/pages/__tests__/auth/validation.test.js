import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validatePasswordStrength,
  validateConfirmPassword,
  validateNickname,
  validateLoginForm,
  validateRegisterForm,
  validateForgotPasswordForm,
  validateChangePasswordForm
} from '../../auth/utils/validation'

describe('validateEmail', () => {
  it('空邮箱应报错', () => {
    expect(validateEmail('')).toBe('请输入邮箱')
    expect(validateEmail('   ')).toBe('请输入邮箱')
  })

  it('无效邮箱格式应报错', () => {
    expect(validateEmail('invalid')).toBe('邮箱格式不正确')
    expect(validateEmail('invalid@')).toBe('邮箱格式不正确')
    expect(validateEmail('invalid@com')).toBe('邮箱格式不正确')
    expect(validateEmail('@example.com')).toBe('邮箱格式不正确')
    expect(validateEmail('invalid@.com')).toBe('邮箱格式不正确')
  })

  it('有效邮箱应通过校验', () => {
    expect(validateEmail('test@example.com')).toBe('')
    expect(validateEmail('user.name+tag@domain.co.uk')).toBe('')
    expect(validateEmail('  test@example.com  ')).toBe('')
  })
})

describe('validatePassword', () => {
  it('空密码应报错', () => {
    expect(validatePassword('')).toBe('请输入密码')
  })

  it('密码长度不足6位应报错', () => {
    expect(validatePassword('12345')).toBe('密码长度至少为6位')
    expect(validatePassword('a')).toBe('密码长度至少为6位')
  })

  it('密码长度6位及以上应通过', () => {
    expect(validatePassword('123456')).toBe('')
    expect(validatePassword('abcdef')).toBe('')
    expect(validatePassword('Password123')).toBe('')
  })
})

describe('validatePasswordStrength', () => {
  it('空密码应返回无效', () => {
    const result = validatePasswordStrength('')
    expect(result.isValid).toBe(false)
    expect(result.message).toBe('请输入密码')
    expect(result.level).toBe(0)
  })

  it('密码长度不足6位应返回无效', () => {
    const result = validatePasswordStrength('12345')
    expect(result.isValid).toBe(false)
    expect(result.message).toBe('密码长度至少为6位')
    expect(result.level).toBe(0)
  })

  it('弱密码应返回正确级别', () => {
    const result = validatePasswordStrength('123456')
    expect(result.isValid).toBe(false)
    expect(result.level).toBeLessThanOrEqual(1)
  })

  it('中等强度密码应通过校验', () => {
    const result = validatePasswordStrength('password123')
    expect(result.isValid).toBe(true)
    expect(result.level).toBeGreaterThanOrEqual(2)
  })

  it('强密码应返回最高级别', () => {
    const result = validatePasswordStrength('Password@123')
    expect(result.isValid).toBe(true)
    expect(result.level).toBeGreaterThanOrEqual(4)
  })

  it('包含大小写字母和数字的密码应有较高强度', () => {
    const result = validatePasswordStrength('Password123')
    expect(result.isValid).toBe(true)
    expect(result.level).toBeGreaterThanOrEqual(3)
  })
})

describe('validateConfirmPassword', () => {
  it('空确认密码应报错', () => {
    expect(validateConfirmPassword('password', '')).toBe('请确认密码')
  })

  it('密码不一致应报错', () => {
    expect(validateConfirmPassword('password', 'different')).toBe('两次输入的密码不一致')
    expect(validateConfirmPassword('Password123', 'password123')).toBe('两次输入的密码不一致')
  })

  it('密码一致应通过', () => {
    expect(validateConfirmPassword('password', 'password')).toBe('')
    expect(validateConfirmPassword('Password@123', 'Password@123')).toBe('')
  })
})

describe('validateNickname', () => {
  it('空昵称应报错', () => {
    expect(validateNickname('')).toBe('请输入昵称')
    expect(validateNickname('   ')).toBe('请输入昵称')
  })

  it('昵称长度不足2位应报错', () => {
    expect(validateNickname('a')).toBe('昵称长度至少为2个字符')
  })

  it('昵称长度超过20位应报错', () => {
    expect(validateNickname('a'.repeat(21))).toBe('昵称长度不能超过20个字符')
  })

  it('有效昵称应通过', () => {
    expect(validateNickname('张三')).toBe('')
    expect(validateNickname('user123')).toBe('')
    expect(validateNickname('  测试用户  ')).toBe('')
    expect(validateNickname('a'.repeat(20))).toBe('')
  })
})

describe('validateLoginForm', () => {
  it('有效登录表单应通过', () => {
    const result = validateLoginForm({
      email: 'test@example.com',
      password: 'password123'
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('邮箱错误应返回错误', () => {
    const result = validateLoginForm({
      email: 'invalid',
      password: 'password123'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })

  it('密码错误应返回错误', () => {
    const result = validateLoginForm({
      email: 'test@example.com',
      password: '123'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBeDefined()
  })

  it('多个错误应同时返回', () => {
    const result = validateLoginForm({
      email: '',
      password: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
    expect(result.errors.password).toBeDefined()
  })
})

describe('validateRegisterForm', () => {
  it('有效注册表单应通过', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      nickname: '测试用户'
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
    expect(result.passwordLevel).toBeGreaterThanOrEqual(2)
  })

  it('邮箱格式错误应报错', () => {
    const result = validateRegisterForm({
      email: 'invalid',
      password: 'Password123',
      confirmPassword: 'Password123',
      nickname: '测试用户'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })

  it('密码强度不足应报错', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: '123456',
      confirmPassword: '123456',
      nickname: '测试用户'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.password).toBeDefined()
  })

  it('确认密码不一致应报错', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password456',
      nickname: '测试用户'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.confirmPassword).toBeDefined()
  })

  it('昵称太短应报错', () => {
    const result = validateRegisterForm({
      email: 'test@example.com',
      password: 'Password123',
      confirmPassword: 'Password123',
      nickname: 'a'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.nickname).toBeDefined()
  })

  it('所有字段为空应返回多个错误', () => {
    const result = validateRegisterForm({
      email: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
    expect(result.errors.password).toBeDefined()
    expect(result.errors.confirmPassword).toBeDefined()
    expect(result.errors.nickname).toBeDefined()
  })
})

describe('validateForgotPasswordForm', () => {
  it('有效邮箱应通过', () => {
    const result = validateForgotPasswordForm({
      email: 'test@example.com'
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('空邮箱应报错', () => {
    const result = validateForgotPasswordForm({ email: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })

  it('无效邮箱应报错', () => {
    const result = validateForgotPasswordForm({ email: 'invalid' })
    expect(result.isValid).toBe(false)
    expect(result.errors.email).toBeDefined()
  })
})

describe('validateChangePasswordForm', () => {
  it('有效修改密码表单应通过', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'OldPassword123',
      newPassword: 'NewPassword456',
      confirmNewPassword: 'NewPassword456'
    })
    expect(result.isValid).toBe(true)
    expect(Object.keys(result.errors).length).toBe(0)
  })

  it('旧密码为空应报错', () => {
    const result = validateChangePasswordForm({
      oldPassword: '',
      newPassword: 'NewPassword456',
      confirmNewPassword: 'NewPassword456'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.oldPassword).toBe('请输入旧密码')
  })

  it('新密码强度不足应报错', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'OldPassword123',
      newPassword: '123456',
      confirmNewPassword: '123456'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.newPassword).toBeDefined()
  })

  it('新密码与旧密码相同应报错', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'OldPassword123',
      newPassword: 'OldPassword123',
      confirmNewPassword: 'OldPassword123'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.newPassword).toBe('新密码不能与旧密码相同')
  })

  it('确认新密码不一致应报错', () => {
    const result = validateChangePasswordForm({
      oldPassword: 'OldPassword123',
      newPassword: 'NewPassword456',
      confirmNewPassword: 'DifferentPassword'
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.confirmNewPassword).toBeDefined()
  })

  it('所有字段为空应返回多个错误', () => {
    const result = validateChangePasswordForm({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
    expect(result.isValid).toBe(false)
    expect(result.errors.oldPassword).toBeDefined()
    expect(result.errors.newPassword).toBeDefined()
    expect(result.errors.confirmNewPassword).toBeDefined()
  })
})
