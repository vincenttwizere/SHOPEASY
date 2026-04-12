import { useEffect, useState } from "react";
import { getProducts, getWishlist, addToWishlist, removeFromWishlist, addToCart } from "../api";
import ProductsCard from "../components/ProductsCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Products({ items: propItems, searchQuery }) {
  const [items, setItems] = useState(propItems || []);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('');
  const [cartMessage, setCartMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { openAuthModal } = useAuth();

  // Get category from URL params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const category = searchParams.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        // Fetch products
        const data = await getProducts(searchQuery);
        
        // Only fetch wishlist if user is authenticated
        let wishlistData = [];
        if (token) {
          try {
            wishlistData = await getWishlist();
          } catch {
            // Silently handle wishlist fetch errors
            wishlistData = [];
          }
        }

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
          setItems(mapped);
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
      openAuthModal();
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
      openAuthModal();
      return;
    }
    try {
      await addToCart({ productId: product.id, quantity: 1 });
      setCartMessage(`"${product.name}" added to cart!`);
      setTimeout(() => setCartMessage(''), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      openAuthModal();
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

  // compute categories for filter
  const categories = Array.from(new Set(items.map(p => p.category).filter(Boolean)));

  // apply front-end filters and sorting
  let displayed = [...items];
  if (categoryFilter !== 'all') {
    displayed = displayed.filter(p => p.category === categoryFilter);
  }
  if (sortOrder === 'priceAsc') {
    displayed.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'priceDesc') {
    displayed.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'newest') {
    // assuming items have id order roughly state, else nothing
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our collection of quality products</p>
        {searchQuery && <p className="search-result">Showing results for "<strong>{searchQuery}</strong>"</p>}
      </div>

      <div className="products-filters">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      <div className="products-grid">
        {loading && <p>Loading products...</p>}
        {!loading && items.length === 0 && <p>No products found{searchQuery && ` matching "${searchQuery}"`}.</p>}
        {cartMessage && <div className="cart-message">{cartMessage}</div>}
        {displayed.map((product) => (
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



