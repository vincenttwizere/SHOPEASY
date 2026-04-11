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
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p className="wishlist-subtitle">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
      </div>

      {loading && (
        <div className="wishlist-loading">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      )}

      {message && (
        <div className={`wishlist-message wishlist-message-${messageType}`}>
          <div className="message-content">
            {messageType === 'success' && '✓ '}
            {messageType === 'error' && '✗ '}
            {message}
          </div>
        </div>
      )}

      {!loading && items.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">♡</div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to come back to them later</p>
          <button className="btn primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <div className="wishlist-container">
          <div className="wishlist-items">
            {items.map(p => (
              <div className="wishlist-item" key={p.id}>
                <div className="item-image-wrapper" onClick={() => navigate(`/details/${p.id}`)}>
                  <img src={p.image} alt={p.name} className="item-image" />
                  <div className="image-overlay">View Details</div>
                </div>

                <div className="item-info">
                  <h3 className="item-name">{p.name}</h3>
                  
                  {p.category && (
                    <p className="item-category">{p.category}</p>
                  )}
                  
                  <p className="item-price">${Number(p.price).toFixed(2)}</p>
                  
                  {p.description && (
                    <p className="item-description">{p.description}</p>
                  )}

                  <div className="item-actions">
                    <button 
                      className="btn-add-to-cart" 
                      onClick={() => handleAddToCart(p)}
                      title="Add to cart"
                    >
                      <ShoppingCart size={16} /> 
                      <span>Add to Cart</span>
                    </button>
                    
                    <button 
                      className="btn-remove-wishlist" 
                      onClick={() => handleRemove(p.id)}
                      title="Remove from wishlist"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
