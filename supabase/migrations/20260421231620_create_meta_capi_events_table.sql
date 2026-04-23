/*
  # Meta Conversions API event log

  Creates a table to log every event forwarded to Meta's Conversions API.
  This is an audit/debug log, NOT a public table. It helps reconcile
  browser-side pixel events with server-side CAPI events (via event_id)
  and lets admins inspect delivery failures.

  1. New Tables
    - `meta_capi_events`
      - `id` (uuid, primary key)
      - `event_id` (text) - shared with the browser pixel for deduplication
      - `event_name` (text) - e.g. Lead, Contact, ViewContent, PageView
      - `event_source_url` (text)
      - `event_time` (timestamptz, default now())
      - `payload` (jsonb) - the outgoing CAPI payload (PII already hashed)
      - `response_status` (int) - HTTP status from Meta
      - `response_body` (text) - raw response, truncated to 2000 chars
      - `created_at` (timestamptz, default now())

  2. Security
    - RLS enabled
    - Only authenticated admins (any authenticated user today) can SELECT
    - Writes happen exclusively from the edge function using the service role,
      which bypasses RLS. No INSERT/UPDATE/DELETE policies are needed.
*/

CREATE TABLE IF NOT EXISTS meta_capi_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  event_name text NOT NULL,
  event_source_url text,
  event_time timestamptz NOT NULL DEFAULT now(),
  payload jsonb NOT NULL,
  response_status int,
  response_body text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS meta_capi_events_event_id_idx ON meta_capi_events (event_id);
CREATE INDEX IF NOT EXISTS meta_capi_events_event_name_idx ON meta_capi_events (event_name);
CREATE INDEX IF NOT EXISTS meta_capi_events_created_at_idx ON meta_capi_events (created_at DESC);

ALTER TABLE meta_capi_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'meta_capi_events'
      AND policyname = 'Authenticated admins can view CAPI event log'
  ) THEN
    CREATE POLICY "Authenticated admins can view CAPI event log"
      ON meta_capi_events
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;
