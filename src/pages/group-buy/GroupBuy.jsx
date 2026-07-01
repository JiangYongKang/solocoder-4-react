import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  MOCK_PRODUCTS,
  MOCK_GROUP_LEADERS,
  generateInitialGroups,
  MOCK_PICKUP_POINTS
} from './data/mockData'
import {
  formatPrice,
  createNewGroup,
  joinGroup,
  getProductGroups,
  sortGroupsByUrgency,
  getOngoingGroups,
  checkGroupExpiry,
  createOrder,
  pickupOrder,
  completeOrder,
  applyAfterSale,
  isUserInGroup
} from './utils/groupBuyManager'
import { PRODUCT_STATUS, GROUP_STATUS } from './types'
import ProductCard from './components/ProductCard'
import GroupCard from './components/GroupCard'
import PickupPointSelector from './components/PickupPointSelector'
import { OrderConfirmModal, OrderDetailCard } from './components/OrderComponents'
import { AfterSaleForm, AfterSaleDetail } from './components/AfterSaleComponents'
import MyOrdersSection from './components/MyOrdersSection'
import './GroupBuy.css'

const CURRENT_USER = {
  id: 'current-user-001',
  nickname: '当前用户',
  phone: '135****1234'
}

const TAB_PRODUCTS = 'products'
const TAB_MY_ORDERS = 'my_orders'

