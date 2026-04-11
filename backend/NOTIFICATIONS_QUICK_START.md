# ShopEasy Payment Notifications - Quick Start

## 📧 Email Notifications Now Working! 

Your payment system now automatically sends payment instructions via email after customers place orders.

### Current Status
- ✅ Backend notification services implemented
- ✅ Email templates for all 3 payment methods
- ✅ Integration with payment controller complete
- ⏳ **ACTION NEEDED: Add Gmail credentials to enable actual emails**

---

## ⚡ Quick Setup (5 minutes)

### Step 1: Get Gmail App Password

1. Open: https://myaccount.google.com/security
2. Scroll down to "App passwords"
3. If you don't see it:
   - Enable 2-Factor Authentication first
   - Then come back to generate App Password
4. Select: "Mail" and "Windows Computer" (or your device)
5. Google will show you a 16-character password
6. **Copy this password** (you'll use it next)

### Step 2: Update .env File

Open: `backend/.env`

Find these lines (near the bottom):
```
# Email Configuration
MAIL_FROM=shopeasy.rw@gmail.com
MAIL_PASSWORD=
```

Replace with your Gmail info:
```
MAIL_FROM=your_actual_gmail@gmail.com
MAIL_PASSWORD=the_16_char_password_from_step_1
```

Example:
```
MAIL_FROM=olivin.ntare@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 3: Restart Backend

```bash
# In terminal, stop current backend (Ctrl+C)
# Then run:
cd backend
npm start
```

### Step 4: Test by Placing an Order

1. Go to http://localhost:5174
2. Add products to cart
3. Go to checkout
4. Select a Rwandan payment method
5. Complete the order
6. **Check your email inbox** for payment instructions!

---

## 📨 What Customers Will Receive

### For Bank Transfer Payment:
```
From: ShopEasy <noreply@shopeasy.rw>
Subject: Payment Instructions - Bank Transfer (ShopEasy Order)

Email includes:
- Bank account details
- Amount to transfer (in RWF)
- Unique reference code
- List of supported banks
- Step-by-step instructions
```

### For Phone Payment:
```
From: ShopEasy <noreply@shopeasy.rw>
Subject: Payment Instructions - Mobile Payment (ShopEasy Order)

Email includes:
- Phone number to confirm on
- Amount to pay
- Reference code
- How-to steps
- What to expect
```

### For Mobile Money:
```
From: ShopEasy <noreply@shopeasy.rw>
Subject: Payment Instructions - Mobile Money (ShopEasy Order)

Email includes:
- Provider (MTN/Airtel)
- Reference code
- Step-by-step payment instructions
- Processing time expectations
```

---

## 🧪 Optional: Test Without Placing Order

Run this command to test email templates (doesn't require Gmail password):

```bash
cd backend
node test_notifications.js
```

This will show:
- ✓ Each email template loads correctly
- ✓ No syntax errors
- ✗ Actual emails won't send (until Gmail password is added)

---

## 💬 SMS Notifications (Optional)

Want customers to receive SMS with payment details too?

### For Phone Payments:
SMS confirmation will be sent immediately after order

### For Mobile Money:
SMS with transaction reference code

### Setup Twilio SMS (10 minutes):

1. Sign up: https://www.twilio.com
2. Get these from your dashboard:
   - Account SID
   - Auth Token
   - Phone number (like +250788123456)

3. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=AC...
   TWILIO_AUTH_TOKEN=...
   TWILIO_PHONE_NUMBER=+250...
   ```

4. Install Twilio package:
   ```bash
   cd backend
   npm install twilio
   npm start
   ```

5. SMS will auto-send with orders now!

---

## ✅ Verification Checklist

After setting up Gmail credentials, verify:

- [ ] Backend starts without errors: `npm start` in backend folder
- [ ] Email service loads (look for no errors in terminal)
- [ ] Test order created successfully
- [ ] Check email inbox for payment instructions
- [ ] Email content matches payment method selected
- [ ] Reference code visible in email
- [ ] Correct amount shown in RWF

---

## 🔧 Troubleshooting

### "Email not received"
1. Check spam/promotions folder in Gmail
2. Verify Gmail password in .env is correct (16 characters)
3. Check backend terminal for error messages
4. Make sure 2FA is enabled on Gmail account

### "MAIL_PASSWORD field empty"
- You haven't added the app password yet
- Follow Step 2 above to get it from Google

### "Connection refused" error
- Make sure backend is running: `npm start`
- Check port 4002 is not blocked by firewall

### Backend won't start
- Look for error messages in terminal
- Make sure all files were created correctly
- Check .env file syntax (no quotes around values)

---

## 📊 Current Files Structure

```
backend/
├── src/
│   ├── services/
│   │   ├── emailService.js        ← NEW: Sends payment emails
│   │   └── smsService.js          ← NEW: Sends SMS (optional)
│   └── controllers/
│       └── paymentController.js   ← MODIFIED: Calls notification services
├── .env                            ← MODIFY: Add Gmail credentials
├── NOTIFICATIONS_SETUP.md          ← Reference guide
└── test_notifications.js           ← Optional: Test script
```

---

## 🎯 What Happens Now (End-to-End Flow)

```
Customer Places Order
        ↓
Order created in database
        ↓
Email automatically sent to customer with:
  • Bank details (for bank transfer)
  • Phone confirmation steps (for phone payment)
  • Mobile money instructions (for mobile money)
        ↓
(Optional) SMS sent to phone number
        ↓
Customer receives payment instructions
        ↓
Customer completes payment
        ↓
Business receives money
```

---

## 🚀 Summary

**Today you've implemented:**
- ✅ Automated email notifications
- ✅ Professional HTML email templates
- ✅ SMS infrastructure (ready to use)
- ✅ Complete notification service

**All you need to do:**
1. Add Gmail app password to .env (5 min)
2. Restart backend (1 min)
3. Test with an order (2 min)

**Total setup time: ~8 minutes!**

---

Need help? Check:
- `NOTIFICATIONS_SETUP.md` - Detailed guide for email/SMS setup
- `test_notifications.js` - Run tests to validate setup
- Backend terminal - Look for ✓ or ✗ logs
