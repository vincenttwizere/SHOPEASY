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
      <h1>Your Cart</h1>
      {loading && <p className="loading">Loading...</p>}
      {message && <p className={`message ${messageType}`}>{message}</p>}
      
      <div className="cart-items">
        {items.length === 0 && !loading && <p className="empty-cart">Your cart is empty</p>}
        {items.map(it => (
          <div className="cart-item" key={it.itemId}>
            <img src={it.image_url || it.image} alt={it.name} />
            <div className="cart-item-details">
              <h4>{it.name}</h4>
              <p className="price">${Number(it.price).toFixed(2)}</p>
              <div className="quantity-control">
                <label>Quantity:</label>
                <input 
                  type="number" 
                  min={1} 
                  value={it.quantity} 
                  onChange={(e) => changeQty(it.itemId, Number(e.target.value))} 
                />
                <span className="item-total">Item Total: ${Number(it.price * it.quantity).toFixed(2)}</span>
              </div>
              <button className="btn remove-btn" onClick={() => removeItem(it.itemId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="cart-summary">
          <div className="summary-item">
            <span>Subtotal:</span>
            <span>${Number(total).toFixed(2)}</span>
          </div>
          <div className="summary-item shipping">
            <span>Shipping:</span>
            <span>{total > 50 ? 'FREE' : '$10.00'}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${(total + (total > 50 ? 0 : 10)).toFixed(2)}</span>
          </div>
          <button 
            className="btn primary checkout-btn" 
            onClick={checkout} 
            disabled={checkoutLoading}
          >
            {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      )}
    </div>
  );
}
