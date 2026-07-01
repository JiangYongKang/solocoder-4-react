import { TABLE_TYPES, TABLE_TYPE_CONFIG } from './types'
import { formatWaitTime } from './queueManager'

const TableTypeSelector = ({ queueOverview, selectedType, onSelect }) => {
  const tableTypes = Object.values(TABLE_TYPES)

  return (
    <div className="table-type-selector">
      <h2 className="section-title">选择桌型</h2>
      <div className="table-type-list">
        {tableTypes.map(type => {
          const config = TABLE_TYPE_CONFIG[type]
          const waitingCount = queueOverview[type]?.waitingCount || 0
          const estimatedTime = waitingCount * config.avgWaitTime

          return (
            <div
              key={type}
              className={`table-type-card ${selectedType === type ? 'selected' : ''}`}
              onClick={() => onSelect(type)}
            >
              <div className="table-type-header">
                <h3 className="table-type-name">{config.name}</h3>
                <span className="table-seats">{config.seats}</span>
              </div>
              <div className="table-queue-info">
                <div className="queue-item">
                  <span className="queue-label">等待桌数</span>
                  <span className="queue-value">{waitingCount} 桌</span>
                </div>
                <div className="queue-item">
                  <span className="queue-label">预计等待</span>
                  <span className="queue-value">{formatWaitTime(estimatedTime)}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TableTypeSelector
