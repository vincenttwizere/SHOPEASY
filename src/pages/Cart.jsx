import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, placeOrder } from '../api';

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await getCart();
      setItems(res.items || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function changeQty(itemId, qty) {
    try {
      await updateCartItem(itemId, { quantity: qty });
      load();
    } catch (err) { console.error(err); }
  }

  async function removeItem(itemId) {
    try { await removeCartItem(itemId); load(); } catch (err) { console.error(err); }
  }

  async function checkout() {
    try {
      setCheckoutLoading(true);
      const res = await placeOrder();
      setMessage(`Order ${res.orderId} placed — total $${res.total}`);
      load();
    } catch (err) { setMessage(err.message || 'Checkout failed'); }
    finally { setCheckoutLoading(false); }
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {loading && <p>Loading...</p>}
      {message && <p className="message">{message}</p>}
      <div className="cart-items">
        {items.length === 0 && <p>Your cart is empty</p>}
        {items.map(it => (
          <div className="cart-item" key={it.itemId}>
            <img src={it.image_url || it.image} alt={it.name} />
            <div>
              <h4>{it.name}</h4>
              <p>${it.price}</p>
              <input type="number" min={1} value={it.quantity} onChange={(e) => changeQty(it.itemId, Number(e.target.value))} />
              <button className="btn" onClick={() => removeItem(it.itemId)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      {items.length > 0 && <button className="btn primary" onClick={checkout} disabled={checkoutLoading}>{checkoutLoading ? 'Placing order...' : 'Checkout'}</button>}
    </div>
  );
}
import { useEffect, useState } from 'react';
import { getCart, updateCartItem, removeCartItem, placeOrder } from '../api';

export default function Cart({ token, onOrderPlaced }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!token) return;
    setLoading(true);
    try {
      const res = await getCart(token);
      setItems(res.items || []);
    } catch (err) {
      console.error('Load cart failed', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [token]);

  async function handleUpdate(itemId, qty) {
    try {
      await updateCartItem(token, itemId, { quantity: qty });
      load();
    } catch (err) { console.error(err); }
  }

  async function handleRemove(itemId) {
    try {
      await removeCartItem(token, itemId);
      load();
    } catch (err) { console.error(err); }
  }

  async function handleCheckout() {
    try {
      const res = await placeOrder(token);
      alert('Order placed: ' + JSON.stringify(res));
      onOrderPlaced && onOrderPlaced();
      load();
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    }
  }

  if (!token) return <div className="cart-page"><p>Please login to view your cart.</p></div>;

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && <p>Cart is empty.</p>}
      <div className="cart-items">
        {items.map(it => (
+          <div key={it.itemId} className="cart-item">
+            <img src={it.image_url || it.image} alt={it.name} />
+            <div className="info">
+              <h4>{it.name}</h4>
+              <p>${it.price} x {it.quantity}</p>
+              <div className="actions">
+                <button onClick={() => handleUpdate(it.itemId, Math.max(1, it.quantity - 1))}>-</button>
+                <button onClick={() => handleUpdate(it.itemId, it.quantity + 1)}>+</button>
+                <button onClick={() => handleRemove(it.itemId)}>Remove</button>
+              </div>
+            </div>
+          </div>
         ))}
      </div>

      {items.length > 0 && (
        <div className="checkout">
          <button className="btn primary" onClick={handleCheckout}>Place Order</button>
        </div>
      )}
    </div>
  );
}
