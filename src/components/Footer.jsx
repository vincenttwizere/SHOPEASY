import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left: Brand */}
        <div className="footer-brand">
          <h2>SHOPEASY</h2>
          <p>Building your online shopping experience.</p>
        </div>

        {/* Center: Quick Links */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/categories">Categories</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Right: Social / Contact */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><Facebook size={20} /></a>
            <a href="#"><Twitter size={20} /></a>
            <a href="#"><Instagram size={20} /></a>
            <a href="#"><Linkedin size={20} /></a>
          </div>
          <p className="footer-contact">contact@shopeasy.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} shoteasy. All rights reserved.j
      </div>
    </footer>
  );
};

export default Footer;
