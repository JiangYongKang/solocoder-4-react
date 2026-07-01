const CategoryBar = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="category-bar">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`category-item ${
            selectedCategory === category.id ? 'active' : ''
          }`}
          onClick={() => onSelect(category.id)}
        >
          <span className="category-name">{category.name}</span>
        </div>
      ))}
    </div>
  )
}

export default CategoryBar
