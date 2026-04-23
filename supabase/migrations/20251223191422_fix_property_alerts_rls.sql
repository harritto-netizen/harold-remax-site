/*
  # Fix Property Alerts RLS Policy

  ## Overview
  Resolve RLS policy violation for anonymous inserts on property_alerts table.

  ## Changes
  1. Drop and recreate the anon INSERT policy with explicit permissions
  2. Grant necessary permissions to anon role
  3. Ensure table permissions are correct

  ## Security
  - Anonymous users can only INSERT (subscribe)
  - No SELECT, UPDATE, or DELETE permissions for anon users
*/

-- Drop existing anon policy
DROP POLICY IF EXISTS "anon_insert_property_alerts" ON property_alerts;

-- Grant INSERT permission to anon role on the table
GRANT INSERT ON property_alerts TO anon;

-- Recreate anon insert policy with explicit check
CREATE POLICY "anon_insert_property_alerts"
  ON property_alerts
  FOR INSERT
  TO anon
  WITH CHECK (true);