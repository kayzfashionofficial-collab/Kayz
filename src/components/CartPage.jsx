// src/pages/CartPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './context/CartContext';
import '../assets/css/Cart.css';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    cartTotal, 
    loading, 
    proceedToCheckout,
    updateCartQuantity
  } = useCart();

  const navigate = useNavigate();
  const [updatingItemIds, setUpdatingItemIds] = useState([]); // track which items are updating

  // === Handlers ===
  const handleCheckout = () => proceedToCheckout();
  const handleContinueShopping = () => navigate('/products');

  const handleUpdateQuantity = async (itemId, newQty, maxQty) => {
    if (newQty < 1 || newQty > maxQty) return;

    setUpdatingItemIds((prev) => [...prev, itemId]); // mark item as updating
    try {
      await updateCartQuantity(itemId, newQty, maxQty);
    } finally {
      setUpdatingItemIds((prev) => prev.filter((id) => id !== itemId)); // remove spinner
    }
  };

  const handleRemoveItem = async (itemId) => {
    setUpdatingItemIds((prev) => [...prev, itemId]);
    try {
      await removeFromCart(itemId);
    } finally {
      setUpdatingItemIds((prev) => prev.filter((id) => id !== itemId));
    }
  };

  // === Empty Cart ===
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <div className="empty-container">
          <h2>Your cart is empty</h2>
          <p>Add some amazing products to get started!</p>
          <button 
            className="continue-shopping-btn"
            onClick={handleContinueShopping}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // === Page ===
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <span className="cart-count">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        <div className="cart-content">
          {/* === ITEMS === */}
          <div className="cart-items">
            {cartItems.map((item) => {
              const isUpdating = updatingItemIds.includes(item.id);

              return (
                <div key={item.id} className={`cart-item ${isUpdating ? 'updating' : ''}`}>
                  <div className="item-image">
                    <img 
                      src={item.product.featuredImage?.url || '/placeholder-image.jpg'} 
                      alt={item.product.title}
                      loading="lazy"
                    />
                  </div>

                  <div className="item-details">
                    <h3 className="item-title">{item.product.title}</h3>
                    <div className="item-price">${parseFloat(item.price).toFixed(2)}</div>

                    <div className="item-quantity">
                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.merchandise?.quantityAvailable || 999)}
                        disabled={isUpdating || item.quantity <= 1}
                      >
                        –
                      </button>

                      <span className="qty-value">
                        {isUpdating ? <span className="mini-spinner"></span> : item.quantity}
                      </span>

                      <button
                        className="qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.merchandise?.quantityAvailable || 999)}
                        disabled={isUpdating || item.quantity >= (item.merchandise?.quantityAvailable || 999)}
                      >
                        +
                      </button>

                      <span className="stock-info">
                        {item.merchandise?.quantityAvailable
                          ? `(Max: ${item.merchandise.quantityAvailable})`
                          : ''}
                      </span>
                    </div>

                    <div className="item-total">Total: ${item.total.toFixed(2)}</div>
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
    <span className="removing-spinner">...</span>
  ) : (
    <Trash2 size={18} />
  )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* === SUMMARY === */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span>Shipping:</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-row">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>

              <div className="summary-row total">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <div className="checkout-note">
                <p>You'll complete your purchase on Shopify's secure checkout page.</p>
              </div>

              <button 
                className="continue-shopping-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
