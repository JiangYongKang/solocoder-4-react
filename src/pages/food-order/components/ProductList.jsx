import { useRef, useEffect } from 'react'
import ProductCard from './ProductCard'

const ProductList = ({
  categories,
  products,
  selectedCategory,
  cartItems,
  onAddToCart,
  onShowSpecs,
  categoryRefs
}) => {
  const listRef = useRef(null)

  const getProductCartQuantity = (productId) => {
    return cartItems
      .filter((item) => item.productId === productId)
      .reduce((sum, item) => sum + item.quantity, 0)
  }

  const getProductsByCategory = (categoryId) => {
    return products.filter((p) => p.categoryId === categoryId)
  }

  useEffect(() => {
    if (selectedCategory && categoryRefs.current[selectedCategory]) {
      categoryRefs.current[selectedCategory]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }, [selectedCategory, categoryRefs])

  return (
    <div className="product-list" ref={listRef}>
      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id)
        if (categoryProducts.length === 0) return null

        return (
          <div
            key={category.id}
            className="category-section"
            ref={(el) => (categoryRefs.current[category.id] = el)}
          >
            <div className="category-title">
              <span>{category.name}</span>
            </div>
            <div className="products-grid">
              {categoryProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartQuantity={getProductCartQuantity(product.id)}
                  onAdd={onAddToCart}
                  onShowSpecs={onShowSpecs}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductList
