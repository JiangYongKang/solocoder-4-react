const STORAGE_KEYS = {
  LEARNING_STATE: 'course_learning_state',
  LESSON_PROGRESS: 'course_lesson_progress',
  NOTES: 'course_notes',
  QUIZ_RESULTS: 'course_quiz_results',
  STATS: 'course_stats',
}

export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '00:00'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function calculateProgress(currentTime, duration) {
  if (!duration || duration <= 0) return 0
  const progress = (currentTime / duration) * 100
  return Math.min(Math.max(progress, 0), 100)
}

export function isLessonCompleted(progress) {
  return progress >= 90
}

export function gradeQuiz(questions, answers) {
  if (!questions || !answers) {
    return { score: 0, correctCount: 0, totalQuestions: 0, results: [] }
  }

  let correctCount = 0
  const results = []

  questions.forEach((q) => {
    const userAnswer = answers[q.id]
    let isCorrect = false

    if (q.type === 'single') {
      isCorrect = userAnswer === q.answer
    } else if (q.type === 'multiple') {
      if (Array.isArray(userAnswer) && Array.isArray(q.answer)) {
        const sortedUser = [...userAnswer].sort()
        const sortedCorrect = [...q.answer].sort()
        isCorrect =
          sortedUser.length === sortedCorrect.length &&
          sortedUser.every((val, i) => val === sortedCorrect[i])
      }
    }

    if (isCorrect) {
      correctCount++
    }

    results.push({
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.answer,
      isCorrect,
      type: q.type,
    })
  })

  const totalQuestions = questions.length
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  return {
    score,
    correctCount,
    totalQuestions,
    results,
  }
}

