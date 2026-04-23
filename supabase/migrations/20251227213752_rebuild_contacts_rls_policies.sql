/*
  # Rebuild Contacts RLS Policies from Scratch

  1. Changes
    - Drop all existing policies on contacts table
    - Recreate RLS policies with correct permissions
    - Ensure anonymous users can INSERT contacts

  2. Security
    - Anonymous users: INSERT only
    - Authenticated users: SELECT, UPDATE, DELETE all contacts
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_select_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_update_contacts" ON contacts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON contacts;

-- Create fresh policies
-- Allow anonymous users to insert contacts
CREATE POLICY "anon_insert_contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all contacts
CREATE POLICY "authenticated_select_contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to update all contacts
CREATE POLICY "authenticated_update_contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete all contacts
CREATE POLICY "authenticated_delete_contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (true);
