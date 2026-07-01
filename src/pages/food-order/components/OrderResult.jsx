import { formatPrice } from '../utils/cartManager'

const OrderResult = ({ visible, order, status, errorMessage, onClose, onNewOrder }) => {
  if (!visible) return null
  if (status !== 'failed' && !order) return null

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(date.getDate()).padStart(2, '0')} ${String(
      date.getHours()
    ).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const getFullAddress = (addr) => {
    return `${addr.province}${addr.city}${addr.district}${addr.detail}`
  }

  return (
    <div className="order-result-overlay" onClick={onClose}>
      <div className="order-result-modal" onClick={(e) => e.stopPropagation()}>
        {status === 'success' ? (
          <>
            <div className="result-icon success">✓</div>
            <h2 className="result-title">下单成功</h2>
            <p className="result-subtitle">订单已提交，商家正在准备</p>

            <div className="order-info-section">
              <div className="info-row">
                <span className="info-label">订单编号</span>
                <span className="info-value">{order.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">下单时间</span>
                <span className="info-value">{formatDate(order.createdAt)}</span>
              </div>
            </div>

            <div className="order-items-section">
              <h4 className="section-title">商品清单</h4>
              <div className="order-items-list">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <span className="item-name">{item.fullName}</span>
                    <span className="item-quantity">×{item.quantity}</span>
                    <span className="item-price">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-price-section">
              <div className="price-row">
                <span className="price-label">商品小计</span>
                <span className="price-value">
                  {formatPrice(order.priceDetail.subtotal)}
                </span>
              </div>
              {order.priceDetail.discount > 0 && (
                <div className="price-row discount-row">
                  <span className="price-label">满减优惠</span>
                  <span className="price-value discount-value">
                    -{formatPrice(order.priceDetail.discount)}
                  </span>
                </div>
              )}
              <div className="price-row">
                <span className="price-label">配送费</span>
                <span className="price-value">
                  {formatPrice(order.priceDetail.deliveryFee)}
                </span>
              </div>
              <div className="price-row total-row">
                <span className="price-label">实付金额</span>
                <span className="price-value total-value">
                  {formatPrice(order.priceDetail.total)}
                </span>
              </div>
            </div>

            {order.remark && (
              <div className="order-remark-section">
                <span className="remark-label">备注：</span>
                <span className="remark-content">{order.remark}</span>
              </div>
            )}

            <div className="delivery-address-section">
              <h4 className="section-title">配送地址</h4>
              <div className="delivery-info">
                <div className="receiver-info">
                  <span className="receiver-name">{order.address.name}</span>
                  <span className="receiver-phone">{order.address.phone}</span>
                </div>
                <div className="receiver-address">
                  {getFullAddress(order.address)}
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button className="btn btn-secondary" onClick={onClose}>
                关闭
              </button>
              <button className="btn btn-primary" onClick={onNewOrder}>
                再来一单
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="result-icon failed">✕</div>
            <h2 className="result-title">下单失败</h2>
            <p className="result-subtitle">{errorMessage || '请稍后重试'}</p>
            <div className="result-actions">
              <button className="btn btn-primary" onClick={onClose}>
                知道了
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderResult
