import { formatDuration } from '../utils.js'

export default function LearningStats({
  stats,
  courseTitle,
  totalLessons,
  totalDuration,
}) {
  if (!stats) {
    return (
      <div className="stats-container">
        <div className="stats-loading">加载中...</div>
      </div>
    )
  }

  const courseProgress = Math.min(stats.courseProgress || 0, 100)
  const completedLessons = stats.completedLessons || 0
  const totalStudyTime = stats.totalStudyTime || 0

  return (
    <div className="stats-container">
      <div className="stats-header">
        <h2 className="stats-title">学习统计</h2>
        <p className="course-name">{courseTitle}</p>
      </div>

      <div className="stats-overview">
        <div className="overview-circle">
          <div className="circle-progress">
            <svg className="progress-ring" width="120" height="120">
              <circle
                className="progress-ring-bg"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
              />
              <circle
                className="progress-ring-fg"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${
                  2 * Math.PI * 52 * (1 - courseProgress / 100)
                }`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="circle-content">
              <span className="progress-value">{courseProgress.toFixed(1)}%</span>
              <span className="progress-label">完成度</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <span className="stat-label">总学习时长</span>
            <span className="stat-value">{formatDuration(totalStudyTime)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <span className="stat-label">已完成课时</span>
            <span className="stat-value">
              {completedLessons} / {totalLessons}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <span className="stat-label">课程总时长</span>
            <span className="stat-value">{formatDuration(totalDuration)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <span className="stat-label">完成进度</span>
            <span className="stat-value">{courseProgress.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-label-row">
          <span>整体进度</span>
          <span>{courseProgress.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-large">
          <div
            className="progress-bar-fill"
            style={{ width: `${courseProgress}%` }}
          />
        </div>
        <div className="progress-milestones">
          <div className="milestone">
            <span className={`dot ${courseProgress >= 25 ? 'active' : ''}`} />
            <span className="milestone-label">25%</span>
          </div>
          <div className="milestone">
            <span className={`dot ${courseProgress >= 50 ? 'active' : ''}`} />
            <span className="milestone-label">50%</span>
          </div>
          <div className="milestone">
            <span className={`dot ${courseProgress >= 75 ? 'active' : ''}`} />
            <span className="milestone-label">75%</span>
          </div>
          <div className="milestone">
            <span className={`dot ${courseProgress >= 100 ? 'active' : ''}`} />
            <span className="milestone-label">100%</span>
          </div>
        </div>
      </div>

      {stats.updatedAt && (
        <div className="stats-footer">
          <span className="update-time">
            数据更新于：{new Date(stats.updatedAt).toLocaleString('zh-CN')}
          </span>
        </div>
      )}
    </div>
  )
}
