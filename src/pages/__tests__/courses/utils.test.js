import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatDuration,
  calculateProgress,
  isLessonCompleted,
  gradeQuiz,
  calculateCourseStats,
  saveLearningState,
  loadLearningState,
  saveLessonProgress,
  loadLessonProgress,
  loadAllLessonProgress,
  saveNote,
  deleteNote,
  toggleNoteFavorite,
  loadNotes,
  saveQuizResult,
  loadQuizResult,
  updateStats,
  loadStats,
  generateId,
  safeLocalStorage,
} from '../../courses/utils.js'

import { courseData } from '../../courses/mockData.js'

describe('utils - formatDuration', () => {
  it('should format seconds to MM:SS when less than 1 hour', () => {
    expect(formatDuration(65)).toBe('01:05')
    expect(formatDuration(3599)).toBe('59:59')
    expect(formatDuration(0)).toBe('00:00')
  })

  it('should format seconds to H:MM:SS when 1 hour or more', () => {
    expect(formatDuration(3600)).toBe('1:00:00')
    expect(formatDuration(3665)).toBe('1:01:05')
    expect(formatDuration(7320)).toBe('2:02:00')
  })

  it('should handle invalid input', () => {
    expect(formatDuration(null)).toBe('00:00')
    expect(formatDuration(undefined)).toBe('00:00')
    expect(formatDuration(-10)).toBe('00:00')
  })
})

describe('utils - calculateProgress', () => {
  it('should calculate progress percentage correctly', () => {
    expect(calculateProgress(50, 100)).toBe(50)
    expect(calculateProgress(25, 100)).toBe(25)
    expect(calculateProgress(0, 100)).toBe(0)
  })

  it('should clamp progress between 0 and 100', () => {
    expect(calculateProgress(150, 100)).toBe(100)
    expect(calculateProgress(-10, 100)).toBe(0)
  })

  it('should return 0 for invalid duration', () => {
    expect(calculateProgress(50, 0)).toBe(0)
    expect(calculateProgress(50, -10)).toBe(0)
    expect(calculateProgress(50, null)).toBe(0)
    expect(calculateProgress(50, undefined)).toBe(0)
  })
})

describe('utils - isLessonCompleted', () => {
  it('should return true when progress is 90% or more', () => {
    expect(isLessonCompleted(90)).toBe(true)
    expect(isLessonCompleted(95)).toBe(true)
    expect(isLessonCompleted(100)).toBe(true)
  })

  it('should return false when progress is less than 90%', () => {
    expect(isLessonCompleted(89)).toBe(false)
    expect(isLessonCompleted(50)).toBe(false)
    expect(isLessonCompleted(0)).toBe(false)
  })
})

describe('utils - gradeQuiz', () => {
  const questions = [
    { id: 'q1', type: 'single', answer: 1 },
    { id: 'q2', type: 'single', answer: 0 },
    { id: 'q3', type: 'multiple', answer: [0, 2] },
    { id: 'q4', type: 'multiple', answer: [1, 3] },
    { id: 'q5', type: 'single', answer: 2 },
  ]

  it('should return 0 for null/undefined input', () => {
    expect(gradeQuiz(null, null)).toEqual({
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      results: [],
    })
    expect(gradeQuiz(undefined, undefined)).toEqual({
      score: 0,
      correctCount: 0,
      totalQuestions: 0,
      results: [],
    })
  })

  it('should grade single choice questions correctly', () => {
    const answers = {
      q1: 1,
      q2: 0,
      q3: [0, 2],
      q4: [1, 3],
      q5: 2,
    }
    const result = gradeQuiz(questions, answers)
    expect(result.score).toBe(100)
    expect(result.correctCount).toBe(5)
    expect(result.totalQuestions).toBe(5)
    expect(result.results.every((r) => r.isCorrect)).toBe(true)
  })

  it('should grade multiple choice questions correctly', () => {
    const answers = {
      q1: 1,
      q2: 0,
      q3: [0, 2],
      q4: [1],
      q5: 2,
    }
    const result = gradeQuiz(questions, answers)
    expect(result.score).toBe(80)
    expect(result.correctCount).toBe(4)
  })

  it('should handle wrong answers', () => {
    const answers = {
      q1: 0,
      q2: 1,
      q3: [1],
      q4: [0, 2],
      q5: 0,
    }
    const result = gradeQuiz(questions, answers)
    expect(result.score).toBe(0)
    expect(result.correctCount).toBe(0)
  })

  it('should handle multiple choice with same elements in different order', () => {
    const answers = {
      q1: 1,
      q2: 0,
      q3: [2, 0],
      q4: [3, 1],
      q5: 2,
    }
    const result = gradeQuiz(questions, answers)
    expect(result.score).toBe(100)
  })
})

