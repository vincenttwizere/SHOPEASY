import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getProduct, addToCart, getWishlist, addToWishlist, removeFromWishlist } from '../api';
import { Heart, ShoppingCart, Zap, Minus, Plus } from 'lucide-react';

const Details = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    // If we have partial data, set image
    if (product && !selectedImage) {
      setSelectedImage(product.image);
    }

    const fetchData = async () => {
      try {
        const [p, wList] = await Promise.all([
          getProduct(id),
          getWishlist().catch(() => [])
        ]);

        // Map fields if necessary (backend returns exact fields usually)
        // Backend returns: id, name, description, price, original_price, quantity, image_url, images
        const mapped = {
          ...p,
          image: p.image_url || p.image,
          originalPrice: p.original_price,
          images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [],
          stock: p.quantity // Backend uses quantity for stock
        };

        setProduct(mapped);
        setSelectedImage(mapped.image);

        if (Array.isArray(wList)) {
          setInWishlist(wList.some(item => item.product_id === parseInt(id)));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login");

    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await addToWishlist(id);
        setInWishlist(true);
      }
    } catch (err) {
      alert("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login");
    try {
      await addToCart({ productId: id, quantity });
      alert("Added to cart");
    } catch (err) {
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login");
    try {
      await addToCart({ productId: id, quantity });
      navigate('/cart');
    } catch (err) {
      alert("Failed to proceed");
    }
  };

  if (loading) return <div className="details-page"><p>Loading...</p></div>;
  if (!product) return <div className="details-page"><p>Product not found</p></div>;

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(images)]; // Deduplicate
  const stock = product.stock || 0;
  const isOutOfStock = stock <= 0;

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="details-page">
      <div className="details-container">
        <div className="details-wrapper">
          {/* Gallery */}
          <div className="details-gallery">
            <img src={selectedImage || product.image} alt={product.name} className="main-image" />
            {uniqueImages.length > 1 && (
              <div className="thumbnail-list">
                {uniqueImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                    alt="thumbnail"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="details-info-section">
            <span className={`stock-status ${isOutOfStock ? 'out' : ''}`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>

            <h1 className="details-title">{product.name}</h1>
            <p className="description">{product.category}</p>

            <div className="details-price-block">
              {discount > 0 && <span className="discount-badge" style={{ position: 'static', marginBottom: 8, display: 'inline-block' }}>-{discount}%</span>}
              <div className="price-row" style={{ marginBottom: 0 }}>
                <span className="big-price">${Number(product.price).toFixed(2)}</span>
                {product.originalPrice && <span className="original-price" style={{ fontSize: 20 }}>${Number(product.originalPrice).toFixed(2)}</span>}
              </div>
            </div>

            <p className="details-description">{product.description}</p>

            {/* Wishlist Toggle */}
            <button
              className="btn"
              style={{ background: 'transparent', color: inWishlist ? '#ef4444' : '#64748b', display: 'flex', alignItems: 'center', gap: 8, padding: 0, marginBottom: 20 }}
              onClick={toggleWishlist}
            >
              <Heart fill={inWishlist ? "currentColor" : "none"} />
              {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            {!isOutOfStock && (
              <div className="quantity-selector">
                <span>Quantity:</span>
                <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <input type="text" className="qty-input" value={quantity} readOnly />
                <button className="qty-btn" onClick={() => setQuantity(q => Math.min(stock, q + 1))}><Plus size={16} /></button>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{stock} available</span>
              </div>
            )}

            <div className="action-buttons-lg">
              <button className="btn-lg cart-btn-lg" onClick={handleAddToCart} disabled={isOutOfStock}>
                Add to Cart
              </button>
              <button className="btn-lg buy-btn-lg" onClick={handleBuyNow} disabled={isOutOfStock}>
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
