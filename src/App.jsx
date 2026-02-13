import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import Wishlist from './pages/Wishlist'
import AdminLayout from './components/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'
import { RequireAuth, RequireAdmin } from './components/ProtectedRoute'
import { addToCart as apiAddToCart, placeOrder, addToWishlist, removeFromWishlist, isInWishlist } from './api'
import AdminMessages from './pages/admin/AdminMessages'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminInvoice from './pages/admin/AdminInvoice'
import AdminDiscounts from './pages/admin/AdminDiscounts'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSecurity from './pages/admin/AdminSecurity'
import AdminHelp from './pages/admin/AdminHelp'

const parseJwt = (token) => {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

function HomePage({ onViewDetails }) {
  return (
    <div>
      <p className="passage">Free shipping on orders over $50 | Same-day delivery available</p>
      <Discover />
      <p className="passage2">Why Choose Us</p>

      <div className="cards-flex">
        <Card title="Free Shipping" description="Free delivery on orders over $50. Fast and reliable shipping nationwide." icon="shipping" />
        <Card title="Easy Returns" description="30-day return policy. No questions asked for easy hassle-free returns." icon="returns" />
        <Card title="Secure Payment" description="Secure payment processing with SSL encryption and fraud protection." icon="payment" />
        <Card title="Quality Guaranteed" description="All products are quality checked and come with manufacturer warranty." icon="quality" />
      </div>

      <p className="passage2">Shop by Category</p>

      <div className="cards-flex">
        <Card title="Electronics" description="Smart Phone, Laptop, and Accessories." icon="Electronics" />
        <Card title="Fashion" description="Clothing, shoes, and accessories for all seasons." icon="Fashion" />
        <Card title="Home & Kitchen" description="Everything you need to make your home comfortable." icon="Home & Kitchen" />
        <Card title="Beauty & Health" description="Skincare, makeup, and health products for everyone." icon="Beauty & Health" />
      </div>

      <Products onViewDetails={onViewDetails} />
      <Categories />
    </div>
  );
}

const App = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initialize user from token
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setUser(payload);
    }
  }, []);

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    navigate('/details');
  };

  const handleOpenAuth = () => setAuthOpen(true);
  const handleCloseAuth = () => setAuthOpen(false);

  const handleLogin = (u) => {
    setUser(u);
    // Role-based redirect
    if (u.role === 'admin') {
      navigate('/admin');
    } else {
      // Redirect to previous page or home
      const from = location.state?.from || '/';
      navigate(from);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
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
      navigate('/cart');
    } catch (err) {
      alert(err.message || 'Failed to process buy now');
    }
  }

  const handleWishlistToggle = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  async function handlePlaceOrder() {
    if (!user) return setAuthOpen(true);
    try {
      const res = await placeOrder();
      alert(`Order ${res.orderId} placed — total $${res.total}`);
      navigate('/');
    } catch (err) {
      alert(err.message || 'Checkout failed');
    }
  }

  const handleSearch = (q) => {
    setSearchQuery(q || '');
    navigate('/products');
  };

  return (
    <div>
      {/* Show Navbar and Footer only for non-admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <Navbar onSearch={handleSearch} onAccountClick={handleOpenAuth} user={user} onLogout={handleLogout} />
      )}

      <Routes>
        <Route path="/" element={<HomePage onViewDetails={handleViewDetails} />} />
        <Route path="/products" element={<Products onViewDetails={handleViewDetails} searchQuery={searchQuery} />} />
        <Route path="/details" element={
          selectedProduct ? (
            <Details
              product={selectedProduct}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              onWishlistToggle={handleWishlistToggle}
              isInWishlist={isInWishlist}
            />
          ) : <div>Product not found</div>
        } />
        <Route path="/cart" element={
          <RequireAuth>
            <Cart onPlaceOrder={handlePlaceOrder} />
          </RequireAuth>
        } />
        <Route path="/wishlist" element={<Wishlist onViewDetails={handleViewDetails} />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminLayout onLogout={handleLogout} user={user} />
          </RequireAdmin>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="invoice" element={<AdminInvoice />} />
          <Route path="discounts" element={<AdminDiscounts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="security" element={<AdminSecurity />} />
          <Route path="help" element={<AdminHelp />} />
        </Route>
      </Routes>

      {!location.pathname.startsWith('/admin') && <Footer />}

      {authOpen && <AuthModal onClose={handleCloseAuth} onLogin={(u) => { handleLogin(u); handleCloseAuth(); }} />}
    </div>
  )
}

export default App;