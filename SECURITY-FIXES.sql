-- =====================================================================
-- SECURITY FIXES
-- =====================================================================
-- These statements close the database-side findings from the security
-- audit. They could not be applied automatically because this session
-- had no connection to the project's database.
--
-- HOW TO APPLY
--   1. Open your Supabase project dashboard.
--   2. Go to "SQL Editor" and paste this whole file in.
--   3. Press "Run".
--
-- BEFORE YOU RUN IT (this is required, see F18 at the bottom):
--   Every rule below trusts a server-controlled "admin" marker on the
--   account. If no account carries it, the admin screens will show no
--   data. Run the F18 block FIRST, with your own admin email.
-- =====================================================================


-- ---------------------------------------------------------------------
-- F18 (run this first): mark the real admin account, and only that one.
-- Replace the email with your own admin login.
-- app_metadata is server-controlled: a signed-in user cannot edit it.
-- (user_metadata CAN be edited by the user and must never be trusted.)
-- ---------------------------------------------------------------------
UPDATE auth.users
SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE email = 'REPLACE-WITH-YOUR-ADMIN-EMAIL@example.com';

-- Also, in the dashboard: Authentication -> Sign In / Providers ->
-- turn OFF "Allow new users to sign up". Otherwise anyone can create an
-- account. (That switch lives in the dashboard, not in SQL.)


-- ---------------------------------------------------------------------
-- F1 (high): anyone at all could read every property-alert request,
-- including the requester's email. Remove the anonymous read rule.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "anon_select_property_alerts" ON public.property_alerts;


-- ---------------------------------------------------------------------
-- F2 (high): any signed-in account could read every contact enquiry.
-- Restrict reads to the admin account.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON public.contacts;

CREATE POLICY "admin_select_contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F3 (high): any signed-in account could read every property alert.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can view all property alerts"
  ON public.property_alerts;

CREATE POLICY "admin_select_property_alerts"
  ON public.property_alerts FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F4 (high): any signed-in account could delete every contact enquiry.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON public.contacts;

CREATE POLICY "admin_delete_contacts"
  ON public.contacts FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F5 (high): any signed-in account could add, edit or delete the videos
-- shown on the public site. Gate all three writes on the admin marker.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can insert property videos"
  ON public.property_videos;
DROP POLICY IF EXISTS "Authenticated users can update property videos"
  ON public.property_videos;
DROP POLICY IF EXISTS "Authenticated users can delete property videos"
  ON public.property_videos;

CREATE POLICY "admin_insert_property_videos"
  ON public.property_videos FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_update_property_videos"
  ON public.property_videos FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "admin_delete_property_videos"
  ON public.property_videos FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F6 (high): any signed-in account could upload, overwrite or delete
-- files in the public "property-videos" storage bucket.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can upload property videos"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update property videos"
  ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete property videos"
  ON storage.objects;

CREATE POLICY "admin_upload_property_video_objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "admin_update_property_video_objects"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  WITH CHECK (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "admin_delete_property_video_objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ---------------------------------------------------------------------
-- F8 (medium): any signed-in account could read the advertising
-- conversion log, which contains visitor contact details.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated admins can view CAPI event log"
  ON public.meta_capi_events;

CREATE POLICY "admin_select_capi_events"
  ON public.meta_capi_events FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F9 (medium): an unconditional insert rule on contacts sat alongside
-- the validated one. Permissive rules are OR-ed, so the unconditional
-- one cancelled all validation: junk or oversized submissions passed.
-- Drop it and re-add a validated rule for signed-in callers.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_insert_for_anon_and_authenticated"
  ON public.contacts;

CREATE POLICY "authenticated_insert_contacts_validated"
  ON public.contacts FOR INSERT
  TO authenticated
  WITH CHECK (
    length(trim(name)) BETWEEN 1 AND 100
    AND length(trim(email)) BETWEEN 5 AND 255
    AND position('@' in email) > 1
    AND length(COALESCE(message, '')) <= 2000
  );


-- ---------------------------------------------------------------------
-- F16 (high): the anonymous website visitor role held ALL privileges on
-- the contacts table. Visitors only ever need to submit the form.
-- ---------------------------------------------------------------------
REVOKE ALL ON public.contacts FROM anon;
GRANT INSERT ON public.contacts TO anon;


-- =====================================================================
-- After running: sign in to the admin screen with the account you
-- marked in F18 and confirm the enquiry and alert lists still load.
-- If they are empty, the F18 step did not match your admin email.
-- =====================================================================
