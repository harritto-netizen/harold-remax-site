/*
  # Create property_videos table and storage bucket

  1. New Tables
    - `property_videos`
      - `id` (uuid, primary key)
      - `title` (text, required) - Video title shown to visitors
      - `description` (text) - Optional short description
      - `video_type` (text) - 'embed' (YouTube/Vimeo) or 'upload' (Supabase Storage)
      - `video_url` (text, required) - Embed URL or storage path/public URL
      - `thumbnail_url` (text) - Optional poster image
      - `display_order` (int) - Sort order, ascending
      - `is_active` (boolean) - Whether to show on the public site
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Storage
    - Create public `property-videos` bucket for uploaded MP4 files

  3. Security
    - Enable RLS on `property_videos`
    - Public (anon + authenticated) can read only active videos
    - Authenticated admins can insert/update/delete
    - Storage bucket: public read, authenticated write

  4. Notes
    - `video_type = 'embed'`: store full YouTube/Vimeo URL
    - `video_type = 'upload'`: store the Supabase Storage public URL
*/

CREATE TABLE IF NOT EXISTS property_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  video_type text NOT NULL DEFAULT 'embed',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  display_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT property_videos_video_type_check CHECK (video_type IN ('embed', 'upload'))
);

ALTER TABLE property_videos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'property_videos' AND policyname = 'Anyone can view active videos'
  ) THEN
    CREATE POLICY "Anyone can view active videos"
      ON property_videos FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'property_videos' AND policyname = 'Authenticated can view all videos'
  ) THEN
    CREATE POLICY "Authenticated can view all videos"
      ON property_videos FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'property_videos' AND policyname = 'Authenticated can insert videos'
  ) THEN
    CREATE POLICY "Authenticated can insert videos"
      ON property_videos FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'property_videos' AND policyname = 'Authenticated can update videos'
  ) THEN
    CREATE POLICY "Authenticated can update videos"
      ON property_videos FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'property_videos' AND policyname = 'Authenticated can delete videos'
  ) THEN
    CREATE POLICY "Authenticated can delete videos"
      ON property_videos FOR DELETE
      TO authenticated
      USING (true);
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('property-videos', 'property-videos', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can read property videos'
  ) THEN
    CREATE POLICY "Public can read property videos"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'property-videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated can upload property videos'
  ) THEN
    CREATE POLICY "Authenticated can upload property videos"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'property-videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated can update property videos'
  ) THEN
    CREATE POLICY "Authenticated can update property videos"
      ON storage.objects FOR UPDATE
      TO authenticated
      USING (bucket_id = 'property-videos')
      WITH CHECK (bucket_id = 'property-videos');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Authenticated can delete property videos'
  ) THEN
    CREATE POLICY "Authenticated can delete property videos"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'property-videos');
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_property_videos_active_order
  ON property_videos (is_active, display_order);
