import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  clearAuth,
  generateToken
} from '../../auth/utils/storage'

describe('storage utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('token operations', () => {
    it('saveToken 应成功保存 token', () => {
      const result = saveToken('test-token-123')
      expect(result).toBe(true)
      expect(localStorage.getItem('auth_token')).toBe('test-token-123')
    })

    it('getToken 应正确获取已保存的 token', () => {
      localStorage.setItem('auth_token', 'test-token-123')
      const token = getToken()
      expect(token).toBe('test-token-123')
    })

    it('getToken 不存在时应返回 null', () => {
      const token = getToken()
      expect(token).toBeNull()
    })

    it('removeToken 应成功删除 token', () => {
      localStorage.setItem('auth_token', 'test-token-123')
      const result = removeToken()
      expect(result).toBe(true)
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })

  describe('user operations', () => {
    it('saveUser 应成功保存用户信息', () => {
      const user = {
        email: 'test@example.com',
        nickname: '测试用户',
        createdAt: '2024-01-01T00:00:00.000Z'
      }
      const result = saveUser(user)
      expect(result).toBe(true)
      expect(JSON.parse(localStorage.getItem('auth_user'))).toEqual(user)
    })

    it('getUser 应正确获取已保存的用户信息', () => {
      const user = {
        email: 'test@example.com',
        nickname: '测试用户'
      }
      localStorage.setItem('auth_user', JSON.stringify(user))
      const savedUser = getUser()
      expect(savedUser).toEqual(user)
    })

    it('getUser 不存在时应返回 null', () => {
      const user = getUser()
      expect(user).toBeNull()
    })

    it('getUser 解析失败时应返回 null', () => {
      localStorage.setItem('auth_user', 'invalid-json')
      const user = getUser()
      expect(user).toBeNull()
    })

    it('removeUser 应成功删除用户信息', () => {
      localStorage.setItem('auth_user', JSON.stringify({ email: 'test@example.com' }))
      const result = removeUser()
      expect(result).toBe(true)
      expect(localStorage.getItem('auth_user')).toBeNull()
    })
  })

  describe('clearAuth', () => {
    it('clearAuth 应同时清除 token 和 user', () => {
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('auth_user', JSON.stringify({ email: 'test@example.com' }))
      
      const result = clearAuth()
      expect(result).toBe(true)
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('auth_user')).toBeNull()
    })
  })

  describe('generateToken', () => {
    it('generateToken 应生成字符串 token', () => {
      const token = generateToken()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
      expect(token.startsWith('token_')).toBe(true)
    })

    it('generateToken 每次调用应生成不同的 token', () => {
      const token1 = generateToken()
      const token2 = generateToken()
      expect(token1).not.toBe(token2)
    })
  })
})
