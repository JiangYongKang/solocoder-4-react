import { formatPrice } from '../utils/cartManager'

const PriceDetail = ({ subtotal, discount, deliveryFee, total, discountRule }) => {
  return (
    <div className="price-detail">
      <div className="price-row">
        <span className="price-label">商品小计</span>
        <span className="price-value">{formatPrice(subtotal)}</span>
      </div>
      {discountRule && (
        <div className="price-row discount-row">
          <span className="price-label">
            满减优惠 <span className="rule-desc">({discountRule.description})</span>
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
  )
}

export default PriceDetail
