import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, placeOrder } from '../api';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      const res = await getCart();
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load cart');
      setMessageType('error');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function changeQty(itemId, qty) {
    if (qty < 1) return;
    try {
      await updateCartItem(itemId, { quantity: qty });
      load();
    } catch (err) { 
      console.error(err);
      setMessage('Failed to update quantity');
      setMessageType('error');
    }
  }

  async function removeItem(itemId) {
    try { 
      await removeCartItem(itemId); 
      load();
      setMessage('Item removed from cart');
      setMessageType('success');
    } catch (err) { 
      console.error(err);
      setMessage('Failed to remove item');
      setMessageType('error');
    }
  }

  async function checkout() {
    if (items.length === 0) {
      setMessage('Your cart is empty');
      setMessageType('warning');
      return;
    }

    try {
      setCheckoutLoading(true);
      const res = await placeOrder();
      setMessage(`Order ${res.orderId} placed successfully! Total: $${res.total}`);
      setMessageType('success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      setItems([]);
    } catch (err) {
      setMessage(err.message || 'Checkout failed');
      setMessageType('error');
    }
    finally { setCheckoutLoading(false); }
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Your Shopping Cart</h1>
        <p className="cart-subtitle">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {loading && (
        <div className="cart-loading">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      )}

      {message && (
        <div className={`cart-message cart-message-${messageType}`}>
          <div className="message-content">
            {messageType === 'success' && '✓ '}
            {messageType === 'error' && '✗ '}
            {messageType === 'warning' && '⚠ '}
            {message}
          </div>
        </div>
      )}
      
      {!loading && items.length === 0 ? (
        <div className="cart-empty">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items to get started!</p>
          <button className="btn primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-main">
            <div className="cart-items">
              {items.map(it => (
                <div className="cart-item" key={it.itemId}>
                  <div className="item-image-wrapper">
                    <img src={it.image_url || it.image} alt={it.name} className="item-image" />
                  </div>
                  
                  <div className="item-details">
                    <h3 className="item-name">{it.name}</h3>
                    <p className="item-price">${Number(it.price).toFixed(2)}</p>
                  </div>

                  <div className="item-quantity">
                    <label>Qty:</label>
                    <div className="qty-input-group">
                      <button 
                        className="qty-dec"
                        onClick={() => changeQty(it.itemId, it.quantity - 1)}
                      >
                        −
                      </button>
                      <input 
                        type="number" 
                        min={1} 
                        value={it.quantity}
                        className="qty-input"
                        onChange={(e) => changeQty(it.itemId, Number(e.target.value))} 
                      />
                      <button 
                        className="qty-inc"
                        onClick={() => changeQty(it.itemId, it.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="item-total-price">
                    ${Number(it.price * it.quantity).toFixed(2)}
                  </div>

                  <button 
                    className="btn-remove" 
                    onClick={() => removeItem(it.itemId)}
                    title="Remove from cart"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${Number(total).toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="shipping-cost">
                  {total > 50 ? (
                    <><span className="badge">FREE</span></>
                  ) : (
                    '$10.00'
                  )}
                </span>
              </div>
              
              {total > 50 && (
                <div className="promo-note">✓ Free shipping on orders over $50</div>
              )}
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span className="total-amount">${(total + (total > 50 ? 0 : 10)).toFixed(2)}</span>
              </div>
              
              <button 
                className="btn-checkout" 
                onClick={checkout} 
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <><span className="spinner-mini"></span> Processing...</> 
                ) : (
                  '→ Proceed to Checkout'
                )}
              </button>
              
              <button 
                className="btn-continue-shopping"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
