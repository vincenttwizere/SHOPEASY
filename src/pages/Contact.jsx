

const Contact = () => {
  return (
    <div className="contact-page">

      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We’d love to hear from you</p>
      </div>

      <div className="contact-container">

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Email: support@shoponline.com</p>
          <p>Phone: +250 700 000 000</p>
          <p>Address: Kigali, Rwanda</p>
        </div>

        {/* Contact Form */}
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>

      </div>

    </div>
  );
};

export default Contact;
