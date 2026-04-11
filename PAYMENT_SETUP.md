# 🔐 ShopEasy Secure Payment System

## Payment Processing with Stripe

This application now includes a professional, secure payment system powered by **Stripe**, featuring:

✅ **SSL/TLS Encryption** - 256-bit encryption for all payments
✅ **PCI DSS Compliance** - Industry-standard security compliance
✅ **Fraud Protection** - Advanced fraud detection by Stripe
✅ **Secure Elements** - Stripe Elements for safe card handling
✅ **Webhook Integration** - Real-time payment event handling
✅ **Order Management** - Automatic order creation after payment

## Setup Instructions

### 1. **Get Stripe API Keys**

1. Visit [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create a free account
3. Go to **Developers** → **API Keys**
4. You'll see:
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)

### 2. **Backend Setup**

Update `.env` file in `backend/` folder:

```env
# Payment Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE  # Optional for webhooks
```

### 3. **Install Stripe Package**

```bash
cd backend
npm install stripe
npm install
npm run dev
```

### 4. **Frontend Setup**

The frontend automatically detects the publishable key from the backend API. No manual configuration needed!

### 5. **Database Migration (Optional)**

Add these columns to your `orders` table if not present:

```sql
ALTER TABLE orders ADD COLUMN payment_id VARCHAR(255) DEFAULT NULL;
ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'card';
```

## Features

### 💳 **Checkout Flow**

1. **Add Items to Cart** - Users add products to shopping cart
2. **View Cart** - Review items and total price
3. **Proceed to Checkout** - Click "Proceed to Checkout" button
4. **Payment Modal Opens** - Enter email, name, and postal code
5. **Secure Processing** - Stripe handles card processing
6. **Order Confirmation** - Order is created after successful payment

### 🔒 **Security Features**

- **No Card Storage** - Cards are never stored on ShopEasy servers
- **SSL Encryption** - All transactions use 256-bit SSL encryption
- **PCI Compliance** - Automatically compliant with payment industry standards
- **Fraud Detection** - Stripe's machine learning detects fraudulent activity
- **Secure Webhooks** - Payment events are verified and secure

### 📊 **API Endpoints**

#### Create Payment Intent
```
POST /api/payment/create-intent
Authorization: Bearer {token}
```
Response:
```json
{
  "clientSecret": "pi_1234567890_secret_abcdef",
  "amount": 12500,
  "cartTotal": 12500,
  "shippingCost": 0,
  "publishableKey": "pk_test_..."
}
```

#### Confirm Payment
```
POST /api/payment/confirm
Authorization: Bearer {token}
Body: { "paymentIntentId": "pi_1234567890" }
```
Response:
```json
{
  "success": true,
  "orderId": 123,
  "total": 125.00
}
```

#### Get Payment Status
```
GET /api/payment/status/:paymentIntentId
Authorization: Bearer {token}
```

### 🧪 **Testing Payment Cards**

Stripe provides test cards for development:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

Use any future expiration date and any CVC.

## Payment Flow Diagram

```
┌─────────────────────────────────────────────────┐
│ 1. User clicks "Proceed to Checkout"            │
└────────────────┬────────────────────────────────┘
                 ↓
        ┌────────────────────┐
        │ PaymentModal Opens  │
        └────────────┬───────┘
                     ↓
    ┌────────────────────────────────┐
    │ User enters payment details      │
    │ - Email                          │
    │ - Full name                      │
    │ - Postal code                    │
    └────────────┬─────────────────────┘
                 ↓
    ┌────────────────────────────────┐
    │ Backend: Create Payment Intent   │
    │ (Stripe API Call)               │
    └────────────┬─────────────────────┘
                 ↓
    ┌────────────────────────────────┐
    │ Frontend: User Confirms Payment  │
    │ (Stripe Elements)               │
    └────────────┬─────────────────────┘
                 ↓
    ┌────────────────────────────────┐
    │ Backend: Confirm Payment         │
    │ (Verify with Stripe)            │
    └────────────┬─────────────────────┘
                 ↓
    ┌────────────────────────────────┐
    │ Payment Succeeded ✓              │
    │ - Create Order                   │
    │ - Decrement Stock                │
    │ - Clear Cart                     │
    │ - Send Confirmation              │
    └────────────────────────────────┘
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | `sk_test_...` |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe public key | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | `whsec_...` |

## Troubleshooting

### "Failed to create payment intent"
- Check that `STRIPE_SECRET_KEY` is set correctly in `.env`
- Verify the key starts with `sk_test_` or `sk_live_`
- Restart the backend server after updating `.env`

### "Payment Intent not found"
- Ensure the payment intent ID is valid
- Check that the payment was created less than 24 hours ago
- Verify you're using the correct Stripe secret key

### "Cart is empty" error
- Ensure cart has items before checkout
- Items may have been removed by another session
- Try adding items again

### SSL Certificate Issues in Development
- Use `http://localhost:5173` for local development
- SSL is not required for `localhost` development
- Production deployment requires valid SSL certificate

## Production Deployment

When moving to production:

1. **Switch to Live Keys**
   - Replace test keys with live keys from Stripe Dashboard
   - Live keys start with `pk_live_` and `sk_live_`

2. **Enable HTTPS**
   - Deploy with valid SSL certificate
   - Update `FRONTEND_ORIGIN` for production domain

3. **Update Webhook**
   - Set up webhook endpoint in Stripe Dashboard
   - Point to your production server `/api/payment/webhook`

4. **Enable 3D Secure**
   - Optional but recommended for fraud prevention
   - Configure in Stripe Dashboard settings

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Testing**: https://stripe.com/docs/testing
- **Stripe Dashboard**: https://dashboard.stripe.com
- **PCI Compliance**: https://stripe.com/pci

## Security Best Practices

✅ **DO:**
- Store keys securely in `.env` file
- Never commit `.env` to version control
- Use webhooks to verify payments server-side
- Validate cart totals before charging
- Log payment events for debugging

❌ **DON'T:**
- Commit API keys to Git
- Hardcode keys in application code
- Store credit card information
- Trust client-side payment validation alone
- Process old payment intents

---

**Your application is now ready for secure payments! 🚀**
