import { QUEUE_STATUS, QUEUE_STATUS_CONFIG, TABLE_TYPE_CONFIG } from './types'
import { calculateEstimatedCallTime, formatTime, formatWaitTime } from './queueManager'

const QueueNumberCard = ({ queueNumber, onCancel, onRequeue }) => {
  if (!queueNumber) return null

  const statusConfig = QUEUE_STATUS_CONFIG[queueNumber.status]
  const tableConfig = TABLE_TYPE_CONFIG[queueNumber.tableType]
  const estimatedCallTime = calculateEstimatedCallTime(queueNumber)
  const isActive = queueNumber.status === QUEUE_STATUS.WAITING || queueNumber.status === QUEUE_STATUS.SOON
  const isExpired = queueNumber.status === QUEUE_STATUS.EXPIRED
  const isCancelled = queueNumber.status === QUEUE_STATUS.CANCELLED
  const isCalled = queueNumber.status === QUEUE_STATUS.CALLED

  return (
    <div className="queue-number-card">
      <div className="queue-card-header">
        <h2 className="section-title">我的排队号</h2>
        <span 
          className="queue-status-badge"
          style={{ backgroundColor: statusConfig.color + '20', color: statusConfig.color }}
        >
          {statusConfig.text}
        </span>
      </div>

      <div className="queue-number-display">
        <div className="queue-number-main">
          <span className="queue-number-label">排队号码</span>
          <span className="queue-number-value">{queueNumber.number}</span>
        </div>
        <div className="queue-number-sub">
          <span className="queue-table-type">{tableConfig.name} ({tableConfig.seats})</span>
        </div>
      </div>

      <div className="queue-info-grid">
        <div className="queue-info-item">
          <span className="queue-info-label">前方等待</span>
          <span className="queue-info-value">
            {queueNumber.waitingCount > 0 ? `${queueNumber.waitingCount} 桌` : '即将叫号'}
          </span>
        </div>
        <div className="queue-info-item">
          <span className="queue-info-label">预计叫号</span>
          <span className="queue-info-value">{formatTime(estimatedCallTime)}</span>
        </div>
        <div className="queue-info-item">
          <span className="queue-info-label">预计等待</span>
          <span className="queue-info-value">{formatWaitTime(queueNumber.estimatedWaitTime)}</span>
        </div>
      </div>

      {queueNumber.isRequeue && (
        <div className="queue-requeue-note">
          🔄 重新取号，原号码：{queueNumber.originalNumber}
        </div>
      )}

      {isCalled && (
        <div className="queue-called-alert">
          🎉 您的号码已叫号，请尽快到店用餐！
        </div>
      )}

      {isExpired && (
        <div className="queue-expired-alert">
          ⚠️ 您的号码已过号，您可以选择重新取号或取消当前号码
        </div>
      )}

      {isCancelled && (
        <div className="queue-cancelled-note">
          该号码已取消
        </div>
      )}

      <div className="queue-actions">
        {isActive && (
          <button className="btn btn-secondary" onClick={onCancel}>
            取消取号
          </button>
        )}
        {isExpired && (
          <>
            <button className="btn btn-primary" onClick={onRequeue}>
              重新取号
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              取消号码
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default QueueNumberCard
