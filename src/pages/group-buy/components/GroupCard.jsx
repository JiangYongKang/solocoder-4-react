import { useEffect, useState } from 'react'
import { GROUP_STATUS_CONFIG } from '../types'
import {
    calculateGroupProgress,
    formatCountdown,
    formatGroupDescription,
    getGroupTimeRemaining,
    getRemainingSlots
} from '../utils/groupBuyManager'

const GroupCard = ({ group, leaderInfo, product, onJoin, isCurrentUserIn }) => {
  const statusConfig = GROUP_STATUS_CONFIG[group.status]
  const [timeRemaining, setTimeRemaining] = useState(getGroupTimeRemaining(group))

  useEffect(() => {
    if (group.status !== 'ongoing') return

    const timer = setInterval(() => {
      const remaining = getGroupTimeRemaining(group)
      setTimeRemaining(remaining)
      if (remaining <= 0) {
        clearInterval(timer)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [group])

  const progress = calculateGroupProgress(group.members.length, group.minGroupSize)
  const remainingSlots = getRemainingSlots(group.members.length, group.minGroupSize)
  const canJoin = group.status === 'ongoing' && remainingSlots > 0 && !isCurrentUserIn
  const groupLeader = group.members.find(m => m.isLeader)
  const leaderNickname = getLeaderNickname(group)

  return (
    <div className={`group-card ${group.status}`}>
      <div className="group-header">
        <div className="group-title-row">
          <h4 className="group-product-name">{product?.name || '团购商品'}</h4>
          <span
            className="group-status-badge"
            style={{ backgroundColor: statusConfig.color }}
          >
            {statusConfig.text}
          </span>
        </div>
        <p className="group-description">{formatGroupDescription(group)}</p>
      </div>

      {group.status === 'ongoing' && (
        <div className="countdown-section">
          <div className="countdown-label">距离结束还剩</div>
          <div className="countdown-timer">
            {formatCountdown(timeRemaining)}
          </div>
        </div>
      )}

      <div className="leader-section">
        <div className="leader-avatar">
          <span className="leader-avatar-icon">👤</span>
          {groupLeader && (
            <span className="leader-tag">团长</span>
          )}
        </div>
        <div className="leader-info">
          <div className="leader-name-row">
            <span className="leader-nickname">
              {leaderInfo?.nickname || leaderNickname}
            </span>
            {leaderInfo?.storeName && (
              <span className="leader-store">{leaderInfo.storeName}</span>
            )}
          </div>
          <div className="leader-contact">
            <span>{leaderInfo?.phone || '联系电话'}</span>
          </div>
          {leaderInfo?.storeDescription && (
            <p className="leader-desc">{leaderInfo.storeDescription}</p>
          )}
        </div>
      </div>

      <div className="group-members-section">
        <div className="members-header">
          <span className="members-title">参团成员</span>
          <span className="members-count">{group.members.length}/{group.minGroupSize}人</span>
        </div>
        <div className="members-list">
          {group.members.map((member) => (
            <div key={member.id} className={`member-item ${member.isLeader ? 'leader' : ''}`}>
              <div className="member-avatar-small">
                <span>{member.isLeader ? '👑' : '👤'}</span>
              </div>
              <div className="member-info">
                <span className="member-name">{member.nickname}</span>
                {member.isLeader && (
                  <span className="member-role">团长</span>
                )}
              </div>
            </div>
          ))}
          {Array.from({ length: remainingSlots }).map((_, idx) => (
            <div key={`empty-${idx}`} className="member-item empty">
              <div className="member-avatar-small empty">
                <span>➕</span>
              </div>
              <span className="member-name empty-text">虚位以待</span>
            </div>
          ))}
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar-container large">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-text">
          成团进度 {progress}%
        </div>
      </div>

      {group.status === 'ongoing' && (
        <div className="group-actions">
          {isCurrentUserIn ? (
            <button className="btn btn-secondary btn-full" disabled>
              您已在该团中
            </button>
          ) : (
            <button
              className={`btn btn-primary btn-full ${!canJoin ? 'disabled' : ''}`}
              onClick={() => canJoin && onJoin && onJoin(group)}
              disabled={!canJoin}
            >
              {remainingSlots > 0
                ? `加入该团（还差${remainingSlots}人）`
                : '已满员'}
            </button>
          )}
        </div>
      )}

      {group.status === 'success' && (
        <div className="group-success-tip">
          🎉 恭喜，该团已成功成团！
        </div>
      )}

      {group.status === 'failed' && (
        <div className="group-failed-tip">
          😢 很遗憾，该团未能成功成团
        </div>
      )}
    </div>
  )
}

export default GroupCard
