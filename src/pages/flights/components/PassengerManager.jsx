import { useState } from 'react'
import { validatePassenger } from '../utils/validation'

const ID_TYPES = [
  { value: 'idcard', label: '身份证' },
  { value: 'passport', label: '护照' }
]

const emptyPassenger = () => ({
  id: null,
  name: '',
  idType: 'idcard',
  idNo: '',
  phone: ''
})

function PassengerManager({ passengers, selectedIds, onUpdatePassengers, onSelectPassenger }) {
  const [showForm, setShowForm] = useState(false)
  const [editingPassenger, setEditingPassenger] = useState(null)
  const [formData, setFormData] = useState(emptyPassenger())
  const [errors, setErrors] = useState({})

  const openAddForm = () => {
    setEditingPassenger(null)
    setFormData(emptyPassenger())
    setErrors({})
    setShowForm(true)
  }

  const openEditForm = (passenger) => {
    setEditingPassenger(passenger)
    setFormData({ ...passenger })
    setErrors({})
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingPassenger(null)
    setFormData(emptyPassenger())
    setErrors({})
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const result = validatePassenger(formData)
    if (!result.isValid) {
      setErrors(result.errors)
      return
    }

    if (editingPassenger) {
      const updated = passengers.map(p =>
        p.id === editingPassenger.id ? { ...formData, id: editingPassenger.id } : p
      )
      onUpdatePassengers(updated)
    } else {
      const newPassenger = {
        ...formData,
        id: 'p_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
      }
      onUpdatePassengers([...passengers, newPassenger])
    }
    closeForm()
  }

  const handleDelete = (passengerId) => {
    if (!window.confirm('确定删除该乘机人吗？')) return
    const updated = passengers.filter(p => p.id !== passengerId)
    onUpdatePassengers(updated)
    if (selectedIds.includes(passengerId)) {
      onSelectPassenger(passengerId, false)
    }
  }

  const toggleSelect = (passengerId) => {
    const isSelected = selectedIds.includes(passengerId)
    onSelectPassenger(passengerId, !isSelected)
  }

  return (
    <div className="passenger-manager-container">
      <div className="passenger-manager-header">
        <h3 className="section-title">乘机人信息</h3>
        <button className="add-passenger-btn" onClick={openAddForm}>
          + 新增乘机人
        </button>
      </div>

      {passengers.length === 0 ? (
        <div className="empty-passenger">
          <p>暂无乘机人，请先添加乘机人信息</p>
        </div>
      ) : (
        <div className="passengers-list">
          {passengers.map(passenger => (
            <div
              key={passenger.id}
              className={`passenger-card ${selectedIds.includes(passenger.id) ? 'selected' : ''}`}
            >
              <div className="passenger-select">
                <label className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(passenger.id)}
                    onChange={() => toggleSelect(passenger.id)}
                  />
                  <span className="checkbox-custom" />
                </label>
              </div>

              <div className="passenger-info">
                <div className="passenger-name-row">
                  <span className="passenger-name">{passenger.name}</span>
                </div>
                <div className="passenger-detail-row">
                  <span className="id-type">
                    {ID_TYPES.find(t => t.value === passenger.idType)?.label}
                  </span>
                  <span className="id-no">{passenger.idNo}</span>
                </div>
                <div className="passenger-detail-row">
                  <span className="phone">{passenger.phone}</span>
                </div>
              </div>

              <div className="passenger-actions">
                <button className="action-btn edit" onClick={() => openEditForm(passenger)}>
                  编辑
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(passenger.id)}>
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeForm()}>
          <div className="modal-content passenger-form-modal">
            <div className="modal-header">
              <h4>{editingPassenger ? '编辑乘机人' : '新增乘机人'}</h4>
              <button className="modal-close" onClick={closeForm}>×</button>
            </div>

            <form className="passenger-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">姓名</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入中文姓名"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">证件类型</label>
                <select
                  className="form-input"
                  value={formData.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                >
                  {ID_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                {errors.idType && <span className="error-text">{errors.idType}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">证件号码</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="请输入证件号码"
                  value={formData.idNo}
                  onChange={(e) => handleInputChange('idNo', e.target.value)}
                />
                {errors.idNo && <span className="error-text">{errors.idNo}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">手机号</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={closeForm}>
                  取消
                </button>
                <button type="submit" className="btn-primary">
                  {editingPassenger ? '保存修改' : '确认添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default PassengerManager
