import image1 from "../assets/Headphone.jpg"
const product = {
  id: 1,
  name: "Wireless Headphones",
  price: 59.99,
  category: "Electronics",
  description:
    "High-quality wireless headphones with noise cancellation, long battery life, and premium sound quality. Perfect for daily use and travel.",
  image: image1,
  features: [
    "Bluetooth connectivity",
    "Noise cancellation",
    "20-hour battery life",
    "Built-in microphone",
  ],
};

const Details = () => {
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
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {/* Actions */}
          <div className="details-actions">
            <button className="add-cart-btn">Add to Cart</button>
            <button className="buy-btn">Buy Now</button>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Details;
