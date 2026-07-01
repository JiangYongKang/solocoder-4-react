import { ColumnOrder, PriorityOrder } from './constants.js'

let idCounter = 0

export function generateId(prefix = 'task') {
  idCounter += 1
  return `${prefix}-${Date.now()}-${idCounter}`
}

export function resetIdCounter() {
  idCounter = 0
}

export function createTask(partial = {}) {
  return {
    id: generateId(),
    title: partial.title ?? '新任务',
    description: partial.description ?? '',
    tags: partial.tags ?? [],
    priority: partial.priority ?? 'medium',
    columnId: partial.columnId ?? 'todo',
    order: partial.order ?? 0,
    createdAt: partial.createdAt ?? Date.now(),
  }
}

export function groupTasksByColumn(tasks) {
  const result = {}
  for (const columnId of ColumnOrder) {
    result[columnId] = []
  }
  for (const task of tasks) {
    if (result[task.columnId]) {
      result[task.columnId].push(task)
    }
  }
  for (const columnId of ColumnOrder) {
    result[columnId].sort((a, b) => a.order - b.order)
  }
  return result
}

export function sortTasksByPriority(tasks) {
  return [...tasks].sort((a, b) => {
    const priorityDiff = PriorityOrder[b.priority] - PriorityOrder[a.priority]
    if (priorityDiff !== 0) return priorityDiff
    return a.order - b.order
  })
}

export function reorderTasksInColumn(tasks, sourceIndex, destinationIndex) {
  const result = [...tasks]
  const [removed] = result.splice(sourceIndex, 1)
  result.splice(destinationIndex, 0, removed)
  return result.map((task, idx) => ({ ...task, order: idx }))
}

export function moveTaskBetweenColumns(
  groupedTasks,
  sourceColumnId,
  sourceIndex,
  destColumnId,
  destIndex
) {
  const newGrouped = {}
  for (const colId of ColumnOrder) {
    newGrouped[colId] = [...groupedTasks[colId]]
  }

  const [movedTask] = newGrouped[sourceColumnId].splice(sourceIndex, 1)
  const taskWithNewColumn = { ...movedTask, columnId: destColumnId }
  newGrouped[destColumnId].splice(destIndex, 0, taskWithNewColumn)

  for (const colId of ColumnOrder) {
    newGrouped[colId] = newGrouped[colId].map((task, idx) => ({
      ...task,
      order: idx,
    }))
  }

  return newGrouped
}

export function flattenGroupedTasks(groupedTasks) {
  const result = []
  for (const colId of ColumnOrder) {
    for (const task of groupedTasks[colId]) {
      result.push(task)
    }
  }
  return result
}

export function filterTasksByTags(tasks, selectedTags) {
  if (!selectedTags || selectedTags.length === 0) {
    return tasks
  }
  return tasks.filter((task) =>
    selectedTags.some((tag) => task.tags?.includes(tag))
  )
}

export function getAllTags(tasks) {
  const tagSet = new Set()
  for (const task of tasks) {
    if (task.tags) {
      for (const tag of task.tags) {
        tagSet.add(tag)
      }
    }
  }
  return Array.from(tagSet).sort()
}

export function updateTaskInList(tasks, taskId, updates) {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, ...updates } : task
  )
}

export function deleteTaskFromList(tasks, taskId) {
  return tasks.filter((task) => task.id !== taskId)
}

export function addTaskToList(tasks, newTask) {
  const sameColumnTasks = tasks.filter((t) => t.columnId === newTask.columnId)
  const maxOrder = sameColumnTasks.length > 0
    ? Math.max(...sameColumnTasks.map((t) => t.order))
    : -1
  const taskWithOrder = { ...newTask, order: maxOrder + 1 }
  return [...tasks, taskWithOrder]
}

export function validateTask(task) {
  const errors = {}
  if (!task.title || task.title.trim().length === 0) {
    errors.title = '任务标题不能为空'
  }
  if (task.title && task.title.length > 100) {
    errors.title = '任务标题不能超过100个字符'
  }
  if (task.description && task.description.length > 2000) {
    errors.description = '任务描述不能超过2000个字符'
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
