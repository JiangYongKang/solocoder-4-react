const AddressDisplay = ({ address, onClick }) => {
  const getFullAddress = (addr) => {
    return `${addr.province}${addr.city}${addr.district}${addr.detail}`
  }

  return (
    <div className="address-display" onClick={onClick}>
      {address ? (
        <div className="address-content">
          <div className="address-icon">📍</div>
          <div className="address-info">
            <div className="address-top">
              <span className="address-name">{address.name}</span>
              <span className="address-phone">{address.phone}</span>
              {address.tag && <span className="address-tag">{address.tag}</span>}
            </div>
            <div className="address-detail">{getFullAddress(address)}</div>
          </div>
          <div className="address-arrow">›</div>
        </div>
      ) : (
        <div className="address-empty-display">
          <div className="address-icon">📍</div>
          <div className="address-empty-text">
            <span className="no-address">请选择配送地址</span>
          </div>
          <div className="address-arrow">›</div>
        </div>
      )}
    </div>
  )
}

export default AddressDisplay
