import { formatPrice, calculateTotalItems } from '../utils/cartManager'

const CheckoutBar = ({
  cartItems,
  subtotal,
  discount,
  deliveryFee,
  minOrderAmount,
  discountRule,
  canSubmit,
  checkReason,
  onOpenCart,
  onSubmit
}) => {
  const totalItems = calculateTotalItems(cartItems)
  const total = Math.max(0, subtotal - discount + deliveryFee)
  const amountToMinOrder = Math.max(0, minOrderAmount - subtotal)

  return (
    <div className="checkout-bar">
      <div className="cart-icon-wrapper" onClick={onOpenCart}>
        <div className="cart-icon">🛒</div>
        {totalItems > 0 && (
          <span className="cart-badge">{totalItems}</span>
        )}
      </div>

      <div className="price-info">
        <div className="price-row">
          <span className="current-total">
            合计：<span className="total-amount">{formatPrice(total)}</span>
          </span>
          {discountRule && (
            <span className="discount-tag">
              已优惠 {formatPrice(discount)}
            </span>
          )}
        </div>
        {discountRule && (
          <div className="discount-info">
            {discountRule.description}
          </div>
        )}
        {!canSubmit && cartItems.length > 0 && (
          <div className="min-order-info">
            还差 {formatPrice(amountToMinOrder)} 起送
          </div>
        )}
      </div>

      <button
        className={`btn btn-submit ${!canSubmit ? 'disabled' : ''}`}
        onClick={onSubmit}
        disabled={!canSubmit}
      >
        {!canSubmit ? (checkReason || '去结算') : '去结算'}
      </button>
    </div>
  )
}

export default CheckoutBar
