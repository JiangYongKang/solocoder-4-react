import { useState, useMemo, useCallback } from 'react'
import KanbanColumn from './components/KanbanColumn.jsx'
import TagFilter from './components/TagFilter.jsx'
import TaskModal from './components/TaskModal.jsx'
import {
  ColumnIds,
  ColumnLabels,
  ColumnOrder,
} from './constants.js'
import {
  groupTasksByColumn,
  filterTasksByTags,
  getAllTags,
  createTask,
  addTaskToList,
  updateTaskInList,
  deleteTaskFromList,
  moveTaskBetweenColumns,
  reorderTasksInColumn,
  flattenGroupedTasks,
} from './utils.js'
import { mockTasks } from './mockData.js'
import './KanbanPage.css'

export default function KanbanPage() {
  const [tasks, setTasks] = useState(mockTasks)
  const [selectedTags, setSelectedTags] = useState([])
  const [draggingTaskId, setDraggingTaskId] = useState(null)
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState(null)
  const [dragOverColumnTasks, setDragOverColumnTasks] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editingTask, setEditingTask] = useState(null)
  const [defaultColumnId, setDefaultColumnId] = useState(ColumnIds.TODO)
  const [modalOpenCounter, setModalOpenCounter] = useState(0)

  const allTags = useMemo(() => getAllTags(tasks), [tasks])

  const filteredTasks = useMemo(
    () => filterTasksByTags(tasks, selectedTags),
    [tasks, selectedTags]
  )

  const groupedAllTasks = useMemo(
    () => groupTasksByColumn(tasks),
    [tasks]
  )

  const groupedFilteredTasks = useMemo(
    () => groupTasksByColumn(filteredTasks),
    [filteredTasks]
  )

  const isFilterActive = selectedTags.length > 0

  const handleTagToggle = useCallback((tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }, [])

  const handleClearTags = useCallback(() => {
    setSelectedTags([])
  }, [])

  const handleTaskDragStart = useCallback((task) => {
    setDraggingTaskId(task.id)
  }, [])

  const handleTaskDragEnd = useCallback(() => {
    setDraggingTaskId(null)
    setDragOverTaskIndex(null)
    setDragOverColumnTasks(null)
  }, [])

  const handleTaskDragOver = useCallback((_columnId, taskIndex, columnTasks) => {
    setDragOverTaskIndex(taskIndex)
    setDragOverColumnTasks(columnTasks ?? null)
  }, [])

  const mapFilteredIndexToFullIndex = (
    filteredIndex,
    filteredTasks,
    fullTasks
  ) => {
    if (filteredIndex === null || filteredIndex === undefined) {
      return fullTasks.length
    }
    if (!filteredTasks || filteredTasks.length === 0) {
      return Math.min(Math.max(filteredIndex, 0), fullTasks.length)
    }
    if (filteredIndex <= 0) {
      if (filteredTasks[0]) {
        const idx = fullTasks.findIndex((t) => t.id === filteredTasks[0].id)
        return idx === -1 ? 0 : idx
      }
      return 0
    }
    if (filteredIndex >= filteredTasks.length) {
      const lastFiltered = filteredTasks[filteredTasks.length - 1]
      const idx = fullTasks.findIndex((t) => t.id === lastFiltered.id)
      return idx === -1 ? fullTasks.length : idx + 1
    }
    const anchorTask = filteredTasks[filteredIndex]
    const idx = fullTasks.findIndex((t) => t.id === anchorTask.id)
    return idx === -1 ? fullTasks.length : idx
  }

  const handleTaskDrop = useCallback((dropData) => {
    const { taskId, columnId: srcColId, destColumnId } = dropData

    setTasks((prevTasks) => {
      const grouped = groupTasksByColumn(prevTasks)
      const sourceTasks = grouped[srcColId]
      const sourceIndex = sourceTasks.findIndex((t) => t.id === taskId)

      if (sourceIndex === -1) return prevTasks

      const destTasks = grouped[destColumnId]

      const destIdx = mapFilteredIndexToFullIndex(
        dragOverTaskIndex,
        dragOverColumnTasks,
        destTasks
      )

      if (srcColId === destColumnId) {
        const adjustedDestIdx = destIdx > sourceIndex ? destIdx - 1 : destIdx
        const clampedDestIdx = Math.min(
          Math.max(adjustedDestIdx, 0),
          sourceTasks.length - 1
        )
        const newSourceTasks = reorderTasksInColumn(
          sourceTasks,
          sourceIndex,
          clampedDestIdx
        )
        const newGrouped = { ...grouped, [srcColId]: newSourceTasks }
        return flattenGroupedTasks(newGrouped)
      } else {
        const newGrouped = moveTaskBetweenColumns(
          grouped,
          srcColId,
          sourceIndex,
          destColumnId,
          destIdx
        )
        return flattenGroupedTasks(newGrouped)
      }
    })

    handleTaskDragEnd()
  }, [dragOverTaskIndex, dragOverColumnTasks, handleTaskDragEnd])

  const handleAddTask = useCallback((columnId) => {
    setModalMode('add')
    setEditingTask(null)
    setDefaultColumnId(columnId)
    setModalOpenCounter((prev) => prev + 1)
    setModalOpen(true)
  }, [])

  const handleEditTask = useCallback((task) => {
    setModalMode('edit')
    setEditingTask(task)
    setDefaultColumnId(task.columnId)
    setModalOpenCounter((prev) => prev + 1)
    setModalOpen(true)
  }, [])

  const handleDeleteTask = useCallback((task) => {
    const confirmed = window.confirm(`确定要删除任务「${task.title}」吗？`)
    if (confirmed) {
      setTasks((prev) => deleteTaskFromList(prev, task.id))
    }
  }, [])

  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setEditingTask(null)
  }, [])

  const handleModalSave = useCallback((taskData) => {
    if (modalMode === 'add') {
      const newTask = createTask(taskData)
      setTasks((prev) => addTaskToList(prev, newTask))
    } else if (modalMode === 'edit' && editingTask) {
      let updatedTasks = updateTaskInList(tasks, editingTask.id, taskData)
      if (taskData.columnId !== editingTask.columnId) {
        const grouped = groupTasksByColumn(updatedTasks)
        const srcColId = editingTask.columnId
        const destColId = taskData.columnId
        const sourceIndex = grouped[srcColId].findIndex(
          (t) => t.id === editingTask.id
        )
        if (sourceIndex !== -1) {
          const newGrouped = moveTaskBetweenColumns(
            grouped,
            srcColId,
            sourceIndex,
            destColId,
            grouped[destColId].length
          )
          updatedTasks = flattenGroupedTasks(newGrouped)
        }
      }
      setTasks(updatedTasks)
    }
    setModalOpen(false)
    setEditingTask(null)
  }, [modalMode, editingTask, tasks])

  const handleModalDelete = useCallback((taskId) => {
    setTasks((prev) => deleteTaskFromList(prev, taskId))
    setModalOpen(false)
    setEditingTask(null)
  }, [])

  return (
    <div className="kanban-page">
      <div className="kanban-page-header">
        <div className="kanban-page-title-wrap">
          <h1 className="kanban-page-title">任务看板</h1>
          <p className="kanban-page-subtitle">
            共 {tasks.length} 个任务
            {isFilterActive && `，筛选后 ${filteredTasks.length} 个`}
          </p>
        </div>
        <button
          type="button"
          className="kanban-page-add-btn"
          onClick={() => handleAddTask(ColumnIds.TODO)}
        >
          + 新增任务
        </button>
      </div>

      <TagFilter
        allTags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
        onClearAll={handleClearTags}
      />

      <div className="kanban-board">
        {ColumnOrder.map((colId) => (
          <KanbanColumn
            key={colId}
            columnId={colId}
            title={ColumnLabels[colId]}
            tasks={isFilterActive ? groupedFilteredTasks[colId] : groupedAllTasks[colId]}
            isFilterActive={isFilterActive}
            hasMatchingTasks={groupedFilteredTasks[colId].length > 0}
            draggingTaskId={draggingTaskId}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onTaskDragStart={handleTaskDragStart}
            onTaskDragEnd={handleTaskDragEnd}
            onTaskDrop={handleTaskDrop}
            onTaskDragOver={handleTaskDragOver}
          />
        ))}
      </div>

      <TaskModal
        key={`${modalMode}-${editingTask?.id ?? 'new'}-${defaultColumnId}-${modalOpenCounter}`}
        isOpen={modalOpen}
        mode={modalMode}
        initialTask={editingTask}
        defaultColumnId={defaultColumnId}
        allTags={allTags}
        onClose={handleModalClose}
        onSave={handleModalSave}
        onDelete={handleModalDelete}
      />
    </div>
  )
}
