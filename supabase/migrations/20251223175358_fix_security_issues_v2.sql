/*
  # Fix Security Issues

  1. Remove Unused Indexes
    - Drop `idx_contacts_email` (unused)
    - Drop `idx_contacts_created_at` (unused)
    - Drop `idx_contacts_status` (unused)

  2. Clean Up Duplicate RLS Policies
    - Drop all existing policies on contacts table
    - Create single, clear policy for INSERT (anonymous users)
    - Create single, clear policy for SELECT (authenticated users)
    - Create single, clear policy for UPDATE (authenticated users)

  3. Fix Function Security
    - Drop trigger first, then function
    - Recreate `update_updated_at_column` function with immutable search_path
    - Recreate trigger

  ## Security Notes
  - One permissive policy per role/action combination
  - Anonymous users can only INSERT contact forms
  - Authenticated users can SELECT and UPDATE contacts
  - Function now has secure search_path
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_contacts_email;
DROP INDEX IF EXISTS idx_contacts_created_at;
DROP INDEX IF EXISTS idx_contacts_status;

-- Drop ALL existing policies to clean up duplicates
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;
DROP POLICY IF EXISTS "Public can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Enable insert for everyone" ON contacts;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON contacts;
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can view all contacts" ON contacts;
DROP POLICY IF EXISTS "Enable read for authenticated users only" ON contacts;
DROP POLICY IF EXISTS "Enable select for authenticated users only" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can read contacts" ON contacts;
DROP POLICY IF EXISTS "Authenticated users can update contacts" ON contacts;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON contacts;

-- Create single INSERT policy for anonymous users
CREATE POLICY "anon_insert_contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create single SELECT policy for authenticated users
CREATE POLICY "authenticated_select_contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Create single UPDATE policy for authenticated users
CREATE POLICY "authenticated_update_contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Fix function security
-- Drop trigger first
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;

-- Drop and recreate function with secure search_path
DROP FUNCTION IF EXISTS update_updated_at_column();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();