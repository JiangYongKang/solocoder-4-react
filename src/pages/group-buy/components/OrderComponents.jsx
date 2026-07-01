import { useState } from 'react'
import { ORDER_STATUS_CONFIG } from '../types'
import {
    formatPickupDeadline,
    formatPrice,
    validatePickupSelection
} from '../utils/groupBuyManager'

const OrderConfirmModal = ({
  product,
  group,
  pickupPoint,
  onSelectPickup,
  onConfirm,
  onClose
}) => {
  const [quantity, setQuantity] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = product.groupPrice * quantity
  const pickupValidation = validatePickupSelection(pickupPoint)

  const handleSubmit = () => {
    if (!pickupValidation.valid) {
      alert(pickupValidation.message)
      if (!pickupPoint) {
        onSelectPickup && onSelectPickup()
      }
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onConfirm && onConfirm(quantity)
      setIsSubmitting(false)
    }, 800)
  }

  return (
    <div className="order-confirm-overlay" onClick={() => !isSubmitting && onClose && onClose()}>
      <div className="order-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">确认团购</h3>
          <button className="close-btn" onClick={() => !isSubmitting && onClose && onClose()}>×</button>
        </div>

        <div className="order-product-section">
          <div className="order-product-image">
            <span className="product-emoji-large">🥑</span>
          </div>
          <div className="order-product-info">
            <h4 className="order-product-name">{product.name}</h4>
            <p className="order-product-spec">{product.spec}</p>
            <div className="order-product-price-row">
              <span className="order-product-price">{formatPrice(product.groupPrice)}</span>
              <span className="order-product-original-price">{formatPrice(product.originalPrice)}</span>
            </div>
          </div>
        </div>

        <div className="order-section">
          <div className="section-header">
            <span className="section-label">购买数量</span>
            <div className="quantity-selector">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isSubmitting}
              >
                -
              </button>
              <span className="qty-value">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                disabled={isSubmitting}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div
          className={`order-section pickup-point-section ${!pickupPoint ? 'warning' : ''}`}
          onClick={() => !isSubmitting && onSelectPickup && onSelectPickup()}
        >
          <div className="section-header">
            <span className="section-label">提货点</span>
            <span className="section-action">选择 ›</span>
          </div>
          {pickupPoint ? (
            <div className="selected-pickup-info">
              <div className="selected-pickup-name-row">
                <span className="pickup-icon">📍</span>
                <span className="pickup-point-name-small">{pickupPoint.name}</span>
              </div>
              <p className="pickup-point-address-small">{pickupPoint.address}</p>
              <p className="pickup-point-hours-small">🕐 {pickupPoint.businessHours}</p>
            </div>
          ) : (
            <div className="no-pickup-warning">
              ⚠️ 请选择提货点
            </div>
          )}
        </div>

        <div className="order-section">
          <div className="section-header">
            <span className="section-label">提货说明</span>
          </div>
          <ul className="pickup-notes">
            <li>成团成功后，请在7天内到提货点自提</li>
            <li>提货时请出示订单核销码</li>
            <li>如有质量问题，可在提货后24小时内申请售后</li>
          </ul>
        </div>

        <div className="order-price-summary">
          <div className="price-row-item">
            <span className="price-label">商品金额</span>
            <span className="price-value">{formatPrice(product.groupPrice)} × {quantity}</span>
          </div>
          <div className="price-row-item total">
            <span className="price-label">应付金额</span>
            <span className="price-value total-value">{formatPrice(totalPrice)}</span>
          </div>
        </div>

        <div className="order-actions">
          <button
            className={`btn btn-primary btn-large ${isSubmitting ? 'disabled' : ''}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '提交中...' : `确认支付 ${formatPrice(totalPrice)}`}
          </button>
        </div>
      </div>
    </div>
  )
}

const OrderDetailCard = ({ order, onPickup, onComplete, onApplyAfterSale, onClose }) => {
  const statusConfig = ORDER_STATUS_CONFIG[order.status]

  return (
    <div className="order-detail-overlay" onClick={onClose}>
      <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">订单详情</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="order-status-header" style={{ borderTopColor: statusConfig.color }}>
          <div className="order-status-text" style={{ color: statusConfig.color }}>
            {statusConfig.text}
          </div>
          <div className="order-id">订单号：{order.id}</div>
        </div>

        <div className="verification-code-section">
          <div className="verification-label">核销码</div>
          <div className="verification-code">{order.verificationCode}</div>
          <div className="verification-tip">请到店出示此核销码提货</div>
          <div className="verification-barcode">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="barcode-line"
                style={{
                  height: `${20 + (i % 3) * 10}px`,
                  width: `${1 + (i % 2)}px`,
                  opacity: 0.6 + (i % 3) * 0.13
                }}
              />
            ))}
          </div>
        </div>

        <div className="order-product-section">
          <div className="order-product-image">
            <span className="product-emoji-large">🥑</span>
          </div>
          <div className="order-product-info">
            <h4 className="order-product-name">{order.productName}</h4>
            <p className="order-product-spec">{order.productSpec}</p>
            <div className="order-product-price-row">
              <span className="order-product-price">{formatPrice(order.unitPrice)}</span>
              <span className="order-quantity">× {order.quantity}</span>
            </div>
          </div>
        </div>

        <div className="order-info-section">
          <div className="info-row">
            <span className="info-label">提货点</span>
            <span className="info-value">{order.pickupPoint.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">提货地址</span>
            <span className="info-value">{order.pickupPoint.address}</span>
          </div>
          <div className="info-row">
            <span className="info-label">营业时间</span>
            <span className="info-value">{order.pickupPoint.businessHours}</span>
          </div>
          <div className="info-row">
            <span className="info-label">提货截止</span>
            <span className="info-value highlight">{formatPickupDeadline(order.pickupDeadline)}</span>
          </div>
          <div className="info-row">
            <span className="info-label">联系电话</span>
            <span className="info-value">{order.pickupPoint.contactPhone}</span>
          </div>
          <div className="info-row">
            <span className="info-label">订单金额</span>
            <span className="info-value price">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>

        <div className="order-actions-row">
          {order.status === 'paid' && (
            <>
              <button className="btn btn-secondary" onClick={onApplyAfterSale}>
                申请售后
              </button>
              <button className="btn btn-primary" onClick={onPickup}>
                确认提货
              </button>
            </>
          )}
          {order.status === 'picked_up' && (
            <>
              <button className="btn btn-secondary" onClick={onApplyAfterSale}>
                申请售后
              </button>
              <button className="btn btn-primary" onClick={onComplete}>
                确认收货
              </button>
            </>
          )}
          {(order.status === 'completed' || order.status === 'after_sale') && (
            <button className="btn btn-secondary btn-full" onClick={onClose}>
              关闭
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export { OrderConfirmModal, OrderDetailCard }

