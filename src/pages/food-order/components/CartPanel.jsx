import { formatPrice } from '../utils/cartManager'

const CartPanel = ({
  visible,
  cartItems,
  subtotal,
  discount,
  deliveryFee,
  total,
  discountRule,
  onClose,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout
}) => {
  if (!visible) return null

  return (
    <div className="cart-panel-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3 className="cart-title">购物车</h3>
          <button className="cart-clear-btn" onClick={onClear}>
            清空购物车
          </button>
          <button className="cart-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <p className="empty-text">购物车是空的，快去选购吧~</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image" />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.fullName}</div>
                    {item.specDescription && (
                      <div className="cart-item-spec">{item.specDescription}</div>
                    )}
                    <div className="cart-item-price">
                      {formatPrice(item.unitPrice)}
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="btn-quantity"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button
                      className="btn-quantity btn-increase"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onRemove(item.id)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-price-detail">
              <div className="price-row">
                <span className="price-label">商品小计</span>
                <span className="price-value">{formatPrice(subtotal)}</span>
              </div>
              {discountRule && (
                <div className="price-row discount-row">
                  <span className="price-label">
                    满减优惠 ({discountRule.description})
                  </span>
                  <span className="price-value discount-value">
                    -{formatPrice(discount)}
                  </span>
                </div>
              )}
              <div className="price-row">
                <span className="price-label">配送费</span>
                <span className="price-value">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="price-row total-row">
                <span className="price-label">合计</span>
                <span className="price-value total-value">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="cart-footer">
              <button className="btn btn-primary btn-checkout" onClick={onCheckout}>
                去结算
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPanel
