import { useCallback, useEffect, useRef, useState } from 'react'
import { calculateProgress, formatDuration } from '../utils.js'

export default function VideoPlayer({
  lesson,
  initialProgress,
  onProgressUpdate,
  onNextLesson,
  onPrevLesson,
  hasNext,
  hasPrev,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(() => initialProgress?.currentTime || 0)
  const [duration, setDuration] = useState(lesson?.duration || 0)
  const [playbackRate, setPlaybackRate] = useState(1)
  const intervalRef = useRef(null)
  const lastSaveRef = useRef(0)
  const lastLessonIdRef = useRef(lesson?.id)

  useEffect(() => {
    lastSaveRef.current = Date.now()
  }, [])

  const progressPercent = calculateProgress(currentTime, duration)

  const saveProgress = useCallback(
    (time, force = false) => {
      const now = Date.now()
      if (force || now - lastSaveRef.current >= 5000) {
        lastSaveRef.current = now
        if (onProgressUpdate) {
          onProgressUpdate({
            currentTime: time,
            duration,
            progressPercent: calculateProgress(time, duration),
          })
        }
      }
    },
    [duration, onProgressUpdate]
  )

  useEffect(() => {
    if (lesson?.id !== lastLessonIdRef.current) {
      lastLessonIdRef.current = lesson?.id
      setCurrentTime(initialProgress?.currentTime || 0)
      setIsPlaying(false)
      setDuration(lesson?.duration || 0)
    }
  }, [lesson?.id, initialProgress, lesson?.duration])

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          const next = Math.min(prev + playbackRate, duration)
          saveProgress(next)
          if (next >= duration) {
            setIsPlaying(false)
            saveProgress(next, true)
          }
          return next
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      saveProgress(currentTime, true)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, playbackRate, duration, currentTime, saveProgress])

  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = x / rect.width
    const newTime = Math.max(0, Math.min(percentage * duration, duration))
    setCurrentTime(newTime)
    saveProgress(newTime, true)
  }

  const handlePlaybackRateChange = (rate) => {
    setPlaybackRate(rate)
  }

  const handlePrev = () => {
    if (onPrevLesson && hasPrev) {
      onPrevLesson()
    }
  }

  const handleNext = () => {
    if (onNextLesson && hasNext) {
      onNextLesson()
    }
  }

  if (!lesson) {
    return (
      <div className="video-player">
        <div className="player-placeholder">
          <p>请选择一个课时开始学习</p>
        </div>
      </div>
    )
  }

  const isCompleted = currentTime >= duration

  return (
    <div className="video-player">
      <div className="player-header">
        <h2 className="lesson-title">{lesson.title}</h2>
        <p className="lesson-duration">时长：{formatDuration(duration)}</p>
      </div>

      <div className="player-video-area">
        <div className={`video-placeholder ${isPlaying ? 'playing' : ''}`}>
          <div className="video-content">
            <div className="video-animation">
              {isPlaying && (
                <div className="playback-indicator">
                  <span className="pulse" />
                  <span className="pulse delay-1" />
                  <span className="pulse delay-2" />
                </div>
              )}
              <div className="video-title-overlay">{lesson.title}</div>
              <div className="playback-rate-badge">{playbackRate}x</div>
            </div>
          </div>
        </div>

        <div className="player-controls">
          <div className="progress-container" onClick={handleSeek}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
              <div
                className="progress-thumb"
                style={{ left: `calc(${progressPercent}% - 6px)` }}
              />
            </div>
          </div>

          <div className="controls-row">
            <div className="left-controls">
              <button
                className="control-btn prev-btn"
                onClick={handlePrev}
                disabled={!hasPrev}
              >
                ◀
              </button>

              <button className="control-btn play-btn" onClick={togglePlay}>
                {isCompleted ? '↻' : isPlaying ? '⏸' : '▶'}
              </button>

              <button
                className="control-btn next-btn"
                onClick={handleNext}
                disabled={!hasNext}
              >
                ▶
              </button>

              <span className="time-display">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            <div className="right-controls">
              <div className="playback-rate-selector">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    className={`rate-btn ${playbackRate === rate ? 'active' : ''}`}
                    onClick={() => handlePlaybackRateChange(rate)}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="player-status">
        <div className="status-item">
          <span className="status-label">学习进度：</span>
          <span className="status-value">{progressPercent.toFixed(1)}%</span>
        </div>
        {isCompleted && (
          <div className="status-item completed">
            <span className="status-value">✓ 已完成</span>
          </div>
        )}
      </div>
    </div>
  )
}
