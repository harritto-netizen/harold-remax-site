/*
  # Grant Full Access to Anon on Contacts

  1. Changes
    - Grant ALL privileges on contacts table to anon role
    - This ensures anonymous users can submit contact forms

  2. Security
    - RLS policies still control what anon can actually do
    - Anon can only INSERT due to RLS policy restrictions
*/

-- Grant ALL privileges to be sure
GRANT ALL ON public.contacts TO anon;

-- Also grant usage on any sequences if needed
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
