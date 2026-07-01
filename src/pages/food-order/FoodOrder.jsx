import { useState, useRef, useCallback, useMemo } from 'react'
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS,
  MOCK_DISCOUNT_RULES,
  MOCK_ADDRESSES,
  MOCK_STORE_INFO
} from './data/mockData'
import {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  calculateSubtotal,
  calculateDiscount,
  calculateTotalPrice,
  findApplicableDiscount,
  canCheckout,
  submitOrder,
  formatPrice
} from './utils/cartManager'
import { ORDER_STATUS } from './types'
import CategoryBar from './components/CategoryBar'
import ProductList from './components/ProductList'
import SpecSelector from './components/SpecSelector'
import CartPanel from './components/CartPanel'
import CheckoutBar from './components/CheckoutBar'
import AddressDisplay from './components/AddressDisplay'
import AddressSelector from './components/AddressSelector'
import OrderRemark from './components/OrderRemark'
import OrderResult from './components/OrderResult'
import PriceDetail from './components/PriceDetail'
import './FoodOrder.css'

const FoodOrder = () => {
  const [categories] = useState(MOCK_CATEGORIES)
  const [products] = useState(MOCK_PRODUCTS)
  const [discountRules] = useState(MOCK_DISCOUNT_RULES)
  const [addresses] = useState(MOCK_ADDRESSES)
  const [storeInfo] = useState(MOCK_STORE_INFO)

  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id)
  const [cart, setCart] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find((a) => a.isDefault) || null
  )
  const [orderRemark, setOrderRemark] = useState('')

  const [showSpecSelector, setShowSpecSelector] = useState(false)
  const [specProduct, setSpecProduct] = useState(null)
  const [showCartPanel, setShowCartPanel] = useState(false)
  const [showAddressSelector, setShowAddressSelector] = useState(false)
  const [showOrderResult, setShowOrderResult] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [orderStatus, setOrderStatus] = useState(ORDER_STATUS.PENDING)
  const [showCheckout, setShowCheckout] = useState(false)

  const categoryRefs = useRef({})

  const subtotal = useMemo(() => calculateSubtotal(cart), [cart])
  const discount = useMemo(
    () => calculateDiscount(subtotal, discountRules),
    [subtotal, discountRules]
  )
  const discountRule = useMemo(
    () => findApplicableDiscount(subtotal, discountRules),
    [subtotal, discountRules]
  )
  const total = useMemo(
    () => calculateTotalPrice(subtotal, discount, storeInfo.deliveryFee),
    [subtotal, discount, storeInfo.deliveryFee]
  )
  const checkoutResult = useMemo(
    () => canCheckout(cart, subtotal, storeInfo.minOrderAmount),
    [cart, subtotal, storeInfo.minOrderAmount]
  )

  const handleAddToCart = useCallback((product, selectedSpecs, quantity) => {
    setCart((prevCart) => addToCart(prevCart, product, selectedSpecs, quantity))
  }, [])

  const handleShowSpecs = useCallback((product) => {
    setSpecProduct(product)
    setShowSpecSelector(true)
  }, [])

  const handleUpdateQuantity = useCallback((itemId, quantity) => {
    setCart((prevCart) => updateCartItemQuantity(prevCart, itemId, quantity))
  }, [])

  const handleRemoveItem = useCallback((itemId) => {
    setCart((prevCart) => removeFromCart(prevCart, itemId))
  }, [])

  const handleClearCart = useCallback(() => {
    setCart(clearCart())
  }, [])

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId)
  }, [])

  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address)
  }, [])

  const handleSubmitOrder = useCallback(() => {
    if (!checkoutResult.canCheckout) {
      alert(checkoutResult.reason)
      return
    }

    if (!selectedAddress) {
      setShowAddressSelector(true)
      return
    }

    setShowCheckout(true)
  }, [checkoutResult, selectedAddress])

  const handleConfirmOrder = useCallback(() => {
    setOrderStatus(ORDER_STATUS.SUBMITTING)

    setTimeout(() => {
      const result = submitOrder(
        cart,
        selectedAddress,
        orderRemark,
        subtotal,
        discount,
        storeInfo.deliveryFee,
        total
      )

      if (result.success) {
        setOrderResult(result.order)
        setOrderStatus(ORDER_STATUS.SUCCESS)
        setShowOrderResult(true)
        setShowCheckout(false)
        setCart(clearCart())
        setOrderRemark('')
      } else {
        setOrderStatus(ORDER_STATUS.FAILED)
        alert(result.message)
      }
    }, 1000)
  }, [cart, selectedAddress, orderRemark, subtotal, discount, storeInfo.deliveryFee, total])

  const handleNewOrder = useCallback(() => {
    setShowOrderResult(false)
    setOrderResult(null)
    setOrderStatus(ORDER_STATUS.PENDING)
  }, [])

  const nextDiscount = useMemo(() => {
    const sortedRules = [...discountRules].sort((a, b) => a.minAmount - b.minAmount)
    return sortedRules.find((rule) => subtotal < rule.minAmount)
  }, [subtotal, discountRules])

  return (
    <div className="food-order-page">
      <header className="page-header">
        <h1 className="page-title">{storeInfo.name}</h1>
        <div className="store-info">
          <span className="store-rating">★ {storeInfo.rating}</span>
          <span className="store-sales">月售 {storeInfo.monthlySales}</span>
          <span className="delivery-time">{storeInfo.estimatedDeliveryTime}</span>
        </div>
        <div className="delivery-fee-info">
          配送费 {formatPrice(storeInfo.deliveryFee)} · 起送 {formatPrice(storeInfo.minOrderAmount)}
        </div>
      </header>

      <AddressDisplay
        address={selectedAddress}
        onClick={() => setShowAddressSelector(true)}
      />

      {nextDiscount && (
        <div className="discount-tip">
          再买 {formatPrice(nextDiscount.minAmount - subtotal)} 可享 {nextDiscount.description}
        </div>
      )}

      <div className="main-content">
        <CategoryBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleCategorySelect}
        />
        <ProductList
          categories={categories}
          products={products}
          selectedCategory={selectedCategory}
          cartItems={cart}
          onAddToCart={handleAddToCart}
          onShowSpecs={handleShowSpecs}
          categoryRefs={categoryRefs}
        />
      </div>

      {showCheckout && (
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-header">
              <h3>确认订单</h3>
              <button className="close-btn" onClick={() => setShowCheckout(false)}>
                ×
              </button>
            </div>

            <AddressDisplay
              address={selectedAddress}
              onClick={() => {
                setShowCheckout(false)
                setShowAddressSelector(true)
              }}
            />

            {!selectedAddress && (
              <div className="warning-message">
                ⚠️ 请选择配送地址
              </div>
            )}

            <div className="checkout-items">
              <h4 className="section-title">商品清单</h4>
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <span className="item-name">{item.fullName}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                  <span className="item-price">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <OrderRemark value={orderRemark} onChange={setOrderRemark} />

            <PriceDetail
              subtotal={subtotal}
              discount={discount}
              deliveryFee={storeInfo.deliveryFee}
              total={total}
              discountRule={discountRule}
            />

            <div className="checkout-actions">
              <button
                className={`btn btn-primary btn-large ${
                  orderStatus === ORDER_STATUS.SUBMITTING || !selectedAddress
                    ? 'disabled'
                    : ''
                }`}
                onClick={handleConfirmOrder}
                disabled={orderStatus === ORDER_STATUS.SUBMITTING || !selectedAddress}
              >
                {orderStatus === ORDER_STATUS.SUBMITTING
                  ? '提交中...'
                  : `提交订单 · ${formatPrice(total)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <CheckoutBar
        cartItems={cart}
        subtotal={subtotal}
        discount={discount}
        deliveryFee={storeInfo.deliveryFee}
        minOrderAmount={storeInfo.minOrderAmount}
        discountRule={discountRule}
        canSubmit={checkoutResult.canCheckout}
        checkReason={checkoutResult.reason}
        onOpenCart={() => setShowCartPanel(true)}
        onSubmit={handleSubmitOrder}
      />

      <SpecSelector
        product={specProduct}
        visible={showSpecSelector}
        onClose={() => setShowSpecSelector(false)}
        onConfirm={handleAddToCart}
      />

      <CartPanel
        visible={showCartPanel}
        cartItems={cart}
        subtotal={subtotal}
        discount={discount}
        deliveryFee={storeInfo.deliveryFee}
        total={total}
        discountRule={discountRule}
        onClose={() => setShowCartPanel(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemove={handleRemoveItem}
        onClear={handleClearCart}
        onCheckout={() => {
          setShowCartPanel(false)
          handleSubmitOrder()
        }}
      />

      <AddressSelector
        visible={showAddressSelector}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelect={handleAddressSelect}
        onClose={() => setShowAddressSelector(false)}
      />

      <OrderResult
        visible={showOrderResult}
        order={orderResult}
        status={orderStatus === ORDER_STATUS.SUCCESS ? 'success' : 'failed'}
        onClose={() => setShowOrderResult(false)}
        onNewOrder={handleNewOrder}
      />
    </div>
  )
}

export default FoodOrder
