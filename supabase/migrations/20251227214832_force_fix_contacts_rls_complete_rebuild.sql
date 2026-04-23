/*
  # Complete RLS Rebuild for Contacts Table

  1. Changes
    - Drop ALL existing policies
    - Drop and recreate table grants
    - Recreate policies from scratch
    - Ensure anon role has proper INSERT access

  2. Security
    - Anonymous users: INSERT only (contact form submissions)
    - Authenticated users: SELECT, UPDATE, DELETE (admin access)
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_select_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_update_contacts" ON contacts;
DROP POLICY IF EXISTS "authenticated_delete_contacts" ON contacts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON contacts;

-- Revoke all existing grants
REVOKE ALL ON contacts FROM anon;
REVOKE ALL ON contacts FROM authenticated;

-- Grant specific privileges
GRANT INSERT ON contacts TO anon;
GRANT SELECT, UPDATE, DELETE ON contacts TO authenticated;

-- Disable RLS temporarily
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create INSERT policy for anonymous users (contact form)
CREATE POLICY "enable_insert_for_anon"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create SELECT policy for authenticated users (admin)
CREATE POLICY "enable_select_for_authenticated"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Create UPDATE policy for authenticated users (admin)
CREATE POLICY "enable_update_for_authenticated"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create DELETE policy for authenticated users (admin)
CREATE POLICY "enable_delete_for_authenticated"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (true);
