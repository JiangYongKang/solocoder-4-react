import { PRODUCT_STATUS_CONFIG } from '../types'
import { formatPrice, calculateGroupProgress, getRemainingSlots } from '../utils/groupBuyManager'

const ProductCard = ({ product, ongoingGroups = [], onStartGroup, onJoinGroup }) => {
  const statusConfig = PRODUCT_STATUS_CONFIG[product.status]
  const hasOngoingGroups = ongoingGroups.length > 0
  const nearestGroup = hasOngoingGroups ? ongoingGroups[0] : null
  const currentProgress = nearestGroup
    ? calculateGroupProgress(nearestGroup.members.length, nearestGroup.minGroupSize)
    : 0
  const remaining = nearestGroup
    ? getRemainingSlots(nearestGroup.members.length, nearestGroup.minGroupSize)
    : product.minGroupSize
  const discountPercent = Math.round((1 - product.groupPrice / product.originalPrice) * 100)

  const isSoldOut = product.status !== 'on_sale'

  return (
    <div className={`product-card ${isSoldOut ? 'sold-out' : ''}`}>
      <div className="product-image-placeholder">
        <span className="product-emoji">🥑</span>
        <span className="discount-badge">-{discountPercent}%</span>
        {statusConfig && (
          <span
            className="product-status-badge"
            style={{ backgroundColor: statusConfig.color }}
          >
            {statusConfig.text}
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-spec">{product.spec}</p>

        <div className="price-row">
          <span className="group-price">{formatPrice(product.groupPrice)}</span>
          <span className="original-price">{formatPrice(product.originalPrice)}</span>
        </div>

        <div className="product-meta">
          <span className="stock-info">库存 {product.stock} 件</span>
          <span className="group-info">{product.minGroupSize}人成团</span>
        </div>

        {nearestGroup && nearestGroup.status === 'ongoing' && (
          <div className="active-group-info">
            <div className="group-progress-header">
              <span className="group-progress-text">
                已有 {nearestGroup.members.length} 人参团，还差 {remaining} 人
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${currentProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="product-actions">
          <button
            className="btn btn-secondary btn-small"
            onClick={() => !isSoldOut && onStartGroup && onStartGroup(product)}
            disabled={isSoldOut}
          >
            发起新团
          </button>
          <button
            className={`btn btn-primary btn-small ${isSoldOut ? 'disabled' : ''}`}
            onClick={() => !isSoldOut && nearestGroup && onJoinGroup && onJoinGroup(product, nearestGroup)}
            disabled={isSoldOut || !nearestGroup}
          >
            {nearestGroup ? '去参团' : '暂无拼团'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
