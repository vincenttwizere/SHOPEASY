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
import AdminMessages from './pages/admin/AdminMessages'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminInvoice from './pages/admin/AdminInvoice'
import AdminDiscounts from './pages/admin/AdminDiscounts'
import AdminSettings from './pages/admin/AdminSettings'
import AdminSecurity from './pages/admin/AdminSecurity'
import AdminHelp from './pages/admin/AdminHelp'
import { AuthProvider, useAuth } from './context/AuthContext'

function HomePage() {
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

      <Products />
      <Categories />
    </div>
  );
}

function AppContent() {
  const { user, authModalOpen, login, logout, closeAuthModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewDetails = (product) => {
    navigate(`/details/${product.id}`);
  };

  const handleLogin = (u) => {
    login(u);
    // Role-based redirect
    if (u.role === 'admin') {
      navigate('/admin');
    } else {
      // Redirect to previous page or home
      let from = '/';
      if (location.state?.from) {
        if (typeof location.state.from === 'string') from = location.state.from;
        else if (location.state.from.pathname) from = location.state.from.pathname + (location.state.from.search || '');
      }
      navigate(from);
    }
  };

  const handleSearch = (q) => {
    if (q) {
      navigate(`/products?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/products');
    }
  };

  // Get search query from URL params
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  return (
    <div>
      {/* Show Navbar and Footer only for non-admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <Navbar onSearch={handleSearch} onAccountClick={() => {}} user={user} onLogout={logout} />
      )}

      <Routes>
        <Route path="/" element={<HomePage onViewDetails={handleViewDetails} />} />
        <Route path="/products" element={<Products onViewDetails={handleViewDetails} searchQuery={searchQuery} />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/cart" element={
          <RequireAuth>
            <Cart />
          </RequireAuth>
        } />
        <Route path="/wishlist" element={
          <RequireAuth>
            <Wishlist onViewDetails={handleViewDetails} />
          </RequireAuth>
        } />
        <Route path="/categories" element={<Categories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <RequireAdmin>
            <AdminLayout onLogout={logout} user={user} />
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

      {authModalOpen && <AuthModal onClose={closeAuthModal} onLogin={handleLogin} />}
    </div>
  )
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;