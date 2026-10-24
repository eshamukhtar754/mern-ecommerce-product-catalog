import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.floor(product.rating) ? 'star filled' : 'star'}>
        ★
      </span>
    );
  }

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.stock < 10 && (
          <span className="stock-badge">Only {product.stock} left</span>
        )}
      </div>
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          {stars}
          <span className="rating-count">({product.rating})</span>
        </div>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
