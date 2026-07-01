import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MOCK_PRODUCTS } from './mockData'
import './ProductManagement.css'
import {
    batchDelete,
    batchOffShelf,
    batchOnShelf,
    calculateStatistics,
    filterProducts,
    formatPrice,
    getFilterDescription,
    isLowStock,
    toggleProductStatus,
    updateProductStock,
    validateStockInput
} from './productManager'
import {
    CATEGORY_CONFIG,
    LOW_STOCK_THRESHOLD,
    NOTIFICATION_TYPES,
    PRODUCT_CATEGORIES,
    PRODUCT_STATUS,
    STATUS_CONFIG
} from './types'

const NotificationArea = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null

  const getTypeClass = (type) => {
    const classMap = {
      [NOTIFICATION_TYPES.INFO]: 'notification-info',
      [NOTIFICATION_TYPES.SUCCESS]: 'notification-success',
      [NOTIFICATION_TYPES.WARNING]: 'notification-warning',
      [NOTIFICATION_TYPES.ERROR]: 'notification-error'
    }
    return classMap[type] || 'notification-info'
  }

  return (
    <div className="notification-area">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${getTypeClass(n.type)}`}>
          <span className="notification-message">{n.message}</span>
          <button
            className="notification-close"
            onClick={() => onDismiss(n.id)}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}

const StatisticsCard = ({ label, value, color, icon }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color }}>{value}</div>
    </div>
  </div>
)

const StockEditor = ({ value, productId, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(String(value))
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const val = e.target.value
    setInputValue(val)
    const validation = validateStockInput(val)
    setError(validation.valid ? '' : validation.reason)
  }

  const handleBlur = () => {
    const validation = validateStockInput(inputValue)
    if (validation.valid) {
      onSave(productId, validation.value)
    } else {
      setError(validation.reason)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleBlur()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="stock-editor">
      <input
        type="number"
        className={`stock-input ${error ? 'input-error' : ''}`}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        min="0"
        max="99999"
      />
      {error && <span className="stock-error">{error}</span>}
    </div>
  )
}

const ProductManagement = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [editingStockId, setEditingStockId] = useState(null)
  const [notifications, setNotifications] = useState([])
  const headerSelectAllRef = useRef(null)
  const batchSelectAllRef = useRef(null)

  const addNotification = useCallback((type, message) => {
    const newNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message
    }
    setNotifications((prev) => [newNotification, ...prev].slice(0, 5))
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
    }, 3000)
  }, [])

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const statistics = useMemo(() => calculateStatistics(products), [products])

  const filteredProducts = useMemo(
    () => filterProducts(products, {
      category: selectedCategory,
      status: selectedStatus,
      keyword
    }),
    [products, selectedCategory, selectedStatus, keyword]
  )

  const filterDescription = useMemo(
    () => getFilterDescription(
      { category: selectedCategory, status: selectedStatus, keyword },
      CATEGORY_CONFIG,
      STATUS_CONFIG
    ),
    [selectedCategory, selectedStatus, keyword]
  )

  const allFilteredSelected = useMemo(() => {
    if (filteredProducts.length === 0) return false
    return filteredProducts.every((p) => selectedIds.has(p.id))
  }, [filteredProducts, selectedIds])

  const someFilteredSelected = useMemo(() => {
    return filteredProducts.some((p) => selectedIds.has(p.id))
  }, [filteredProducts, selectedIds])

  const handleToggleSelectAll = useCallback(() => {
    if (allFilteredSelected) {
      const newSelected = new Set(selectedIds)
      filteredProducts.forEach((p) => newSelected.delete(p.id))
      setSelectedIds(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      filteredProducts.forEach((p) => newSelected.add(p.id))
      setSelectedIds(newSelected)
    }
  }, [allFilteredSelected, filteredProducts, selectedIds])

  const handleToggleSelectOne = useCallback((productId) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(productId)) {
      newSelected.delete(productId)
    } else {
      newSelected.add(productId)
    }
    setSelectedIds(newSelected)
  }, [selectedIds])

  const handleCategoryChange = useCallback((e) => {
    setSelectedCategory(e.target.value)
  }, [])

  const handleStatusChange = useCallback((e) => {
    setSelectedStatus(e.target.value)
  }, [])

  const handleKeywordChange = useCallback((e) => {
    setKeyword(e.target.value)
  }, [])

  const handleStockSave = useCallback((productId, newStock) => {
    const result = updateProductStock(products, productId, newStock)
    if (result.success) {
      setProducts(result.products)
      setEditingStockId(null)
      const product = products.find((p) => p.id === productId)
      if (product) {
        addNotification(
          NOTIFICATION_TYPES.SUCCESS,
          `「${product.name}」库存已更新为 ${newStock}`
        )
      }
    } else {
      addNotification(NOTIFICATION_TYPES.ERROR, result.reason)
    }
  }, [products, addNotification])

  const handleStockEditCancel = useCallback(() => {
    setEditingStockId(null)
  }, [])

  const handleStartEditStock = useCallback((productId) => {
    setEditingStockId(productId)
  }, [])

  const handleToggleStatus = useCallback((productId) => {
    const updated = toggleProductStatus(products, productId)
    setProducts(updated)
    const product = updated.find((p) => p.id === productId)
    if (product) {
      const action = product.status === PRODUCT_STATUS.ON_SHELF ? '上架' : '下架'
      addNotification(
        NOTIFICATION_TYPES.SUCCESS,
        `「${product.name}」已${action}`
      )
    }
  }, [products, addNotification])

  const handleDeleteProduct = useCallback((productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    if (!window.confirm(`确定删除商品「${product.name}」吗？此操作不可撤销。`)) {
      return
    }

    const result = batchDelete(products, [productId])
    setProducts(result.products)
    const newSelected = new Set(selectedIds)
    newSelected.delete(productId)
    setSelectedIds(newSelected)
    addNotification(NOTIFICATION_TYPES.SUCCESS, `已删除「${product.name}」`)
  }, [products, selectedIds, addNotification])

  const handleBatchOnShelf = useCallback(() => {
    if (selectedIds.size === 0) {
      addNotification(NOTIFICATION_TYPES.WARNING, '请先选择要操作的商品')
      return
    }
    const result = batchOnShelf(products, Array.from(selectedIds))
    setProducts(result.products)
    addNotification(
      NOTIFICATION_TYPES.SUCCESS,
      `已批量上架 ${result.affectedCount} 件商品`
    )
  }, [products, selectedIds, addNotification])

  const handleBatchOffShelf = useCallback(() => {
    if (selectedIds.size === 0) {
      addNotification(NOTIFICATION_TYPES.WARNING, '请先选择要操作的商品')
      return
    }
    const result = batchOffShelf(products, Array.from(selectedIds))
    setProducts(result.products)
    addNotification(
      NOTIFICATION_TYPES.SUCCESS,
      `已批量下架 ${result.affectedCount} 件商品`
    )
  }, [products, selectedIds, addNotification])

  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) {
      addNotification(NOTIFICATION_TYPES.WARNING, '请先选择要操作的商品')
      return
    }
    if (!window.confirm(`确定删除选中的 ${selectedIds.size} 件商品吗？此操作不可撤销。`)) {
      return
    }
    const result = batchDelete(products, Array.from(selectedIds))
    setProducts(result.products)
    setSelectedIds(new Set())
    addNotification(
      NOTIFICATION_TYPES.SUCCESS,
      `已批量删除 ${result.deletedCount} 件商品`
    )
  }, [products, selectedIds, addNotification])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const handleResetFilters = useCallback(() => {
    setSelectedCategory('all')
    setSelectedStatus('all')
    setKeyword('')
  }, [])

  useEffect(() => {
    const indeterminate = !allFilteredSelected && someFilteredSelected
    if (headerSelectAllRef.current) {
      headerSelectAllRef.current.indeterminate = indeterminate
    }
    if (batchSelectAllRef.current) {
      batchSelectAllRef.current.indeterminate = indeterminate
    }
  }, [allFilteredSelected, someFilteredSelected])

  return (
    <div className="product-management-page">
      <header className="page-header">
        <h1 className="page-title">商品管理</h1>
        <div className="header-subtitle">管理所有商品的库存、状态等信息</div>
      </header>

      <NotificationArea
        notifications={notifications}
        onDismiss={dismissNotification}
      />

      <section className="statistics-section">
        <div className="statistics-grid">
          <StatisticsCard
            label="商品总数"
            value={statistics.totalCount}
            color="#1677ff"
            icon="📦"
          />
          <StatisticsCard
            label="上架数量"
            value={statistics.onShelfCount}
            color="#52c41a"
            icon="✅"
          />
          <StatisticsCard
            label={`低库存 (<${LOW_STOCK_THRESHOLD})`}
            value={statistics.lowStockCount}
            color="#faad14"
            icon="⚠️"
          />
          <StatisticsCard
            label="库存总量"
            value={statistics.totalStock.toLocaleString()}
            color="#722ed1"
            icon="📊"
          />
        </div>
      </section>

      <section className="filter-section">
        <div className="filter-row">
          <div className="filter-item">
            <label className="filter-label">商品分类</label>
            <select
              className="filter-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="all">全部分类</option>
              {Object.values(PRODUCT_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_CONFIG[cat].name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label className="filter-label">商品状态</label>
            <select
              className="filter-select"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="all">全部状态</option>
              {Object.values(PRODUCT_STATUS).map((st) => (
                <option key={st} value={st}>
                  {STATUS_CONFIG[st].text}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item filter-item-grow">
            <label className="filter-label">搜索关键词</label>
            <input
              type="text"
              className="filter-input"
              placeholder="输入商品名称搜索..."
              value={keyword}
              onChange={handleKeywordChange}
            />
          </div>

          <div className="filter-item filter-item-btn">
            <button
              className="btn btn-secondary"
              onClick={handleResetFilters}
            >
              重置筛选
            </button>
          </div>
        </div>

        <div className="filter-info">
          <span className="filter-description">当前筛选: {filterDescription}</span>
          <span className="filter-count">
            共 <strong>{filteredProducts.length}</strong> 条结果
          </span>
        </div>
      </section>

      <section className="batch-actions-section">
        <div className="batch-actions-left">
          <label className="batch-select-all">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              ref={batchSelectAllRef}
              onChange={handleToggleSelectAll}
            />
            <span>
              全选当前页
              {selectedIds.size > 0 && (
                <span className="selected-count"> (已选 {selectedIds.size})</span>
              )}
            </span>
          </label>
          {selectedIds.size > 0 && (
            <button
              className="btn btn-link btn-sm"
              onClick={handleClearSelection}
            >
              清除选择
            </button>
          )}
        </div>

        <div className="batch-actions-right">
          <button
            className={`btn btn-success ${selectedIds.size === 0 ? 'btn-disabled' : ''}`}
            onClick={handleBatchOnShelf}
            disabled={selectedIds.size === 0}
          >
            批量上架
          </button>
          <button
            className={`btn btn-warning ${selectedIds.size === 0 ? 'btn-disabled' : ''}`}
            onClick={handleBatchOffShelf}
            disabled={selectedIds.size === 0}
          >
            批量下架
          </button>
          <button
            className={`btn btn-danger ${selectedIds.size === 0 ? 'btn-disabled' : ''}`}
            onClick={handleBatchDelete}
            disabled={selectedIds.size === 0}
          >
            批量删除
          </button>
        </div>
      </section>

      <section className="product-list-section">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">没有找到匹配的商品</div>
            <div className="empty-desc">尝试修改筛选条件或清除所有筛选</div>
          </div>
        ) : (
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th className="col-checkbox">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={headerSelectAllRef}
                      onChange={handleToggleSelectAll}
                    />
                  </th>
                  <th className="col-name">商品名称</th>
                  <th className="col-category">分类</th>
                  <th className="col-price">价格</th>
                  <th className="col-stock">库存</th>
                  <th className="col-status">状态</th>
                  <th className="col-actions">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`product-row ${selectedIds.has(product.id) ? 'row-selected' : ''}`}
                  >
                    <td className="col-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(product.id)}
                        onChange={() => handleToggleSelectOne(product.id)}
                      />
                    </td>
                    <td className="col-name">
                      <div className="product-name" title={product.name}>
                        {product.name}
                      </div>
                    </td>
                    <td className="col-category">
                      <span
                        className="category-tag"
                        style={{
                          color: CATEGORY_CONFIG[product.category]?.color,
                          backgroundColor: `${CATEGORY_CONFIG[product.category]?.color}15`
                        }}
                      >
                        {CATEGORY_CONFIG[product.category]?.name}
                      </span>
                    </td>
                    <td className="col-price price-text">
                      {formatPrice(product.price)}
                    </td>
                    <td className="col-stock">
                      {editingStockId === product.id ? (
                        <StockEditor
                          value={product.stock}
                          productId={product.id}
                          onSave={handleStockSave}
                          onCancel={handleStockEditCancel}
                        />
                      ) : (
                        <div
                          className={`stock-display ${isLowStock(product.stock) ? 'low-stock' : ''}`}
                          onClick={() => handleStartEditStock(product.id)}
                          title="点击编辑库存"
                        >
                          <span className="stock-value">{product.stock}</span>
                          {isLowStock(product.stock) && (
                            <span className="stock-badge low">低库存</span>
                          )}
                          <span className="stock-edit-icon">✏️</span>
                        </div>
                      )}
                    </td>
                    <td className="col-status">
                      <span
                        className="status-tag"
                        style={{
                          color: STATUS_CONFIG[product.status]?.color,
                          backgroundColor: STATUS_CONFIG[product.status]?.bgColor,
                          borderColor: STATUS_CONFIG[product.status]?.borderColor
                        }}
                      >
                        {STATUS_CONFIG[product.status]?.text}
                      </span>
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <button
                          className={`btn btn-sm ${
                            product.status === PRODUCT_STATUS.ON_SHELF
                              ? 'btn-warning-outline'
                              : 'btn-success-outline'
                          }`}
                          onClick={() => handleToggleStatus(product.id)}
                        >
                          {product.status === PRODUCT_STATUS.ON_SHELF ? '下架' : '上架'}
                        </button>
                        <button
                          className="btn btn-sm btn-danger-outline"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

export default ProductManagement
