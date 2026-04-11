# Email Templates Preview

This document shows what customers will receive in their email for each payment method.

## Bank Transfer Payment Email

**Subject:** Payment Instructions - Bank Transfer (ShopEasy Order)

---

### Email Content (HTML rendered):

```
╔═══════════════════════════════════════════════════════════════╗
║                   SHOPEASY PAYMENT INSTRUCTIONS               ║
║                                                               ║
║         [Orange Gradient Header - Company Branding]           ║
╚═══════════════════════════════════════════════════════════════╝

Hello Abraham Nyabigambo,

Thank you for your purchase! To complete your order, please make a bank 
transfer using the details below.

┌─────────────────────────────────────────────────────────────┐
│ AMOUNT TO TRANSFER                                          │
│                                                             │
│ RWF 250,000.00                                              │
│                                                             │
│ Reference Code: RW1705123456ABC                             │
│ Important: Include this reference code in the transfer      │
└─────────────────────────────────────────────────────────────┘

BANK DETAILS
─────────────────────────────────────────────────────────────
Bank Name:           BPR (Banque Populaire Rwandaise)
Account Number:      0123456789
Reference:           RW1705123456ABC

IMPORTANT NOTES:
• Your order will be confirmed once we receive payment
• Please keep the reference code for your records
• Transfer may take 1-2 hours to process
• Contact us if you have any questions

We accept transfers from all Rwandan banks including:
- BPR (Banque Populaire Rwandaise)
- Equity Bank Rwanda
- Cogebanque
- And other major banks

Thank you for shopping with ShopEasy!

─────────────────────────────────────────────────────────────
© 2026 ShopEasy. All rights reserved.
For support, contact: support@shopeasy.rw
```

---

## Phone Payment Email

**Subject:** Payment Instructions - Mobile Payment (ShopEasy Order)

---

### Email Content (HTML rendered):

```
╔═══════════════════════════════════════════════════════════════╗
║              SHOPEASY PAYMENT - MOBILE PAYMENT                ║
║                                                               ║
║         [Orange Gradient Header - Company Branding]           ║
╚═══════════════════════════════════════════════════════════════╝

Hello Olive Rukundo,

A payment request has been sent to your phone number: +250788123456

┌─────────────────────────────────────────────────────────────┐
│ AMOUNT TO PAY                                               │
│                                                             │
│ RWF 150,000.00                                              │
│                                                             │
│ Reference Code: RW1705123456XYZ                             │
└─────────────────────────────────────────────────────────────┘

HOW TO COMPLETE PAYMENT:

① Wait for the payment prompt on your phone
   Look for an incoming payment request on your device

② Confirm the transaction amount
   Verify the amount shown matches: RWF 150,000.00

③ Enter your PIN to authorize
   Complete the authorization process on your phone

④ Receipt will be sent automatically
   You'll receive confirmation immediately after payment

NOTE: If you didn't receive a payment prompt, please check that 
your phone number is correct above or contact our support team.

Thank you for shopping with ShopEasy!

─────────────────────────────────────────────────────────────
© 2026 ShopEasy. All rights reserved.
For support, contact: support@shopeasy.rw
```

---

## Mobile Money Payment Email

**Subject:** Payment Instructions - Mobile Money (ShopEasy Order)

---

### Email Content (HTML rendered):

```
╔═══════════════════════════════════════════════════════════════╗
║              SHOPEASY PAYMENT - MTN MOBILE MONEY              ║
║                                                               ║
║         [Orange Gradient Header - Company Branding]           ║
╚═══════════════════════════════════════════════════════════════╝

Hello Jean Pierre Mbakanje,

Please use your MTN Mobile Money account to complete this payment.

┌─────────────────────────────────────────────────────────────┐
│ PAYMENT DETAILS                                             │
│                                                             │
│ RWF 100,000.00                                              │
│                                                             │
│ Provider:        MTN Mobile Money                           │
│ Reference Code:  RW1705123456DEF                            │
│ Code/Account:    SHOP-MTN-001                               │
└─────────────────────────────────────────────────────────────┘

PAYMENT INSTRUCTIONS:

① Open MTN Mobile Money on your device
   Launch the MTN Money app or dial *182#

② Select "Send Money" or "Pay Bill"
   Choose the payment option from the menu

③ Enter the reference code: RW1705123456DEF
   Type exactly as shown

④ Enter amount: RWF 100,000.00
   Confirm the exact amount

⑤ Enter your PIN to authorize
   Complete the transaction with your security PIN

⑥ Confirm the transaction
   Review and confirm all details

IMPORTANT: Your order will be confirmed once payment is received.

Thank you for shopping with ShopEasy!

─────────────────────────────────────────────────────────────
© 2026 ShopEasy. All rights reserved.
For support, contact: support@shopeasy.rw
```

