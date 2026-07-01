const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const saveToken = (token) => {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    return true
  } catch (e) {
    return false
  }
}

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch (e) {
    return null
  }
}

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    return true
  } catch (e) {
    return false
  }
}

export const saveUser = (user) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    return true
  } catch (e) {
    return false
  }
}

export const getUser = () => {
  try {
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  } catch (e) {
    return null
  }
}

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
    return true
  } catch (e) {
    return false
  }
}

export const clearAuth = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    return true
  } catch (e) {
    return false
  }
}

export const generateToken = () => {
  return 'token_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
}
