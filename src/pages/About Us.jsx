
const About = () => {
  return (
    <div className="about-page">

      {/* Header */}
      <div className="about-header">
        <h1>About Us</h1>
        <p>Your trusted online shopping destination</p>
      </div>

      {/* Content */}
      <div className="about-content">

        <section className="about-section">
          <h2>Who We Are</h2>
          <p>
            We are a modern e-commerce platform dedicated to providing
            high-quality products at affordable prices. Our mission is to make
            online shopping easy, reliable, and accessible for everyone.
          </p>
        </section>

        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            To connect customers with quality products while delivering a smooth
            and secure shopping experience. We focus on trust, transparency, and
            customer satisfaction.
          </p>
        </section>

        <section className="about-section">
          <h2>Why Choose Us</h2>
          <ul>
            <li>Wide range of quality products</li>
            <li>Secure and fast payments</li>
            <li>Reliable delivery services</li>
            <li>Customer-first support</li>
          </ul>
        </section>

      </div>

    </div>
  );
};

export default About;