---

## Order Confirmation Email

**Subject:** Order Confirmed - ShopEasy Order #12345

---

### Email Content (HTML rendered):

```
╔═══════════════════════════════════════════════════════════════╗
║               ORDER CONFIRMED - SHOPEASY                      ║
║                                                               ║
║         [Orange Gradient Header - Company Branding]           ║
╚═══════════════════════════════════════════════════════════════╝

Hello Patricia Uma,

Your order has been confirmed! Here are your order details:

Order ID: #12345

ORDER ITEMS
────────────────────────────────────────────────────────────
Product                    Qty    Price        Subtotal
────────────────────────────────────────────────────────────
Laptop Stand               2      RWF 25,000   RWF 50,000
Wireless Mouse             1      RWF 50,000   RWF 50,000
────────────────────────────────────────────────────────────
TOTAL                                         RWF 100,000
────────────────────────────────────────────────────────────

Thank you for your purchase! We'll send you tracking information 
once your order ships.

For support, contact: support@shopeasy.rw

─────────────────────────────────────────────────────────────
© 2026 ShopEasy. All rights reserved.
```

---

## Email Design Features

### Branding Elements
- **Color Scheme**: Orange gradient header (rgb(255, 102, 0) → rgb(230, 92, 0))
- **Fonts**: Professional sans-serif (Arial)
- **Layout**: Clean, organized with clear sections
- **Footer**: Company info and support contact

### User Information
- **Personalization**: Each email addresses customer by name
- **Clear Instructions**: Step-by-step numbered/bullet points
- **Important Details**: Highlighted in orange with bold text
- **Reference Codes**: Large, monospace font for easy copying

### Payment Method Specific
- **Bank Transfer**: Account details, banks list, transfer instructions
- **Phone Payment**: Expected prompts, PIN entry, confirmation
- **Mobile Money**: Provider-specific steps, transaction process

### Mobile Friendly
- Responsive design works on phones/tablets
- Large clickable text areas
- Easy-to-read layouts
- Single-column format for small screens

---

## Customization Options

You can customize these templates by editing:
- Location: `backend/src/services/emailService.js`
- Functions:
  - `generateBankTransferEmail()`
  - `generatePhonePaymentEmail()`
  - `generateMobileMoneyEmail()`

Common customizations:
- Change colors: Search for `rgb(255, 102, 0)`
- Add company logo: Modify header HTML
- Add more bank names: Edit bank list in template
- Adjust instructions: Edit the steps sections
- Change footer text: Modify company info at bottom

---

## Email Delivery Timeline

| When | What | Where |
|------|------|-------|
| Immediately after order | Payment instructions | Email inbox |
| Customer completes payment | Order confirmation | Email inbox |
| Before shipping | Tracking info | Email inbox (future feature) |

---

## Email Testing

To test email templates locally, see:
- `NOTIFICATIONS_SETUP.md` - Detailed setup
- `test_notifications.js` - Automated testing
- `NOTIFICATIONS_QUICK_START.md` - Quick guide

---

## Troubleshooting

### Emails not received?
1. Check spam/promotions folder
2. Verify email address is correct
3. Check backend terminal for errors
4. Ensure Gmail app password is set in .env

### Email content wrong?
1. Check customer entered info correctly
2. Verify payment method selected
3. Review email template in emailService.js
4. Check database for stored details

### Styling looks broken?
- Email HTML is fully inline (CSS in style tags)
- Should display correctly in all email clients
- Test in Gmail, Outlook, etc.
- Some email clients strip certain CSS (expected)
