
import { useNavigate } from 'react-router-dom';

const Discover = () => {
  const navigate = useNavigate();

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleViewMore = () => {
    navigate('/categories');
  };

  return (
    <div className="discover">
      <h2>Discover Amazing Products</h2>
      <p>Shop the collection of premium products with exclusive deals and discounts.</p>

      <span className="discover-buttons">
        <button className="btn" onClick={handleShopNow}>Shop Now</button>
        <button className="btn2" onClick={handleViewMore}>View More</button>
      </span>
    </div>
  );
};

export default Discover;