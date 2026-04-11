#!/usr/bin/env node

/**
 * Test Email Notifications
 * Usage: node test_notifications.js
 */

const emailService = require('./src/services/emailService');

async function testEmailNotifications() {
  console.log('🧪 Testing ShopEasy Email Notifications\n');

  // Test 1: Bank Transfer Email
  console.log('📧 Test 1: Bank Transfer Email');
  const bankResult = await emailService.sendPaymentInstructions(
    'olivin@example.com',
    'Olivin Nshuti',
    'bank',
    'RW1234567890ABC',
    100000,
    {
      bankName: 'BPR (Banque Populaire Rwandaise)',
      accountNumber: '0123456789'
    }
  );
  console.log(bankResult.success ? '✓ Test passed' : `✗ Test failed: ${bankResult.error}\n`);

  // Test 2: Phone Payment Email
  console.log('\n📧 Test 2: Phone Payment Email');
  const phoneResult = await emailService.sendPaymentInstructions(
    'olivin@example.com',
    'Olivin Nshuti',
    'phone',
    'RW0987654321XYZ',
    50000,
    {
      phoneNumber: '0788123456'
    }
  );
  console.log(phoneResult.success ? '✓ Test passed' : `✗ Test failed: ${phoneResult.error}\n`);

  // Test 3: Mobile Money Email
  console.log('\n📧 Test 3: Mobile Money Email');
  const mobileResult = await emailService.sendPaymentInstructions(
    'olivin@example.com',
    'Olivin Nshuti',
    'mobilemoney',
    'RW1111111111DEF',
    75000,
    {
      provider: 'mtn',
      code: 'SHOP-MTN-001'
    }
  );
  console.log(mobileResult.success ? '✓ Test passed' : `✗ Test failed: ${mobileResult.error}\n`);

  // Test 4: Order Confirmation Email
  console.log('\n📧 Test 4: Order Confirmation Email');
  const orderResult = await emailService.sendOrderConfirmation(
    'olivin@example.com',
    'Olivin Nshuti',
    '12345',
    [
      { name: 'Product A', quantity: 2, unit_price: 25000 },
      { name: 'Product B', quantity: 1, unit_price: 50000 }
    ],
    100000
  );
  console.log(orderResult.success ? '✓ Test passed' : `✗ Test failed: ${orderResult.error}\n`);

  console.log('\n✅ Email notification tests completed!');
  console.log('\nNote: Make sure MAIL_PASSWORD is set in .env file for emails to actually be sent.');
}

testEmailNotifications().catch(err => {
  console.error('❌ Test failed:', err.message);
  process.exit(1);
});
