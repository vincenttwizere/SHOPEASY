import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProduct, addToCart, getWishlist, addToWishlist, removeFromWishlist } from '../api';
import { Heart, ShoppingCart, Zap, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Details = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openAuthModal } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);
  const [cartFeedback, setCartFeedback] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError('');
        const [p, wList] = await Promise.all([
          getProduct(id),
          getWishlist().catch(() => [])
        ]);

        if (!p) {
          setError('Product not found');
          return;
        }

        const mapped = {
          ...p,
          image: p.image_url || p.image,
          originalPrice: p.original_price,
          images: p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : p.images) : [],
          stock: p.quantity || 0
        };

        if (isMounted) {
          setProduct(mapped);
          setSelectedImage(mapped.image);
          setQuantity(1);

          if (Array.isArray(wList)) {
            setInWishlist(wList.some(item => item.product_id === parseInt(id)));
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Failed to load product details');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  const toggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) return openAuthModal();

    try {
      if (inWishlist) {
        await removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await addToWishlist(id);
        setInWishlist(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update wishlist");
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) return openAuthModal();
    try {
      await addToCart({ productId: id, quantity });
      setCartFeedback(`✓ Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart`);
      setTimeout(() => setCartFeedback(''), 3000);
      setQuantity(1);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) return openAuthModal();
    try {
      await addToCart({ productId: id, quantity });
      navigate('/cart');
    } catch (err) {
      console.error(err);
      alert("Failed to proceed");
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <div className="details-loading">
          <div className="spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-page">
        <div className="details-error">
          <h2>⚠️ {error}</h2>
          <button className="btn primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-page">
        <div className="details-error">
          <h2>Product not found</h2>
          <button className="btn primary" onClick={() => navigate('/products')}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const uniqueImages = [...new Set(images)];
  const stock = product.stock || 0;
  const isOutOfStock = stock <= 0;
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="details-page">
      <div className="details-back-button">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back
        </button>
      </div>

      <div className="details-container">
        <div className="details-wrapper">
          {/* Gallery */}
          <div className="details-gallery">
            <div className="main-image-wrapper">
              <img src={selectedImage || product.image} alt={product.name} className="main-image" />
              {isOutOfStock && <div className="out-of-stock-overlay">Out of Stock</div>}
            </div>
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
              {isOutOfStock ? '❌ Out of Stock' : '✓ In Stock'}
            </span>

            <h1 className="details-title">{product.name}</h1>
            {product.category && <p className="product-category">{product.category}</p>}

            <div className="details-price-block">
              {discount > 0 && (
                <span className="discount-badge">Save {discount}%</span>
              )}
              <div className="price-row">
                <span className="big-price">${Number(product.price).toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="original-price">${Number(product.originalPrice).toFixed(2)}</span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="details-description">{product.description}</p>
            )}

            {/* Wishlist Toggle */}
            <button
              className={`wishlist-toggle ${inWishlist ? 'active' : ''}`}
              onClick={toggleWishlist}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart size={20} fill={inWishlist ? "currentColor" : "none"} />
              {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
            </button>

            {/* Quantity & Stock */}
            {!isOutOfStock && (
              <div className="quantity-selector">
                <label>Quantity:</label>
                <div className="qty-controls">
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <input type="number" className="qty-input" value={quantity} readOnly />
                  <button 
                    className="qty-btn" 
                    onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <span className="stock-available">{stock} available</span>
              </div>
            )}

            {/* Feedback Message */}
            {cartFeedback && (
              <div className="cart-feedback-success">
                {cartFeedback}
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-buttons-lg">
              <button 
                className="btn-lg cart-btn-lg" 
                onClick={handleAddToCart} 
                disabled={isOutOfStock}
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button 
                className="btn-lg buy-btn-lg" 
                onClick={handleBuyNow} 
                disabled={isOutOfStock}
              >
                <Zap size={18} /> Order Now
              </button>
            </div>

            {/* Features/Specs */}
            {product.features && product.features.length > 0 && (
              <div className="features-section">
                <h3>Key Features</h3>
                <ul className="features-list">
                  {product.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
