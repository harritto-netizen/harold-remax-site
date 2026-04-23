/*
  # Fix Anonymous Contact Form Submissions

  1. Changes
    - Drop and recreate the anon_insert_contacts policy to ensure it works properly
    - Ensure anonymous users can submit contact forms without authentication

  2. Security
    - Policy allows anonymous INSERT operations with no restrictions
    - Owner_id will be NULL for anonymous submissions
*/

-- Drop existing anon policy
DROP POLICY IF EXISTS "anon_insert_contacts" ON contacts;

-- Recreate with explicit permissions
CREATE POLICY "anon_insert_contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant INSERT permission to anon role
GRANT INSERT ON contacts TO anon;
