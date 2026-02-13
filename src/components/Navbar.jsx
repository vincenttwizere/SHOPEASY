import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";

const Navbar = ({ onSearch, user, onAccountClick, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <div className="logo">
        <h1 onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          SHOPEASY
        </h1>
        <p>Your one-stop <br /> shopping destination</p>
      </div>

      {/* Hamburger menu (mobile only) */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/categories">Categories</Link>
        {user && user.role === 'admin' && (
          <Link to="/admin">Admin</Link>
        )}
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* Desktop Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products..." />
          <button className="btn primary" onClick={() => onSearch && onSearch(query)}>Search</button>
        </div>

        <div className="search-actions">
          <button className="btn" onClick={() => navigate('/cart')}>Cart</button>
          {!user ? (
            <button className="btn" onClick={() => onAccountClick && onAccountClick()}>Account</button>
          ) : (
            <>
              <button className="btn">{user.name || 'Account'}</button>
              <button className="btn" onClick={() => onLogout && onLogout()}>Logout</button>
            </>
          )}
          <button className="btn" onClick={() => navigate('/wishlist')}>Wishlist</button>
        </div>
      </div>

      {/* Mobile Search Icon */}
      <div className="mobile-search-icon" onClick={() => setSearchOpen(!searchOpen)}>
        <Search size={24} color="#fff" />
      </div>

      {/* Mobile Search Bar */}
      {searchOpen && (
        <div className="mobile-search-bar active">
          <div className="search-box">
            <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products..." />
            <button className="btn primary" onClick={() => onSearch && onSearch(query)}>Search</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
