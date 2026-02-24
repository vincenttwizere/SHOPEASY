import { useEffect, useState } from "react";
import { getProducts, getWishlist, addToWishlist, removeFromWishlist, addToCart } from "../api";
import ProductsCard from "../components/ProductsCard";
import { useNavigate } from "react-router-dom";

export const products = [];

export default function Products({ onViewDetails, items: propItems, searchQuery }) {
  const [items, setItems] = useState(propItems || products);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        // Fetch products and wishlist in parallel
        // If query fails (e.g. 401 for wishlist), it returns empty array safely
        const [data, wishlistData] = await Promise.all([
          getProducts(searchQuery),
          getWishlist().catch(() => [])
        ]);

        const mapped = data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          image: p.image_url || p.image || '',
          images: p.images || [],
          description: p.description || '',
          category: p.category || '',
          features: p.features || []
        }));

        if (mounted) {
          if (!propItems) setItems(mapped);
          if (Array.isArray(wishlistData)) {
            setWishlist(wishlistData.map(w => w.product_id));
          }
        }
      } catch (err) {
        console.error('Failed to load data', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [searchQuery]);

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to use wishlist");
      return;
    }

    const isIn = wishlist.includes(productId);
    try {
      if (isIn) {
        await removeFromWishlist(productId);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        await addToWishlist(productId);
        setWishlist(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist.");
    }
  };

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add to cart");
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      alert("Added to cart!");
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to buy");
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert("Failed to process buy now");
    }
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our collection of quality products</p>
        {searchQuery && <p className="search-result">Showing results for "<strong>{searchQuery}</strong>"</p>}
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
        {!loading && items.length === 0 && <p>No products found{searchQuery && ` matching "${searchQuery}"`}.</p>}
        {items.map((product) => (
          <ProductsCard
            key={product.id}
            {...product}
            inWishlist={wishlist.includes(product.id)}
            onToggleWishlist={toggleWishlist}
            onAddToCart={() => handleAddToCart(product)}
            onBuyNow={() => handleBuyNow(product)}
          />
        ))}
      </div>
    </div>
  );
}



