-- =====================================================================
-- SECURITY FIXES  (audit of 2026-09-28)
-- =====================================================================
-- These statements close every database-side finding from the audit.
-- They could NOT be applied automatically: this project currently has
-- no database, so there was nothing to apply them to.
--
-- HOW TO APPLY
--   1. Create / open your Supabase project dashboard.
--   2. Make sure the project's migrations under supabase/migrations/
--      have been applied first (they create the tables these rules
--      refer to).
--   3. Open "SQL Editor", paste this whole file in, press "Run".
--
-- READ THIS FIRST
--   Every rule below trusts a server-controlled "admin" marker on the
--   account (app_metadata.role = 'admin'). app_metadata cannot be
--   edited by the signed-in user, unlike user_metadata, which must
--   never be trusted for access decisions.
--   Run block A below FIRST, with your own admin email, or the admin
--   screens will load but show nothing.
--
-- Safe to run more than once.
-- =====================================================================


-- ---------------------------------------------------------------------
-- A (run first): mark the real admin account, and only that one.
-- Replace the email with your own admin login.
-- ---------------------------------------------------------------------
UPDATE auth.users
SET raw_app_meta_data =
      COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
WHERE email = 'REPLACE-WITH-YOUR-ADMIN-EMAIL@example.com';


-- ---------------------------------------------------------------------
-- F1 (high): any visitor at all could read every property alert
-- request, including the requester's name, email and phone number.
-- The website never reads this table back, so nothing breaks.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "anon_select_property_alerts" ON public.property_alerts;


-- ---------------------------------------------------------------------
-- F2 (high): any signed-in account could read every property alert
-- request. Restrict reads to the admin account.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated users can view all property alerts"
  ON public.property_alerts;
DROP POLICY IF EXISTS "admin_select_property_alerts" ON public.property_alerts;

CREATE POLICY "admin_select_property_alerts"
  ON public.property_alerts FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F3 (high): any signed-in account could read every contact enquiry.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_select_for_authenticated" ON public.contacts;
DROP POLICY IF EXISTS "authenticated_select_contacts" ON public.contacts;
DROP POLICY IF EXISTS "admin_select_contacts" ON public.contacts;

CREATE POLICY "admin_select_contacts"
  ON public.contacts FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F4 (medium): any signed-in account could delete every contact
-- enquiry.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_delete_for_authenticated" ON public.contacts;
DROP POLICY IF EXISTS "authenticated_delete_contacts" ON public.contacts;
DROP POLICY IF EXISTS "admin_delete_contacts" ON public.contacts;

CREATE POLICY "admin_delete_contacts"
  ON public.contacts FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F5 (low): an unconditional insert rule sat alongside the validated
-- one. Permissive rules are OR-ed together, so the unconditional rule
-- cancelled every length and format check: junk and oversized
-- submissions passed. Drop it, and give signed-in callers a validated
-- rule of their own.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "enable_insert_for_anon_and_authenticated"
  ON public.contacts;
DROP POLICY IF EXISTS "authenticated_insert_contacts_validated"
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
-- F6 (low): the anonymous website-visitor role held EVERY privilege on
-- the contacts table. Visitors only ever need to submit the form.
-- ---------------------------------------------------------------------
REVOKE ALL ON public.contacts FROM anon;
GRANT INSERT ON public.contacts TO anon;


-- ---------------------------------------------------------------------
-- F7 (medium): any signed-in account could publish a new video onto
-- the public site.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can insert videos" ON public.property_videos;
DROP POLICY IF EXISTS "admin_insert_property_videos" ON public.property_videos;

CREATE POLICY "admin_insert_property_videos"
  ON public.property_videos FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F8 (medium): any signed-in account could rewrite the videos already
-- on the public site.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can update videos" ON public.property_videos;
DROP POLICY IF EXISTS "admin_update_property_videos" ON public.property_videos;

CREATE POLICY "admin_update_property_videos"
  ON public.property_videos FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F9 (medium): any signed-in account could delete the videos on the
-- public site.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can delete videos" ON public.property_videos;
DROP POLICY IF EXISTS "admin_delete_property_videos" ON public.property_videos;

CREATE POLICY "admin_delete_property_videos"
  ON public.property_videos FOR DELETE
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- The admin screen also needs to see hidden videos, which the public
-- read rule (active only) does not cover. Keep that read admin-only.
DROP POLICY IF EXISTS "Authenticated can view all videos" ON public.property_videos;
DROP POLICY IF EXISTS "admin_select_all_property_videos" ON public.property_videos;

CREATE POLICY "admin_select_all_property_videos"
  ON public.property_videos FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F10 (medium): any signed-in account could upload arbitrary files
-- into the public "property-videos" storage bucket.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can upload property videos" ON storage.objects;
DROP POLICY IF EXISTS "admin_upload_property_video_objects" ON storage.objects;

CREATE POLICY "admin_upload_property_video_objects"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ---------------------------------------------------------------------
-- F11 (medium): any signed-in account could overwrite files already in
-- that bucket.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can update property videos" ON storage.objects;
DROP POLICY IF EXISTS "admin_update_property_video_objects" ON storage.objects;

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


-- ---------------------------------------------------------------------
-- F12 (medium): any signed-in account could delete files from that
-- bucket.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated can delete property videos" ON storage.objects;
DROP POLICY IF EXISTS "admin_delete_property_video_objects" ON storage.objects;

CREATE POLICY "admin_delete_property_video_objects"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'property-videos'
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );


-- ---------------------------------------------------------------------
-- F13 (medium): any signed-in account could read the advertising
-- conversion log.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS "Authenticated admins can view CAPI event log"
  ON public.meta_capi_events;
DROP POLICY IF EXISTS "admin_select_capi_events" ON public.meta_capi_events;

CREATE POLICY "admin_select_capi_events"
  ON public.meta_capi_events FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');


-- ---------------------------------------------------------------------
-- F14 (medium): the public video bucket accepted files of any type and
-- any size. The browser's file picker filter is not a control: the
-- upload endpoint can be called directly. Enforce it on the bucket.
-- ---------------------------------------------------------------------
UPDATE storage.buckets
SET file_size_limit = 524288000,  -- 500 MB
    allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime']
WHERE id = 'property-videos';


-- =====================================================================
-- After running: sign in to the admin screen with the account you
-- marked in block A and confirm the enquiry list, the alert list and
-- the video manager still load. If they are empty, the email in block A
-- did not match your admin account.
-- =====================================================================
