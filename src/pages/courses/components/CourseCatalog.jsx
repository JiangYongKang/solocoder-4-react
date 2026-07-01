import { isLessonCompleted, formatDuration } from '../utils.js'

export default function CourseCatalog({
  chapters,
  currentChapterId,
  currentLessonId,
  lessonProgress,
  onChapterSelect,
  onLessonSelect,
}) {
  const handleChapterClick = (chapterId) => {
    if (onChapterSelect) {
      onChapterSelect(chapterId)
    }
  }

  const handleLessonClick = (lessonId) => {
    if (onLessonSelect) {
      onLessonSelect(lessonId)
    }
  }

  return (
    <div className="course-catalog">
      <h2 className="catalog-title">课程目录</h2>
      <div className="chapters-list">
        {chapters.map((chapter) => {
          const isChapterActive = chapter.id === currentChapterId
          const completedLessons = chapter.lessons.filter(
            (lesson) => {
              const progress = lessonProgress[lesson.id]
              return progress && isLessonCompleted(progress.progressPercent)
            }
          ).length

          return (
            <div
              key={chapter.id}
              className={`chapter-item ${isChapterActive ? 'active' : ''}`}
            >
              <div
                className="chapter-header"
                onClick={() => handleChapterClick(chapter.id)}
              >
                <div className="chapter-info">
                  <h3 className="chapter-title">{chapter.title}</h3>
                  <p className="chapter-meta">
                    {completedLessons}/{chapter.lessons.length} 课时已完成
                  </p>
                </div>
                <span className={`chapter-toggle ${isChapterActive ? 'expanded' : ''}`}>
                  {isChapterActive ? '−' : '+'}
                </span>
              </div>

              {isChapterActive && (
                <div className="lessons-list">
                  {chapter.lessons.map((lesson) => {
                    const progress = lessonProgress[lesson.id]
                    const progressPercent = progress ? progress.progressPercent : 0
                    const completed = isLessonCompleted(progressPercent)
                    const isActive = lesson.id === currentLessonId

                    return (
                      <div
                        key={lesson.id}
                        className={`lesson-item ${isActive ? 'active' : ''} ${completed ? 'completed' : ''}`}
                        onClick={() => handleLessonClick(lesson.id)}
                      >
                        <div className="lesson-icon">
                          {completed ? (
                            <span className="icon-check">✓</span>
                          ) : (
                            <span className="icon-play">▶</span>
                          )}
                        </div>
                        <div className="lesson-info">
                          <h4 className="lesson-title">{lesson.title}</h4>
                          <div className="lesson-progress-bar">
                            <div
                              className="lesson-progress-fill"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                        <span className="lesson-duration">
                          {formatDuration(lesson.duration)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
