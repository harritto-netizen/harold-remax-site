/*
# Create blog_posts table for Holo AI publishing

1. Plain-English summary
   Stores SEO blog articles that Holo AI sends to the website when Harold approves them.
   Visitors can read published articles; nobody can create, edit or delete them from the browser.
   Only the secure Holo receiver (server side, using the service role) writes to this table.

2. New Tables
   - `blog_posts`
     - `id` (uuid, primary key)
     - `holo_id` (uuid, unique) - Holo's stable article id, used to update the same post on republish
     - `slug` (text, unique) - address of the article, e.g. /blog/<slug>
     - `title` (text)
     - `excerpt` (text) - short teaser shown on the blog index
     - `content_html` (text) - article body, already cleaned of unsafe markup by the receiver
     - `meta_title`, `meta_description` (text) - search engine title / description
     - `featured_image` (text, nullable) - https image URL from Holo's CDN
     - `is_published` (boolean, default true) - lets the owner hide a post without deleting it
     - `published_at` (timestamptz) - Holo publish date
     - `created_at`, `updated_at` (timestamptz)

3. Security
   - RLS enabled.
   - anon + authenticated: SELECT only, and only rows where is_published = true (public articles).
   - No INSERT/UPDATE/DELETE policies or grants for anon/authenticated, so the browser cannot write.
   - service_role granted SELECT/INSERT/UPDATE for the webhook receiver and sitemap.

4. Notes
   1. Slug format is enforced so stored slugs are always URL-safe.
   2. Index on published_at for newest-first listing.
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  holo_id uuid UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 200),
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content_html text NOT NULL,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  featured_image text,
  is_published boolean NOT NULL DEFAULT true,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_posts_published_at_idx ON blog_posts (published_at DESC) WHERE is_published;

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON blog_posts FROM anon, authenticated;
GRANT SELECT ON blog_posts TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON blog_posts TO service_role;

DROP POLICY IF EXISTS "Public can read published blog posts" ON blog_posts;
CREATE POLICY "Public can read published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (is_published = true);
