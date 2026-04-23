/*
  # Final Fix for Contacts Table RLS

  1. Changes
    - Drop all existing INSERT policies
    - Create single INSERT policy that allows BOTH anon AND authenticated users
    - This matches the original working migration pattern

  2. Security
    - Both anonymous and authenticated users can submit contact forms
    - Only authenticated users can view/update/delete contacts
*/

-- Drop existing INSERT policy for anon only
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;
DROP POLICY IF EXISTS "enable_insert_for_anon" ON contacts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contacts;

-- Create INSERT policy for BOTH anon and authenticated (like original migration)
CREATE POLICY "enable_insert_for_anon_and_authenticated"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
