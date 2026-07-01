export const ColumnIds = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress',
  DONE: 'done',
}

export const ColumnLabels = {
  [ColumnIds.TODO]: '待处理',
  [ColumnIds.IN_PROGRESS]: '进行中',
  [ColumnIds.DONE]: '已完成',
}

export const Priority = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const PriorityLabels = {
  [Priority.HIGH]: '高优先级',
  [Priority.MEDIUM]: '中优先级',
  [Priority.LOW]: '低优先级',
}

export const PriorityOrder = {
  [Priority.HIGH]: 3,
  [Priority.MEDIUM]: 2,
  [Priority.LOW]: 1,
}

export const ColumnOrder = [ColumnIds.TODO, ColumnIds.IN_PROGRESS, ColumnIds.DONE]
