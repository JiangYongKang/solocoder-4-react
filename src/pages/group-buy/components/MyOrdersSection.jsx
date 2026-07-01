import { ORDER_STATUS_CONFIG } from '../types'
import { formatPrice, formatPickupDeadline, formatDate } from '../utils/groupBuyManager'

const MyOrdersSection = ({ orders, afterSales, onViewOrder, onViewAfterSale }) => {
  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-icon-large">📦</div>
        <p className="empty-text">暂无订单，快去拼团吧！</p>
      </div>
    )
  }

  return (
    <div className="my-orders-section">
      <div className="section-header-row">
        <h2 className="section-title">我的订单</h2>
        <span className="order-count">共 {orders.length} 笔</span>
      </div>

      <div className="order-list">
        {orders.map((order) => {
          const statusConfig = ORDER_STATUS_CONFIG[order.status]
          const hasAfterSale = afterSales.some(a => a.orderId === order.id)

          return (
            <div key={order.id} className="order-card" onClick={() => onViewOrder && onViewOrder(order)}>
              <div className="order-card-header">
                <span className="order-date">{formatDate(order.createdAt)}</span>
                <span
                  className="order-status-tag"
                  style={{ backgroundColor: `${statusConfig.color}15`, color: statusConfig.color }}
                >
                  {statusConfig.text}
                </span>
              </div>

              <div className="order-card-body">
                <div className="order-product-image-small">
                  <span className="product-emoji-small">🥑</span>
                </div>
                <div className="order-product-info-small">
                  <h4 className="order-product-name-small">{order.productName}</h4>
                  <p className="order-product-spec-small">{order.productSpec}</p>
                  <div className="order-product-meta">
                    <span>{formatPrice(order.unitPrice)} × {order.quantity}</span>
                  </div>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="order-footer-left">
                  <span className="pickup-point-short">📍 {order.pickupPoint.name.substring(0, 12)}...</span>
                  {order.status === 'paid' && (
                    <span className="pickup-deadline-short">
                      截止 {formatPickupDeadline(order.pickupDeadline)}
                    </span>
                  )}
                </div>
                <div className="order-footer-right">
                  <span className="order-total-label">实付</span>
                  <span className="order-total-value">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              <div className="order-card-actions">
                {hasAfterSale && (
                  <button
                    className="btn btn-tiny btn-warning-inline"
                    onClick={(e) => {
                      e.stopPropagation()
                      const as = afterSales.find(a => a.orderId === order.id)
                      onViewAfterSale && onViewAfterSale(as)
                    }}
                  >
                    查看售后
                  </button>
                )}
                <button
                  className="btn btn-tiny btn-primary-inline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onViewOrder && onViewOrder(order)
                  }}
                >
                  查看详情
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrdersSection
