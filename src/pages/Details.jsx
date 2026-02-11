const Details = ({ product, onNavigate, onAddToCart, onBuyNow, onWishlistToggle, isInWishlist }) => {
  if (!product) {
    return (
      <div className="details-page">
        <div className="details-container">
          <p>Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="details-page">

      <div className="details-container">

        {/* Image */}
        <div className="details-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Info */}
        <div className="details-info">
          <h1>{product.name}</h1>
          <span className="category">{product.category}</span>

          <p className="price">${product.price}</p>

          <p className="description">{product.description}</p>

          {/* Features */}
          <ul className="features">
            {(product.features || []).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {/* Actions */}
          <div className="details-actions">
            <button className="add-cart-btn" onClick={() => onAddToCart && onAddToCart(product, 1)}>Add to Cart</button>
            <button className="buy-btn" onClick={() => onBuyNow && onBuyNow(product, 1)}>Buy Now</button>
            <button className={`wishlist-btn ${isInWishlist && isInWishlist(product.id) ? 'active' : ''}`} onClick={() => onWishlistToggle && onWishlistToggle(product.id)}>
              {isInWishlist && isInWishlist(product.id) ? '❤️ Wishlist' : '🤍 Wishlist'}
            </button>
          </div>

          {/* Back to Products */}
          {onNavigate && (
            <div className="details-footer">
              <button 
                className="back-btn"
                onClick={() => onNavigate('products')}
              >
                ← View More Products
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default Details;
