import './Cart.css';

function Cart({ cart, isOpen, onClose, onUpdateQuantity, onRemoveItem }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 && subtotal < 100 ? 9.99 : 0;
  const total = subtotal + shipping;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      <aside className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <div>
            <h2 className="cart-title">Your Cart</h2>
            <span className="cart-item-count">{itemCount} items</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <p>Your cart is empty</p>
            <span>Add some products to get started</span>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-category">{item.category}</span>
                    <div className="cart-item-row">
                      <div className="quantity-controls">
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          +
                        </button>
                      </div>
                      <span className="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="cart-remove-btn"
                    onClick={() => onRemoveItem(item._id)}
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal > 0 && subtotal < 100 && (
                <p className="cart-free-shipping-hint">
                  Add ${(100 - subtotal).toFixed(2)} more for FREE shipping!
                </p>
              )}
              <div className="cart-summary-row cart-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button className="checkout-btn">Proceed to Checkout</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export default Cart;
