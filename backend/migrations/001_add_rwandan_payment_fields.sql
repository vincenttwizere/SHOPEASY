-- Migration: Add Rwandan payment support fields to orders table
-- This migration adds columns to support Rwandan payment methods

ALTER TABLE orders ADD COLUMN payment_method VARCHAR(50) DEFAULT 'stripe' AFTER status;
ALTER TABLE orders ADD COLUMN payment_reference VARCHAR(255) AFTER payment_method;
ALTER TABLE orders ADD COLUMN payment_details JSON AFTER payment_reference;

-- Add index for payment reference for quick lookups
CREATE INDEX idx_payment_reference ON orders(payment_reference);

-- Add index for payment method for filtering
CREATE INDEX idx_payment_method ON orders(payment_method);

-- Note: If the payment_id column does not yet contain payment method info,
-- you may want to migrate existing data. For new installations, these columns
-- will be used for all payment types moving forward.
