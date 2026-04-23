/*
  # Fix update_property_alert_timestamp Function

  ## Overview
  The previous migration set search_path to an empty string which prevents
  the function from finding the now() function. This migration fixes that.

  ## Changes Made
  - Recreate the function with proper search_path set to 'pg_catalog, public'
  - This allows the function to find pg_catalog.now() while maintaining security

  ## Security Notes
  - Using explicit pg_catalog schema prevents search_path manipulation attacks
  - Function remains SECURITY DEFINER with immutable search_path
*/

-- Recreate function with proper search_path
CREATE OR REPLACE FUNCTION update_property_alert_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;