import { STORE_STATUS } from './types'
import { getTotalWaitingCount } from './queueManager'

const StoreSelector = ({ stores, selectedStore, onSelect }) => {
  return (
    <div className="store-selector">
      <h2 className="section-title">选择门店</h2>
      <div className="store-list">
        {stores.map(store => (
          <div
            key={store.id}
            className={`store-card ${selectedStore?.id === store.id ? 'selected' : ''} ${store.status === STORE_STATUS.CLOSED ? 'closed' : ''}`}
            onClick={() => store.status === STORE_STATUS.OPEN && onSelect(store)}
          >
            <div className="store-header">
              <h3 className="store-name">{store.name}</h3>
              <span className={`store-status ${store.status}`}>
                {store.status === STORE_STATUS.OPEN ? '营业中' : '已打烊'}
              </span>
            </div>
            <p className="store-address">📍 {store.address}</p>
            <p className="store-hours">🕐 {store.businessHours}</p>
            <div className="queue-overview">
              <span className="queue-total">
                当前排队: {getTotalWaitingCount(store.queueOverview)} 桌
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreSelector
