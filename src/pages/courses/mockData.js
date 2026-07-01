export const courseData = {
  id: 'course-001',
  title: 'React 19 前端开发实战',
  description: '从零开始学习 React 19，掌握现代前端开发技能',
  instructor: '张老师',
  cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=react%20programming%20course%20cover&image_size=landscape_16_9',
  totalDuration: 12600,
  chapters: [
    {
      id: 'chapter-1',
      title: '第一章：React 基础入门',
      description: '了解 React 的核心概念和基本用法',
      lessons: [
        {
          id: 'lesson-1-1',
          title: '1.1 React 简介与环境搭建',
          duration: 1200,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-1-2',
          title: '1.2 JSX 语法详解',
          duration: 1500,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-1-3',
          title: '1.3 组件化开发思想',
          duration: 1800,
          type: 'video',
          videoUrl: '#',
        },
      ],
      quiz: {
        id: 'quiz-1',
        title: '第一章测验',
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'React 是由哪家公司开发的？',
            options: ['Google', 'Facebook (Meta)', 'Microsoft', 'Amazon'],
            answer: 1,
          },
          {
            id: 'q2',
            type: 'single',
            question: 'JSX 最终会被编译成什么？',
            options: ['HTML', 'JavaScript 函数调用', 'CSS', 'JSON'],
            answer: 1,
          },
          {
            id: 'q3',
            type: 'multiple',
            question: '以下哪些是 React 的核心特性？（多选）',
            options: ['虚拟 DOM', '组件化', '双向数据绑定', '声明式编程'],
            answer: [0, 1, 3],
          },
          {
            id: 'q4',
            type: 'single',
            question: 'React 组件的状态应该如何管理？',
            options: ['直接修改 state 对象', '使用 setState 或 useState', '使用全局变量', '修改 DOM 元素'],
            answer: 1,
          },
          {
            id: 'q5',
            type: 'single',
            question: '以下哪个 Hook 用于管理组件状态？',
            options: ['useEffect', 'useState', 'useContext', 'useRef'],
            answer: 1,
          },
        ],
        passingScore: 60,
      },
    },
    {
      id: 'chapter-2',
      title: '第二章：React Hooks 进阶',
      description: '深入理解和使用 React Hooks',
      lessons: [
        {
          id: 'lesson-2-1',
          title: '2.1 useState 和 useEffect 详解',
          duration: 2100,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-2-2',
          title: '2.2 useContext 和 useReducer',
          duration: 1800,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-2-3',
          title: '2.3 自定义 Hooks',
          duration: 2400,
          type: 'video',
          videoUrl: '#',
        },
      ],
      quiz: {
        id: 'quiz-2',
        title: '第二章测验',
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'useEffect 的第二个参数是什么？',
            options: ['回调函数', '依赖数组', '初始状态', '配置对象'],
            answer: 1,
          },
          {
            id: 'q2',
            type: 'single',
            question: '当依赖数组为空时，useEffect 会在什么时候执行？',
            options: ['每次渲染', '仅在组件挂载时', '仅在组件卸载时', '永不执行'],
            answer: 1,
          },
          {
            id: 'q3',
            type: 'multiple',
            question: '以下哪些 Hook 可以用于性能优化？（多选）',
            options: ['useMemo', 'useCallback', 'useState', 'useRef'],
            answer: [0, 1],
          },
          {
            id: 'q4',
            type: 'single',
            question: 'useRef 返回的对象有什么特点？',
            options: ['每次渲染都会变化', '修改其 current 属性会触发重渲染', '其 current 属性在整个生命周期内保持不变', '只能用于 DOM 引用'],
            answer: 2,
          },
          {
            id: 'q5',
            type: 'single',
            question: '自定义 Hook 的命名必须以什么开头？',
            options: ['hook', 'use', 'custom', 'Hook'],
            answer: 1,
          },
        ],
        passingScore: 60,
      },
    },
    {
      id: 'chapter-3',
      title: '第三章：状态管理与路由',
      description: '学习复杂应用的状态管理和路由配置',
      lessons: [
        {
          id: 'lesson-3-1',
          title: '3.1 React Router 使用指南',
          duration: 1800,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-3-2',
          title: '3.2 Redux Toolkit 状态管理',
          duration: 2400,
          type: 'video',
          videoUrl: '#',
        },
        {
          id: 'lesson-3-3',
          title: '3.3 MobX 与 Zustand 对比',
          duration: 1800,
          type: 'video',
          videoUrl: '#',
        },
      ],
      quiz: {
        id: 'quiz-3',
        title: '第三章测验',
        questions: [
          {
            id: 'q1',
            type: 'single',
            question: 'React Router 中用于定义路由的组件是？',
            options: ['<Route>', '<Path>', '<Link>', '<Navigate>'],
            answer: 0,
          },
          {
            id: 'q2',
            type: 'single',
            question: 'Redux 中用于修改状态的函数叫做？',
            options: ['action', 'reducer', 'store', 'dispatch'],
            answer: 1,
          },
          {
            id: 'q3',
            type: 'multiple',
            question: '以下哪些是状态管理库？（多选）',
            options: ['Redux', 'MobX', 'Zustand', 'Axios'],
            answer: [0, 1, 2],
          },
          {
            id: 'q4',
            type: 'single',
            question: '在 Redux Toolkit 中，哪个函数用于创建 slice？',
            options: ['createStore', 'createSlice', 'createReducer', 'configureStore'],
            answer: 1,
          },
          {
            id: 'q5',
            type: 'single',
            question: 'Zustand 相比 Redux 的主要优势是什么？',
            options: ['更好的性能', '更少的样板代码', '更强的类型支持', '更大的社区'],
            answer: 1,
          },
        ],
        passingScore: 60,
      },
    },
  ],
}

export function getTotalLessons(course) {
  return course.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0)
}

export function findLessonById(course, lessonId) {
  for (const chapter of course.chapters) {
    const lesson = chapter.lessons.find((l) => l.id === lessonId)
    if (lesson) {
      return { chapter, lesson }
    }
  }
  return null
}

export function findChapterByLessonId(course, lessonId) {
  return course.chapters.find((chapter) => chapter.lessons.some((l) => l.id === lessonId))
}

export function getNextLesson(course, currentLessonId) {
  const allLessons = course.chapters.flatMap((ch) => ch.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  if (currentIndex < allLessons.length - 1) {
    return allLessons[currentIndex + 1]
  }
  return null
}

export function getPrevLesson(course, currentLessonId) {
  const allLessons = course.chapters.flatMap((ch) => ch.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId)
  if (currentIndex > 0) {
    return allLessons[currentIndex - 1]
  }
  return null
}
