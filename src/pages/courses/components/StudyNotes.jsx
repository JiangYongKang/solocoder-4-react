import { useState, useRef, useEffect } from 'react'

export default function StudyNotes({
  lessonId,
  lessonTitle,
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onToggleFavorite,
}) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [editContent, setEditContent] = useState('')
  const [filterFavorites, setFilterFavorites] = useState(false)
  const lastLessonIdRef = useRef(lessonId)

  useEffect(() => {
    if (lessonId !== lastLessonIdRef.current) {
      lastLessonIdRef.current = lessonId
      const timer = setTimeout(() => {
        setIsAdding(false)
        setEditingId(null)
        setNewNoteContent('')
        setEditContent('')
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [lessonId])

  if (!lessonId) {
    return (
      <div className="notes-container">
        <div className="notes-placeholder">
          <p>请选择一个课时查看笔记</p>
        </div>
      </div>
    )
  }

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return
    if (onAddNote) {
      onAddNote({
        content: newNoteContent.trim(),
        isFavorite: false,
      })
    }
    setNewNoteContent('')
    setIsAdding(false)
  }

  const handleStartEdit = (note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleSaveEdit = (note) => {
    if (!editContent.trim()) return
    if (onUpdateNote) {
      onUpdateNote({
        ...note,
        content: editContent.trim(),
      })
    }
    setEditingId(null)
    setEditContent('')
  }

  const handleDelete = (noteId) => {
    if (window.confirm('确定要删除这条笔记吗？')) {
      if (onDeleteNote) {
        onDeleteNote(noteId)
      }
    }
  }

  const handleToggleFavorite = (noteId) => {
    if (onToggleFavorite) {
      onToggleFavorite(noteId)
    }
  }

  const displayedNotes = filterFavorites
    ? notes.filter((note) => note.isFavorite)
    : notes

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h2 className="notes-title">学习笔记</h2>
        <div className="lesson-subtitle">{lessonTitle}</div>
      </div>

      <div className="notes-toolbar">
        <button
          className={`filter-btn ${filterFavorites ? 'active' : ''}`}
          onClick={() => setFilterFavorites(!filterFavorites)}
        >
          <span className="icon">⭐</span>
          {filterFavorites ? '显示全部' : '仅显示收藏'}
        </button>

        {!isAdding && (
          <button className="add-btn" onClick={() => setIsAdding(true)}>
            <span className="icon">+</span>
            新增笔记
          </button>
        )}
      </div>

      {isAdding && (
        <div className="note-editor add-note">
          <textarea
            className="note-textarea"
            placeholder="请输入笔记内容..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            autoFocus
          />
          <div className="editor-actions">
            <button
              className="action-btn cancel-btn"
              onClick={() => {
                setIsAdding(false)
                setNewNoteContent('')
              }}
            >
              取消
            </button>
            <button
              className="action-btn save-btn"
              onClick={handleAddNote}
              disabled={!newNoteContent.trim()}
            >
              保存
            </button>
          </div>
        </div>
      )}

      <div className="notes-list">
        {displayedNotes.length === 0 ? (
          <div className="notes-empty">
            <div className="empty-icon">📝</div>
            <p>
              {filterFavorites
                ? '暂无收藏的笔记'
                : '还没有笔记，点击上方"新增笔记"开始记录'}
            </p>
          </div>
        ) : (
          displayedNotes
            .sort((a, b) => {
              if (a.isFavorite !== b.isFavorite) {
                return a.isFavorite ? -1 : 1
              }
              return b.updatedAt - a.updatedAt
            })
            .map((note) => (
              <div
                key={note.id}
                className={`note-card ${note.isFavorite ? 'favorite' : ''}`}
              >
                {editingId === note.id ? (
                  <div className="note-editor">
                    <textarea
                      className="note-textarea"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      autoFocus
                    />
                    <div className="editor-actions">
                      <button
                        className="action-btn cancel-btn"
                        onClick={handleCancelEdit}
                      >
                        取消
                      </button>
                      <button
                        className="action-btn save-btn"
                        onClick={() => handleSaveEdit(note)}
                        disabled={!editContent.trim()}
                      >
                        保存
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="note-content">
                      <p className="note-text">{note.content}</p>
                      <div className="note-meta">
                        <span className="note-time">
                          {formatDate(note.updatedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="note-actions">
                      <button
                        className={`action-icon ${
                          note.isFavorite ? 'favorited' : ''
                        }`}
                        onClick={() => handleToggleFavorite(note.id)}
                        title={note.isFavorite ? '取消收藏' : '收藏'}
                      >
                        ⭐
                      </button>
                      <button
                        className="action-icon"
                        onClick={() => handleStartEdit(note)}
                        title="编辑"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-icon delete"
                        onClick={() => handleDelete(note.id)}
                        title="删除"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
        )}
      </div>

      <div className="notes-footer">
        <span className="notes-count">
          共 {notes.length} 条笔记
          {filterFavorites && displayedNotes.length !== notes.length
            ? `，已显示 ${displayedNotes.length} 条`
            : ''}
        </span>
      </div>
    </div>
  )
}
