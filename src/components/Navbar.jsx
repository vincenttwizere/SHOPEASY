
const Navbar = ({ onNavigate }) => {

    return (
        <div className="navbar">
            <div className = 'logo'>
                <h1 onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>SHOPEASY</h1>
                <p>Your one-stop <br /> shopping destination</p>
            </div>

            <div className="nav-links">
                <a onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>Home</a>
                <a onClick={() => onNavigate('products')} style={{ cursor: 'pointer' }}>Products</a>
                <a onClick={() => onNavigate('categories')} style={{ cursor: 'pointer' }}>Categories</a>
                <a onClick={() => onNavigate('about')} style={{ cursor: 'pointer' }}>About Us</a>
                <a onClick={() => onNavigate('contact')} style={{ cursor: 'pointer' }}>Contact</a>
            </div>
          <div className="search-bar">
            <div className="search-box">
                <input
                type="text"
                placeholder="Search products..."
                aria-label="Search products"
                />
                <button className="btn primary">Search</button>
            </div>

            <div className="search-actions">
                <button className="btn">Account</button>
                <button className="btn">Wishlist</button>
            </div>
        </div>

        </div>
    );
}

export default Navbar;