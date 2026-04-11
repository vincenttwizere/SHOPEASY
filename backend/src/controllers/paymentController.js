const db = require('../config/db');
const { sendPaymentInstructions, sendOrderConfirmation } = require('../services/emailService');
const { sendPaymentSMS, sendOrderConfirmationSMS } = require('../services/smsService');

// Get Stripe instance lazily - only loads when first needed
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }
  return require('stripe')(process.env.STRIPE_SECRET_KEY);
}

/**
 * Create a payment intent for the user's cart
 * POST /api/payment/create-intent
 */
async function createPaymentIntent(req, res, next) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ 
        message: 'Payment service not configured. Please set STRIPE_SECRET_KEY in .env' 
      });
    }

    const userId = req.user.id;
    
    // Get cart items
    const [cartRows] = await db.query(
      `SELECT ci.id as itemId, p.id as productId, p.price, ci.quantity, p.quantity as stock
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartRows.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check stock and calculate total
    let total = 0;
    for (const item of cartRows) {
      if (item.quantity > item.stock) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${item.productId}` 
        });
      }
      total += Number(item.price) * item.quantity;
    }

    // Add shipping cost if needed
    const shippingCost = total > 50 ? 0 : 1000; // $10 shipping = 1000 cents
    const finalTotal = total * 100 + shippingCost; // Convert to cents for Stripe

    // Get user details for payment
    const [userRows] = await db.query(
      'SELECT email, name FROM users WHERE id = ?',
      [userId]
    );
    const user = userRows[0];

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalTotal),
      currency: 'usd',
      description: `ShopEasy Order for ${user.name || 'Customer'}`,
      metadata: {
        userId,
        itemCount: cartRows.length
      },
      receipt_email: user.email
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: finalTotal,
      cartTotal: total * 100,
      shippingCost,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    });
  } catch (err) {
    console.error('Payment Intent Creation Error:', err);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
}

/**
 * Confirm payment and create order
 * POST /api/payment/confirm
 */
async function confirmPayment(req, res, next) {
  const conn = await db.getConnection();
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ 
        message: 'Payment service not configured' 
      });
    }

    const userId = req.user.id;
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment intent ID required' });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ 
        message: 'Payment not completed. Status: ' + paymentIntent.status 
      });
    }

    // Payment succeeded, now create the order
    await conn.beginTransaction();

    // Get cart items
    const [cartRows] = await conn.query(
      `SELECT ci.id as itemId, p.id as productId, p.price, ci.quantity, p.quantity as stock
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE c.user_id = ?`,
      [userId]
    );

    if (!cartRows.length) {
      await conn.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    let total = 0;
    for (const item of cartRows) {
      if (item.quantity > item.stock) {
        await conn.rollback();
        return res.status(400).json({ 
          message: `Insufficient stock for product ${item.productId}` 
        });
      }
      total += Number(item.price) * item.quantity;
    }

    // Add shipping
    const shippingCost = total > 50 ? 0 : 10;
    const finalTotal = total + shippingCost;

    // Create order
    const [orderRes] = await conn.query(
      'INSERT INTO orders (user_id, total, payment_id, status) VALUES (?, ?, ?, ?)',
      [userId, finalTotal, paymentIntentId, 'paid']
    );
    const orderId = orderRes.insertId;

    // Add order items
    for (const item of cartRows) {
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
      // Update product stock
      await conn.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.productId]
      );
    }

    // Clear cart
    await conn.query(
      'DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?',
      [userId]
    );

    await conn.commit();

    res.json({
      success: true,
      orderId,
      total: finalTotal,
      message: 'Order placed successfully!'
    });
  } catch (err) {
    await conn.rollback();
    console.error('Payment Confirmation Error:', err);
    res.status(500).json({ message: 'Failed to confirm payment' });
  } finally {
    conn.release();
  }
}

/**
 * Get payment status
 * GET /api/payment/status/:paymentIntentId
 */
async function getPaymentStatus(req, res, next) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.status(503).json({ 
        message: 'Payment service not configured' 
      });
    }

    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      receiptEmail: paymentIntent.receipt_email
    });
  } catch (err) {
    console.error('Get Payment Status Error:', err);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
}

/**
 * Handle Stripe webhook for payment events
 * POST /api/payment/webhook
 */
async function handleWebhook(req, res, next) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return res.json({ received: true });
    }

    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      return res.json({ received: true });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        console.log('Payment succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('Payment failed:', event.data.object.id);
        break;
      case 'charge.refunded':
        console.log('Charge refunded:', event.data.object.id);
        break;
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
}

/**
 * Process Rwandan payment methods
 * POST /api/payment/rwandan
 * Supports: Bank Transfer, Phone Payment, Mobile Money
 */
