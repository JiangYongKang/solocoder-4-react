import { useState, useMemo } from 'react'
import {
  ColumnIds,
  ColumnLabels,
  ColumnOrder,
  Priority,
  PriorityLabels,
} from '../constants.js'
import { validateTask } from '../utils.js'

function getInitialState(initialTask, defaultColumnId) {
  if (initialTask) {
    return {
      title: initialTask.title ?? '',
      description: initialTask.description ?? '',
      tagsInput: (initialTask.tags ?? []).join(', '),
      priority: initialTask.priority ?? Priority.MEDIUM,
      columnId: initialTask.columnId ?? defaultColumnId ?? ColumnIds.TODO,
    }
  }
  return {
    title: '',
    description: '',
    tagsInput: '',
    priority: Priority.MEDIUM,
    columnId: defaultColumnId ?? ColumnIds.TODO,
  }
}

export default function TaskModal({
  isOpen,
  mode,
  initialTask,
  defaultColumnId,
  allTags,
  onClose,
  onSave,
  onDelete,
}) {
  const initial = useMemo(
    () => getInitialState(initialTask, defaultColumnId),
    [initialTask, defaultColumnId]
  )

  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)
  const [tagsInput, setTagsInput] = useState(initial.tagsInput)
  const [priority, setPriority] = useState(initial.priority)
  const [columnId, setColumnId] = useState(initial.columnId)
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const parseTags = (input) => {
    return input
      .split(/[,，]/)
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const tags = parseTags(tagsInput)
    const taskData = {
      title,
      description,
      tags,
      priority,
      columnId,
    }

    const validation = validateTask(taskData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    if (onSave) {
      onSave(taskData)
    }
  }

  const handleDelete = () => {
    if (onDelete && initialTask) {
      onDelete(initialTask.id)
    }
  }

  const modalTitle = mode === 'edit' ? '编辑任务' : '新增任务'

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div
        className="task-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="task-modal-header">
          <h2 id="task-modal-title" className="task-modal-title">
            {modalTitle}
          </h2>
          <button
            className="task-modal-close"
            onClick={onClose}
            title="关闭"
            type="button"
          >
            ×
          </button>
        </div>

        <form className="task-modal-form" onSubmit={handleSubmit}>
          <div className="task-modal-field">
            <label className="task-modal-label" htmlFor="task-title">
              标题 <span className="task-modal-required">*</span>
            </label>
            <input
              id="task-title"
              className={`task-modal-input ${errors.title ? 'task-modal-input-error' : ''}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入任务标题"
              maxLength={100}
            />
            {errors.title && (
              <p className="task-modal-error">{errors.title}</p>
            )}
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label" htmlFor="task-description">
              描述
            </label>
            <textarea
              id="task-description"
              className={`task-modal-textarea ${errors.description ? 'task-modal-input-error' : ''}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入任务描述（可选）"
              rows={4}
              maxLength={2000}
            />
            {errors.description && (
              <p className="task-modal-error">{errors.description}</p>
            )}
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label" htmlFor="task-tags">
              标签
            </label>
            <input
              id="task-tags"
              className="task-modal-input"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="用逗号分隔多个标签，如：前端, 设计"
            />
            {allTags && allTags.length > 0 && (
              <div className="task-modal-tag-suggestions">
                <span className="task-modal-tag-suggestions-label">快速添加：</span>
                {allTags.map((tag) => {
                  const currentTags = parseTags(tagsInput)
                  const isSelected = currentTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      className={`task-modal-tag-chip ${isSelected ? 'task-modal-tag-chip-selected' : ''}`}
                      onClick={() => {
                        const current = parseTags(tagsInput)
                        if (current.includes(tag)) {
                          setTagsInput(current.filter((t) => t !== tag).join(', '))
                        } else {
                          setTagsInput([...current, tag].join(', '))
                        }
                      }}
                    >
                      {isSelected ? '✓ ' : ''}{tag}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label">
              优先级
            </label>
            <div className="task-modal-radio-group">
              {[Priority.HIGH, Priority.MEDIUM, Priority.LOW].map((p) => (
                <label
                  key={p}
                  className={`task-modal-radio ${priority === p ? `task-modal-radio-${p}` : ''}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={p}
                    checked={priority === p}
                    onChange={() => setPriority(p)}
                    className="task-modal-radio-input"
                  />
                  <span className="task-modal-radio-label">
                    {PriorityLabels[p]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="task-modal-field">
            <label className="task-modal-label" htmlFor="task-column">
              所属状态
            </label>
            <select
              id="task-column"
              className="task-modal-select"
              value={columnId}
              onChange={(e) => setColumnId(e.target.value)}
            >
              {ColumnOrder.map((colId) => (
                <option key={colId} value={colId}>
                  {ColumnLabels[colId]}
                </option>
              ))}
            </select>
          </div>

          <div className="task-modal-footer">
            {mode === 'edit' && (
              <button
                type="button"
                className="task-modal-btn task-modal-btn-danger"
                onClick={handleDelete}
              >
                删除任务
              </button>
            )}
            <div className="task-modal-footer-right">
              <button
                type="button"
                className="task-modal-btn task-modal-btn-secondary"
                onClick={onClose}
              >
                取消
              </button>
              <button
                type="submit"
                className="task-modal-btn task-modal-btn-primary"
              >
                保存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
