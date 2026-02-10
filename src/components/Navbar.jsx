import { useState } from "react";
import { Search, Menu, X } from "lucide-react";

const Navbar = ({ onNavigate, onSearch, user, onAccountClick, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <div className="navbar">
      <div className="logo">
        <h1 onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>
          SHOPEASY
        </h1>
        <p>Your one-stop <br /> shopping destination</p>
      </div>

      {/* Hamburger menu (mobile only) */}
      <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </div>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a onClick={() => onNavigate("home")} style={{ cursor: "pointer" }}>Home</a>
        <a onClick={() => onNavigate("products")} style={{ cursor: "pointer" }}>Products</a>
        <a onClick={() => onNavigate("categories")} style={{ cursor: "pointer" }}>Categories</a>
        {user && user.role === 'admin' && (
          <a onClick={() => onNavigate("admin")} style={{ cursor: "pointer" }}>Admin</a>
        )}
        <a onClick={() => onNavigate("about")} style={{ cursor: "pointer" }}>About Us</a>
        <a onClick={() => onNavigate("contact")} style={{ cursor: "pointer" }}>Contact</a>
      </div>

      {/* Desktop Search Bar */}
      <div className="search-bar">
        <div className="search-box">
          <input value={query} onChange={(e) => setQuery(e.target.value)} type="text" placeholder="Search products..." />
          <button className="btn primary" onClick={() => onSearch && onSearch(query)}>Search</button>
        </div>

        <div className="search-actions">
          <button className="btn" onClick={() => onNavigate && onNavigate('cart')}>Cart</button>
          {!user ? (
            <button className="btn" onClick={() => onAccountClick && onAccountClick()}>Account</button>
          ) : (
            <>
              <button className="btn">{user.name || 'Account'}</button>
              <button className="btn" onClick={() => onLogout && onLogout()}>Logout</button>
            </>
          )}
          <button className="btn">Wishlist</button>
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
