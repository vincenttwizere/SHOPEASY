/**
 * SMS Service for ShopEasy
 * Sends SMS notifications to customers
 * Supports Twilio and Africa's Talking
 */

// Initialize SMS provider (Twilio)
let twilioClient = null;

try {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    const twilio = require('twilio');
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (err) {
  console.warn('Twilio not configured - SMS functionality disabled');
}

/**
 * Send SMS with payment instructions
 * @param {string} phoneNumber - Rwandan phone number (07XXXXXXXX or +25607XXXXXXXX)
 * @param {string} paymentMethod - Payment method (bank, phone, mobilemoney)
 * @param {string} referenceCode - Unique payment reference
 * @param {number} amount - Amount in RWF
 */
async function sendPaymentSMS(phoneNumber, paymentMethod, referenceCode, amount) {
  try {
    // Normalize phone number
    let normalizedPhone = phoneNumber;
    if (normalizedPhone.startsWith('07')) {
      normalizedPhone = '+250' + normalizedPhone;
    } else if (!normalizedPhone.startsWith('+250')) {
      normalizedPhone = '+250' + normalizedPhone.replace(/^\+/, '');
    }

    let message = '';

    if (paymentMethod === 'bank') {
      message = `ShopEasy Payment: Please transfer RWF ${Number(amount).toLocaleString('en-RW')} to our bank account. Reference: ${referenceCode}. Check your email for bank details.`;
    } else if (paymentMethod === 'phone') {
      message = `ShopEasy Payment: A payment request for RWF ${Number(amount).toLocaleString('en-RW')} has been sent to your phone. Reference: ${referenceCode}. Confirm on your device.`;
    } else if (paymentMethod === 'mobilemoney') {
      message = `ShopEasy Payment: Send RWF ${Number(amount).toLocaleString('en-RW')} using Mobile Money. Reference: ${referenceCode}. Check email for provider details.`;
    }

    if (!twilioClient) {
      console.warn('⚠️  SMS not sent - Twilio not configured. To enable SMS:');
      console.warn('   1. Sign up at https://www.twilio.com');
      console.warn('   2. Add to .env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER');
      console.warn(`   3. Run: npm install twilio`);
      return { success: false, error: 'SMS service not configured' };
    }

    console.log(`📱 Sending SMS to: ${normalizedPhone}`);
    console.log(`   Method: ${paymentMethod}`);
    console.log(`   Reference: ${referenceCode}`);

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalizedPhone
    });

    console.log(`✓ SMS successfully sent to ${normalizedPhone}`);
    return { success: true };
  } catch (err) {
    console.error('❌ Error sending SMS:', err.message);
    console.error('   Error details:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Send order confirmation SMS
 */
async function sendOrderConfirmationSMS(phoneNumber, orderId, total) {
  try {
    let normalizedPhone = phoneNumber;
    if (normalizedPhone.startsWith('07')) {
      normalizedPhone = '+250' + normalizedPhone;
    }

    const message = `ShopEasy: Order confirmed! Order ID: #${orderId}. Total: RWF ${Number(total).toLocaleString('en-RW')}. Check your email for details & payment instructions.`;

    if (!twilioClient) {
      console.warn('✗ SMS not sent - Twilio not configured');
      return { success: false, error: 'SMS service not configured' };
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalizedPhone
    });

    console.log(`✓ Confirmation SMS sent to ${normalizedPhone}`);
    return { success: true };
  } catch (err) {
    console.error('Error sending confirmation SMS:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Send generic SMS (for custom messages)
 */
async function sendSMS(phoneNumber, message) {
  try {
    let normalizedPhone = phoneNumber;
    if (normalizedPhone.startsWith('07')) {
      normalizedPhone = '+250' + normalizedPhone;
    }

    if (!twilioClient) {
      console.warn('✗ SMS not sent - Twilio not configured');
      return { success: false, error: 'SMS service not configured' };
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: normalizedPhone
    });

    console.log(`✓ SMS sent`);
    return { success: true };
  } catch (err) {
    console.error('Error sending SMS:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Check if SMS service is available
 */
function isSMSAvailable() {
  return !!twilioClient;
}

module.exports = {
  sendPaymentSMS,
  sendOrderConfirmationSMS,
  sendSMS,
  isSMSAvailable
};
