import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../api";
import image5 from "../assets/Electronics.jpg";
import image6 from "../assets/Fashion.jpg";
import image7 from "../assets/Accessories.jpg";
import image8 from "../assets/Home and living.jpg";

const fallbackCategories = [
  {
    id: 1,
    name: "Electronics",
    description: "Phones, laptops, gadgets and accessories",
    image_url: image5,
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing, shoes and trending outfits",
    image_url: image6,
  },
  {
    id: 3,
    name: "Accessories",
    description: "Bags, watches, and lifestyle accessories",
    image_url: image7,
  },
  {
    id: 4,
    name: "Home & Living",
    description: "Furniture, kitchen and home essentials",
    image_url: image8,
  },
];

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setLoading(true);
      try {
        const data = await getCategories();
        if (active) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
        if (active) setCategories(fallbackCategories);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleViewProducts = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h1>Shop by Category</h1>
        <p>Explore products based on your interests</p>
      </div>

      {loading && <p>Loading categories...</p>}

      <div className="categories-grid">
        {categories.map((category) => (
          <div className="category-card" key={category.id}>
            <img src={category.image_url} alt={category.name} />

            <div className="category-info">
              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <button
                className="category-btn"
                onClick={() => handleViewProducts(category.name)}
              >
                View Products
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
