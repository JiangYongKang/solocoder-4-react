import { describe, it, expect } from 'vitest'
import {
  courseData,
  getTotalLessons,
  findLessonById,
  findChapterByLessonId,
  getNextLesson,
  getPrevLesson,
} from '../../courses/mockData.js'

describe('mockData - course structure', () => {
  it('should have correct course structure', () => {
    expect(courseData.id).toBe('course-001')
    expect(courseData.title).toBe('React 19 前端开发实战')
    expect(courseData.chapters).toHaveLength(3)
    expect(courseData.totalDuration).toBe(16800)
  })

  it('should have 3 chapters with correct number of lessons', () => {
    expect(courseData.chapters[0].lessons).toHaveLength(3)
    expect(courseData.chapters[1].lessons).toHaveLength(3)
    expect(courseData.chapters[2].lessons).toHaveLength(3)
  })

  it('should have correct total duration sum', () => {
    const totalDuration = courseData.chapters.reduce((sum, chapter) => {
      return sum + chapter.lessons.reduce((lessonSum, lesson) => lessonSum + lesson.duration, 0)
    }, 0)
    expect(totalDuration).toBe(16800)
    expect(courseData.totalDuration).toBe(totalDuration)
  })

  it('each chapter should have a quiz with 5 questions', () => {
    courseData.chapters.forEach((chapter) => {
      expect(chapter.quiz).toBeDefined()
      expect(chapter.quiz.questions).toHaveLength(5)
    })
  })
})

describe('mockData - getTotalLessons', () => {
  it('should return total number of lessons', () => {
    expect(getTotalLessons(courseData)).toBe(9)
  })

  it('should handle course with no chapters', () => {
    const emptyCourse = { ...courseData, chapters: [] }
    expect(getTotalLessons(emptyCourse)).toBe(0)
  })

  it('should handle chapter with no lessons', () => {
    const course = {
      ...courseData,
      chapters: [{ id: 'ch1', title: 'Test', lessons: [] }],
    }
    expect(getTotalLessons(course)).toBe(0)
  })
})

describe('mockData - findLessonById', () => {
  it('should find lesson and its chapter by lesson id', () => {
    const result = findLessonById(courseData, 'lesson-1-1')
    expect(result).not.toBeNull()
    expect(result.lesson.id).toBe('lesson-1-1')
    expect(result.lesson.title).toBe('1.1 React 简介与环境搭建')
    expect(result.chapter.id).toBe('chapter-1')
  })

  it('should find lesson in second chapter', () => {
    const result = findLessonById(courseData, 'lesson-2-2')
    expect(result).not.toBeNull()
    expect(result.lesson.id).toBe('lesson-2-2')
    expect(result.chapter.id).toBe('chapter-2')
  })

  it('should find lesson in third chapter', () => {
    const result = findLessonById(courseData, 'lesson-3-3')
    expect(result).not.toBeNull()
    expect(result.lesson.id).toBe('lesson-3-3')
    expect(result.chapter.id).toBe('chapter-3')
  })

  it('should return null for non-existent lesson id', () => {
    const result = findLessonById(courseData, 'non-existent-lesson')
    expect(result).toBeNull()
  })
})

describe('mockData - findChapterByLessonId', () => {
  it('should find chapter by lesson id', () => {
    const chapter = findChapterByLessonId(courseData, 'lesson-1-1')
    expect(chapter).not.toBeNull()
    expect(chapter?.id).toBe('chapter-1')
  })

  it('should find correct chapter for lessons in different chapters', () => {
    expect(findChapterByLessonId(courseData, 'lesson-1-3')?.id).toBe('chapter-1')
    expect(findChapterByLessonId(courseData, 'lesson-2-1')?.id).toBe('chapter-2')
    expect(findChapterByLessonId(courseData, 'lesson-3-2')?.id).toBe('chapter-3')
  })

  it('should return undefined for non-existent lesson id', () => {
    const chapter = findChapterByLessonId(courseData, 'non-existent-lesson')
    expect(chapter).toBeUndefined()
  })
})

