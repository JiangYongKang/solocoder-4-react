import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateForgotPasswordForm } from '../utils/validation'

const ForgotPasswordForm = ({ onSwitchTab }) => {
  const { forgotPassword, isAuthenticated, user, logout } = useAuth()
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedEmail, setSubmittedEmail] = useState('')

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
    const validation = validateForgotPasswordForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await forgotPassword(formData.email)
      if (result.success) {
        setSubmittedEmail(formData.email)
        setIsSubmitted(true)
      } else {
        setSubmitError(result.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthenticated && user) {
    return (
      <div className="auth-success">
        <div className="success-icon">🔐</div>
        <h3 className="success-title">您已处于登录状态</h3>
        <p className="success-message">
          当前账号：<strong>{user.email}</strong>
        </p>
        <p className="success-hint">
          如果您忘记了密码，可以直接使用"修改密码"功能。
        </p>
        <div style={{ display: 'flex', gap: '12px', width: '100%', flexDirection: 'column' }}>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={() => onSwitchTab('change')}
          >
            去修改密码
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-block"
            onClick={logout}
          >
            退出登录后找回密码
          </button>
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="auth-success">
        <div className="success-icon">✉</div>
        <h3 className="success-title">重置链接已发送</h3>
        <p className="success-message">
          我们已向 <strong>{submittedEmail}</strong> 发送了密码重置链接，
          请查收邮件并按照提示操作。
        </p>
        <p className="success-hint">
          如未收到邮件，请检查垃圾邮件箱或稍后重试。
        </p>
        <button
          type="button"
          className="btn btn-primary btn-block"
          onClick={() => onSwitchTab('login')}
        >
          返回登录
        </button>
      </div>
    )
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="form-title">找回密码</h2>

      {submitError && (
        <div className="form-error-banner">{submitError}</div>
      )}

      <p className="form-description">
        请输入您注册时使用的邮箱，我们将向您发送密码重置链接。
      </p>

      <div className="form-group">
        <label className="form-label">邮箱</label>
        <input
          type="email"
          name="email"
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          placeholder="请输入注册邮箱"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? '发送中...' : '发送重置链接'}
      </button>

      <div className="form-footer">
        <button
          type="button"
          className="link-btn"
          onClick={() => onSwitchTab('login')}
        >
          ← 返回登录
        </button>
      </div>
    </form>
  )
}

export default ForgotPasswordForm
