
const Navbar = () => {

    return (
        <div className="navbar">
            <div className = 'logo'>
                <h1>SHOPEASY</h1>
                <p>Your one-stop <br /> shopping destination</p>
            </div>

            <div className="nav-links">
                <a href= "/">Home</a>
                <a href= "/products">Products</a>
                <a href = "/categories">Categories</a>
                <a href = "/details">Details</a>
                <a href="/about">About Us</a>
                <a href="/contact">Contact</a>
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