# ShopEasy Notification System Setup Guide

## Overview

The notification system sends email and SMS instructions to customers after they place an order with the Rwandan payment methods (Bank Transfer, Phone Payment, Mobile Money).

## Email Notifications

### Setup Instructions

1. **Gmail Configuration** (Recommended for Development)

   - Enable 2FA on your Gmail account: https://myaccount.google.com/security
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Update `.env`:
     ```
     MAIL_SERVICE=gmail
     MAIL_FROM=your_email@gmail.com
     MAIL_PASSWORD=your_app_password
     ```

2. **Alternative Email Services**

   You can also use:
   - SendGrid
   - Mailgun
   - AWS SES
   - Custom SMTP server

   Examples:
   ```
   # SendGrid
   MAIL_SERVICE=sendgrid
   MAIL_FROM=noreply@yourdomain.com
   MAIL_PASSWORD=SG.xxxxxxxxxxxx

   # Custom SMTP
   MAIL_SERVICE=custom
   MAIL_HOST=smtp.yourdomain.com
   MAIL_PORT=587
   MAIL_USER=your_email@yourdomain.com
   MAIL_PASSWORD=your_password
   ```

### Email Templates

The system sends different emails based on payment method:

- **Bank Transfer**: Account details, reference code, bank list
- **Phone Payment**: Confirmation steps, phone number verification
- **Mobile Money**: Provider instructions, transaction reference

All emails include company branding (orange logo, professional layout).

## SMS Notifications (Optional but Recommended)

### Setup Instructions

1. **Install Twilio** (recommended SMS provider in Africa)
   ```bash
   npm install twilio
   ```

2. **Get Twilio Credentials**
   - Sign up: https://www.twilio.com
   - Get Account SID, Auth Token, and phone number
   - Update `.env`:
     ```
     TWILIO_ACCOUNT_SID=AC...
     TWILIO_AUTH_TOKEN=...
     TWILIO_PHONE_NUMBER=+250...
     ```

3. **Alternative SMS Providers**
   - Africa's Talking (popular in Africa): https://africastalking.com
   - Local telecom APIs (MTN, Airtel Rwanda)

### Supported Payment Methods for SMS

- **Phone Payment**: SMS notification sent to customer's phone
- **Mobile Money**: SMS with transaction reference and steps
- **Bank Transfer**: Email only (bank account details aren't safe in SMS)

## Testing Email Notifications

### Manual Test

1. Place an order with a test email address
2. Check the email inbox for payment instructions
3. Verify message contains:
   - Correct order reference
   - Correct amount in RWF
   - Method-specific instructions

### Terminal Test

```bash
# Start backend
npm start

# In another terminal, test the email service
node -e "
const emailService = require('./src/services/emailService');
(async () => {
  await emailService.sendPaymentInstructions(
    'test@example.com',
    'Test User',
    'bank',
    'RW1234567890ABC',
    100000,
    {
      bankName: 'BPR',
      accountNumber: '1234567890'
    }
  );
})();
"
```

## Troubleshooting

### Email Not Sending

1. Check backend logs:
   ```
   ✗ Error sending email: ...
   ```

2. For Gmail:
   - Verify App Password is correct
   - Check 2FA is enabled
   - Verify email address in MAIL_FROM

3. For other providers:
   - Verify API key is correct
   - Check SMTP credentials
   - Verify from address matches provider settings

### SMS Not Sending

1. Check if SMS is available:
   ```
   // In backend logs
   ✗ SMS not sent - Twilio not configured
   ```

2. Verify Twilio credentials:
   - Account SID correct
   - Auth Token correct
   - Phone number in E.164 format (+250...)

3. Check phone number format:
   - Rwandan: 07XXXXXXXX → +25607XXXXXXXX
   - Must be valid phone number

## Notification Flow

```
Order Created
    ↓
Email Service
    ├─ Generate HTML template (based on payment method)
    ├─ Send via SMTP (nodemailer)
    └─ Log result
    ↓
SMS Service (if configured)
    ├─ Prepare message
    ├─ Send via Twilio
    └─ Log result
    ↓
Response to Client
    └─ Order created successfully
```

## Payment Method Details Sent

### Bank Transfer
- Bank name
- Account number
- Reference code
- Expected transfer amount

### Phone Payment
- Phone number confirmed
- Amount to pay
- Expected confirmation steps

### Mobile Money
- Provider (MTN/Airtel)
- Reference code
- Transaction steps
- Expected processing time

## Environment Variables Summary

```bash
# Email (Required)
MAIL_SERVICE=gmail                    # Service provider
MAIL_FROM=shopeasy.rw@gmail.com      # From email address
MAIL_PASSWORD=                        # App password or API key

# SMS (Optional)
TWILIO_ACCOUNT_SID=                  # Twilio account SID
TWILIO_AUTH_TOKEN=                   # Twilio auth token
TWILIO_PHONE_NUMBER=                 # Twilio phone number (+250...)
```

## Files Modified

1. `backend/src/controllers/paymentController.js`
   - Added email and SMS notification calls
   - Imports emailService and smsService

2. `backend/src/services/emailService.js` (NEW)
   - Nodemailer email transporter
   - Email templates for each payment method
   - sendPaymentInstructions() function
   - sendOrderConfirmation() function

3. `backend/src/services/smsService.js` (NEW)
   - Twilio SMS client initialization
   - sendPaymentSMS() function
   - sendOrderConfirmationSMS() function
   - Phone number normalization

4. `backend/.env`
   - Added email configuration variables
   - Added SMS configuration variables

## Next Steps

1. Configure MAIL_PASSWORD in `.env` with real credentials
2. Test email notifications by placing an order
3. (Optional) Configure Twilio for SMS notifications
4. Monitor logs for successful/failed notifications
5. Customize email templates if needed (in emailService.js)

## Support

For issues:
- Check backend logs in terminal
- Verify .env variables are set correctly
- Test email/SMS services independently
- Check email provider's bounce/spam folder
