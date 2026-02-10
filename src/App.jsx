import { useEffect, useState } from 'react';
import Navbar from "./components/Navbar"
import Discover from "./components/Discover"
import Card from "./components/Card"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import Details from "./pages/Details"
import Contact from "./pages/Contact"
import Footer from "./components/Footer"
import About from "./pages/About Us"
import AuthModal from './components/AuthModal'
import Cart from './pages/Cart'
import { addToCart as apiAddToCart, placeOrder } from './api'
import AdminProducts from './pages/AdminProducts'

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // try to initialize user from token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) { /* ignore */ }
    }
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setCurrentPage('details');
  };
  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedProduct(null);
  };

  const handleOpenAuth = () => setAuthOpen(true);
  const handleCloseAuth = () => setAuthOpen(false);
  const handleLogin = (u) => { setUser(u); };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  async function handleAddToCart(product, quantity = 1) {
    if (!user) return setAuthOpen(true);
    try {
      await apiAddToCart({ productId: product.id, quantity });
      alert('Added to cart');
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  }

  async function handleBuyNow(product, quantity = 1) {
    if (!user) return setAuthOpen(true);
    try {
      await apiAddToCart({ productId: product.id, quantity });
      // redirect to cart for checkout
      setCurrentPage('cart');
    } catch (err) {
      alert(err.message || 'Failed to process buy now');
    }
  }

  async function handlePlaceOrder() {
    if (!user) return setAuthOpen(true);
    try {
      const res = await placeOrder();
      alert(`Order ${res.orderId} placed — total $${res.total}`);
      setCurrentPage('home');
    } catch (err) { alert(err.message || 'Checkout failed'); }
  }

  const handleSearch = (q) => {
    setSearchQuery(q || '');
    setCurrentPage('products');
  };

  return (
    <div>
      <Navbar onNavigate={handleNavigate} onAccountClick={handleOpenAuth} onSearch={handleSearch} user={user} onLogout={handleLogout} />
      
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
        <Products onViewDetails={handleViewDetails} searchQuery={searchQuery} />
      )}

      {/* Details Page */}
      {currentPage === 'details' && selectedProduct && (
        <Details product={selectedProduct} onNavigate={handleNavigate} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
      )}

      {currentPage === 'admin' && user && user.role === 'admin' && (
        <AdminProducts />
      )}

      {/* Cart Page */}
      {currentPage === 'cart' && (
        <Cart onPlaceOrder={handlePlaceOrder} />
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
      
        <Contact />
     

      <Footer onNavigate={handleNavigate} />

      {authOpen && <AuthModal onClose={handleCloseAuth} onLogin={(u) => { handleLogin(u); handleCloseAuth(); }} />}
    </div>
  )
}

export default App;