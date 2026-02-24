import { Heart, ShoppingCart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductsCard = ({
    id,
    name,
    price,
    originalPrice,
    category,
    image,
    inWishlist,
    onToggleWishlist,
    onAddToCart,
    onBuyNow
}) => {
    const navigate = useNavigate();
    const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const handleCardClick = () => {
        // Navigate to details page
        navigate(`/details/${id}`, { state: { product: { id, name, price, originalPrice, category, image } } });
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="product-image-container">
                <img src={image} alt={name} />
                {discount > 0 && <span className="discount-badge">-{discount}%</span>}
                <button
                    className={`wishlist-btn-card ${inWishlist ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onToggleWishlist(id); }}
                    title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <Heart size={20} fill={inWishlist ? "currentColor" : "none"} strokeWidth={inWishlist ? 0 : 2} />
                </button>
            </div>

            <div className="product-info-card">
                <span className="category-tag">{category}</span>
                <h3 className="product-title" title={name}>{name}</h3>

                <div className="price-row">
                    <span className="current-price">${Number(price).toFixed(2)}</span>
                    {originalPrice && Number(originalPrice) > Number(price) && (
                        <span className="original-price">${Number(originalPrice).toFixed(2)}</span>
                    )}
                </div>

                <div className="card-actions">
                    <button
                        className="action-btn cart-btn"
                        onClick={(e) => { e.stopPropagation(); onAddToCart({ id, name, price, image }); }}
                        title="Add to Cart"
                    >
                        <ShoppingCart size={18} />
                    </button>
                    <button
                        className="action-btn buy-btn"
                        onClick={(e) => { e.stopPropagation(); onBuyNow({ id, name, price, image }); }}
                        title="Buy Now"
                    >
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductsCard;