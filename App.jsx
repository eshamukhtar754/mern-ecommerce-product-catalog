import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import './App.css';

const API_BASE = '/api';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [addedNotification, setAddedNotification] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setIsLoading(true);
        setApiError(null);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/categories`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('API server not reachable. Is backend running on port 5000?');
        }

        const productsJson = await productsRes.json();
        const categoriesJson = await categoriesRes.json();

        if (productsJson.success) {
          setProducts(productsJson.data);
        }
        if (categoriesJson.success) {
          setCategories(categoriesJson.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setApiError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    setAddedNotification(product.name);
    setTimeout(() => setAddedNotification(null), 2000);
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.min(newQuantity, item.stock) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <div className="app-root">
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      {addedNotification && (
        <div className="toast-notification">
          ✅ "{addedNotification}" added to cart!
        </div>
      )}

      <main className="main-content">
        <div className="catalog-header">
          <div>
            <h2 className="catalog-title">Featured Products</h2>
            <p className="catalog-subtitle">
              {isLoading
                ? 'Loading products...'
                : apiError
                ? `⚠️ ${apiError}`
                : `${filteredProducts.length} product${
                    filteredProducts.length !== 1 ? 's' : ''
                  } available${
                    selectedCategory !== 'All'
                      ? ` in "${selectedCategory}"`
                      : ''
                  }`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="empty-state">
            <div className="empty-icon">⏳</div>
            <h3>Loading products...</h3>
            <p>Fetching data from MongoDB via Express API</p>
          </div>
        ) : apiError ? (
          <div className="empty-state">
            <div className="empty-icon">⚠️</div>
            <h3>Backend connection failed</h3>
            <p>{apiError}</p>
            <p style={{ marginTop: 8, fontSize: 14 }}>
              Make sure MongoDB is running locally and backend server is started
              (see README or run: <code>cd backend ; npm install ; npm run seed ; npm run dev</code>)
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          © 2026 ShopCatalog. 
        </p>
      </footer>

      <Cart
        cart={cart}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}

export default App;
