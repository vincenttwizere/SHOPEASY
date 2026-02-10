import { useEffect, useState } from "react";
import { getProducts } from "../api";

export const products = [];

export default function Products({ onViewDetails, items: propItems, searchQuery }) {
  const [items, setItems] = useState(propItems || products);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getProducts(searchQuery);
        // Map backend fields to frontend expectations
        const mapped = data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.image_url || p.image || '',
          description: p.description || '',
          category: p.category || '',
          features: p.features || []
        }));
        if (mounted && !propItems) setItems(mapped);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [searchQuery]);

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our collection of quality products</p>
      </div>

      <div className="products-filters">
        <select>
          <option>All Categories</option>
          <option>Electronics</option>
          <option>Fashion</option>
          <option>Accessories</option>
        </select>

        <select>
          <option>Sort By</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>

      <div className="products-grid">
        {loading && <p>Loading products...</p>}
        {items.map((product) => (
          <div className="product-card" key={product.id}>
            <img src={product.image} className="object-c" alt={product.name} />

            <div className="product-info">
              <h3>{product.name}</h3>
              <span className="category">{product.category}</span>
              <p className="price">${product.price}</p>

              <button 
                className="details-btn"
                onClick={() => onViewDetails(product)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