const GroupBuyPage = () => {
  const [products] = useState(MOCK_PRODUCTS)
  const [leaders] = useState(MOCK_GROUP_LEADERS)
  const [pickupPoints] = useState(MOCK_PICKUP_POINTS)
  const [groups, setGroups] = useState(generateInitialGroups)
  const [orders, setOrders] = useState([])
  const [afterSales, setAfterSales] = useState([])

  const [activeTab, setActiveTab] = useState(TAB_PRODUCTS)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [viewingGroups, setViewingGroups] = useState(null)

  const [showPickupSelector, setShowPickupSelector] = useState(false)
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null)
  const [pendingProduct, setPendingProduct] = useState(null)
  const [pendingGroup, setPendingGroup] = useState(null)

  const [showOrderConfirm, setShowOrderConfirm] = useState(false)
  const [viewingOrder, setViewingOrder] = useState(null)

  const [showAfterSaleForm, setShowAfterSaleForm] = useState(false)
  const [afterSaleOrder, setAfterSaleOrder] = useState(null)
  const [viewingAfterSale, setViewingAfterSale] = useState(null)

  const [toast, setToast] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setGroups(prevGroups => prevGroups.map(g => checkGroupExpiry(g)))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  const getLeaderInfo = useCallback((leaderId) => {
    return leaders.find(l => l.id === leaderId) || null
  }, [leaders])

  const getProductById = useCallback((productId) => {
    return products.find(p => p.id === productId) || null
  }, [products])

  const handleStartGroup = useCallback((product) => {
    if (product.status !== PRODUCT_STATUS.ON_SALE) {
      showToast('该商品暂不可团购', 'error')
      return
    }

    const leader = leaders[Math.floor(Math.random() * leaders.length)]
    const newGroup = createNewGroup(product, leader)

    setGroups(prev => [newGroup, ...prev])
    setPendingProduct(product)
    setPendingGroup(newGroup)
    setSelectedPickupPoint(null)
    setShowOrderConfirm(true)
  }, [leaders, showToast])

  const handleJoinGroup = useCallback((product, group) => {
    if (group.status !== GROUP_STATUS.ONGOING) {
      showToast('该团已结束', 'error')
      return
    }

    if (isUserInGroup(group, CURRENT_USER.id)) {
      showToast('您已在该团中', 'warning')
      return
    }

    const result = joinGroup(group, CURRENT_USER)
    if (!result.success) {
      showToast(result.message, 'error')
      return
    }

    setGroups(prev => prev.map(g => g.id === group.id ? result.group : g))

    if (result.isGroupFull) {
      showToast(result.message, 'success')
    }

    setPendingProduct(product)
    setPendingGroup(result.group)
    setSelectedPickupPoint(null)
    setShowOrderConfirm(true)
  }, [showToast])

  const handleViewGroups = useCallback((product) => {
    const productGroups = getProductGroups(groups, product.id)
    const ongoing = sortGroupsByUrgency(getOngoingGroups(productGroups))
    const others = productGroups.filter(g => g.status !== GROUP_STATUS.ONGOING)
    setSelectedProduct(product)
    setViewingGroups([...ongoing, ...others])
  }, [groups])

  const handleSelectPickupPoint = useCallback(() => {
    setShowOrderConfirm(false)
    setShowPickupSelector(true)
  }, [])

  const handleConfirmPickupPoint = useCallback((point) => {
    setSelectedPickupPoint(point)
  }, [])

  const handleClosePickupSelector = useCallback(() => {
    setShowPickupSelector(false)
    if (pendingProduct && pendingGroup) {
      setShowOrderConfirm(true)
    }
  }, [pendingProduct, pendingGroup])

  const handleConfirmOrder = useCallback((quantity) => {
    const result = createOrder(
      pendingProduct,
      pendingGroup,
      selectedPickupPoint,
      CURRENT_USER,
      quantity
    )

    if (!result.success) {
      showToast(result.message, 'error')
      return
    }

    setOrders(prev => [result.order, ...prev])
    setShowOrderConfirm(false)
    setPendingProduct(null)
    setPendingGroup(null)
    setSelectedPickupPoint(null)
    showToast('下单成功！请在7天内提货', 'success')
    setActiveTab(TAB_MY_ORDERS)
  }, [pendingProduct, pendingGroup, selectedPickupPoint, showToast])

  const handleCancelOrderConfirm = useCallback(() => {
    setShowOrderConfirm(false)
    setPendingProduct(null)
    setPendingGroup(null)
    setSelectedPickupPoint(null)
  }, [])

  const handleViewOrder = useCallback((order) => {
    setViewingOrder(order)
  }, [])

  const handlePickupOrder = useCallback(() => {
    if (!viewingOrder) return
    const result = pickupOrder(viewingOrder)
    if (!result.success) {
      showToast(result.message, 'error')
      return
    }
    setOrders(prev => prev.map(o => o.id === result.order.id ? result.order : o))
    setViewingOrder(result.order)
    showToast('提货成功！请确认商品完好', 'success')
  }, [viewingOrder, showToast])

  const handleCompleteOrder = useCallback(() => {
    if (!viewingOrder) return
    const result = completeOrder(viewingOrder)
    if (!result.success) {
      showToast(result.message, 'error')
      return
    }
    setOrders(prev => prev.map(o => o.id === result.order.id ? result.order : o))
    setViewingOrder(result.order)
    showToast('订单已完成！感谢您的支持', 'success')
  }, [viewingOrder, showToast])

  const handleOpenAfterSale = useCallback(() => {
    if (!viewingOrder) return
    setAfterSaleOrder(viewingOrder)
    setViewingOrder(null)
    setShowAfterSaleForm(true)
  }, [viewingOrder])

  const handleSubmitAfterSale = useCallback(({ reasonId, reasonText, description }) => {
    if (!afterSaleOrder) return
    const result = applyAfterSale(afterSaleOrder, reasonId, reasonText, description)
    if (!result.success) {
      showToast(result.message, 'error')
      return
    }

    setAfterSales(prev => [result.afterSale, ...prev])
    setOrders(prev => prev.map(o => o.id === result.updatedOrder.id ? result.updatedOrder : o))
    setShowAfterSaleForm(false)
    setAfterSaleOrder(null)
    showToast('售后申请已提交，客服将尽快处理', 'success')
    setActiveTab(TAB_MY_ORDERS)
  }, [afterSaleOrder, showToast])

  const handleCancelAfterSale = useCallback(() => {
    setShowAfterSaleForm(false)
    setAfterSaleOrder(null)
  }, [])

  const handleViewAfterSale = useCallback((afterSale) => {
    setViewingAfterSale(afterSale)
  }, [])

  const productGroupMap = useMemo(() => {
    const map = {}
    products.forEach(p => {
      const pGroups = getProductGroups(groups, p.id)
      const ongoing = sortGroupsByUrgency(getOngoingGroups(pGroups))
      map[p.id] = ongoing
    })
    return map
  }, [products, groups])

  return (
    <div className="group-buy-page">
      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">生鲜团购</h1>
          <p className="page-subtitle">产地直采 · 品质保证 · 新鲜到家</p>
        </div>
        <div className="header-banner">
          <span className="banner-icon">🎉</span>
          <span className="banner-text">新人首单立减10元</span>
        </div>
      </header>

      <div className="tabs-container">
        <div
          className={`tab-item ${activeTab === TAB_PRODUCTS ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_PRODUCTS)}
        >
          <span className="tab-icon">🛒</span>
          <span className="tab-text">团购商品</span>
        </div>
        <div
          className={`tab-item ${activeTab === TAB_MY_ORDERS ? 'active' : ''}`}
          onClick={() => setActiveTab(TAB_MY_ORDERS)}
        >
          <span className="tab-icon">📦</span>
          <span className="tab-text">我的订单</span>
          {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}
        </div>
      </div>

      <main className="page-content">
        {activeTab === TAB_PRODUCTS && (
          <>
            <section className="products-section">
              <div className="section-header-row">
                <h2 className="section-title">精选生鲜</h2>
                <span className="section-more">产地直供</span>
              </div>

              <div className="product-grid">
                {products.map((product) => (
                  <div key={product.id} onClick={() => handleViewGroups(product)}>
                    <ProductCard
                      product={product}
                      ongoingGroups={productGroupMap[product.id] || []}
                      onStartGroup={(p) => { handleStartGroup(p) }}
                      onJoinGroup={(p, g) => { handleJoinGroup(p, g) }}
                    />
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === TAB_MY_ORDERS && (
          <MyOrdersSection
            orders={orders}
            afterSales={afterSales}
            onViewOrder={handleViewOrder}
            onViewAfterSale={handleViewAfterSale}
          />
        )}
      </main>

      {viewingGroups && selectedProduct && (
        <div className="groups-overlay" onClick={() => { setViewingGroups(null); setSelectedProduct(null) }}>
          <div className="groups-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{selectedProduct.name}</h3>
                <p className="modal-subtitle">
                  <span className="highlight-price">{formatPrice(selectedProduct.groupPrice)}</span>
                  <span className="original-price-strikethrough">{formatPrice(selectedProduct.originalPrice)}</span>
                  <span className="group-size-tip">· {selectedProduct.minGroupSize}人成团</span>
                </p>
              </div>
              <button className="close-btn" onClick={() => { setViewingGroups(null); setSelectedProduct(null) }}>×</button>
            </div>

            <div className="groups-action-bar">
              <button
                className={`btn btn-primary btn-small ${selectedProduct.status !== 'on_sale' ? 'disabled' : ''}`}
                onClick={() => { handleStartGroup(selectedProduct) }}
                disabled={selectedProduct.status !== 'on_sale'}
              >
                🔔 发起新团
              </button>
            </div>

            <div className="groups-list">
              {viewingGroups.length > 0 ? (
                viewingGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    leaderInfo={getLeaderInfo(group.leaderId)}
                    product={getProductById(group.productId)}
                    onJoin={(g) => handleJoinGroup(selectedProduct, g)}
                    isCurrentUserIn={isUserInGroup(group, CURRENT_USER.id)}
                  />
                ))
              ) : (
                <div className="groups-empty">
                  <div className="empty-icon-large">🤝</div>
                  <p className="empty-text">暂无拼团，快来发起第一个吧！</p>
                  <button
                    className={`btn btn-primary ${selectedProduct.status !== 'on_sale' ? 'disabled' : ''}`}
                    onClick={() => handleStartGroup(selectedProduct)}
                    disabled={selectedProduct.status !== 'on_sale'}
                  >
                    发起拼团
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showPickupSelector && (
        <PickupPointSelector
          pickupPoints={pickupPoints}
          selectedPickupPoint={selectedPickupPoint}
          onSelect={handleConfirmPickupPoint}
          onClose={handleClosePickupSelector}
        />
      )}

      {showOrderConfirm && pendingProduct && pendingGroup && (
        <OrderConfirmModal
          product={pendingProduct}
          group={pendingGroup}
          pickupPoint={selectedPickupPoint}
          onSelectPickup={handleSelectPickupPoint}
          onConfirm={handleConfirmOrder}
          onClose={handleCancelOrderConfirm}
        />
      )}

      {viewingOrder && (
        <OrderDetailCard
          order={viewingOrder}
          onPickup={handlePickupOrder}
          onComplete={handleCompleteOrder}
          onApplyAfterSale={handleOpenAfterSale}
          onClose={() => setViewingOrder(null)}
        />
      )}

      {showAfterSaleForm && afterSaleOrder && (
        <AfterSaleForm
          order={afterSaleOrder}
          onSubmit={handleSubmitAfterSale}
          onClose={handleCancelAfterSale}
        />
      )}

      {viewingAfterSale && (
        <AfterSaleDetail
          afterSale={viewingAfterSale}
          onClose={() => setViewingAfterSale(null)}
        />
      )}

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default GroupBuyPage
