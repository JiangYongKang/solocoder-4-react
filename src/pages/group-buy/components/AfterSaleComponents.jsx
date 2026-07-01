import { useState } from 'react'
import { AFTER_SALE_REASONS, AFTER_SALE_STATUS_CONFIG } from '../types'
import { formatDate, formatPrice, getAfterSaleStatusText } from '../utils/groupBuyManager'

const AfterSaleForm = ({ order, onSubmit, onClose }) => {
  const [selectedReason, setSelectedReason] = useState(null)
  const [customReason, setCustomReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    const reason = selectedReason || customReason.trim()
    if (!reason) {
      alert('请选择或填写售后原因')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit && onSubmit({
        reasonId: selectedReason?.id || null,
        reasonText: selectedReason?.text || customReason.trim(),
        description: description.trim()
      })
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="aftersale-overlay" onClick={() => !isSubmitting && onClose && onClose()}>
      <div className="aftersale-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">申请售后</h3>
          <button className="close-btn" onClick={() => !isSubmitting && onClose && onClose()}>×</button>
        </div>

        <div className="aftersale-product-info">
          <div className="aftersale-product-image">
            <span className="product-emoji-medium">🥑</span>
          </div>
          <div className="aftersale-product-detail">
            <h4 className="aftersale-product-name">{order.productName}</h4>
            <p className="aftersale-product-spec">{order.productSpec}</p>
            <div className="aftersale-product-price">
              {formatPrice(order.unitPrice)} × {order.quantity} = {formatPrice(order.totalPrice)}
            </div>
          </div>
        </div>

        <div className="aftersale-refund-info">
          <span className="refund-label">预计退款金额</span>
          <span className="refund-amount">{formatPrice(order.totalPrice)}</span>
        </div>

        <div className="form-section">
          <label className="form-label">售后原因 <span className="required">*</span></label>
          <div className="reason-options">
            {AFTER_SALE_REASONS.map((reason) => (
              <div
                key={reason.id}
                className={`reason-option ${selectedReason?.id === reason.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedReason(reason)
                  setCustomReason('')
                }}
              >
                <span className="radio-indicator">
                  {selectedReason?.id === reason.id && <span className="radio-dot" />}
                </span>
                <span className="reason-text">{reason.text}</span>
              </div>
            ))}
          </div>
          <input
            type="text"
            className="form-input"
            placeholder="或输入其他原因..."
            value={customReason}
            onChange={(e) => {
              setCustomReason(e.target.value)
              if (e.target.value.trim()) setSelectedReason(null)
            }}
          />
        </div>

        <div className="form-section">
          <label className="form-label">问题描述</label>
          <textarea
            className="form-textarea"
            placeholder="请详细描述遇到的问题，方便我们更好地为您处理..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="aftersale-notes">
          <p>📋 售后说明：</p>
          <ul>
            <li>提交申请后，客服将在1-3个工作日内处理</li>
            <li>如需补充图片或凭证，请联系在线客服</li>
            <li>处理完成后，退款将原路返回至您的账户</li>
          </ul>
        </div>

        <div className="form-actions">
          <button
            className="btn btn-secondary"
            onClick={() => !isSubmitting && onClose && onClose()}
            disabled={isSubmitting}
          >
            取消
          </button>
          <button
            className={`btn btn-primary ${isSubmitting ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : '提交申请'}
          </button>
        </div>
      </div>
    </div>
  )
}

const AfterSaleDetail = ({ afterSale, onClose }) => {
  const statusConfig = AFTER_SALE_STATUS_CONFIG[afterSale.status]

  return (
    <div className="aftersale-overlay" onClick={onClose}>
      <div className="aftersale-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">售后详情</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="aftersale-status-section" style={{ borderTopColor: statusConfig.color }}>
          <div className="aftersale-status-row">
            <span
              className="aftersale-status-badge"
              style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}
            >
              {statusConfig.text}
            </span>
            <span className="aftersale-id">售后单号：{afterSale.id}</span>
          </div>
          <p className="aftersale-status-desc">{getAfterSaleStatusText(afterSale.status)}</p>
          <p className="aftersale-apply-time">申请时间：{formatDate(afterSale.appliedAt)}</p>
        </div>

        <div className="aftersale-product-info">
          <div className="aftersale-product-image">
            <span className="product-emoji-medium">🥑</span>
          </div>
          <div className="aftersale-product-detail">
            <h4 className="aftersale-product-name">{afterSale.productName}</h4>
            <div className="aftersale-refund-info-inline">
              <span className="refund-label">退款金额</span>
              <span className="refund-amount">{formatPrice(afterSale.refundAmount)}</span>
            </div>
          </div>
        </div>

        <div className="aftersale-info-section">
          <div className="info-row">
            <span className="info-label">售后原因</span>
            <span className="info-value">{afterSale.reasonText}</span>
          </div>
          {afterSale.description && (
            <div className="info-row">
              <span className="info-label">问题描述</span>
              <span className="info-value">{afterSale.description}</span>
            </div>
          )}
          <div className="info-row">
            <span className="info-label">关联订单</span>
            <span className="info-value">{afterSale.orderId}</span>
          </div>
        </div>

        <div className="aftersale-progress">
          <h4 className="progress-title">处理进度</h4>
          <div className="progress-timeline">
            <div className={`timeline-item ${true ? 'completed' : ''}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-title">提交申请</div>
                <div className="timeline-time">{formatDate(afterSale.appliedAt)}</div>
              </div>
            </div>
            <div className={`timeline-item ${afterSale.status !== 'pending' ? 'completed' : 'active'}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-title">客服审核</div>
                <div className="timeline-time">
                  {afterSale.status !== 'pending' ? formatDate(afterSale.appliedAt + 3600000) : '处理中...'}
                </div>
              </div>
            </div>
            <div className={`timeline-item ${afterSale.status === 'completed' ? 'completed' : ''}`}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-title">
                  {afterSale.status === 'completed' ? '退款完成' : '处理完成'}
                </div>
                <div className="timeline-time">
                  {afterSale.status === 'completed'
                    ? formatDate(afterSale.appliedAt + 86400000)
                    : afterSale.status === 'rejected' ? '申请已被拒绝' : '待完成'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-primary btn-full" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export { AfterSaleDetail, AfterSaleForm }

