const nodemailer = require('nodemailer');

/**
 * Email Service for ShopEasy
 * Sends email notifications to customers
 */

let transporter;

// Initialize email transporter
async function initializeTransporter() {
  // In production, use Gmail or SendGrid credentials
  if (process.env.MAIL_PASSWORD && process.env.NODE_ENV === 'production') {
    transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.MAIL_FROM,
        pass: process.env.MAIL_PASSWORD
      }
    });
    console.log('✓ Email service: Production mode (Gmail)');
  } else {
    // In development, use Ethereal Email (free test service)
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('✓ Email service: Development mode (Ethereal Email - Test Service)');
      console.log(`   📧 Test email account: ${testAccount.user}`);
      console.log('   💡 Tip: Preview sent emails in your browser after each test');
    } catch (err) {
      console.error('❌ Failed to initialize email service:', err.message);
      transporter = null;
    }
  }
}

// Initialize on module load
initializeTransporter();

/**
 * Send payment instructions email
 * @param {string} email - Customer's email
 * @param {string} customerName - Customer's name
 * @param {string} paymentMethod - Payment method (bank, phone, mobilemoney)
 * @param {string} referenceCode - Unique payment reference
 * @param {number} amount - Amount to pay in RWF
 * @param {object} paymentDetails - Payment method specific details
 */
