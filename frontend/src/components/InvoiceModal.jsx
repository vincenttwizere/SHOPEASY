import { useState, useEffect } from 'react';
import { BASE_URL } from '../api';
import { X, FileText, User, Calendar, DollarSign } from 'lucide-react';
import './InvoiceModal.css';

export default function InvoiceModal({ isOpen, onClose, invoice }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && invoice) {
      fetchOrderDetails();
    }
  }, [isOpen, invoice]);

  const fetchOrderDetails = async () => {
    if (!invoice) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/orders/admin/${invoice.orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOrderDetails(data);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="invoice-header">
            <FileText size={24} />
            <div>
              <h2>{invoice.invoiceNumber}</h2>
              <p>Invoice Details</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="loading">Loading invoice details...</div>
          ) : orderDetails ? (
            <div className="invoice-details">
              {/* Invoice Header */}
              <div className="invoice-info">
                <div className="info-section">
                  <h3><User size={16} /> Customer Information</h3>
                  <p><strong>Name:</strong> {orderDetails.order.user_name}</p>
                  <p><strong>Email:</strong> {orderDetails.order.email}</p>
                </div>
                <div className="info-section">
                  <h3><Calendar size={16} /> Invoice Information</h3>
                  <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                  <p><strong>Order ID:</strong> #{orderDetails.order.id}</p>
                  <p><strong>Date:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> <span className={`status-badge ${invoice.status}`}>{invoice.status}</span></p>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-items">
                <h3>Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.unit_price).toFixed(2)}</td>
                        <td>${(item.quantity * Number(item.unit_price)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div className="invoice-total">
                <div className="total-row">
                  <span><DollarSign size={16} /> Total Amount:</span>
                  <span className="total-amount">${Number(orderDetails.order.total).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="error">Failed to load invoice details</div>
          )}
        </div>
      </div>
    </div>
  );
}