export default function TagFilter({
  allTags,
  selectedTags,
  onTagToggle,
  onClearAll,
}) {
  if (!allTags || allTags.length === 0) {
    return null
  }

  return (
    <div className="tag-filter">
      <div className="tag-filter-header">
        <span className="tag-filter-title">按标签筛选：</span>
        {selectedTags.length > 0 && (
          <button
            type="button"
            className="tag-filter-clear"
            onClick={onClearAll}
          >
            清除筛选 ({selectedTags.length})
          </button>
        )}
      </div>
      <div className="tag-filter-chips">
        {allTags.map((tag) => {
          const isSelected = selectedTags.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              className={`tag-filter-chip ${isSelected ? 'tag-filter-chip-selected' : ''}`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
