import { NOTIFICATION_TYPES } from './types'

const NOTIFICATION_ICONS = {
  [NOTIFICATION_TYPES.INFO]: 'ℹ️',
  [NOTIFICATION_TYPES.SUCCESS]: '✅',
  [NOTIFICATION_TYPES.WARNING]: '⚠️',
  [NOTIFICATION_TYPES.ERROR]: '❌'
}

const NotificationArea = ({ notifications, onDismiss }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="notification-area">
        <h2 className="section-title">通知提醒</h2>
        <div className="notification-empty">
          <span className="empty-icon">🔔</span>
          <p className="empty-text">暂无通知</p>
        </div>
      </div>
    )
  }

  return (
    <div className="notification-area">
      <h2 className="section-title">通知提醒</h2>
      <div className="notification-list">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification-item ${notification.type}`}
          >
            <div className="notification-icon">
              {NOTIFICATION_ICONS[notification.type]}
            </div>
            <div className="notification-content">
              <p className="notification-message">{notification.message}</p>
              <span className="notification-time">{notification.time}</span>
            </div>
            {onDismiss && (
              <button
                className="notification-close"
                onClick={() => onDismiss(notification.id)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationArea
