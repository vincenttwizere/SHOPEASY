import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ShoppingCart, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ onSearch, user, onAccountClick, onLogout }) => {
  const { openAuthModal } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Extract initials from user name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAccountClick = () => {
    if (user) {
      onAccountClick && onAccountClick();
    } else {
      openAuthModal();
    }
  };

  const handleWishlistClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      navigate('/wishlist');
    }
  };

  const handleCartClick = () => {
    if (!user) {
      openAuthModal();
    } else {
      navigate('/cart');
    }
  };

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
          <button className="btn primary" onClick={() => onSearch && onSearch(query)}> <Search size={18} /> </button>
        </div>

        <div className="search-actions">
          {!user ? (
            <button className="btn" onClick={handleAccountClick} title="Login / Register">
              <User size={20} style={{ marginRight: 6 }} /> Account
            </button>
          ) : (
            <div className="user-account-wrapper" ref={userDropdownRef}>
              <button 
                className="user-avatar-btn" 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                title={user.name}
              >
                <div className="user-avatar">
                  {getInitials(user.name)}
                </div>
              </button>
              
              {userDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-dropdown-header">
                    <span className="user-name">{user.name}</span>
                    <span className="user-email">{user.email}</span>
                  </div>
                  <div className="user-dropdown-divider"></div>
                  {user.role === 'admin' && (
                    <>
                      <button 
                        className="user-dropdown-item"
                        onClick={() => {
                          navigate('/admin');
                          setUserDropdownOpen(false);
                        }}
                      >
                        Admin Dashboard
                      </button>
                      <div className="user-dropdown-divider"></div>
                    </>
                  )}
                  <button 
                    className="user-dropdown-item logout-item"
                    onClick={() => {
                      onLogout && onLogout();
                      setUserDropdownOpen(false);
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="btn icon-only" onClick={handleWishlistClick} title="Wishlist">
            <Heart size={20} />
          </button>

          <button className="btn icon-only" onClick={handleCartClick} title="Cart">
            <ShoppingCart size={20} />
          </button>
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