async function processRwandanPayment(req, res, next) {
  const conn = await db.getConnection();
  try {
    const userId = req.user.id;
    const {
      method,
      email,
      fullName,
      bankName,
      accountNumber,
      phoneNumber,
      mobileMoneyCode,
      provider,
      total,
      cartTotal,
      shippingCost
    } = req.body;

    console.log('Rwandan Payment Request:', {
      userId,
      method,
      email,
      fullName,
      total
    });

    // Validate payment method
    if (!['bank', 'phone', 'mobilemoney'].includes(method)) {
      console.error('Invalid payment method:', method);
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Validate required fields
    if (!email || !fullName || !total) {
      console.error('Missing required fields:', { email, fullName, total });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate method-specific fields
    if (method === 'bank' && (!bankName || !accountNumber)) {
      console.error('Missing bank details');
      return res.status(400).json({ message: 'Bank details required' });
    }
    if (method === 'phone' && !phoneNumber) {
      console.error('Missing phone number');
      return res.status(400).json({ message: 'Phone number required' });
    }
    if (method === 'mobilemoney' && (!mobileMoneyCode || !provider)) {
      console.error('Missing mobile money details');
      return res.status(400).json({ message: 'Mobile money details required' });
    }

    // Begin transaction
    await conn.beginTransaction();

    try {
      // Get cart items
      const [cartRows] = await conn.query(
        `SELECT ci.id as itemId, p.id as productId, p.price, ci.quantity, p.quantity as stock
         FROM cart_items ci
         JOIN carts c ON ci.cart_id = c.id
         JOIN products p ON ci.product_id = p.id
         WHERE c.user_id = ?`,
        [userId]
      );

      if (!cartRows.length) {
        await conn.rollback();
        console.error('Cart is empty for user:', userId);
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Validate stock
      let calculatedTotal = 0;
      for (const item of cartRows) {
        if (item.quantity > item.stock) {
          await conn.rollback();
          console.error(`Insufficient stock for product ${item.productId}`);
          return res.status(400).json({
            message: `Insufficient stock for product ${item.productId}`
          });
        }
        calculatedTotal += Number(item.price) * item.quantity;
      }

      // Add shipping
      const shippingAmount = calculatedTotal > 50 ? 0 : 10;
      const finalTotal = calculatedTotal + shippingAmount;

      // Generate payment reference code
      const referenceCode = `RW${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      console.log('Creating order:', {
        userId,
        finalTotal,
        referenceCode,
        method
      });

      // Create order with payment method details
      const paymentDetails = {
        method,
        email,
        fullName,
        ...(method === 'bank' && { bankName, accountNumber }),
        ...(method === 'phone' && { phoneNumber }),
        ...(method === 'mobilemoney' && { provider, code: mobileMoneyCode })
      };

      const [orderRes] = await conn.query(
        'INSERT INTO orders (user_id, total, payment_id, status, payment_method, payment_reference, payment_details) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          userId,
          finalTotal,
          referenceCode,
          'pending_payment',
          method,
          referenceCode,
          JSON.stringify(paymentDetails)
        ]
      );
      const orderId = orderRes.insertId;

      console.log('Order created:', orderId);

      // Add order items
      for (const item of cartRows) {
        await conn.query(
          'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
          [orderId, item.productId, item.quantity, item.price]
        );

        // Update product stock
        await conn.query(
          'UPDATE products SET quantity = quantity - ? WHERE id = ?',
          [item.quantity, item.productId]
        );
      }

      // Clear cart
      await conn.query(
        'DELETE ci FROM cart_items ci JOIN carts c ON ci.cart_id = c.id WHERE c.user_id = ?',
        [userId]
      );

      // Commit transaction
      await conn.commit();

      console.log('Payment processed successfully:', {
        orderId,
        referenceCode,
        method
      });

      // Send notifications (after commit to ensure order is saved)
      // Prepare payment details for email
      const paymentDetailsForEmail = {
        bankName: method === 'bank' ? bankName : null,
        accountNumber: method === 'bank' ? accountNumber : null,
        phoneNumber: method === 'phone' ? phoneNumber : null,
        provider: method === 'mobilemoney' ? provider : null,
        code: method === 'mobilemoney' ? mobileMoneyCode : null
      };

      // Send email notification
      console.log('Sending email notification to:', email);
      const emailResult = await sendPaymentInstructions(
        email,
        fullName,
        method,
        referenceCode,
        finalTotal,
        paymentDetailsForEmail
      );

      // Send SMS notification (if phone number available)
      if (phoneNumber && method === 'phone') {
        console.log('Sending SMS notification to:', phoneNumber);
        const smsResult = await sendPaymentSMS(phoneNumber, method, referenceCode, finalTotal);
      } else if (method === 'mobilemoney') {
        console.log('Sending SMS notification to:', phoneNumber);
        const smsResult = await sendPaymentSMS(phoneNumber, method, referenceCode, finalTotal);
      }

      res.json({
        success: true,
        orderId,
        referenceCode,
        method,
        total: finalTotal,
        message: 'Order created. Payment instructions have been sent to your email.',
        instructions: getPaymentInstructions(method, referenceCode)
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (err) {
    console.error('Rwandan Payment Processing Error:', err);
    console.error('Error stack:', err.stack);
    res.status(500).json({ message: 'Failed to process payment', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  } finally {
    conn.release();
  }
}

/**
 * Get payment instructions based on method
 */
function getPaymentInstructions(method, referenceCode) {
  switch (method) {
    case 'bank':
      return {
        title: 'Bank Transfer Instructions',
        steps: [
          'Transfer the specified amount to our bank account',
          'Include the reference code in the transfer description',
          'Your order will be confirmed once payment is received',
          'We accept transfers from BPR, Equity Bank, Cogebanque, and other Rwandan banks'
        ]
      };
    case 'phone':
      return {
        title: 'Phone Payment',
        steps: [
          'You will receive a payment request on your phone',
          'Confirm the transaction to complete your payment',
          'Your order will be confirmed immediately after payment'
        ]
      };
    case 'mobilemoney':
      return {
        title: 'Mobile Money Payment',
        steps: [
          'Use your mobile money account to initiate payment',
          'Include the reference code in your payment note',
          'Payment should be received within minutes'
        ]
      };
    default:
      return {};
  }
}

module.exports = {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  handleWebhook,
  processRwandanPayment
};
