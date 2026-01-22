import image5 from "../assets/Electronics.jpg";
import image6 from "../assets/Fashion.jpg"
import image7 from "../assets/Accessories.jpg"
import image8 from "../assets/Home and living.jpg"

const categories = [
  {
    id: 1,
    name: "Electronics",
    description: "Phones, laptops, gadgets and accessories",
    image: image5,
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, shoes and trending outfits",
    image: image6,
  },
  {
    id: 3,
    name: "Accessories",
    description: "Bags, watches, and lifestyle accessories",
    image: image7,
  },
  {
    id: 4,
    name: "Home & Living",
    description: "Furniture, kitchen and home essentials",
    image: image8,
  },
];

export default function Categories() {
  return (
    <div className="categories-page">

      {/* Header */}
      <div className="categories-header">
        <h1>Shop by Category</h1>
        <p>Explore products based on your interests</p>
      </div>

      {/* Categories Grid */}
      <div className="categories-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <img src={category.image} alt={category.name} />

            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <button className="category-btn">
                View Products
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
