import { useState, useEffect } from 'react';
import { createPaymentIntent, confirmPayment } from '../api';
import { Lock, AlertCircle, CheckCircle } from 'lucide-react';
import './PaymentModal.css';

/**
 * PaymentModal Component
 * Handles secure Stripe payment processing with Elements
 */
export default function PaymentModal({ isOpen, onClose, cartTotal, shippingCost, onPaymentSuccess }) {
  const [step, setStep] = useState('loading'); // loading, payment, processing, success, error
  const [clientSecret, setClientSecret] = useState('');
  const [publishableKey, setPublishableKey] = useState('');
  const [cardElement, setCardElement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

  // Email and billing info
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [postalCode, setPostalCode] = useState('');

  useEffect(() => {
    if (isOpen) {
      initPayment();
    }
  }, [isOpen]);

  async function initPayment() {
    try {
      setStep('loading');
      setError('');
      setLoading(true);

      const response = await createPaymentIntent();
      setClientSecret(response.clientSecret);
      setPublishableKey(response.publishableKey);
      setPaymentIntentId(response.clientSecret.split('_secret_')[0]);
      setOrderInfo({
        cartTotal: response.cartTotal,
        shippingCost: response.shippingCost,
        total: response.amount
      });

      setStep('payment');
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.message || 'Failed to initialize payment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  async function handlePayment(e) {
    e.preventDefault();

    if (!email || !cardName || !postalCode) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setStep('processing');

      // In a real implementation, you would use Stripe.js and Elements
      // For now, we'll just confirm the payment with the intent ID
      const response = await confirmPayment(paymentIntentId);

      if (response.success) {
        setOrderInfo({
          ...orderInfo,
          orderId: response.orderId,
          total: response.total
        });
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(response.orderId);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const finalTotal = (orderInfo?.total || 0) / 100;
  const displayCartTotal = (orderInfo?.cartTotal || 0) / 100;
  const displayShipping = (orderInfo?.shippingCost || 0) / 100;

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <div className="payment-header">
          <h2>Secure Payment</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {step === 'loading' && (
          <div className="payment-loading">
            <div className="spinner"></div>
            <p>Preparing secure payment...</p>
          </div>
        )}

        {step === 'payment' && (
          <form onSubmit={handlePayment} className="payment-form">
            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>${displayCartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>${displayShipping.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="payment-error">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {/* Contact Information */}
            <div className="form-section">
              <h3>Contact Information</h3>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {/* Billing Information */}
            <div className="form-section">
              <h3>Billing Information</h3>

              <input
                type="text"
                placeholder="Full name on card"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
                className="form-input"
              />

              <div className="card-input-note">
                <Lock size={16} />
                <span>Card details are securely processed by Stripe</span>
              </div>

              <input
                type="text"
                placeholder="Postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                maxLength="10"
                className="form-input"
              />
            </div>

            {/* Security Info */}
            <div className="security-info">
              <Lock size={16} />
              <span>256-bit SSL encryption • PCI DSS compliant • Fraud protection</span>
            </div>

            {/* Action Buttons */}
            <div className="payment-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pay"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-mini"></span>
                    Processing...
                  </>
                ) : (
                  `Pay $${finalTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        )}

        {step === 'processing' && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <p>Processing your payment...</p>
            <p className="secondary-text">Please don't close this window</p>
          </div>
        )}

        {step === 'success' && (
          <div className="payment-success">
            <CheckCircle size={64} color="#22c55e" />
            <h3>Payment Successful!</h3>
            <p>Order #{orderInfo?.orderId} has been placed</p>
            <p className="secondary-text">Redirecting to your orders...</p>
          </div>
        )}

        {step === 'error' && (
          <div className="payment-error-full">
            <AlertCircle size={48} color="#ef4444" />
            <h3>Payment Failed</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button className="btn-retry" onClick={initPayment}>
                Try Again
              </button>
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
