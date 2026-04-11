import { useState, useEffect } from 'react';
import { processRwandanPayment } from '../api';
import { Shield, AlertTriangle, Check, CreditCard, Smartphone, Coins } from 'lucide-react';
import './RwandanPaymentModal.css';

/**
 * RwandanPaymentModal Component
 * Handles Rwandan-specific payment methods:
 * 1. Bank Transfer
 * 2. Phone Number (Mobile Payment)
 * 3. Mobile Money Code (MTN Mobile Money, Airtel Money)
 */
export default function RwandanPaymentModal({ isOpen, onClose, cartTotal, shippingCost, onPaymentSuccess }) {
  const [step, setStep] = useState('loading'); // loading, method, payment, processing, success, error
  const [paymentMethod, setPaymentMethod] = useState(''); // 'bank', 'phone', 'mobilemoney'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderInfo, setOrderInfo] = useState(null);

  // Common fields
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');

  // Bank fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  // Phone/Mobile Money fields
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mobileMoneyCode, setMobileMoneyCode] = useState(''); // For mobile money method
  const [provider, setProvider] = useState('mtn'); // 'mtn', 'airtel'

  useEffect(() => {
    if (isOpen) {
      initializePayment();
    }
  }, [isOpen]);

  async function initializePayment() {
    try {
      setStep('loading');
      setError('');
      
      // Calculate totals
      const cartTotalCents = Math.round(parseFloat(cartTotal) * 100);
      const shippingCents = Math.round(parseFloat(shippingCost) * 100);
      const totalCents = cartTotalCents + shippingCents;

      setOrderInfo({
        cartTotal: cartTotalCents,
        shippingCost: shippingCents,
        total: totalCents
      });

      setStep('method');
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.message || 'Failed to initialize payment');
      setStep('error');
    }
  }

  async function handlePayment(e) {
    e.preventDefault();

    if (!email || !fullName) {
      setError('Please fill in all required fields');
      return;
    }

    if (paymentMethod === 'bank') {
      if (!bankName || !accountNumber) {
        setError('Please fill in bank details');
        return;
      }
    } else if (paymentMethod === 'phone') {
      if (!phoneNumber) {
        setError('Please enter your phone number');
        return;
      }
      // Validate Rwandan phone format (07XXXXXXXX or +25607XXXXXXXX)
      const phoneRegex = /^(?:\+250|0)7[\d]{8}$/;
      if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
        setError('Invalid Rwandan phone number. Use format: +250788888888 or 0788888888');
        return;
      }
    } else if (paymentMethod === 'mobilemoney') {
      if (!mobileMoneyCode || !provider) {
        setError('Please select provider and enter code');
        return;
      }
    }

    try {
      setLoading(true);
      setError('');
      setStep('processing');

      const paymentData = {
        method: paymentMethod,
        email,
        fullName,
        total: orderInfo.total,
        cartTotal: orderInfo.cartTotal,
        shippingCost: orderInfo.shippingCost,
      };

      if (paymentMethod === 'bank') {
        paymentData.bankName = bankName;
        paymentData.accountNumber = accountNumber;
      } else if (paymentMethod === 'phone') {
        paymentData.phoneNumber = phoneNumber.replace(/\s/g, '');
      } else if (paymentMethod === 'mobilemoney') {
        paymentData.mobileMoneyCode = mobileMoneyCode;
        paymentData.provider = provider;
      }

      const response = await processRwandanPayment(paymentData);

      if (response.success) {
        setOrderInfo({
          ...orderInfo,
          orderId: response.orderId,
          referenceCode: response.referenceCode
        });
        setStep('success');
        setTimeout(() => {
          onPaymentSuccess(response.orderId);
          onClose();
        }, 3000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment processing failed. Please try again.');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  function handleMethodSelect(method) {
    setPaymentMethod(method);
    setError('');
    setStep('payment');
  }

  if (!isOpen) return null;

  const finalTotal = (orderInfo?.total || 0) / 100;
  const displayCartTotal = (orderInfo?.cartTotal || 0) / 100;
  const displayShipping = (orderInfo?.shippingCost || 0) / 100;

  return (
    <div className="rwandan-payment-overlay">
      <div className="rwandan-payment-modal">
        {/* Header */}
        <div className="rwandan-payment-header">
          <h2>Payment - ShopEasy Rwanda</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Loading */}
        {step === 'loading' && (
          <div className="payment-loading">
            <div className="spinner"></div>
            <p>Preparing your payment...</p>
          </div>
        )}

        {/* Method Selection */}
        {step === 'method' && (
          <div className="payment-methods">
            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>RWF {displayCartTotal.toFixed(0)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>RWF {displayShipping.toFixed(0)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>RWF {finalTotal.toFixed(0)}</span>
              </div>
            </div>

            <h3 className="methods-title">Choose Payment Method</h3>

            {/* Bank Transfer */}
            <button
              type="button"
              className="method-card"
              onClick={() => handleMethodSelect('bank')}
            >
              <div className="method-icon bank">
                <CreditCard size={32} />
              </div>
              <div className="method-info">
                <h4>Bank Transfer</h4>
                <p>Transfer directly to our bank account</p>
              </div>
              <div className="method-arrow">→</div>
            </button>

            {/* Phone Payment */}
            <button
              type="button"
              className="method-card"
              onClick={() => handleMethodSelect('phone')}
            >
              <div className="method-icon phone">
                <Smartphone size={32} />
              </div>
              <div className="method-info">
                <h4>Mobile Payment</h4>
                <p>Pay via your phone number</p>
              </div>
              <div className="method-arrow">→</div>
            </button>

            {/* Mobile Money Code */}
            <button
              type="button"
              className="method-card"
              onClick={() => handleMethodSelect('mobilemoney')}
            >
              <div className="method-icon mobilemoney">
                <Coins size={32} />
              </div>
              <div className="method-info">
                <h4>Mobile Money</h4>
                <p>MTN Mobile Money or Airtel Money</p>
              </div>
              <div className="method-arrow">→</div>
            </button>
          </div>
        )}

        {/* Payment Form */}
        {step === 'payment' && (
          <form onSubmit={handlePayment} className="rwandan-payment-form">
            {/* Order Summary */}
            <div className="order-summary-section">
              <h3>Order Summary</h3>
              <div className="summary-item">
                <span>Subtotal:</span>
                <span>RWF {displayCartTotal.toFixed(0)}</span>
              </div>
              <div className="summary-item">
                <span>Shipping:</span>
                <span>RWF {displayShipping.toFixed(0)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-item total">
                <span>Total:</span>
                <span>RWF {finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="payment-error">
                <AlertTriangle size={20} />
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
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            {/* Bank Transfer Form */}
            {paymentMethod === 'bank' && (
              <div className="form-section">
                <h3>Bank Details</h3>
                <div className="form-group">
                  <label>Bank Name</label>
                  <input
                    type="text"
                    placeholder="e.g., BPR, Equity Bank, Cogebanque"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    placeholder="Enter your bank account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="bank-info-note">
                  After submission, you'll receive our bank details via email to complete the transfer.
                </div>
              </div>
            )}

            {/* Phone Payment Form */}
            {paymentMethod === 'phone' && (
              <div className="form-section">
                <h3>Phone Number</h3>
                <div className="form-group">
                  <label>Your Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+250 788 888 888"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="phone-info-note">
                  We'll send a payment request to your phone number.
                </div>
              </div>
            )}

            {/* Mobile Money Form */}
            {paymentMethod === 'mobilemoney' && (
              <div className="form-section">
                <h3>Mobile Money Payment</h3>
                <div className="form-group">
                  <label>Provider</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="form-input"
                  >
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Mobile Money Code</label>
                  <input
                    type="text"
                    placeholder="Enter your mobile money code/reference"
                    value={mobileMoneyCode}
                    onChange={(e) => setMobileMoneyCode(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <div className="mobilemoney-info-note">
                  Enter your {provider === 'mtn' ? 'MTN' : 'Airtel'} Mobile Money account reference or phone number.
                </div>
              </div>
            )}

            {/* Security Info */}
            <div className="security-info">
              <Shield size={16} />
              <span>Your payment information is encrypted and secure</span>
            </div>

            {/* Action Buttons */}
            <div className="payment-actions">
              <button
                type="button"
                className="btn-back"
                onClick={() => setStep('method')}
                disabled={loading}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Processing...' : `Pay RWF ${finalTotal.toFixed(0)}`}
              </button>
            </div>
          </form>
        )}

        {/* Processing */}
        {step === 'processing' && (
          <div className="payment-processing">
            <div className="spinner"></div>
            <p>Processing your payment...</p>
            <p className="processing-subtitle">Please do not close this window</p>
          </div>
        )}

        {/* Success */}
        {step === 'success' && (
          <div className="payment-success">
            <div className="success-icon">
              <Check size={64} />
            </div>
            <h3>Payment Successful!</h3>
            <p>Your order has been confirmed.</p>
            {orderInfo?.orderId && (
              <div className="order-details">
                <p><strong>Order ID:</strong> {orderInfo.orderId}</p>
                {orderInfo?.referenceCode && (
                  <p><strong>Reference Code:</strong> {orderInfo.referenceCode}</p>
                )}
              </div>
            )}
            <p className="success-subtitle">You'll be redirected shortly...</p>
          </div>
        )}

        {/* Error */}
        {step === 'error' && (
          <div className="payment-error-state">
            <AlertTriangle size={64} />
            <h3>Payment Failed</h3>
            <p>{error}</p>
            <div className="error-actions">
              <button
                type="button"
                className="btn-try-again"
                onClick={() => setStep('method')}
              >
                Try Another Method
              </button>
              <button
                type="button"
                className="btn-close-error"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
