/*
  # Create Property Alerts Table

  ## Overview
  This table stores user subscriptions for property alerts and new listing notifications.

  ## 1. New Tables
    - `property_alerts`
      - `id` (uuid, primary key) - Unique identifier for each alert subscription
      - `email` (text, required) - Subscriber's email address
      - `name` (text, optional) - Subscriber's name
      - `phone` (text, optional) - Subscriber's phone number
      - `property_type` (text, optional) - Type of property they're interested in (villa, apartment, etc.)
      - `location` (text, optional) - Preferred location (Santo Domingo, Punta Cana, etc.)
      - `price_min` (integer, optional) - Minimum price range
      - `price_max` (integer, optional) - Maximum price range
      - `is_active` (boolean) - Whether the alert is active (default true)
      - `created_at` (timestamptz) - When the subscription was created
      - `updated_at` (timestamptz) - When the subscription was last updated

  ## 2. Security
    - Enable RLS on `property_alerts` table
    - Allow anonymous users to INSERT (subscribe to alerts)
    - Authenticated users can view all alerts
    - Only authenticated users can UPDATE/DELETE alerts

  ## 3. Indexes
    - Index on email for quick lookups
    - Index on is_active for filtering active subscriptions
*/

-- Create property_alerts table
CREATE TABLE IF NOT EXISTS property_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  phone text,
  property_type text,
  location text,
  price_min integer,
  price_max integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_alerts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to subscribe (INSERT)
CREATE POLICY "anon_insert_property_alerts"
  ON property_alerts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all alerts
CREATE POLICY "authenticated_select_property_alerts"
  ON property_alerts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update alerts
CREATE POLICY "authenticated_update_property_alerts"
  ON property_alerts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete alerts
CREATE POLICY "authenticated_delete_property_alerts"
  ON property_alerts
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_property_alerts_email ON property_alerts(email);
CREATE INDEX IF NOT EXISTS idx_property_alerts_is_active ON property_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_property_alerts_created_at ON property_alerts(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_property_alert_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_property_alert_timestamp_trigger
  BEFORE UPDATE ON property_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_property_alert_timestamp();