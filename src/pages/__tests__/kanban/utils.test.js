import { describe, it, expect, beforeEach } from 'vitest'
import {
  generateId,
  resetIdCounter,
  createTask,
  groupTasksByColumn,
  sortTasksByPriority,
  reorderTasksInColumn,
  moveTaskBetweenColumns,
  flattenGroupedTasks,
  filterTasksByTags,
  getAllTags,
  updateTaskInList,
  deleteTaskFromList,
  addTaskToList,
  validateTask,
} from '../../kanban/utils.js'
import { ColumnIds, Priority, ColumnOrder } from '../../kanban/constants.js'

describe('generateId', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  it('should generate unique IDs with prefix', () => {
    const id1 = generateId('task')
    const id2 = generateId('task')
    expect(id1).not.toBe(id2)
    expect(id1.startsWith('task-')).toBe(true)
  })

  it('should use default prefix when not provided', () => {
    const id = generateId()
    expect(id.startsWith('task-')).toBe(true)
  })

  it('should increment counter for each call', () => {
    const id1 = generateId('test')
    const id2 = generateId('test')
    const parts1 = id1.split('-')
    const parts2 = id2.split('-')
    expect(Number(parts2[parts2.length - 1])).toBe(
      Number(parts1[parts1.length - 1]) + 1
    )
  })
})

describe('createTask', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  it('should create task with default values', () => {
    const task = createTask()
    expect(task.id).toBeDefined()
    expect(task.title).toBe('新任务')
    expect(task.description).toBe('')
    expect(task.tags).toEqual([])
    expect(task.priority).toBe('medium')
    expect(task.columnId).toBe('todo')
    expect(task.order).toBe(0)
    expect(task.createdAt).toBeDefined()
  })

  it('should create task with partial values', () => {
    const partial = {
      title: '测试任务',
      description: '这是描述',
      tags: ['前端', '设计'],
      priority: Priority.HIGH,
      columnId: ColumnIds.IN_PROGRESS,
    }
    const task = createTask(partial)
    expect(task.title).toBe('测试任务')
    expect(task.description).toBe('这是描述')
    expect(task.tags).toEqual(['前端', '设计'])
    expect(task.priority).toBe(Priority.HIGH)
    expect(task.columnId).toBe(ColumnIds.IN_PROGRESS)
    expect(task.id).toBeDefined()
  })
})

describe('groupTasksByColumn', () => {
  it('should group tasks by column ID and sort by order', () => {
    const tasks = [
      { id: '1', columnId: ColumnIds.TODO, order: 1 },
      { id: '2', columnId: ColumnIds.TODO, order: 0 },
      { id: '3', columnId: ColumnIds.DONE, order: 0 },
      { id: '4', columnId: ColumnIds.IN_PROGRESS, order: 0 },
    ]
    const grouped = groupTasksByColumn(tasks)
    expect(Object.keys(grouped)).toEqual(ColumnOrder)
    expect(grouped[ColumnIds.TODO].map((t) => t.id)).toEqual(['2', '1'])
    expect(grouped[ColumnIds.IN_PROGRESS].map((t) => t.id)).toEqual(['4'])
    expect(grouped[ColumnIds.DONE].map((t) => t.id)).toEqual(['3'])
  })

  it('should return empty arrays for columns with no tasks', () => {
    const tasks = [{ id: '1', columnId: ColumnIds.TODO, order: 0 }]
    const grouped = groupTasksByColumn(tasks)
    expect(grouped[ColumnIds.TODO]).toHaveLength(1)
    expect(grouped[ColumnIds.IN_PROGRESS]).toEqual([])
    expect(grouped[ColumnIds.DONE]).toEqual([])
  })

  it('should handle empty input', () => {
    const grouped = groupTasksByColumn([])
    for (const colId of ColumnOrder) {
      expect(grouped[colId]).toEqual([])
    }
  })
})

describe('sortTasksByPriority', () => {
  it('should sort tasks by priority descending', () => {
    const tasks = [
      { id: '1', priority: Priority.LOW, order: 0 },
      { id: '2', priority: Priority.HIGH, order: 0 },
      { id: '3', priority: Priority.MEDIUM, order: 0 },
    ]
    const sorted = sortTasksByPriority(tasks)
    expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1'])
  })

  it('should use order as secondary sort key', () => {
    const tasks = [
      { id: '1', priority: Priority.HIGH, order: 2 },
      { id: '2', priority: Priority.HIGH, order: 0 },
      { id: '3', priority: Priority.HIGH, order: 1 },
    ]
    const sorted = sortTasksByPriority(tasks)
    expect(sorted.map((t) => t.id)).toEqual(['2', '3', '1'])
  })

  it('should not mutate original array', () => {
    const tasks = [
      { id: '1', priority: Priority.LOW, order: 0 },
      { id: '2', priority: Priority.HIGH, order: 0 },
    ]
    const originalIds = tasks.map((t) => t.id)
    sortTasksByPriority(tasks)
    expect(tasks.map((t) => t.id)).toEqual(originalIds)
  })
})

describe('reorderTasksInColumn', () => {
  it('should reorder tasks within same column', () => {
    const tasks = [
      { id: '1', order: 0 },
      { id: '2', order: 1 },
      { id: '3', order: 2 },
      { id: '4', order: 3 },
    ]
    const reordered = reorderTasksInColumn(tasks, 1, 3)
    expect(reordered.map((t) => t.id)).toEqual(['1', '3', '4', '2'])
    reordered.forEach((t, idx) => {
      expect(t.order).toBe(idx)
    })
  })

  it('should handle moving task to beginning', () => {
    const tasks = [
      { id: '1', order: 0 },
      { id: '2', order: 1 },
      { id: '3', order: 2 },
    ]
    const reordered = reorderTasksInColumn(tasks, 2, 0)
    expect(reordered.map((t) => t.id)).toEqual(['3', '1', '2'])
  })

  it('should return tasks with correct order when positions are same', () => {
    const tasks = [
      { id: '1', order: 0 },
      { id: '2', order: 1 },
    ]
    const reordered = reorderTasksInColumn(tasks, 0, 0)
    expect(reordered.map((t) => t.id)).toEqual(['1', '2'])
    expect(reordered[0].order).toBe(0)
    expect(reordered[1].order).toBe(1)
  })
})

describe('moveTaskBetweenColumns', () => {
  it('should move task from one column to another', () => {
    const grouped = {
      [ColumnIds.TODO]: [
        { id: '1', columnId: ColumnIds.TODO, order: 0 },
        { id: '2', columnId: ColumnIds.TODO, order: 1 },
      ],
      [ColumnIds.IN_PROGRESS]: [
        { id: '3', columnId: ColumnIds.IN_PROGRESS, order: 0 },
      ],
      [ColumnIds.DONE]: [],
    }
    const result = moveTaskBetweenColumns(
      grouped,
      ColumnIds.TODO,
      0,
      ColumnIds.IN_PROGRESS,
      0
    )
    expect(result[ColumnIds.TODO].map((t) => t.id)).toEqual(['2'])
    expect(result[ColumnIds.TODO][0].order).toBe(0)
    expect(result[ColumnIds.IN_PROGRESS].map((t) => t.id)).toEqual(['1', '3'])
    expect(result[ColumnIds.IN_PROGRESS][0].columnId).toBe(ColumnIds.IN_PROGRESS)
    expect(result[ColumnIds.IN_PROGRESS][0].order).toBe(0)
    expect(result[ColumnIds.IN_PROGRESS][1].order).toBe(1)
  })

  it('should move task to end of destination column', () => {
    const grouped = {
      [ColumnIds.TODO]: [
        { id: '1', columnId: ColumnIds.TODO, order: 0 },
      ],
      [ColumnIds.IN_PROGRESS]: [
        { id: '2', columnId: ColumnIds.IN_PROGRESS, order: 0 },
        { id: '3', columnId: ColumnIds.IN_PROGRESS, order: 1 },
      ],
      [ColumnIds.DONE]: [],
    }
    const result = moveTaskBetweenColumns(
      grouped,
      ColumnIds.TODO,
      0,
      ColumnIds.IN_PROGRESS,
      2
    )
    expect(result[ColumnIds.IN_PROGRESS].map((t) => t.id)).toEqual(['2', '3', '1'])
  })

  it('should handle moving to empty column', () => {
    const grouped = {
      [ColumnIds.TODO]: [
        { id: '1', columnId: ColumnIds.TODO, order: 0 },
      ],
      [ColumnIds.IN_PROGRESS]: [],
      [ColumnIds.DONE]: [],
    }
    const result = moveTaskBetweenColumns(
      grouped,
      ColumnIds.TODO,
      0,
      ColumnIds.IN_PROGRESS,
      0
    )
    expect(result[ColumnIds.TODO]).toEqual([])
    expect(result[ColumnIds.IN_PROGRESS].map((t) => t.id)).toEqual(['1'])
    expect(result[ColumnIds.IN_PROGRESS][0].order).toBe(0)
  })
})

