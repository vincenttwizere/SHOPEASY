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