describe('utils - calculateCourseStats', () => {
  it('should calculate stats with no progress', () => {
    const result = calculateCourseStats(courseData, {})
    expect(result.totalLessons).toBe(9)
    expect(result.completedLessons).toBe(0)
    expect(result.courseProgress).toBe(0)
    expect(result.totalDuration).toBe(16800)
  })

  it('should calculate stats with partial progress', () => {
    const progress = {
      'lesson-1-1': { progressPercent: 50 },
      'lesson-1-2': { progressPercent: 100 },
    }
    const result = calculateCourseStats(courseData, progress)
    expect(result.completedLessons).toBe(1)
    expect(result.courseProgress).toBeGreaterThan(0)
    expect(result.courseProgress).toBeLessThan(100)
  })

  it('should calculate stats with all completed', () => {
    const progress = {}
    courseData.chapters.forEach((ch) => {
      ch.lessons.forEach((lesson) => {
        progress[lesson.id] = { progressPercent: 100 }
      })
    })
    const result = calculateCourseStats(courseData, progress)
    expect(result.completedLessons).toBe(9)
    expect(result.courseProgress).toBeCloseTo(100)
  })
})

describe('utils - generateId', () => {
  it('should generate unique ids', () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(generateId())
    }
    expect(ids.size).toBe(100)
  })

  it('should include prefix', () => {
    expect(generateId('note')).toMatch(/^note_/)
    expect(generateId('test')).toMatch(/^test_/)
  })
})

describe('utils - safeLocalStorage', () => {
  it('should return localStorage when available', () => {
    const storage = safeLocalStorage()
    expect(storage).toBeDefined()
    expect(typeof storage.getItem).toBe('function')
    expect(typeof storage.setItem).toBe('function')
  })
})

