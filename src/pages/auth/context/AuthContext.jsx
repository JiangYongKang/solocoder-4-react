import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getToken,
  getUser,
  saveToken,
  saveUser,
  clearAuth,
  generateToken
} from '../utils/storage'
import {
  verifyUser,
  registerUser,
  updateUserPassword,
  requestPasswordReset
} from '../utils/mockUsers'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = () => {
      const savedToken = getToken()
      const savedUser = getUser()
      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(savedUser)
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const login = useCallback(async (email, password) => {
    const result = verifyUser(email, password)
    if (result.success) {
      const newToken = generateToken()
      saveToken(newToken)
      saveUser(result.user)
      setToken(newToken)
      setUser(result.user)
      setIsAuthenticated(true)
      return { success: true, message: '登录成功' }
    }
    return { success: false, message: result.message }
  }, [])

  const register = useCallback(async (userData) => {
    const result = registerUser(userData)
    if (result.success) {
      const newToken = generateToken()
      const newUser = {
        email: userData.email,
        nickname: userData.nickname,
        createdAt: new Date().toISOString()
      }
      saveToken(newToken)
      saveUser(newUser)
      setToken(newToken)
      setUser(newUser)
      setIsAuthenticated(true)
      return { success: true, message: '注册成功' }
    }
    return { success: false, message: result.message }
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    if (!user) {
      return { success: false, message: '请先登录' }
    }
    const verifyResult = verifyUser(user.email, oldPassword)
    if (!verifyResult.success) {
      return { success: false, message: '旧密码不正确' }
    }
    const updateResult = updateUserPassword(user.email, newPassword)
    if (updateResult.success) {
      return { success: true, message: '密码修改成功，请重新登录' }
    }
    return { success: false, message: updateResult.message }
  }, [user])

  const forgotPassword = useCallback(async (email) => {
    return requestPasswordReset(email)
  }, [])

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    register,
    logout,
    changePassword,
    forgotPassword
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
