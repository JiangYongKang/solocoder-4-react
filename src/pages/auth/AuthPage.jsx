import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import ChangePasswordForm from './components/ChangePasswordForm'
import './AuthPage.css'

const TABS = [
  { key: 'login', label: '登录', requiresAuth: false },
  { key: 'register', label: '注册', requiresAuth: false },
  { key: 'forgot', label: '找回密码', requiresAuth: false },
  { key: 'change', label: '修改密码', requiresAuth: true }
]

const AuthPageContent = () => {
  const { isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('login')

  useEffect(() => {
    if (!loading) {
      const tab = TABS.find(t => t.key === activeTab)
      if (tab?.requiresAuth && !isAuthenticated) {
        setActiveTab('login')
      }
    }
  }, [activeTab, isAuthenticated, loading])

  const handleSwitchTab = (tabKey) => {
    const tab = TABS.find(t => t.key === tabKey)
    if (tab?.requiresAuth && !isAuthenticated) {
      setActiveTab('login')
      return
    }
    setActiveTab(tabKey)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'login':
        return <LoginForm onSwitchTab={handleSwitchTab} />
      case 'register':
        return <RegisterForm onSwitchTab={handleSwitchTab} />
      case 'forgot':
        return <ForgotPasswordForm onSwitchTab={handleSwitchTab} />
      case 'change':
        return <ChangePasswordForm onSwitchTab={handleSwitchTab} />
      default:
        return <LoginForm onSwitchTab={handleSwitchTab} />
    }
  }

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-loading">加载中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <header className="auth-header">
          <h1 className="auth-title">用户认证中心</h1>
          <p className="auth-subtitle">欢迎使用我们的服务</p>
        </header>

        <nav className="auth-tabs">
          {TABS.map(tab => {
            if (tab.requiresAuth && !isAuthenticated) {
              return null
            }
            return (
              <button
                key={tab.key}
                type="button"
                className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => handleSwitchTab(tab.key)}
              >
                {tab.label}
              </button>
            )
          })}
        </nav>

        <main className="auth-content">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

const AuthPage = () => {
  return (
    <AuthProvider>
      <AuthPageContent />
    </AuthProvider>
  )
}

export default AuthPage
