import { formatPrice } from '../utils/cartManager'

const ProductCard = ({ product, cartQuantity, onAdd, onShowSpecs }) => {
  const handleAddClick = () => {
    if (product.soldOut) return
    if (product.hasSpecs) {
      onShowSpecs(product)
    } else {
      onAdd(product, null, 1)
    }
  }

  const handleIncrease = (e) => {
    e.stopPropagation()
    if (product.soldOut) return
    if (product.hasSpecs) {
      onShowSpecs(product)
    } else {
      onAdd(product, null, 1)
    }
  }

  return (
    <div className={`product-card ${product.soldOut ? 'sold-out' : ''}`}>
      <div className="product-image">
        {product.soldOut && <div className="sold-out-mask">售罄</div>}
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          {product.originalPrice > product.price && (
            <span className="product-discount-tag">
              省¥{(product.originalPrice - product.price).toFixed(0)}
            </span>
          )}
        </div>
        <p className="product-desc">{product.description}</p>
        <div className="product-meta">
          <span className="product-sales">月售 {product.sales}</span>
          {product.hasSpecs && <span className="product-spec-tag">多规格</span>}
        </div>
        <div className="product-footer">
          <div className="product-price">
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="product-actions">
            {cartQuantity > 0 && (
              <div className="quantity-control">
                {cartQuantity > 0 && (
                  <span className="quantity-display">{cartQuantity}</span>
                )}
                <button
                  className="btn-quantity btn-increase"
                  onClick={handleIncrease}
                  disabled={product.soldOut}
                >
                  +
                </button>
              </div>
            )}
            {cartQuantity === 0 && (
              <button
                className="btn-add"
                onClick={handleAddClick}
                disabled={product.soldOut}
              >
                加入购物车
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
