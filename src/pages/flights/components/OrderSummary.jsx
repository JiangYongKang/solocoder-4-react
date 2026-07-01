import { useState } from 'react'
import { CITIES } from '../data/mockData'
import { calculateOrderPrice, formatDate, generateOrderNo } from '../utils/helpers'

function OrderSummary({
  tripType,
  searchForm,
  selections,
  passengers,
  selectedPassengerIds,
  onConfirm
}) {
  const [showResult, setShowResult] = useState(false)
  const [orderResult, setOrderResult] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const selectedPassengers = passengers.filter(p => selectedPassengerIds.includes(p.id))
  const price = calculateOrderPrice(selections, selectedPassengers)

  const canSubmit =
    selections.length > 0 &&
    selections.every(s => s.flight && s.cabin) &&
    selectedPassengers.length > 0

  const getCityName = (code) => CITIES.find(c => c.code === code)?.name || code

  const handleSubmit = () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    setTimeout(() => {
      const result = {
        orderNo: generateOrderNo(),
        status: 'success',
        total: price.total,
        passengers: selectedPassengers,
        flights: selections.map(s => ({
          flightNo: s.flight.flightNo,
          departure: getCityName(s.flight.departureCity),
          arrival: getCityName(s.flight.arrivalCity),
          date: s.flight.date,
          departureTime: s.flight.departureTime,
          arrivalTime: s.flight.arrivalTime,
          cabin: s.cabin.name,
          type: s.type
        })),
        createTime: new Date().toLocaleString('zh-CN')
      }
      setOrderResult(result)
      setIsSubmitting(false)
      setShowResult(true)
    }, 800)
  }

  const closeResult = () => {
    setShowResult(false)
    setOrderResult(null)
    if (onConfirm) onConfirm()
  }

  return (
    <div className="order-summary-container">
      <div className="order-summary-header">
        <h3 className="section-title">订单信息</h3>
      </div>

      <div className="flight-selection-summary">
        {selections.map((sel, idx) => (
          <div key={idx} className="flight-selection-item">
            <div className="flight-type-tag">{sel.type === 'departure' ? '去程' : '返程'}</div>
            {sel.flight && sel.cabin ? (
              <div className="flight-selection-detail">
                <span className="airline-name">{sel.flight.airline} {sel.flight.flightNo}</span>
                <span className="route">
                  {formatDate(sel.flight.date).split(' ')[0]} {sel.flight.departureTime}
                  {getCityName(sel.flight.departureCity)}
                  →
                  {sel.flight.arrivalTime}
                  {getCityName(sel.flight.arrivalCity)}
                </span>
                <span className="cabin-tag">{sel.cabin.name} ¥{sel.cabin.price}/人</span>
              </div>
            ) : (
              <div className="flight-selection-empty">请选择航班和舱位</div>
            )}
          </div>
        ))}
      </div>

      <div className="passenger-summary">
        <div className="summary-label">已选乘机人</div>
        {selectedPassengers.length === 0 ? (
          <div className="empty-text">请选择乘机人</div>
        ) : (
          <div className="selected-passenger-names">
            {selectedPassengers.map(p => (
              <span key={p.id} className="passenger-chip">{p.name}</span>
            ))}
            <span className="count-text">共 {selectedPassengers.length} 人</span>
          </div>
        )}
      </div>

      <div className="price-breakdown">
        <div className="price-section-title">费用明细</div>

        {selections.filter(s => s.flight && s.cabin).map((sel, idx) => (
          <div key={`flight-${idx}`} className="price-row">
            <span className="price-label">
              {sel.type === 'departure' ? '去程' : '返程'}机票 ({sel.cabin.name})
              × {selectedPassengers.length}人
            </span>
            <span className="price-value">¥{sel.cabin.price * selectedPassengers.length}</span>
          </div>
        ))}

        <div className="price-row">
          <span className="price-label">
            燃油附加费 (¥{price.fuelTax}/人 × {selectedPassengers.length}人 × {price.validSelectionCount}程)
          </span>
          <span className="price-value">¥{price.fuelTax * selectedPassengers.length * price.validSelectionCount}</span>
        </div>

        <div className="price-row">
          <span className="price-label">
            机场建设费 (¥{price.airportTax}/人 × {selectedPassengers.length}人 × {price.validSelectionCount}程)
          </span>
          <span className="price-value">¥{price.airportTax * selectedPassengers.length * price.validSelectionCount}</span>
        </div>

        <div className="price-row">
          <span className="price-label">
            航空意外险 (¥{price.insurancePerPerson}/人 × {selectedPassengers.length}人 × {price.validSelectionCount}程)
          </span>
          <span className="price-value">¥{price.insuranceTotal}</span>
        </div>

        <div className="price-divider" />

        <div className="price-row total-row">
          <span className="price-label">合计</span>
          <span className="price-total">
            <span className="currency">¥</span>
            <span className="amount">{price.total}</span>
          </span>
        </div>
      </div>

      <div className="notice-section">
        <div className="notice-title">改签退票提示</div>
        <ul className="notice-list">
          <li>改签：根据舱位规则，部分舱位支持免费改签，详细规则请在"舱位详情"中查看</li>
          <li>退票：起飞前可申请退票，手续费按各舱位规定收取</li>
          <li>航变保障：如遇航班变动，将自动为您保护至后续航班</li>
          <li>如需退改签，请联系客服或在"我的订单"中操作</li>
        </ul>
      </div>

      <div className="submit-section">
        <button
          className="submit-order-btn"
          onClick={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? '提交中...' : `确认下单 (¥${price.total})`}
        </button>
        {!canSubmit && (
          <div className="submit-hint">
            {!selections.every(s => s.flight && s.cabin) && '请先选择航班和舱位；'}
            {selectedPassengers.length === 0 && '请选择乘机人'}
          </div>
        )}
      </div>

      {showResult && orderResult && (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && closeResult()}>
          <div className="modal-content result-modal">
            <div className="result-icon success">✓</div>
            <h4 className="result-title">下单成功</h4>
            <div className="result-order-no">订单号：{orderResult.orderNo}</div>
            <div className="result-amount">
              支付金额：<span className="amount">¥{orderResult.total}</span>
            </div>

            <div className="result-detail">
              <div className="result-sub-title">航班信息</div>
              {orderResult.flights.map((f, idx) => (
                <div key={idx} className="result-flight-row">
                  <span className="flight-type-tag">{f.type === 'departure' ? '去程' : '返程'}</span>
                  <span>{f.date} {f.flightNo}</span>
                  <span>{f.departureTime} {f.departure} → {f.arrivalTime} {f.arrival}</span>
                  <span className="cabin-tag">{f.cabin}</span>
                </div>
              ))}
            </div>

            <div className="result-detail">
              <div className="result-sub-title">乘机人</div>
              <div className="result-passengers">
                {orderResult.passengers.map(p => (
                  <span key={p.id} className="passenger-chip">{p.name}</span>
                ))}
              </div>
            </div>

            <div className="result-time">创建时间：{orderResult.createTime}</div>

            <button className="btn-primary result-close-btn" onClick={closeResult}>
              完成
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderSummary
