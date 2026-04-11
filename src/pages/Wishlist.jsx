import { useEffect, useState } from 'react';
import { getWishlist, removeFromWishlist, addToCart } from '../api';
import { useNavigate } from 'react-router-dom';
import { TrashIcon, ShoppingCart } from 'lucide-react';

export default function Wishlist({ onViewDetails }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info');
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setMessage('');
    try {
      // API now returns array of objects { product_id, name, price, image_url, description }
      const wishlistItems = await getWishlist();
      setItems(wishlistItems.map(p => ({
        id: p.product_id,
        name: p.name,
        price: p.price,
        image: p.image_url || p.image || '',
        description: p.description || '',
        category: p.category || '',
      })));
    } catch (err) {
      console.error('Failed to load wishlist', err);
      setMessage('Failed to load wishlist');
      setMessageType('error');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function handleRemove(productId) {
    try {
      await removeFromWishlist(productId);
      setItems(prev => prev.filter(item => item.id !== productId));
      setMessage('Item removed from wishlist');
      setMessageType('success');
    } catch (err) {
      console.error('Failed to remove from wishlist', err);
      setMessage('Failed to remove item');
      setMessageType('error');
    }
  }

  async function handleAddToCart(product) {
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setMessage(`"${product.name}" added to cart!`);
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Failed to add to cart', err);
      setMessage('Failed to add to cart');
      setMessageType('error');
    }
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      {loading && <p className="loading">Loading...</p>}
      {message && <p className={`message ${messageType}`}>{message}</p>}
      {!loading && items.length === 0 && <p className="empty-wishlist">Your wishlist is empty. <button onClick={() => navigate('/products')}>Start shopping</button></p>}
      <div className="wishlist-items">
        {items.map(p => (
          <div className="wishlist-item" key={p.id}>
            <img src={p.image} alt={p.name} onClick={() => navigate(`/details/${p.id}`)} />
            <div className="wishlist-item-content">
              <h3>{p.name}</h3>
              <p className="category">{p.category}</p>
              <p className="price">${Number(p.price).toFixed(2)}</p>
              <p className="description">{p.description}</p>
              <div className="wishlist-actions">
                <button className="btn primary" onClick={() => handleAddToCart(p)}>
                  <ShoppingCart size={18} /> Add to Cart
                </button>
                <button className="btn danger" onClick={() => handleRemove(p.id)}>
                  <TrashIcon size={18} /> Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
