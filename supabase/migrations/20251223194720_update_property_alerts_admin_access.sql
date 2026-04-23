/*
  # Update Property Alerts RLS for Admin Access

  1. Changes
    - Adds policies to allow authenticated users (admins) to:
      - View all property alerts
      - Update property alerts (toggle active status)
      - Delete property alerts
    
  2. Security
    - Only authenticated users (logged in admins) can manage alerts
    - Anonymous users can still insert new alerts (existing policy)
    - Authenticated users get full CRUD access to all alerts
*/

CREATE POLICY "Authenticated users can view all property alerts"
  ON property_alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update property alerts"
  ON property_alerts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete property alerts"
  ON property_alerts
  FOR DELETE
  TO authenticated
  USING (true);
