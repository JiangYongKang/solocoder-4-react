import { useState } from 'react'
import TaskCard from './TaskCard.jsx'

export default function KanbanColumn({
  columnId,
  title,
  tasks,
  isFilterActive,
  hasMatchingTasks,
  draggingTaskId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onTaskDragStart,
  onTaskDragEnd,
  onTaskDrop,
  onTaskDragOver,
}) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!isDragOver) {
      setIsDragOver(true)
    }
    const taskWrapper = e.target.closest('.kanban-task-wrapper')
    let overIndex = null
    if (taskWrapper) {
      const indexAttr = taskWrapper.getAttribute('data-task-index')
      if (indexAttr !== null) {
        overIndex = parseInt(indexAttr, 10)
        const rect = taskWrapper.getBoundingClientRect()
        const middleY = rect.top + rect.height / 2
        if (e.clientY > middleY) {
          overIndex += 1
        }
      }
    }
    if (onTaskDragOver) {
      onTaskDragOver(columnId, overIndex, tasks)
    }
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'))
      if (onTaskDrop) {
        onTaskDrop({
          ...data,
          destColumnId: columnId,
        })
      }
    } catch {
      // ignore invalid data
    }
  }

  const renderEmptyState = () => {
    if (isFilterActive && !hasMatchingTasks) {
      return (
        <div className="kanban-column-empty">
          <div className="kanban-column-empty-icon">🔍</div>
          <p className="kanban-column-empty-text">暂无匹配的任务</p>
          <p className="kanban-column-empty-hint">请尝试调整筛选条件</p>
        </div>
      )
    }
    if (tasks.length === 0) {
      return (
        <div className="kanban-column-empty">
          <div className="kanban-column-empty-icon">📋</div>
          <p className="kanban-column-empty-text">暂无任务</p>
          <button
            className="kanban-column-empty-btn"
            onClick={() => onAddTask && onAddTask(columnId)}
            type="button"
          >
            + 添加任务
          </button>
        </div>
      )
    }
    return null
  }

  return (
    <div
      className={`kanban-column ${isDragOver ? 'kanban-column-drag-over' : ''}`}
      data-column-id={columnId}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <div className="kanban-column-title-wrap">
          <h3 className="kanban-column-title">{title}</h3>
          <span className="kanban-column-count">{tasks.length}</span>
        </div>
        <button
          className="kanban-column-add-btn"
          onClick={() => onAddTask && onAddTask(columnId)}
          title="添加任务"
          type="button"
        >
          +
        </button>
      </div>

      <div className="kanban-column-tasks">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className="kanban-task-wrapper"
            data-task-index={index}
          >
            <TaskCard
              task={task}
              isDragging={draggingTaskId === task.id}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={onTaskDragStart}
              onDragEnd={onTaskDragEnd}
            />
          </div>
        ))}
        {renderEmptyState()}
      </div>
    </div>
  )
}
