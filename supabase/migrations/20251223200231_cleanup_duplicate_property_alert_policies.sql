/*
  # Clean up duplicate RLS policies on property_alerts

  1. Changes
    - Removes duplicate policies that were created in multiple migrations
    - Keeps only the necessary policies for proper access control
    
  2. Final Policies
    - Anonymous users: INSERT and SELECT
    - Authenticated users: SELECT, UPDATE, DELETE
*/

DROP POLICY IF EXISTS "authenticated_select_property_alerts" ON property_alerts;
DROP POLICY IF EXISTS "authenticated_update_property_alerts" ON property_alerts;
DROP POLICY IF EXISTS "authenticated_delete_property_alerts" ON property_alerts;
