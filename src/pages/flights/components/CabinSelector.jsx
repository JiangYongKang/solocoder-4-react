import { useState } from 'react'

function CabinSelector({ flight, flightType, selectedCabin, onSelectCabin, onBack }) {
  const [expandedCabin, setExpandedCabin] = useState(selectedCabin?.type || flight.cabins[0]?.type)

  return (
    <div className="cabin-selector-container">
      <div className="cabin-selector-header">
        <button className="back-btn" onClick={onBack}>
          ← 返回航班列表
        </button>
        <h3 className="cabin-selector-title">
          选择舱位 - {flight.airline} {flight.flightNo}
          <span className="flight-type-tag">
            {flightType === 'departure' ? '去程' : '返程'}
          </span>
        </h3>
        <div className="flight-summary">
          <span>{flight.departureTime} {flight.departureAirport}</span>
          <span className="arrow">→</span>
          <span>{flight.arrivalTime} {flight.arrivalAirport}</span>
          <span className="duration-tag">{flight.durationText}</span>
        </div>
      </div>

      <div className="cabins-list">
        {flight.cabins.map(cabin => {
          const isExpanded = expandedCabin === cabin.type
          const isSelected = selectedCabin?.type === cabin.type
          const stockLevel = cabin.stock <= 3 ? 'low' : cabin.stock <= 8 ? 'medium' : 'high'

          return (
            <div
              key={cabin.type}
              className={`cabin-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              <div
                className="cabin-card-header"
                onClick={() => setExpandedCabin(isExpanded ? null : cabin.type)}
              >
                <div className="cabin-info-left">
                  <span className={`cabin-type-badge type-${cabin.type}`}>{cabin.name}</span>
                  <span className={`stock-tag stock-${stockLevel}`}>
                    {cabin.stock <= 3 ? `仅剩${cabin.stock}张` : `余票${cabin.stock}张`}
                  </span>
                </div>
                <div className="cabin-info-right">
                  <div className="cabin-price">
                    <span className="currency">¥</span>
                    <span className="amount">{cabin.price}</span>
                    <span className="unit">/人</span>
                  </div>
                  <button
                    className={`select-cabin-btn ${isSelected ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectCabin(flightType, cabin)
                    }}
                  >
                    {isSelected ? '已选择' : '选择'}
                  </button>
                  <span className={`expand-icon ${isExpanded ? 'up' : 'down'}`}>▾</span>
                </div>
              </div>

              {isExpanded && (
                <div className="cabin-card-detail">
                  <div className="detail-row">
                    <div className="detail-item">
                      <div className="detail-label">退票规则</div>
                      <div className="detail-value">{cabin.refund}</div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <div className="detail-label">改签规则</div>
                      <div className="detail-value">{cabin.change}</div>
                    </div>
                  </div>
                  <div className="detail-row">
                    <div className="detail-item">
                      <div className="detail-label">行李额</div>
                      <div className="detail-value">{cabin.baggage}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CabinSelector
