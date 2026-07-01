import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getMockUsers,
  saveMockUsers,
  findUserByEmail,
  registerUser,
  verifyUser,
  updateUserPassword,
  requestPasswordReset
} from '../../auth/utils/mockUsers'

describe('mockUsers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  const testUser = {
    email: 'test@example.com',
    password: 'Password123',
    nickname: '测试用户'
  }

  describe('getMockUsers', () => {
    it('初始状态应返回空对象', () => {
      const users = getMockUsers()
      expect(users).toEqual({})
    })

    it('应返回已保存的用户数据', () => {
      const users = { 'test@example.com': testUser }
      localStorage.setItem('mock_users', JSON.stringify(users))
      expect(getMockUsers()).toEqual(users)
    })

    it('数据损坏时应返回空对象', () => {
      localStorage.setItem('mock_users', 'invalid-json')
      expect(getMockUsers()).toEqual({})
    })
  })

  describe('saveMockUsers', () => {
    it('应成功保存用户数据', () => {
      const users = { 'test@example.com': testUser }
      const result = saveMockUsers(users)
      expect(result).toBe(true)
      expect(JSON.parse(localStorage.getItem('mock_users'))).toEqual(users)
    })
  })

  describe('findUserByEmail', () => {
    it('应能通过邮箱找到用户', () => {
      const users = { 'test@example.com': testUser }
      localStorage.setItem('mock_users', JSON.stringify(users))
      
      const user = findUserByEmail('test@example.com')
      expect(user).toEqual(testUser)
    })

    it('邮箱不区分大小写', () => {
      const users = { 'test@example.com': testUser }
      localStorage.setItem('mock_users', JSON.stringify(users))
      
      const user = findUserByEmail('TEST@EXAMPLE.COM')
      expect(user).toEqual(testUser)
    })

    it('用户不存在时返回 null', () => {
      const user = findUserByEmail('notfound@example.com')
      expect(user).toBeNull()
    })
  })

  describe('registerUser', () => {
    it('应成功注册新用户', () => {
      const result = registerUser(testUser)
      expect(result.success).toBe(true)
      expect(result.message).toBe('注册成功')
      
      const savedUser = findUserByEmail(testUser.email)
      expect(savedUser.email).toBe(testUser.email)
      expect(savedUser.nickname).toBe(testUser.nickname)
      expect(savedUser.password).toBe(testUser.password)
      expect(savedUser.createdAt).toBeDefined()
    })

    it('邮箱已注册时应失败', () => {
      registerUser(testUser)
      const result = registerUser(testUser)
      expect(result.success).toBe(false)
      expect(result.message).toBe('该邮箱已被注册')
    })

    it('注册时邮箱不区分大小写', () => {
      registerUser(testUser)
      const result = registerUser({
        ...testUser,
        email: 'TEST@EXAMPLE.COM'
      })
      expect(result.success).toBe(false)
      expect(result.message).toBe('该邮箱已被注册')
    })
  })

  describe('verifyUser', () => {
    beforeEach(() => {
      registerUser(testUser)
    })

    it('邮箱和密码正确时验证成功', () => {
      const result = verifyUser('test@example.com', 'Password123')
      expect(result.success).toBe(true)
      expect(result.user.email).toBe('test@example.com')
      expect(result.user.nickname).toBe('测试用户')
      expect(result.user.createdAt).toBeDefined()
      expect(result.user.password).toBeUndefined()
    })

    it('邮箱不区分大小写', () => {
      const result = verifyUser('TEST@EXAMPLE.COM', 'Password123')
      expect(result.success).toBe(true)
    })

    it('用户不存在时验证失败', () => {
      const result = verifyUser('notfound@example.com', 'Password123')
      expect(result.success).toBe(false)
      expect(result.message).toBe('用户不存在')
    })

    it('密码错误时验证失败', () => {
      const result = verifyUser('test@example.com', 'WrongPassword')
      expect(result.success).toBe(false)
      expect(result.message).toBe('密码错误')
    })
  })

  describe('updateUserPassword', () => {
    beforeEach(() => {
      registerUser(testUser)
    })

    it('应成功更新密码', () => {
      const result = updateUserPassword('test@example.com', 'NewPassword456')
      expect(result.success).toBe(true)
      expect(result.message).toBe('密码修改成功')
      
      const verifyResult = verifyUser('test@example.com', 'NewPassword456')
      expect(verifyResult.success).toBe(true)
    })

    it('用户不存在时失败', () => {
      const result = updateUserPassword('notfound@example.com', 'NewPassword456')
      expect(result.success).toBe(false)
      expect(result.message).toBe('用户不存在')
    })

    it('邮箱不区分大小写', () => {
      const result = updateUserPassword('TEST@EXAMPLE.COM', 'NewPassword456')
      expect(result.success).toBe(true)
    })
  })

  describe('requestPasswordReset', () => {
    beforeEach(() => {
      registerUser(testUser)
    })

    it('已注册邮箱应返回成功', () => {
      const result = requestPasswordReset('test@example.com')
      expect(result.success).toBe(true)
      expect(result.message).toBe('重置链接已发送到您的邮箱，请查收')
    })

    it('未注册邮箱应返回失败', () => {
      const result = requestPasswordReset('notfound@example.com')
      expect(result.success).toBe(false)
      expect(result.message).toBe('该邮箱未注册')
    })

    it('邮箱不区分大小写', () => {
      const result = requestPasswordReset('TEST@EXAMPLE.COM')
      expect(result.success).toBe(true)
    })
  })
})
