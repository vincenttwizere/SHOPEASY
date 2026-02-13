import { Book, Video, Mail, FileText, HelpCircle } from 'lucide-react';

export default function AdminHelp() {
    const faqs = [
        {
            question: "How do I add a new product?",
            answer: "Navigate to Products page, click 'Add New Product' button, fill in the details including name, price, description, and upload an image. Click 'Create Product' to save."
        },
        {
            question: "How do I manage orders?",
            answer: "Go to the Orders page to view all customer orders. You can update order status by selecting from the dropdown (Pending, Shipped, Delivered, Cancelled)."
        },
        {
            question: "How do I create discount codes?",
            answer: "Visit the Discounts page, click 'Create Discount', enter the code, select type (percentage or fixed), set value and expiration date."
        },
        {
            question: "How do I view sales analytics?",
            answer: "The Dashboard shows overview stats and charts. For detailed analytics, visit the Analytics page for in-depth reports and trends."
        },
        {
            question: "How do I update store settings?",
            answer: "Go to Settings page to configure store information, email settings, payment gateways, and other preferences."
        }
    ];

    const documentation = [
        { title: "Getting Started Guide", icon: Book, description: "Learn the basics of managing your store" },
        { title: "Product Management", icon: FileText, description: "How to add, edit, and organize products" },
        { title: "Order Processing", icon: FileText, description: "Managing orders from start to delivery" },
        { title: "Customer Support", icon: Mail, description: "Handling customer inquiries and messages" }
    ];

    return (
        <div className="admin-help">
            <h1>Help & Documentation</h1>

            {/* Quick Links */}
            <div className="help-section">
                <h2>Documentation</h2>
                <div className="docs-grid">
                    {documentation.map((doc, idx) => (
                        <div key={idx} className="doc-card">
                            <doc.icon size={32} className="doc-icon" />
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>
                            <button className="btn-link">Read More →</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="help-section">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    {faqs.map((faq, idx) => (
                        <details key={idx} className="faq-item">
                            <summary>{faq.question}</summary>
                            <p>{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="help-section">
                <h2>Need More Help?</h2>
                <div className="contact-support">
                    <Mail size={48} />
                    <h3>Contact Support</h3>
                    <p>Can't find what you're looking for? Our support team is here to help.</p>
                    <button className="btn-primary">Send Support Request</button>
                </div>
            </div>

            {/* Video Tutorials */}
            <div className="help-section">
                <h2>Video Tutorials</h2>
                <div className="video-grid">
                    <div className="video-card">
                        <div className="video-thumbnail">
                            <Video size={48} />
                        </div>
                        <h4>Dashboard Overview</h4>
                        <p>5:30</p>
                    </div>
                    <div className="video-card">
                        <div className="video-thumbnail">
                            <Video size={48} />
                        </div>
                        <h4>Managing Products</h4>
                        <p>8:15</p>
                    </div>
                    <div className="video-card">
                        <div className="video-thumbnail">
                            <Video size={48} />
                        </div>
                        <h4>Processing Orders</h4>
                        <p>6:45</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
