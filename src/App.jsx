import { useState } from 'react';
import Navbar from "./components/Navbar"
import Discover from "./components/Discover"
import Card from "./components/Card"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import Details from "./pages/Details"
import Contact from "./pages/Contact"
import Footer from "./components/Footer"
import About from "./pages/About Us"

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setCurrentPage('details');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedProduct(null);
  };

  return (
    <div>
      <Navbar onNavigate={handleNavigate} />
      
      {/* Home Page */}
      {currentPage === 'home' && (
        <div>
          <p className="passage">Free shipping on orders over $50 | Same-day delivery available</p>
          <Discover />
          <p className="passage2">Why Choose Us</p>

          <div className="cards-flex">
            <Card title="Free Shipping" description="Free delivery on orders over $50. Fast and reliable shipping nationwide." icon="shipping"/>
            <Card title="Easy Returns" description="30-day return policy. No questions asked for easy hassle-free returns." icon="returns"/>
            <Card title="Secure Payment" description="Secure payment processing with SSL encryption and fraud protection." icon="payment"/>
            <Card title="Quality Guaranteed" description="All products are quality checked and come with manufacturer warranty." icon="quality"/>
          </div>

          <p className="passage2">Shop by Category</p>

          <div className="cards-flex">
            <Card title="Electronics" description="Smart Phone, Laptop, and Accessories." icon="Electronics"/>
            <Card title="Fashion" description="Clothing, shoes, and accessories for all seasons." icon="Fashion"/>
            <Card title="Home & Kitchen" description="Everything you need to make your home comfortable." icon="Home & Kitchen"/>
            <Card title="Beauty & Health" description="Skincare, makeup, and health products for everyone." icon="Beauty & Health"/>
          </div>

          <Products onViewDetails={handleViewDetails} />
          <Categories />
        </div>
      )}

      {/* Products Page */}
      {currentPage === 'products' && (
        <Products onViewDetails={handleViewDetails} />
      )}

      {/* Details Page */}
      {currentPage === 'details' && selectedProduct && (
        <Details product={selectedProduct} onNavigate={handleNavigate} />
      )}

      {/* Categories Page */}
      {currentPage === 'categories' && (
        <Categories />
      )}

      {/* About Page */}
      {currentPage === 'about' && (
        <About />
      )}

      {/* Contact Page */}
      {currentPage === 'contact' && (
        <Contact />
      )}

      <Footer onNavigate={handleNavigate} />
    </div>
  )
}

export default App;