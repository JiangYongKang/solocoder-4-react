const AddressSelector = ({
  visible,
  addresses,
  selectedAddress,
  onSelect,
  onClose
}) => {
  if (!visible) return null

  const getFullAddress = (addr) => {
    return `${addr.province}${addr.city}${addr.district}${addr.detail}`
  }

  return (
    <div className="address-selector-overlay" onClick={onClose}>
      <div className="address-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-header">
          <h3 className="address-title">选择配送地址</h3>
          <button className="address-close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="address-empty">
            <div className="empty-icon">📍</div>
            <p className="empty-text">暂无配送地址</p>
            <p className="empty-desc">请先添加收货地址</p>
          </div>
        ) : (
          <div className="address-list">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`address-item ${
                  selectedAddress?.id === addr.id ? 'selected' : ''
                }`}
                onClick={() => {
                  onSelect(addr)
                  onClose()
                }}
              >
                <div className="address-info">
                  <div className="address-top">
                    <span className="address-name">{addr.name}</span>
                    <span className="address-phone">{addr.phone}</span>
                    {addr.tag && <span className="address-tag">{addr.tag}</span>}
                    {addr.isDefault && (
                      <span className="address-tag default-tag">默认</span>
                    )}
                  </div>
                  <div className="address-detail">{getFullAddress(addr)}</div>
                </div>
                <div className="address-radio">
                  <div
                    className={`radio-circle ${
                      selectedAddress?.id === addr.id ? 'checked' : ''
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddressSelector
