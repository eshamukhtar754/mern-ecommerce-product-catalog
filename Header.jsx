import './Header.css';

function Header({ cartCount, onCartClick, searchQuery, onSearchChange, selectedCategory, onCategoryChange, categories }) {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <span className="logo-icon">🛍️</span>
          <h1 className="logo-text">ShopCatalog</h1>
        </div>

        <div className="search-section">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="header-actions">
          <button className="cart-btn" onClick={onCartClick}>
            <span className="cart-icon">🛒</span>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}

export default Header;
