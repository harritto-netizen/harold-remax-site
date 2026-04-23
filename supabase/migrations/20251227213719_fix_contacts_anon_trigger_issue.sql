/*
  # Fix Anonymous Contact Submissions - Trigger Issue

  1. Changes
    - Modify set_contact_owner function to gracefully handle anonymous users
    - Only set owner_id if user is authenticated
    - Allow NULL owner_id for anonymous submissions

  2. Security
    - Anonymous users can submit contacts without owner_id
    - Authenticated users get automatic owner_id assignment
*/

-- Drop and recreate the trigger function with better anonymous handling
DROP FUNCTION IF EXISTS set_contact_owner() CASCADE;

CREATE OR REPLACE FUNCTION set_contact_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  -- Try to get current user ID
  current_user_id := auth.uid();
  
  -- Only set owner_id if user is authenticated (not anonymous)
  IF current_user_id IS NOT NULL AND NEW.owner_id IS NULL THEN
    NEW.owner_id := current_user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS set_contact_owner_trigger ON contacts;
CREATE TRIGGER set_contact_owner_trigger
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION set_contact_owner();
