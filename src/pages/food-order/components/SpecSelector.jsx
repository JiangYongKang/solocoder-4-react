import { useState, useEffect } from 'react'
import {
  calculateCartItemPrice,
  validateSpecSelection,
  getDefaultSpecSelection,
  formatPrice
} from '../utils/cartManager'

const SpecSelector = ({ product, visible, onClose, onConfirm }) => {
  const [selectedSpecs, setSelectedSpecs] = useState({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (visible && product) {
      const defaultSpecs = getDefaultSpecSelection(product)
      setSelectedSpecs(defaultSpecs || {})
      setQuantity(1)
    }
  }, [visible, product])

  if (!visible || !product) return null

  const handleSpecSelect = (groupId, optionId, isMultiple) => {
    setSelectedSpecs((prev) => {
      if (isMultiple) {
        const current = prev[groupId] || []
        const exists = current.includes(optionId)
        return {
          ...prev,
          [groupId]: exists
            ? current.filter((id) => id !== optionId)
            : [...current, optionId]
        }
      }
      return {
        ...prev,
        [groupId]: optionId
      }
    })
  }

  const handleConfirm = () => {
    const validation = validateSpecSelection(product, selectedSpecs)
    if (!validation.valid) {
      alert(validation.reason)
      return
    }
    onConfirm(product, selectedSpecs, quantity)
    onClose()
  }

  const currentPrice = calculateCartItemPrice(product, selectedSpecs)
  const totalPrice = currentPrice * quantity

  return (
    <div className="spec-selector-overlay" onClick={onClose}>
      <div className="spec-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="spec-header">
          <div className="spec-product-image" />
          <div className="spec-product-info">
            <h3 className="spec-product-name">{product.name}</h3>
            <p className="spec-product-desc">{product.description}</p>
            <div className="spec-product-price">
              <span className="current-price">{formatPrice(currentPrice)}</span>
              {product.originalPrice > currentPrice && (
                <span className="original-price">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <button className="spec-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="spec-groups">
          {product.specGroups.map((group) => (
            <div key={group.id} className="spec-group">
              <div className="spec-group-title">
                {group.name}
                {group.required && <span className="required-mark"> *</span>}
              </div>
              <div className="spec-options">
                {group.options.map((option) => {
                  const isSelected =
                    group.type === 'multiple'
                      ? (selectedSpecs[group.id] || []).includes(option.id)
                      : selectedSpecs[group.id] === option.id

                  return (
                    <button
                      key={option.id}
                      className={`spec-option ${isSelected ? 'selected' : ''}`}
                      onClick={() =>
                        handleSpecSelect(group.id, option.id, group.type === 'multiple')
                      }
                    >
                      <span>{option.name}</span>
                      {option.price > 0 && (
                        <span className="option-price">+{formatPrice(option.price)}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="spec-footer">
          <div className="spec-quantity">
            <span className="quantity-label">数量</span>
            <div className="quantity-control-large">
              <button
                className="btn-quantity-large"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="btn-quantity-large"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>
          </div>
          <div className="spec-actions">
            <div className="spec-total-price">
              <span className="total-label">合计：</span>
              <span className="total-value">{formatPrice(totalPrice)}</span>
            </div>
            <button className="btn btn-primary btn-confirm" onClick={handleConfirm}>
              加入购物车
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpecSelector
