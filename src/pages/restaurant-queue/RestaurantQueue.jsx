import { useState, useEffect, useCallback } from 'react'
import { MOCK_STORES } from './mockData'
import { NOTIFICATION_TYPES, QUEUE_STATUS, STORE_STATUS } from './types'
import {
  createQueueNumber,
  cancelQueueNumber,
  requeueAfterExpired,
  refreshQueueOverview,
  updateQueueNumberStatus,
  updateEstimatedWaitTime,
  canTakeNumber,
  formatTime
} from './queueManager'
import StoreSelector from './StoreSelector'
import TableTypeSelector from './TableTypeSelector'
import QueueNumberCard from './QueueNumberCard'
import NotificationArea from './NotificationArea'
import './RestaurantQueue.css'

const RestaurantQueue = () => {
  const [stores] = useState(MOCK_STORES)
  const [selectedStore, setSelectedStore] = useState(null)
  const [selectedTableType, setSelectedTableType] = useState(null)
  const [queueOverview, setQueueOverview] = useState({})
  const [queueNumber, setQueueNumber] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const addNotification = useCallback((type, message) => {
    const newNotification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      time: formatTime(new Date())
    }
    setNotifications(prev => [newNotification, ...prev].slice(0, 10))
  }, [])

  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const handleStoreSelect = useCallback((store) => {
    setSelectedStore(store)
    setQueueOverview({ ...store.queueOverview })
    setSelectedTableType(null)
    addNotification(NOTIFICATION_TYPES.INFO, `已选择门店：${store.name}`)
  }, [addNotification])

  const handleTableTypeSelect = useCallback((type) => {
    setSelectedTableType(type)
  }, [])

  const handleTakeNumber = useCallback(() => {
    const checkResult = canTakeNumber(selectedStore, selectedTableType)
    if (!checkResult.canTake) {
      addNotification(NOTIFICATION_TYPES.WARNING, checkResult.reason)
      return
    }

    const newQueueNumber = createQueueNumber(
      selectedStore.id,
      selectedTableType,
      queueOverview
    )
    setQueueNumber(newQueueNumber)
    addNotification(
      NOTIFICATION_TYPES.SUCCESS,
      `取号成功！您的号码是 ${newQueueNumber.number}`
    )
  }, [selectedStore, selectedTableType, queueOverview, addNotification])

  const handleCancelNumber = useCallback(() => {
    if (!queueNumber) return

    const cancelled = cancelQueueNumber(queueNumber)
    setQueueNumber(cancelled)
    addNotification(
      NOTIFICATION_TYPES.INFO,
      `号码 ${queueNumber.number} 已取消`
    )
  }, [queueNumber, addNotification])

  const handleRequeue = useCallback(() => {
    if (!queueNumber || queueNumber.status !== QUEUE_STATUS.EXPIRED) return

    const newQueueNumber = requeueAfterExpired(queueNumber, queueOverview)
    setQueueNumber(newQueueNumber)
    addNotification(
      NOTIFICATION_TYPES.SUCCESS,
      `重新取号成功！新号码是 ${newQueueNumber.number}`
    )
  }, [queueNumber, queueOverview, addNotification])

  const handleRefresh = useCallback(() => {
    if (!selectedStore) return

    setIsRefreshing(true)
    setTimeout(() => {
      const updatedQueue = refreshQueueOverview(queueOverview, selectedStore.id)
      setQueueOverview(updatedQueue)
      setLastUpdated(new Date())

      if (queueNumber && 
          queueNumber.status !== QUEUE_STATUS.CANCELLED && 
          queueNumber.status !== QUEUE_STATUS.EXPIRED) {
        let updatedNumber = updateEstimatedWaitTime(queueNumber, updatedQueue)
        updatedNumber = updateQueueNumberStatus(updatedNumber, updatedQueue)
        
        if (updatedNumber.status !== queueNumber.status) {
          if (updatedNumber.status === QUEUE_STATUS.SOON) {
            addNotification(
              NOTIFICATION_TYPES.WARNING,
              `号码 ${queueNumber.number} 即将叫号，请做好准备！`
            )
          } else if (updatedNumber.status === QUEUE_STATUS.CALLED) {
            addNotification(
              NOTIFICATION_TYPES.SUCCESS,
              `🎉 号码 ${queueNumber.number} 已叫号，请尽快到店用餐！`
            )
          } else if (updatedNumber.status === QUEUE_STATUS.EXPIRED) {
            addNotification(
              NOTIFICATION_TYPES.ERROR,
              `号码 ${queueNumber.number} 已过号，请重新取号或取消`
            )
          }
        }
        
        setQueueNumber(updatedNumber)
      }

      setIsRefreshing(false)
      addNotification(NOTIFICATION_TYPES.INFO, '排队信息已刷新')
    }, 500)
  }, [selectedStore, queueOverview, queueNumber, addNotification])

  const handleNewNumber = useCallback(() => {
    setQueueNumber(null)
    setSelectedTableType(null)
  }, [])

  useEffect(() => {
    if (!selectedStore) return

    const interval = setInterval(() => {
      handleRefresh()
    }, 10000)

    return () => clearInterval(interval)
  }, [selectedStore, handleRefresh])

  const showTakeNumberSection = !queueNumber || 
    queueNumber.status === QUEUE_STATUS.CANCELLED

  return (
    <div className="restaurant-queue-page">
      <header className="page-header">
        <h1 className="page-title">餐厅排队取号</h1>
        {lastUpdated && (
          <span className="last-updated">
            最后更新: {formatTime(lastUpdated)}
          </span>
        )}
      </header>

      <StoreSelector
        stores={stores}
        selectedStore={selectedStore}
        onSelect={handleStoreSelect}
      />

      {selectedStore && selectedStore.status === STORE_STATUS.OPEN && (
        <>
          {showTakeNumberSection ? (
            <>
              <TableTypeSelector
                queueOverview={queueOverview}
                selectedType={selectedTableType}
                onSelect={handleTableTypeSelect}
              />

              <div className="take-number-section">
                <button
                  className={`btn btn-large btn-primary ${!selectedTableType ? 'disabled' : ''}`}
                  onClick={handleTakeNumber}
                  disabled={!selectedTableType}
                >
                  立即取号
                </button>
              </div>
            </>
          ) : (
            <>
              <QueueNumberCard
                queueNumber={queueNumber}
                onCancel={handleCancelNumber}
                onRequeue={handleRequeue}
              />

              <div className="refresh-section">
                <button
                  className={`btn btn-refresh ${isRefreshing ? 'loading' : ''}`}
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  {isRefreshing ? '刷新中...' : '🔄 刷新排队状态'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleNewNumber}
                >
                  取新号
                </button>
              </div>
            </>
          )}
        </>
      )}

      <NotificationArea
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  )
}

export default RestaurantQueue
