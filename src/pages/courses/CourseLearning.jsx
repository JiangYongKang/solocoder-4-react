import { useCallback, useEffect, useRef, useState } from 'react'
import ChapterQuiz from './components/ChapterQuiz.jsx'
import CourseCatalog from './components/CourseCatalog.jsx'
import LearningStats from './components/LearningStats.jsx'
import StudyNotes from './components/StudyNotes.jsx'
import VideoPlayer from './components/VideoPlayer.jsx'
import './CourseLearning.css'
import { courseData, findChapterByLessonId, findLessonById, getNextLesson, getPrevLesson, getTotalLessons } from './mockData.js'
import {
    calculateCourseStats,
    deleteNote,
    loadAllLessonProgress,
    loadLearningState,
    loadNotes,
    loadQuizResult,
    loadStats,
    saveLearningState,
    saveLessonProgress,
    saveNote,
    saveQuizResult,
    toggleNoteFavorite,
    updateStats,
} from './utils.js'

const ACTIVE_TABS = ['video', 'quiz', 'notes', 'stats']

export default function CourseLearning() {
  const course = courseData
  const courseId = course.id
  const savedState = loadLearningState(courseId)
  const initialLessonId = savedState?.currentLessonId || course.chapters[0].lessons[0].id
  const initialLessonInfo = findLessonById(course, initialLessonId)

  const [activeTab, setActiveTab] = useState('video')
  const [currentChapterId, setCurrentChapterId] = useState(
    initialLessonInfo ? initialLessonInfo.chapter.id : course.chapters[0].id
  )
  const [currentLessonId, setCurrentLessonId] = useState(initialLessonId)
  const [lessonProgress, setLessonProgress] = useState(() => loadAllLessonProgress(courseId))
  const [notes, setNotes] = useState(() => loadNotes(courseId, initialLessonId))
  const [quizResult, setQuizResult] = useState(() => {
    const chapter = findChapterByLessonId(course, initialLessonId)
    if (chapter?.quiz) {
      return loadQuizResult(courseId, chapter.quiz.id)
    }
    return null
  })
  const [stats, setStats] = useState(() => loadStats(courseId))
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const statsUpdateRef = useRef(0)
  const studyTimeRef = useRef(0)
  const totalStudyTimeRef = useRef(stats.totalStudyTime || 0)
  const lessonProgressRef = useRef(lessonProgress)

  useEffect(() => {
    totalStudyTimeRef.current = stats.totalStudyTime || 0
  }, [stats.totalStudyTime])

  useEffect(() => {
    lessonProgressRef.current = lessonProgress
  }, [lessonProgress])

  useEffect(() => {
    statsUpdateRef.current = Date.now()
  }, [])

  useEffect(() => {
    saveLearningState(courseId, {
      currentLessonId,
      currentChapterId,
    })
  }, [courseId, currentLessonId, currentChapterId])

  const updateStatsFromProgress = useCallback(() => {
    const courseStats = calculateCourseStats(course, lessonProgressRef.current)
    const newStats = updateStats(courseId, {
      totalStudyTime: totalStudyTimeRef.current,
      completedLessons: courseStats.completedLessons,
      courseProgress: courseStats.courseProgress,
    })
    if (newStats) {
      setStats(newStats)
    }
  }, [courseId, course])

  useEffect(() => {
    const interval = setInterval(() => {
      studyTimeRef.current += 1
      totalStudyTimeRef.current += 1
      const now = Date.now()
      if (now - statsUpdateRef.current >= 5000) {
        statsUpdateRef.current = now
        updateStatsFromProgress()
        studyTimeRef.current = 0
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [courseId, updateStatsFromProgress])

  const currentLesson = findLessonById(course, currentLessonId)?.lesson || null
  const currentChapter = findChapterByLessonId(course, currentLessonId)
  const currentLessonProgress = lessonProgress[currentLessonId] || null

  const handleChapterSelect = (chapterId) => {
    setCurrentChapterId(chapterId)
    const chapter = course.chapters.find((ch) => ch.id === chapterId)
    if (chapter && chapter.lessons.length > 0) {
      handleLessonSelect(chapter.lessons[0].id)
    }
    setMobileMenuOpen(false)
  }

  const handleLessonSelect = (lessonId) => {
    setCurrentLessonId(lessonId)
    setActiveTab('video')
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    const chapter = findChapterByLessonId(course, currentLessonId)
    if (chapter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentChapterId(chapter.id)
      if (chapter.quiz) {
        const savedQuizResult = loadQuizResult(courseId, chapter.quiz.id)
        setQuizResult(savedQuizResult)
      }
    }
    const lessonNotes = loadNotes(courseId, currentLessonId)
    setNotes(lessonNotes)
  }, [courseId, course, currentLessonId])

  const handleProgressUpdate = (progress) => {
    saveLessonProgress(courseId, currentLessonId, progress)
    setLessonProgress((prev) => {
      const updated = {
        ...prev,
        [currentLessonId]: progress,
      }
      lessonProgressRef.current = updated
      return updated
    })
    updateStatsFromProgress()
  }

  const handleNextLesson = () => {
    const next = getNextLesson(course, currentLessonId)
    if (next) {
      handleLessonSelect(next.id)
    }
  }

  const handlePrevLesson = () => {
    const prev = getPrevLesson(course, currentLessonId)
    if (prev) {
      handleLessonSelect(prev.id)
    }
  }

  const hasNext = !!getNextLesson(course, currentLessonId)
  const hasPrev = !!getPrevLesson(course, currentLessonId)

  const handleQuizSubmit = (result) => {
    if (currentChapter?.quiz) {
      saveQuizResult(courseId, currentChapter.quiz.id, result)
      setQuizResult(result)
    }
  }

  const handleQuizRetry = () => {
    setQuizResult(null)
  }

  const handleAddNote = (noteData) => {
    const saved = saveNote(courseId, currentLessonId, noteData)
    if (saved) {
      const updatedNotes = loadNotes(courseId, currentLessonId)
      setNotes(updatedNotes)
    }
  }

  const handleUpdateNote = (noteData) => {
    const saved = saveNote(courseId, currentLessonId, noteData)
    if (saved) {
      const updatedNotes = loadNotes(courseId, currentLessonId)
      setNotes(updatedNotes)
    }
  }

  const handleDeleteNote = (noteId) => {
    deleteNote(courseId, currentLessonId, noteId)
    const updatedNotes = loadNotes(courseId, currentLessonId)
    setNotes(updatedNotes)
  }

  const handleToggleFavorite = (noteId) => {
    toggleNoteFavorite(courseId, currentLessonId, noteId)
    const updatedNotes = loadNotes(courseId, currentLessonId)
    setNotes(updatedNotes)
  }

  const totalLessons = getTotalLessons(course)

  return (
    <div className="course-learning-page">
      <header className="page-header">
        <div className="header-content">
          <h1 className="page-title">{course.title}</h1>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'} 目录
          </button>
        </div>
      </header>

      <div className="page-layout">
        <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`}>
          <CourseCatalog
            chapters={course.chapters}
            currentChapterId={currentChapterId}
            currentLessonId={currentLessonId}
            lessonProgress={lessonProgress}
            onChapterSelect={handleChapterSelect}
            onLessonSelect={handleLessonSelect}
          />
        </aside>

        <main className="main-content">
          <nav className="tab-navigation">
            {ACTIVE_TABS.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'video' && '🎬 视频学习'}
                {tab === 'quiz' && '📝 章节测验'}
                {tab === 'notes' && '📒 学习笔记'}
                {tab === 'stats' && '📊 学习统计'}
              </button>
            ))}
          </nav>

          <div className="tab-content">
            {activeTab === 'video' && (
              <VideoPlayer
                key={currentLessonId}
                lesson={currentLesson}
                initialProgress={currentLessonProgress}
                onProgressUpdate={handleProgressUpdate}
                onNextLesson={handleNextLesson}
                onPrevLesson={handlePrevLesson}
                hasNext={hasNext}
                hasPrev={hasPrev}
              />
            )}

            {activeTab === 'quiz' && (
              <ChapterQuiz
                quiz={currentChapter?.quiz}
                chapterTitle={currentChapter?.title}
                savedResult={quizResult}
                onSubmit={handleQuizSubmit}
                onRetry={handleQuizRetry}
              />
            )}

            {activeTab === 'notes' && (
              <StudyNotes
                lessonId={currentLessonId}
                lessonTitle={currentLesson?.title}
                notes={notes}
                onAddNote={handleAddNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onToggleFavorite={handleToggleFavorite}
              />
            )}

            {activeTab === 'stats' && (
              <LearningStats
                stats={stats}
                courseTitle={course.title}
                totalLessons={totalLessons}
                totalDuration={course.totalDuration}
              />
            )}
          </div>
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  )
}
