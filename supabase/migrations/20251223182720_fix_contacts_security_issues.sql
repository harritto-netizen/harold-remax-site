/*
  # Fix Security Issues in Contacts Table

  ## Overview
  This migration resolves security warnings identified in the database:

  ## 1. Remove Duplicate Permissive Policies
  Multiple policies exist for the same role and action, which creates ambiguity:
    - Drop `authenticated_select_contacts_owner` (duplicate SELECT policy)
    - Drop `authenticated_update_contacts_owner` (duplicate UPDATE policy)
    - Drop `authenticated_insert_contacts_owner` (duplicate INSERT policy)
    - Keep single policies: `authenticated_select_contacts` and `authenticated_update_contacts`

  ## 2. Fix Function Search Path
  The `set_contact_owner` function has a mutable search_path which is a security risk:
    - Drop and recreate `set_contact_owner` with immutable search_path
    - Set explicit `SET search_path = pg_catalog, public`

  ## 3. Add Anonymous INSERT Policy
  Allow anonymous users to submit contact forms:
    - Create policy for anon role to INSERT contacts

  ## Security Notes
  - Only one permissive policy per role/action combination
  - Anonymous users can only INSERT (submit forms)
  - Authenticated users can SELECT and UPDATE all contacts
  - Function now has secure, immutable search_path
*/

-- Drop duplicate policies
DROP POLICY IF EXISTS "authenticated_select_contacts_owner" ON contacts;
DROP POLICY IF EXISTS "authenticated_update_contacts_owner" ON contacts;
DROP POLICY IF EXISTS "authenticated_insert_contacts_owner" ON contacts;

-- Add anonymous INSERT policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'contacts' 
    AND policyname = 'anon_insert_contacts'
  ) THEN
    CREATE POLICY "anon_insert_contacts"
      ON contacts
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- Fix set_contact_owner function with secure search_path
DROP FUNCTION IF EXISTS set_contact_owner() CASCADE;

CREATE OR REPLACE FUNCTION set_contact_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := (SELECT auth.uid())::uuid;
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger if it was dropped
DROP TRIGGER IF EXISTS set_contact_owner_trigger ON contacts;
CREATE TRIGGER set_contact_owner_trigger
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_contact_owner();
