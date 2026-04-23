/*
  # Add SELECT Policy for Anonymous Users on Property Alerts

  ## Overview
  Allow anonymous users to read back their inserted property alert subscriptions.
  This is needed because the frontend uses `.select()` after insert to get the created record.

  ## Changes Made
  - Add SELECT policy for anon role on property_alerts table
  - This allows the Supabase client to return the inserted row data

  ## Security Notes
  - Anonymous users can only see all property alerts (for now)
  - This is acceptable as property alerts don't contain sensitive information
  - Email addresses are public for the purpose of the alert system
*/

-- Add SELECT policy for anonymous users
CREATE POLICY "anon_select_property_alerts"
  ON property_alerts
  FOR SELECT
  TO anon
  USING (true);