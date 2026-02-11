import { useEffect, useState } from 'react';
import { getProducts, getWishlist, removeFromWishlist } from '../api';

export default function Wishlist({ onViewDetails }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const allProducts = await getProducts();
      const wishlistIds = getWishlist();
      const filtered = allProducts.filter(p => wishlistIds.includes(p.id));
      setItems(filtered.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image_url || p.image || '',
        description: p.description || '',
        category: p.category || '',
      })));
    } catch (err) {
      console.error('Failed to load wishlist', err);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  function handleRemove(productId) {
    removeFromWishlist(productId);
    load();
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>
      {loading && <p>Loading...</p>}
      {items.length === 0 && <p>Your wishlist is empty</p>}
      <div className="wishlist-items">
        {items.map(p => (
          <div className="wishlist-item" key={p.id}>
            <img src={p.image} alt={p.name} />
            <div>
              <h3>{p.name}</h3>
              <p className="price">${p.price}</p>
              <p className="description">{p.description}</p>
              <div className="actions">
                <button className="btn" onClick={() => onViewDetails && onViewDetails(p)}>View Details</button>
                <button className="btn" onClick={() => handleRemove(p.id)}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
