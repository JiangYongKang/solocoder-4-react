import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { validateChangePasswordForm } from '../utils/validation'

const ChangePasswordForm = ({ onSwitchTab }) => {
  const { changePassword, isAuthenticated, user } = useAuth()
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
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
    if (name === 'newPassword' || name === 'confirmNewPassword') {
      const validation = validateChangePasswordForm(
        { ...formData, [name]: value }
      )
      setPasswordLevel(validation.passwordLevel)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateChangePasswordForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      setPasswordLevel(validation.passwordLevel)
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      const result = await changePassword(formData.oldPassword, formData.newPassword)
      if (!result.success) {
        setSubmitError(result.message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="access-denied">
        <div className="denied-icon">🔒</div>
        <h3 className="denied-title">请先登录</h3>
        <p className="denied-message">修改密码功能需要登录后才能使用。</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onSwitchTab('login')}
        >
          去登录
        </button>
      </div>
    )
  }

  const levelInfo = getPasswordLevelText(passwordLevel)

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="form-title">修改密码</h2>

      {submitError && (
        <div className="form-error-banner">{submitError}</div>
      )}

      <div className="current-user-info">
        当前用户：<strong>{user?.nickname}</strong> ({user?.email})
      </div>

      <div className="form-group">
        <label className="form-label">旧密码</label>
        <input
          type="password"
          name="oldPassword"
          className={`form-input ${errors.oldPassword ? 'input-error' : ''}`}
          placeholder="请输入当前密码"
          value={formData.oldPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.oldPassword && <span className="error-text">{errors.oldPassword}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">新密码</label>
        <input
          type="password"
          name="newPassword"
          className={`form-input ${errors.newPassword ? 'input-error' : ''}`}
          placeholder="请输入新密码（至少6位，建议包含字母和数字）"
          value={formData.newPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {formData.newPassword && (
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
        {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">确认新密码</label>
        <input
          type="password"
          name="confirmNewPassword"
          className={`form-input ${errors.confirmNewPassword ? 'input-error' : ''}`}
          placeholder="请再次输入新密码"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.confirmNewPassword && <span className="error-text">{errors.confirmNewPassword}</span>}
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? '修改中...' : '确认修改'}
      </button>

      <p className="form-hint">
        修改密码后，您需要使用新密码重新登录。
      </p>

      <div className="form-footer">
        <button
          type="button"
          className="link-btn"
          onClick={() => onSwitchTab('login')}
        >
          ← 返回
        </button>
      </div>
    </form>
  )
}

export default ChangePasswordForm
