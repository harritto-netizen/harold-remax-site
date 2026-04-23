/*
  # Fix Property Alerts Security Issues

  ## Overview
  Resolve security vulnerabilities in property_alerts table and related functions.

  ## Changes Made
  
  ### 1. Remove Unused Indexes
  - Drop `idx_property_alerts_email` (not being used)
  - Drop `idx_property_alerts_is_active` (not being used)
  - Drop `idx_property_alerts_created_at` (not being used)
  
  ### 2. Fix Function Search Path
  - Recreate `update_property_alert_timestamp` function with immutable search_path
  - Prevents search_path manipulation attacks
  
  ## Security Notes
  - Unused indexes removed to improve performance and reduce attack surface
  - Function now uses secure search_path configuration
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_property_alerts_email;
DROP INDEX IF EXISTS idx_property_alerts_is_active;
DROP INDEX IF EXISTS idx_property_alerts_created_at;

-- Recreate function with secure search_path
CREATE OR REPLACE FUNCTION update_property_alert_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;