describe('utils - storage operations', () => {
  const courseId = 'test-course-1'

  beforeEach(() => {
    localStorage.clear()
  })

  describe('learning state', () => {
    it('should save and load learning state', () => {
      const state = { currentLessonId: 'lesson-1', currentChapterId: 'chapter-1' }
      const saveResult = saveLearningState(courseId, state)
      expect(saveResult).toBe(true)

      const loaded = loadLearningState(courseId)
      expect(loaded.currentLessonId).toBe(state.currentLessonId)
      expect(loaded.currentChapterId).toBe(state.currentChapterId)
      expect(loaded.savedAt).toBeDefined()
    })

    it('should return null for non-existent state', () => {
      expect(loadLearningState('non-existent')).toBeNull()
    })
  })

  describe('lesson progress', () => {
    it('should save and load lesson progress', () => {
      const progress = { currentTime: 500, duration: 1000, progressPercent: 50 }
      const saveResult = saveLessonProgress(courseId, 'lesson-1', progress)
      expect(saveResult).toBe(true)

      const loaded = loadLessonProgress(courseId, 'lesson-1')
      expect(loaded.currentTime).toBe(500)
      expect(loaded.progressPercent).toBe(50)
      expect(loaded.lessonId).toBe('lesson-1')
      expect(loaded.updatedAt).toBeDefined()
    })

    it('should return null for non-existent progress', () => {
      expect(loadLessonProgress(courseId, 'non-existent')).toBeNull()
    })

    it('should load all lesson progress', () => {
      saveLessonProgress(courseId, 'lesson-1', { progressPercent: 50 })
      saveLessonProgress(courseId, 'lesson-2', { progressPercent: 75 })

      const all = loadAllLessonProgress(courseId)
      expect(Object.keys(all)).toHaveLength(2)
      expect(all['lesson-1'].progressPercent).toBe(50)
      expect(all['lesson-2'].progressPercent).toBe(75)
    })
  })

  describe('notes', () => {
    it('should create a new note', () => {
      const note = { content: 'Test note' }
      const saved = saveNote(courseId, 'lesson-1', note)
      expect(saved).not.toBeNull()
      expect(saved.id).toBeDefined()
      expect(saved.content).toBe('Test note')
      expect(saved.lessonId).toBe('lesson-1')
      expect(saved.createdAt).toBeDefined()
      expect(saved.isFavorite).toBe(false)
    })

    it('should update an existing note', () => {
      vi.useFakeTimers()
      const note = { content: 'Test note' }
      const saved = saveNote(courseId, 'lesson-1', note)

      vi.advanceTimersByTime(1000)

      const updated = saveNote(courseId, 'lesson-1', {
        id: saved.id,
        content: 'Updated note',
        createdAt: saved.createdAt,
      })
      expect(updated.content).toBe('Updated note')
      expect(updated.id).toBe(saved.id)
      expect(updated.updatedAt).toBeGreaterThan(saved.updatedAt)

      vi.useRealTimers()
    })

    it('should delete a note', () => {
      const note = saveNote(courseId, 'lesson-1', { content: 'To delete' })
      expect(loadNotes(courseId, 'lesson-1')).toHaveLength(1)

      const result = deleteNote(courseId, 'lesson-1', note.id)
      expect(result).toBe(true)
      expect(loadNotes(courseId, 'lesson-1')).toHaveLength(0)
    })

    it('should toggle note favorite', () => {
      const note = saveNote(courseId, 'lesson-1', { content: 'Test' })
      expect(note.isFavorite).toBe(false)

      const toggled = toggleNoteFavorite(courseId, 'lesson-1', note.id)
      expect(toggled.isFavorite).toBe(true)

      const toggledAgain = toggleNoteFavorite(courseId, 'lesson-1', note.id)
      expect(toggledAgain.isFavorite).toBe(false)
    })

    it('should load notes for a lesson', () => {
      saveNote(courseId, 'lesson-1', { content: 'Note 1' })
      saveNote(courseId, 'lesson-1', { content: 'Note 2' })
      saveNote(courseId, 'lesson-2', { content: 'Note 3' })

      const notes = loadNotes(courseId, 'lesson-1')
      expect(notes).toHaveLength(2)
    })

    it('should return empty array for lesson with no notes', () => {
      expect(loadNotes(courseId, 'empty-lesson')).toEqual([])
    })
  })

  describe('quiz results', () => {
    it('should save and load quiz results', () => {
      const result = { score: 80, correctCount: 4, totalQuestions: 5 }
      const saved = saveQuizResult(courseId, 'quiz-1', result)
      expect(saved).toBe(true)

      const loaded = loadQuizResult(courseId, 'quiz-1')
      expect(loaded.score).toBe(80)
      expect(loaded.quizId).toBe('quiz-1')
      expect(loaded.submittedAt).toBeDefined()
    })

    it('should return null for non-existent quiz result', () => {
      expect(loadQuizResult(courseId, 'non-existent')).toBeNull()
    })
  })

  describe('stats', () => {
    it('should return default stats for new course', () => {
      const stats = loadStats(courseId)
      expect(stats.totalStudyTime).toBe(0)
      expect(stats.completedLessons).toBe(0)
      expect(stats.courseProgress).toBe(0)
    })

    it('should update and load stats', () => {
      const updated = updateStats(courseId, {
        totalStudyTime: 3600,
        completedLessons: 3,
        courseProgress: 33.33,
      })
      expect(updated.totalStudyTime).toBe(3600)
      expect(updated.completedLessons).toBe(3)
      expect(updated.updatedAt).toBeDefined()

      const loaded = loadStats(courseId)
      expect(loaded.totalStudyTime).toBe(3600)
    })

    it('should merge stats updates', () => {
      updateStats(courseId, { totalStudyTime: 1000 })
      const updated = updateStats(courseId, { completedLessons: 2 })
      expect(updated.totalStudyTime).toBe(1000)
      expect(updated.completedLessons).toBe(2)
    })
  })
})
