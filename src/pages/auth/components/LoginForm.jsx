import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateLoginForm } from '../utils/validation'

const LoginForm = ({ onSwitchTab }) => {
  const { login, user, isAuthenticated, logout } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateLoginForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await login(formData.email, formData.password)
      if (!result.success) {
        setSubmitError(result.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-success">
        <div className="success-icon">✓</div>
        <h3 className="success-title">已登录</h3>
        <div className="user-info-card">
          <div className="user-info-row">
            <span className="user-info-label">昵称：</span>
            <span className="user-info-value">{user.nickname}</span>
          </div>
          <div className="user-info-row">
            <span className="user-info-label">邮箱：</span>
            <span className="user-info-value">{user.email}</span>
          </div>
          <div className="user-info-row">
            <span className="user-info-label">注册时间：</span>
            <span className="user-info-value">
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={logout}
        >
          退出登录
        </button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="form-title">登录</h2>

      {submitError && (
        <div className="form-error-banner">{submitError}</div>
      )}

      <div className="form-group">
        <label className="form-label">邮箱</label>
        <input
          type="email"
          name="email"
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          placeholder="请输入邮箱"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">密码</label>
        <input
          type="password"
          name="password"
          className={`form-input ${errors.password ? 'input-error' : ''}`}
          placeholder="请输入密码（至少6位）"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? '登录中...' : '登录'}
      </button>

      <div className="form-footer">
        <button
          type="button"
          className="link-btn"
          onClick={() => onSwitchTab('forgot')}
        >
          忘记密码？
        </button>
        <button
          type="button"
          className="link-btn"
          onClick={() => onSwitchTab('register')}
        >
          立即注册
        </button>
      </div>
    </form>
  )
}

export default LoginForm
