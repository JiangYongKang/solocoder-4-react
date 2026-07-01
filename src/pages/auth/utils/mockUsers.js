const USERS_KEY = 'mock_users'

export const getMockUsers = () => {
  try {
    const usersStr = localStorage.getItem(USERS_KEY)
    return usersStr ? JSON.parse(usersStr) : {}
  } catch (e) {
    return {}
  }
}

export const saveMockUsers = (users) => {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return true
  } catch (e) {
    return false
  }
}

export const findUserByEmail = (email) => {
  const users = getMockUsers()
  return users[email.toLowerCase()] || null
}

export const registerUser = (userData) => {
  const users = getMockUsers()
  const emailKey = userData.email.toLowerCase()

  if (users[emailKey]) {
    return { success: false, message: '该邮箱已被注册' }
  }

  users[emailKey] = {
    email: userData.email,
    password: userData.password,
    nickname: userData.nickname,
    createdAt: new Date().toISOString()
  }

  saveMockUsers(users)
  return { success: true, message: '注册成功' }
}

export const verifyUser = (email, password) => {
  const user = findUserByEmail(email)
  if (!user) {
    return { success: false, message: '用户不存在' }
  }
  if (user.password !== password) {
    return { success: false, message: '密码错误' }
  }
  return {
    success: true,
    user: {
      email: user.email,
      nickname: user.nickname,
      createdAt: user.createdAt
    }
  }
}

export const updateUserPassword = (email, newPassword) => {
  const users = getMockUsers()
  const emailKey = email.toLowerCase()

  if (!users[emailKey]) {
    return { success: false, message: '用户不存在' }
  }

  users[emailKey].password = newPassword
  saveMockUsers(users)
  return { success: true, message: '密码修改成功' }
}

export const requestPasswordReset = (email) => {
  const user = findUserByEmail(email)
  if (!user) {
    return { success: false, message: '该邮箱未注册' }
  }
  return { success: true, message: '重置链接已发送到您的邮箱，请查收' }
}
