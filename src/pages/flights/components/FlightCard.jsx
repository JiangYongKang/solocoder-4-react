function FlightCard({ flight, isSelected, onSelect }) {
  const minPrice = Math.min(...flight.cabins.map(c => c.price))
  const minCabin = flight.cabins.find(c => c.price === minPrice)

  return (
    <div
      className={`flight-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(flight)}
    >
      <div className="flight-card-main">
        <div className="flight-info-left">
          <div className="airline-section">
            <div className="airline-logo">{flight.airlineLogo}</div>
            <div className="airline-detail">
              <div className="airline-name">{flight.airline}</div>
              <div className="flight-no">{flight.flightNo}</div>
            </div>
          </div>
        </div>

        <div className="flight-info-center">
          <div className="departure-section">
            <div className="time">{flight.departureTime}</div>
            <div className="airport">{flight.departureAirport}</div>
          </div>

          <div className="duration-section">
            <div className="duration-text">{flight.durationText}</div>
            <div className="route-line">
              <span className="line" />
              <span className={`plane-icon ${flight.isDirect ? 'direct' : 'transfer'}`}>✈</span>
              <span className="line" />
            </div>
            <div className="direct-tag">
              {flight.isDirect ? (
                <span className="tag direct">直飞</span>
              ) : (
                <span className="tag transfer">经停 {flight.stopCity}</span>
              )}
            </div>
          </div>

          <div className="arrival-section">
            <div className="time">{flight.arrivalTime}</div>
            <div className="airport">{flight.arrivalAirport}</div>
          </div>
        </div>

        <div className="flight-info-right">
          <div className="on-time-rate">
            <span className="label">准点率</span>
            <span className="rate">{flight.onTimeRate}%</span>
          </div>
          <div className="price-section">
            <div className="cabin-name">{minCabin?.name}起</div>
            <div className="price">
              <span className="currency">¥</span>
              <span className="amount">{minPrice}</span>
            </div>
          </div>
          <button className={`select-btn ${isSelected ? 'selected' : ''}`}>
            {isSelected ? '已选择' : '选择'}
          </button>
        </div>
      </div>

      <div className="flight-card-footer">
        <div className="cabins-preview">
          {flight.cabins.map(cabin => (
            <div key={cabin.type} className="cabin-tag-preview">
              <span className="cabin-type">{cabin.name}</span>
              <span className="cabin-price">¥{cabin.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FlightCard
