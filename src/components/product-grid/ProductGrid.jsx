import './ProductGrid.css'

function ProductGrid({ products }) {
  return (
    <section className="product-grid" id="products">
      <div className="product-grid__heading">
        <span>Product Section</span>
        <h2>Beautifully packed spices for daily cooking and premium retail shelves.</h2>
      </div>

      <div className="product-grid__list">
        {products.map((product) => (
          <article key={product.name} className="product-grid__card">
            <div className="product-grid__badge">{product.tag}</div>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-grid__meta">
              <strong>{product.price}</strong>
              <span>{product.size}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default ProductGrid
