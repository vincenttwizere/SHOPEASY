import image1 from "../assets/head4ne.jpg";
import image2 from "../assets/Watch.jpg";
import image3 from "../assets/running shoe.jpg";
import image4 from "../assets/Backpack.jpg"

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 59.99,
    category: "Electronics",
    image: image1 ,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 89.99,
    category: "Electronics",
    image: image2,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 49.99,
    category: "Fashion",
    image: image3,
  },
  {
    id: 4,
    name: "Backpack",
    price: 39.99,
    category: "Accessories",
    image: image4,
  },
];


export default function Products() {
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


              <button className="details-btn">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}



