import { PICKUP_POINT_STATUS } from '../types'
import { isPickupPointAvailable } from '../utils/groupBuyManager'

const PICKUP_STATUS_TEXT = {
  [PICKUP_POINT_STATUS.AVAILABLE]: { text: '可自提', color: '#52c41a' },
  [PICKUP_POINT_STATUS.FULL]: { text: '已满', color: '#faad14' },
  [PICKUP_POINT_STATUS.CLOSED]: { text: '已关闭', color: '#8c8c8c' }
}

const PickupPointSelector = ({
  pickupPoints,
  selectedPickupPoint,
  onSelect,
  onClose
}) => {
  return (
    <div className="pickup-selector-overlay" onClick={onClose}>
      <div className="pickup-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">选择提货点</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="pickup-point-list">
          {pickupPoints.map((point) => {
            const isAvailable = isPickupPointAvailable(point)
            const isSelected = selectedPickupPoint?.id === point.id
            const statusInfo = PICKUP_STATUS_TEXT[point.status]

            return (
              <div
                key={point.id}
                className={`pickup-point-card ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                onClick={() => isAvailable && onSelect && onSelect(point)}
              >
                <div className="pickup-point-header">
                  <div className="pickup-point-name-row">
                    <h4 className="pickup-point-name">{point.name}</h4>
                    <span
                      className="pickup-point-status"
                      style={{ color: statusInfo.color, backgroundColor: `${statusInfo.color}15` }}
                    >
                      {statusInfo.text}
                    </span>
                  </div>
                  {point.distance && (
                    <span className="pickup-point-distance">{point.distance}</span>
                  )}
                </div>

                <div className="pickup-point-detail-row">
                  <span className="detail-icon">📍</span>
                  <span className="detail-text">{point.address}</span>
                </div>

                <div className="pickup-point-detail-row">
                  <span className="detail-icon">🕐</span>
                  <span className="detail-text">营业时间：{point.businessHours}</span>
                </div>

                <div className="pickup-point-detail-row">
                  <span className="detail-icon">📞</span>
                  <span className="detail-text">{point.contactPhone}</span>
                </div>

                {isSelected && (
                  <div className="selected-indicator">✓ 已选择</div>
                )}
              </div>
            )
          })}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button
            className={`btn btn-primary ${!selectedPickupPoint ? 'disabled' : ''}`}
            onClick={() => selectedPickupPoint && onClose && onClose()}
            disabled={!selectedPickupPoint}
          >
            确认选择
          </button>
        </div>
      </div>
    </div>
  )
}

export default PickupPointSelector