async function sendPaymentInstructions(email, customerName, paymentMethod, referenceCode, amount, paymentDetails) {
  try {
    if (!transporter) {
      console.error('❌ Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    let subject = '';
    let htmlContent = '';

    if (paymentMethod === 'bank') {
      subject = 'Payment Instructions - Bank Transfer (ShopEasy Order)';
      htmlContent = generateBankTransferEmail(customerName, referenceCode, amount, paymentDetails);
    } else if (paymentMethod === 'phone') {
      subject = 'Payment Instructions - Mobile Payment (ShopEasy Order)';
      htmlContent = generatePhonePaymentEmail(customerName, referenceCode, amount, paymentDetails);
    } else if (paymentMethod === 'mobilemoney') {
      subject = 'Payment Instructions - Mobile Money (ShopEasy Order)';
      htmlContent = generateMobileMoneyEmail(customerName, referenceCode, amount, paymentDetails);
    }

    const mailOptions = {
      from: process.env.MAIL_FROM || 'ShopEasy <noreply@shopeasy.rw>',
      to: email,
      subject,
      html: htmlContent
    };

    console.log(`\n📧 Sending payment instructions email...`);
    console.log(`   To: ${email}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Payment Method: ${paymentMethod}`);
    console.log(`   Reference Code: ${referenceCode}`);
    console.log(`   Amount: RWF ${Number(amount).toLocaleString('en-RW')}`);

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✓ Email sent successfully!`);
    console.log(`   Message ID: ${info.messageId}`);
    
    // If using test service, show preview URL
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`   📩 Preview email: ${previewUrl}`);
    }
    
    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.error('❌ Error sending email:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Bank transfer payment instructions email template
 */
function generateBankTransferEmail(name, referenceCode, amount, details) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: linear-gradient(135deg, rgb(255, 102, 0) 0%, rgb(230, 92, 0) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; }
          .amount-box { background: #f9f9f9; padding: 20px; border-left: 4px solid rgb(255, 102, 0); margin: 20px 0; border-radius: 4px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .reference { font-family: monospace; font-size: 14px; font-weight: bold; color: rgb(255, 102, 0); }
          .important { color: rgb(255, 102, 0); font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ShopEasy Payment Instructions</h1>
          </div>
          
          <div class="content">
            <p>Hello <span class="important">${name}</span>,</p>
            
            <p>Thank you for your purchase! To complete your order, please make a bank transfer using the details below.</p>
            
            <div class="amount-box">
              <h3 style="margin-top: 0;">Amount to Transfer</h3>
              <p style="font-size: 28px; margin: 10px 0; color: rgb(255, 102, 0);">RWF ${Number(amount).toLocaleString('en-RW')}</p>
              <p style="margin: 0;"><strong>Reference Code:</strong> <span class="reference">${referenceCode}</span></p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;"><em>Important: Include this reference code in the transfer description</em></p>
            </div>
            
            <h3 style="color: rgb(255, 102, 0);">Bank Details</h3>
            <table>
              <tr>
                <td style="font-weight: bold; width: 150px;">Bank Name</td>
                <td>${details.bankName || 'ShopEasy Bank Account'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Account Number</td>
                <td>${details.accountNumber || 'Account Details'}</td>
              </tr>
              <tr>
                <td style="font-weight: bold;">Reference</td>
                <td><span class="reference">${referenceCode}</span></td>
              </tr>
            </table>
            
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>Your order will be confirmed once we receive payment</li>
              <li>Please keep the reference code for your records</li>
              <li>Transfer may take 1-2 hours to process</li>
              <li>Contact us if you have any questions</li>
            </ul>
            
            <p>We accept transfers from all Rwandan banks including BPR, Equity Bank, Cogebanque, and others.</p>
            
            <p>Thank you for shopping with ShopEasy!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 ShopEasy. All rights reserved.</p>
            <p>For support, contact: support@shopeasy.rw</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Phone payment instructions email template
 */
function generatePhonePaymentEmail(name, referenceCode, amount, details) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: linear-gradient(135deg, rgb(255, 102, 0) 0%, rgb(230, 92, 0) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; }
          .amount-box { background: #f9f9f9; padding: 20px; border-left: 4px solid rgb(255, 102, 0); margin: 20px 0; border-radius: 4px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .reference { font-family: monospace; font-size: 14px; font-weight: bold; color: rgb(255, 102, 0); }
          .important { color: rgb(255, 102, 0); font-weight: bold; }
          .steps { background: #fff9f5; padding: 20px; border-radius: 4px; margin: 20px 0; }
          .step { margin: 15px 0; }
          .step-number { background: rgb(255, 102, 0); color: white; width: 30px; height: 30px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin-right: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ShopEasy Payment - Mobile Payment</h1>
          </div>
          
          <div class="content">
            <p>Hello <span class="important">${name}</span>,</p>
            
            <p>A payment request has been sent to your phone number: <span class="important">${details.phoneNumber || 'your phone'}</span></p>
            
            <div class="amount-box">
              <h3 style="margin-top: 0;">Amount to Pay</h3>
              <p style="font-size: 28px; margin: 10px 0; color: rgb(255, 102, 0);">RWF ${Number(amount).toLocaleString('en-RW')}</p>
              <p style="margin: 0;"><strong>Reference Code:</strong> <span class="reference">${referenceCode}</span></p>
            </div>
            
            <div class="steps">
              <h3 style="color: rgb(255, 102, 0); margin-top: 0;">How to Complete Payment:</h3>
              <div class="step">
                <span class="step-number">1</span>
                <p style="display: inline; vertical-align: middle;">Wait for the payment prompt on your phone</p>
              </div>
              <div class="step">
                <span class="step-number">2</span>
                <p style="display: inline; vertical-align: middle;">Confirm the transaction amount</p>
              </div>
              <div class="step">
                <span class="step-number">3</span>
                <p style="display: inline; vertical-align: middle;">Enter your PIN to authorize</p>
              </div>
              <div class="step">
                <span class="step-number">4</span>
                <p style="display: inline; vertical-align: middle;">Receipt will be sent automatically</p>
              </div>
            </div>
            
            <p><strong>Note:</strong> If you didn't receive a payment prompt, please check that your phone number is correct above or contact our support team.</p>
            
            <p>Thank you for shopping with ShopEasy!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 ShopEasy. All rights reserved.</p>
            <p>For support, contact: support@shopeasy.rw</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Mobile money payment instructions email template
 */
function generateMobileMoneyEmail(name, referenceCode, amount, details) {
  const provider = details.provider === 'mtn' ? 'MTN Mobile Money' : 'Airtel Money';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: linear-gradient(135deg, rgb(255, 102, 0) 0%, rgb(230, 92, 0) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
          .content { padding: 20px; }
          .amount-box { background: #f9f9f9; padding: 20px; border-left: 4px solid rgb(255, 102, 0); margin: 20px 0; border-radius: 4px; }
          .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
          .reference { font-family: monospace; font-size: 14px; font-weight: bold; color: rgb(255, 102, 0); }
          .important { color: rgb(255, 102, 0); font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          td { padding: 10px; border-bottom: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ShopEasy Payment - ${provider}</h1>
          </div>
          
          <div class="content">
            <p>Hello <span class="important">${name}</span>,</p>
            
            <p>Please use your ${provider} account to complete this payment.</p>
            
            <div class="amount-box">
              <h3 style="margin-top: 0;">Payment Details</h3>
              <p style="font-size: 28px; margin: 10px 0; color: rgb(255, 102, 0);">RWF ${Number(amount).toLocaleString('en-RW')}</p>
              <table>
                <tr>
                  <td style="font-weight: bold; width: 150px;">Provider</td>
                  <td>${provider}</td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Reference Code</td>
                  <td><span class="reference">${referenceCode}</span></td>
                </tr>
                <tr>
                  <td style="font-weight: bold;">Code/Account</td>
                  <td><span class="reference">${details.code || 'See reference above'}</span></td>
                </tr>
              </table>
            </div>
            
            <h3 style="color: rgb(255, 102, 0);">Payment Instructions:</h3>
            <ol>
              <li>Open ${provider} on your device</li>
              <li>Select "Send Money" or "Pay Bill"</li>
              <li>Enter the reference code: <span class="reference">${referenceCode}</span></li>
              <li>Enter amount: <span class="important">RWF ${Number(amount).toLocaleString('en-RW')}</span></li>
              <li>Enter your PIN to authorize</li>
              <li>Confirm the transaction</li>
            </ol>
            
            <p><strong>Important:</strong> Your order will be confirmed once payment is received.</p>
            
            <p>Thank you for shopping with ShopEasy!</p>
          </div>
          
          <div class="footer">
            <p>&copy; 2026 ShopEasy. All rights reserved.</p>
            <p>For support, contact: support@shopeasy.rw</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send order confirmation email
 */
async function sendOrderConfirmation(email, customerName, orderId, orderItems, total) {
  try {
    if (!transporter) {
      console.error('❌ Email service not initialized');
      return { success: false, error: 'Email service not available' };
    }

    const itemsHTML = orderItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">RWF ${Number(item.unit_price).toLocaleString('en-RW')}</td>
        <td style="text-align: right;">RWF ${(Number(item.unit_price) * item.quantity).toLocaleString('en-RW')}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { background: linear-gradient(135deg, rgb(255, 102, 0) 0%, rgb(230, 92, 0) 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { padding: 20px; }
            .footer { background: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid rgb(255, 102, 0); }
            td { padding: 10px; border-bottom: 1px solid #eee; }
            .total-row { font-weight: bold; background: #fff9f5; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmed - ShopEasy</h1>
            </div>
            
            <div class="content">
              <p>Hello ${customerName},</p>
              <p>Your order has been confirmed! Here are your order details:</p>
              
              <p><strong>Order ID:</strong> #${orderId}</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHTML}
                  <tr class="total-row">
                    <td colspan="3">Total</td>
                    <td>RWF ${Number(total).toLocaleString('en-RW')}</td>
                  </tr>
                </tbody>
              </table>
              
              <p>Thank you for your purchase! We'll send you tracking information once your order ships.</p>
              <p>For support, contact: support@shopeasy.rw</p>
            </div>
            
            <div class="footer">
              <p>&copy; 2026 ShopEasy. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`\n📧 Sending order confirmation email...`);
    console.log(`   To: ${email}`);
    console.log(`   Order ID: #${orderId}`);
    console.log(`   Total: RWF ${Number(total).toLocaleString('en-RW')}`);

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || 'ShopEasy <noreply@shopeasy.rw>',
      to: email,
      subject: `Order Confirmed - ShopEasy Order #${orderId}`,
      html: htmlContent
    });

    console.log(`✓ Order confirmation email sent!`);
    console.log(`   Message ID: ${info.messageId}`);
    
    if (process.env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`   📩 Preview email: ${previewUrl}`);
    }

    return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
  } catch (err) {
    console.error('❌ Error sending order confirmation:', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = {
  sendPaymentInstructions,
  sendOrderConfirmation
};