export function storageAvailable(type = 'localStorage') {
  try {
    const storage = window[type]
    const x = '__storage_test__'
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch {
    return false
  }
}

export function safeLocalStorage() {
  if (typeof window === 'undefined' || !storageAvailable()) {
    const memoryStore = new Map()
    return {
      getItem: (key) => memoryStore.get(key) || null,
      setItem: (key, value) => memoryStore.set(key, value),
      removeItem: (key) => memoryStore.delete(key),
      clear: () => memoryStore.clear(),
    }
  }
  return window.localStorage
}

const storage = safeLocalStorage()

export function saveLearningState(courseId, state) {
  try {
    const key = `${STORAGE_KEYS.LEARNING_STATE}_${courseId}`
    storage.setItem(key, JSON.stringify({ ...state, savedAt: Date.now() }))
    return true
  } catch (e) {
    console.error('Failed to save learning state:', e)
    return false
  }
}

export function loadLearningState(courseId) {
  try {
    const key = `${STORAGE_KEYS.LEARNING_STATE}_${courseId}`
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to load learning state:', e)
    return null
  }
}

export function saveLessonProgress(courseId, lessonId, progress) {
  try {
    const key = `${STORAGE_KEYS.LESSON_PROGRESS}_${courseId}`
    const allProgress = loadAllLessonProgress(courseId)
    allProgress[lessonId] = {
      ...progress,
      lessonId,
      updatedAt: Date.now(),
    }
    storage.setItem(key, JSON.stringify(allProgress))
    return true
  } catch (e) {
    console.error('Failed to save lesson progress:', e)
    return false
  }
}

export function loadLessonProgress(courseId, lessonId) {
  const allProgress = loadAllLessonProgress(courseId)
  return allProgress[lessonId] || null
}

export function loadAllLessonProgress(courseId) {
  try {
    const key = `${STORAGE_KEYS.LESSON_PROGRESS}_${courseId}`
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Failed to load lesson progress:', e)
    return {}
  }
}

export function saveNote(courseId, lessonId, note) {
  try {
    const key = `${STORAGE_KEYS.NOTES}_${courseId}`
    const allNotes = loadAllNotes(courseId)
    const lessonNotes = allNotes[lessonId] || []
    const newNote = {
      ...note,
      id: note.id || `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lessonId,
      createdAt: note.createdAt || Date.now(),
      updatedAt: Date.now(),
      isFavorite: note.isFavorite || false,
    }

    if (note.id) {
      const index = lessonNotes.findIndex((n) => n.id === note.id)
      if (index !== -1) {
        lessonNotes[index] = newNote
      } else {
        lessonNotes.push(newNote)
      }
    } else {
      lessonNotes.push(newNote)
    }

    allNotes[lessonId] = lessonNotes
    storage.setItem(key, JSON.stringify(allNotes))
    return newNote
  } catch (e) {
    console.error('Failed to save note:', e)
    return null
  }
}

export function deleteNote(courseId, lessonId, noteId) {
  try {
    const key = `${STORAGE_KEYS.NOTES}_${courseId}`
    const allNotes = loadAllNotes(courseId)
    const lessonNotes = allNotes[lessonId] || []
    allNotes[lessonId] = lessonNotes.filter((n) => n.id !== noteId)
    storage.setItem(key, JSON.stringify(allNotes))
    return true
  } catch (e) {
    console.error('Failed to delete note:', e)
    return false
  }
}

export function toggleNoteFavorite(courseId, lessonId, noteId) {
  try {
    const allNotes = loadAllNotes(courseId)
    const lessonNotes = allNotes[lessonId] || []
    const note = lessonNotes.find((n) => n.id === noteId)
    if (note) {
      note.isFavorite = !note.isFavorite
      note.updatedAt = Date.now()
      const key = `${STORAGE_KEYS.NOTES}_${courseId}`
      storage.setItem(key, JSON.stringify(allNotes))
      return note
    }
    return null
  } catch (e) {
    console.error('Failed to toggle note favorite:', e)
    return null
  }
}

export function loadNotes(courseId, lessonId) {
  const allNotes = loadAllNotes(courseId)
  return allNotes[lessonId] || []
}

export function loadAllNotes(courseId) {
  try {
    const key = `${STORAGE_KEYS.NOTES}_${courseId}`
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Failed to load notes:', e)
    return {}
  }
}

export function saveQuizResult(courseId, quizId, result) {
  try {
    const key = `${STORAGE_KEYS.QUIZ_RESULTS}_${courseId}`
    const allResults = loadAllQuizResults(courseId)
    allResults[quizId] = {
      ...result,
      quizId,
      submittedAt: Date.now(),
    }
    storage.setItem(key, JSON.stringify(allResults))
    return true
  } catch (e) {
    console.error('Failed to save quiz result:', e)
    return false
  }
}

export function loadQuizResult(courseId, quizId) {
  const allResults = loadAllQuizResults(courseId)
  return allResults[quizId] || null
}

export function loadAllQuizResults(courseId) {
  try {
    const key = `${STORAGE_KEYS.QUIZ_RESULTS}_${courseId}`
    const data = storage.getItem(key)
    return data ? JSON.parse(data) : {}
  } catch (e) {
    console.error('Failed to load quiz results:', e)
    return {}
  }
}

export function updateStats(courseId, statsUpdate) {
  try {
    const key = `${STORAGE_KEYS.STATS}_${courseId}`
    const currentStats = loadStats(courseId)
    const newStats = {
      ...currentStats,
      ...statsUpdate,
      updatedAt: Date.now(),
    }
    storage.setItem(key, JSON.stringify(newStats))
    return newStats
  } catch (e) {
    console.error('Failed to update stats:', e)
    return null
  }
}

export function loadStats(courseId) {
  try {
    const key = `${STORAGE_KEYS.STATS}_${courseId}`
    const data = storage.getItem(key)
    return data
      ? JSON.parse(data)
      : {
          totalStudyTime: 0,
          completedLessons: 0,
          courseProgress: 0,
          updatedAt: null,
        }
  } catch (e) {
    console.error('Failed to load stats:', e)
    return {
      totalStudyTime: 0,
      completedLessons: 0,
      courseProgress: 0,
      updatedAt: null,
    }
  }
}

export function calculateCourseStats(course, lessonProgress) {
  const allLessons = course.chapters.flatMap((ch) => ch.lessons)
  const totalLessons = allLessons.length
  let completedCount = 0
  let totalDuration = 0
  let watchedDuration = 0

  allLessons.forEach((lesson) => {
    totalDuration += lesson.duration
    const progress = lessonProgress[lesson.id]
    if (progress) {
      const watched = (progress.progressPercent / 100) * lesson.duration
      watchedDuration += watched
      if (isLessonCompleted(progress.progressPercent)) {
        completedCount++
      }
    }
  })

  const courseProgress = totalDuration > 0 ? (watchedDuration / totalDuration) * 100 : 0

  return {
    totalLessons,
    completedLessons: completedCount,
    totalDuration,
    watchedDuration,
    courseProgress: Math.min(courseProgress, 100),
  }
}

export function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
