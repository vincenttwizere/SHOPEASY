import image1 from "../assets/head4ne.jpg";
import image2 from "../assets/Watch.jpg";
import image3 from "../assets/running shoe.jpg";
import image4 from "../assets/Backpack.jpg"

export const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59.99,
    category: "Electronics",
    image: image1,
    description: "High-quality wireless headphones with noise cancellation, long battery life, and premium sound quality. Perfect for daily use and travel.",
    features: [
      "Bluetooth connectivity",
      "Noise cancellation",
      "20-hour battery life",
      "Built-in microphone",
    ],
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 89.99,
    category: "Electronics",
    image: image2,
    description: "Advanced smartwatch with health tracking, notifications, and long battery life.",
    features: [
      "Heart rate monitor",
      "Sleep tracking",
      "Water resistant",
      "7-day battery life",
    ],
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 49.99,
    category: "Fashion",
    image: image3,
    description: "Comfortable running shoes with excellent grip and cushioning for all types of runners.",
    features: [
      "Lightweight design",
      "Extra cushioning",
      "Breathable material",
      "Anti-slip sole",
    ],
  },
  {
    id: 4,
    name: "Backpack",
    price: 39.99,
    category: "Accessories",
    image: image4,
    description: "Durable backpack with multiple compartments for everyday use and travel.",
    features: [
      "Spacious storage",
      "Laptop compartment",
      "Water resistant",
      "Ergonomic design",
    ],
  },
];


export default function Products({ onViewDetails }) {
  return (
    <div className="products-page">
     
      {/* Header */}
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Browse our collection of quality products</p>
      </div>


      {/* Filters */}
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


      {/* Product Grid */}
      <div className="products-grid">
        {products.map((product) => (
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