describe('flattenGroupedTasks', () => {
  it('should flatten grouped tasks in column order', () => {
    const grouped = {
      [ColumnIds.TODO]: [{ id: '1' }, { id: '2' }],
      [ColumnIds.IN_PROGRESS]: [{ id: '3' }],
      [ColumnIds.DONE]: [{ id: '4' }, { id: '5' }],
    }
    const flat = flattenGroupedTasks(grouped)
    expect(flat.map((t) => t.id)).toEqual(['1', '2', '3', '4', '5'])
  })

  it('should handle empty groups', () => {
    const grouped = {
      [ColumnIds.TODO]: [],
      [ColumnIds.IN_PROGRESS]: [],
      [ColumnIds.DONE]: [],
    }
    expect(flattenGroupedTasks(grouped)).toEqual([])
  })
})

describe('filterTasksByTags', () => {
  const tasks = [
    { id: '1', tags: ['前端', '设计'] },
    { id: '2', tags: ['后端'] },
    { id: '3', tags: ['设计', 'UI'] },
    { id: '4', tags: [] },
    { id: '5', tags: undefined },
  ]

  it('should return all tasks when no tags selected', () => {
    const result = filterTasksByTags(tasks, [])
    expect(result).toHaveLength(5)
  })

  it('should return all tasks when selectedTags is falsy', () => {
    const result = filterTasksByTags(tasks, null)
    expect(result).toHaveLength(5)
  })

  it('should filter by single tag', () => {
    const result = filterTasksByTags(tasks, ['设计'])
    expect(result.map((t) => t.id)).toEqual(['1', '3'])
  })

  it('should filter by multiple tags (OR logic)', () => {
    const result = filterTasksByTags(tasks, ['前端', '后端'])
    expect(result.map((t) => t.id)).toEqual(['1', '2'])
  })

  it('should return empty array when no matches', () => {
    const result = filterTasksByTags(tasks, ['不存在的标签'])
    expect(result).toEqual([])
  })
})

describe('getAllTags', () => {
  it('should collect all unique tags sorted', () => {
    const tasks = [
      { tags: ['c', 'a'] },
      { tags: ['b'] },
      { tags: ['a', 'c'] },
      { tags: [] },
      { tags: undefined },
    ]
    const tags = getAllTags(tasks)
    expect(tags).toEqual(['a', 'b', 'c'])
  })

  it('should return empty array for no tasks', () => {
    expect(getAllTags([])).toEqual([])
  })

  it('should return empty array when no tasks have tags', () => {
    const tasks = [{ tags: [] }, { tags: undefined }]
    expect(getAllTags(tasks)).toEqual([])
  })
})

describe('updateTaskInList', () => {
  it('should update task fields by id', () => {
    const tasks = [
      { id: '1', title: '旧标题', priority: Priority.LOW },
      { id: '2', title: '其他' },
    ]
    const result = updateTaskInList(tasks, '1', {
      title: '新标题',
      priority: Priority.HIGH,
    })
    expect(result[0].title).toBe('新标题')
    expect(result[0].priority).toBe(Priority.HIGH)
    expect(result[1].title).toBe('其他')
  })

  it('should not mutate original array', () => {
    const tasks = [{ id: '1', title: '旧标题' }]
    updateTaskInList(tasks, '1', { title: '新标题' })
    expect(tasks[0].title).toBe('旧标题')
  })

  it('should return unchanged if id not found', () => {
    const tasks = [{ id: '1', title: '标题' }]
    const result = updateTaskInList(tasks, '999', { title: '新标题' })
    expect(result[0].title).toBe('标题')
  })
})

describe('deleteTaskFromList', () => {
  it('should remove task by id', () => {
    const tasks = [{ id: '1' }, { id: '2' }, { id: '3' }]
    const result = deleteTaskFromList(tasks, '2')
    expect(result.map((t) => t.id)).toEqual(['1', '3'])
  })

  it('should not mutate original array', () => {
    const tasks = [{ id: '1' }, { id: '2' }]
    deleteTaskFromList(tasks, '1')
    expect(tasks).toHaveLength(2)
  })

  it('should return unchanged if id not found', () => {
    const tasks = [{ id: '1' }]
    const result = deleteTaskFromList(tasks, '999')
    expect(result).toHaveLength(1)
  })
})

describe('addTaskToList', () => {
  it('should add task with correct order in column', () => {
    const tasks = [
      { id: '1', columnId: ColumnIds.TODO, order: 0 },
      { id: '2', columnId: ColumnIds.TODO, order: 1 },
      { id: '3', columnId: ColumnIds.IN_PROGRESS, order: 0 },
    ]
    const newTask = {
      id: '4',
      title: '新任务',
      columnId: ColumnIds.TODO,
    }
    const result = addTaskToList(tasks, newTask)
    const added = result.find((t) => t.id === '4')
    expect(added).toBeDefined()
    expect(added.order).toBe(2)
    expect(result).toHaveLength(4)
  })

  it('should set order to 0 for empty column', () => {
    const tasks = [{ id: '1', columnId: ColumnIds.TODO, order: 0 }]
    const newTask = {
      id: '2',
      columnId: ColumnIds.IN_PROGRESS,
    }
    const result = addTaskToList(tasks, newTask)
    const added = result.find((t) => t.id === '2')
    expect(added.order).toBe(0)
  })
})

describe('validateTask', () => {
  it('should return valid for correct task', () => {
    const task = { title: '测试任务', description: '描述' }
    const result = validateTask(task)
    expect(result.isValid).toBe(true)
    expect(result.errors).toEqual({})
  })

  it('should return error for empty title', () => {
    const result = validateTask({ title: '' })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toBeDefined()
  })

  it('should return error for whitespace-only title', () => {
    const result = validateTask({ title: '   ' })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toBeDefined()
  })

  it('should return error for title exceeding max length', () => {
    const longTitle = 'a'.repeat(101)
    const result = validateTask({ title: longTitle })
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toBeDefined()
  })

  it('should accept title at max length boundary', () => {
    const validTitle = 'a'.repeat(100)
    const result = validateTask({ title: validTitle })
    expect(result.isValid).toBe(true)
  })

  it('should return error for description exceeding max length', () => {
    const longDesc = 'a'.repeat(2001)
    const result = validateTask({ title: '标题', description: longDesc })
    expect(result.isValid).toBe(false)
    expect(result.errors.description).toBeDefined()
  })

  it('should handle missing fields gracefully', () => {
    const result = validateTask({})
    expect(result.isValid).toBe(false)
    expect(result.errors.title).toBeDefined()
  })
})
