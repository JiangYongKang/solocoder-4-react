import { Priority, PriorityLabels } from '../constants.js'

const priorityStyles = {
  [Priority.HIGH]: 'task-card-priority-high',
  [Priority.MEDIUM]: 'task-card-priority-medium',
  [Priority.LOW]: 'task-card-priority-low',
}

const priorityDots = {
  [Priority.HIGH]: '●●●',
  [Priority.MEDIUM]: '●●',
  [Priority.LOW]: '●',
}

export default function TaskCard({
  task,
  isDragging,
  onEdit,
  onDelete,
  onDragStart,
  onDragEnd,
}) {
  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({
      taskId: task.id,
      columnId: task.columnId,
    }))
    if (onDragStart) {
      onDragStart(task)
    }
  }

  const handleDragEnd = () => {
    if (onDragEnd) {
      onDragEnd()
    }
  }

  return (
    <div
      className={`task-card ${priorityStyles[task.priority]} ${isDragging ? 'task-card-dragging' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-task-id={task.id}
    >
      <div className="task-card-header">
        <span
          className={`task-card-priority-badge ${priorityStyles[task.priority]}`}
          title={PriorityLabels[task.priority]}
        >
          {priorityDots[task.priority]}
        </span>
        <div className="task-card-actions">
          <button
            className="task-card-btn"
            onClick={() => onEdit && onEdit(task)}
            title="编辑任务"
            type="button"
          >
            ✎
          </button>
          <button
            className="task-card-btn task-card-btn-delete"
            onClick={() => onDelete && onDelete(task)}
            title="删除任务"
            type="button"
          >
            ×
          </button>
        </div>
      </div>

      <h4 className="task-card-title">{task.title}</h4>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      {task.tags && task.tags.length > 0 && (
        <div className="task-card-tags">
          {task.tags.map((tag) => (
            <span key={tag} className="task-card-tag">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
