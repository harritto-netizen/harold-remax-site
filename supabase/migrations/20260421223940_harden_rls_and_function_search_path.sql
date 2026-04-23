/*
  # Harden RLS policies and fix function search_path

  1. Function hardening
    - Recreate `public.notify_property_alert` with an immutable `search_path`
      set to `public, pg_temp` to eliminate the "role mutable search_path"
      warning. Function body is unchanged.

  2. Contacts RLS
    - Replace `anon_insert_contacts_alerts` with a policy that validates the
      submission (non-empty name, email and message, plus a basic email shape
      check) instead of `WITH CHECK (true)`.
    - Replace `enable_update_for_authenticated` with an admin-only policy
      that requires `app_metadata.role = 'admin'` in the JWT for both the
      `USING` and `WITH CHECK` clauses.

  3. Property Alerts RLS
    - Replace `anon_insert_property_alerts` with a policy that validates the
      submission (non-empty email with a basic shape check and
      `is_active = true`).
    - Replace `Authenticated users can update property alerts` and
      `Authenticated users can delete property alerts` with admin-only
      policies that require `app_metadata.role = 'admin'`.

  4. Notes
    - No data is deleted or modified.
    - Public insert access is preserved for the lead forms, but is now
      constrained by input validation.
    - Admin-only mutations rely on `auth.jwt() -> 'app_metadata' ->> 'role'`.
      The admin user's `raw_app_meta_data.role` must be set to `'admin'`.
*/

CREATE OR REPLACE FUNCTION public.notify_property_alert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  supabase_url text;
  service_role_key text;
  payload jsonb;
BEGIN
  supabase_url := current_setting('app.settings.supabase_url', true);
  service_role_key := current_setting('app.settings.service_role_key', true);

  IF supabase_url IS NULL OR service_role_key IS NULL THEN
    RAISE WARNING 'Supabase URL or service role key not configured';
    RETURN NEW;
  END IF;

  payload := jsonb_build_object(
    'email', NEW.email,
    'name', NEW.name,
    'phone', NEW.phone,
    'property_type', NEW.property_type,
    'location', NEW.location,
    'price_min', NEW.price_min,
    'price_max', NEW.price_max
  );

  PERFORM net.http_post(
    url := supabase_url || '/functions/v1/send-property-alert-notification',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || service_role_key
    ),
    body := payload
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to send notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

DROP POLICY IF EXISTS "anon_insert_contacts_alerts" ON public.contacts;
CREATE POLICY "anon_insert_contacts_validated"
  ON public.contacts
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND length(btrim(name)) > 0
    AND email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND message IS NOT NULL AND length(btrim(message)) > 0
  );

DROP POLICY IF EXISTS "enable_update_for_authenticated" ON public.contacts;
CREATE POLICY "admin_update_contacts"
  ON public.contacts
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "anon_insert_property_alerts" ON public.property_alerts;
CREATE POLICY "anon_insert_property_alerts_validated"
  ON public.property_alerts
  FOR INSERT
  TO anon
  WITH CHECK (
    email IS NOT NULL AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND is_active = true
  );

DROP POLICY IF EXISTS "Authenticated users can update property alerts" ON public.property_alerts;
CREATE POLICY "admin_update_property_alerts"
  ON public.property_alerts
  FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete property alerts" ON public.property_alerts;
CREATE POLICY "admin_delete_property_alerts"
  ON public.property_alerts
  FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