describe('mockData - getNextLesson', () => {
  it('should return next lesson in the same chapter', () => {
    const next = getNextLesson(courseData, 'lesson-1-1')
    expect(next).not.toBeNull()
    expect(next?.id).toBe('lesson-1-2')
  })

  it('should return first lesson of next chapter when at end of chapter', () => {
    const next = getNextLesson(courseData, 'lesson-1-3')
    expect(next).not.toBeNull()
    expect(next?.id).toBe('lesson-2-1')
  })

  it('should return next lesson across chapters', () => {
    const next = getNextLesson(courseData, 'lesson-2-3')
    expect(next).not.toBeNull()
    expect(next?.id).toBe('lesson-3-1')
  })

  it('should return null when at last lesson', () => {
    const next = getNextLesson(courseData, 'lesson-3-3')
    expect(next).toBeNull()
  })

  it('should return null for non-existent lesson id', () => {
    const next = getNextLesson(courseData, 'non-existent-lesson')
    expect(next).toBeNull()
  })
})

describe('mockData - getPrevLesson', () => {
  it('should return previous lesson in the same chapter', () => {
    const prev = getPrevLesson(courseData, 'lesson-1-2')
    expect(prev).not.toBeNull()
    expect(prev?.id).toBe('lesson-1-1')
  })

  it('should return last lesson of previous chapter when at start of chapter', () => {
    const prev = getPrevLesson(courseData, 'lesson-2-1')
    expect(prev).not.toBeNull()
    expect(prev?.id).toBe('lesson-1-3')
  })

  it('should return previous lesson across chapters', () => {
    const prev = getPrevLesson(courseData, 'lesson-3-1')
    expect(prev).not.toBeNull()
    expect(prev?.id).toBe('lesson-2-3')
  })

  it('should return null when at first lesson', () => {
    const prev = getPrevLesson(courseData, 'lesson-1-1')
    expect(prev).toBeNull()
  })

  it('should return null for non-existent lesson id', () => {
    const prev = getPrevLesson(courseData, 'non-existent-lesson')
    expect(prev).toBeNull()
  })
})

describe('mockData - quiz structure', () => {
  it('should have both single and multiple choice questions', () => {
    const quiz = courseData.chapters[0].quiz
    const hasSingle = quiz.questions.some((q) => q.type === 'single')
    const hasMultiple = quiz.questions.some((q) => q.type === 'multiple')
    expect(hasSingle).toBe(true)
    expect(hasMultiple).toBe(true)
  })

  it('should have passing score of 60', () => {
    courseData.chapters.forEach((chapter) => {
      expect(chapter.quiz.passingScore).toBe(60)
    })
  })

  it('should have valid answer indices', () => {
    courseData.chapters.forEach((chapter) => {
      chapter.quiz.questions.forEach((question) => {
        if (question.type === 'single') {
          expect(question.answer).toBeGreaterThanOrEqual(0)
          expect(question.answer).toBeLessThan(question.options.length)
        } else if (question.type === 'multiple') {
          expect(Array.isArray(question.answer)).toBe(true)
          question.answer.forEach((ans) => {
            expect(ans).toBeGreaterThanOrEqual(0)
            expect(ans).toBeLessThan(question.options.length)
          })
        }
      })
    })
  })
})

describe('mockData - lesson navigation flow', () => {
  it('should navigate through all lessons correctly', () => {
    const expectedOrder = [
      'lesson-1-1',
      'lesson-1-2',
      'lesson-1-3',
      'lesson-2-1',
      'lesson-2-2',
      'lesson-2-3',
      'lesson-3-1',
      'lesson-3-2',
      'lesson-3-3',
    ]

    let currentId = 'lesson-1-1'
    const visitedOrder = [currentId]

    for (let i = 1; i < expectedOrder.length; i++) {
      const next = getNextLesson(courseData, currentId)
      expect(next).not.toBeNull()
      currentId = next.id
      visitedOrder.push(currentId)
    }

    expect(visitedOrder).toEqual(expectedOrder)
    expect(getNextLesson(courseData, currentId)).toBeNull()

    for (let i = expectedOrder.length - 2; i >= 0; i--) {
      const prev = getPrevLesson(courseData, currentId)
      expect(prev).not.toBeNull()
      currentId = prev.id
    }

    expect(currentId).toBe('lesson-1-1')
    expect(getPrevLesson(courseData, currentId)).toBeNull()
  })
})
