import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateRegisterForm } from '../utils/validation'

const RegisterForm = ({ onSwitchTab }) => {
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordLevel, setPasswordLevel] = useState(0)

  const getPasswordLevelText = (level) => {
    if (level <= 1) return { text: '弱', className: 'level-weak' }
    if (level <= 3) return { text: '中', className: 'level-medium' }
    return { text: '强', className: 'level-strong' }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (submitError) {
      setSubmitError('')
    }
    if (name === 'password' || name === 'confirmPassword') {
      const validation = validateRegisterForm({ ...formData, [name]: value })
      setPasswordLevel(validation.passwordLevel)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateRegisterForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setPasswordLevel(validation.passwordLevel)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname
      })
      if (!result.success) {
        setSubmitError(result.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  const levelInfo = getPasswordLevelText(passwordLevel)

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="form-title">注册</h2>

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
        <label className="form-label">昵称</label>
        <input
          type="text"
          name="nickname"
          className={`form-input ${errors.nickname ? 'input-error' : ''}`}
          placeholder="请输入昵称（2-20个字符）"
          value={formData.nickname}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.nickname && <span className="error-text">{errors.nickname}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">密码</label>
        <input
          type="password"
          name="password"
          className={`form-input ${errors.password ? 'input-error' : ''}`}
          placeholder="请输入密码（至少6位，建议包含字母和数字）"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div
                className={`strength-fill ${levelInfo.className}`}
                style={{ width: `${Math.min(passwordLevel * 20, 100)}%` }}
              />
            </div>
            <span className={`strength-text ${levelInfo.className}`}>
              强度：{levelInfo.text}
            </span>
          </div>
        )}
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">确认密码</label>
        <input
          type="password"
          name="confirmPassword"
          className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
          placeholder="请再次输入密码"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? '注册中...' : '注册'}
      </button>

      <div className="form-footer">
        <span className="footer-text">已有账号？</span>
        <button
          type="button"
          className="link-btn"
          onClick={() => onSwitchTab('login')}
        >
          立即登录
        </button>
      </div>
    </form>
  )
}

export default RegisterForm
