/*
  # Create Contacts Table for Contact Form Submissions

  ## Overview
  This migration creates a secure contacts table to store form submissions from the real estate website.
  
  ## 1. New Tables
    - `contacts`
      - `id` (uuid, primary key) - Unique identifier for each contact
      - `name` (text, required) - Full name of the contact
      - `email` (text, required) - Email address
      - `phone` (text, optional) - Phone number
      - `message` (text, required) - Message content
      - `status` (text, default 'new') - Status: 'new', 'contacted', 'closed'
      - `created_at` (timestamptz) - Timestamp of submission
      - `updated_at` (timestamptz) - Last update timestamp
  
  ## 2. Security
    - Enable RLS on `contacts` table
    - Add policy for inserting contacts (public can insert)
    - Add policy for authenticated admin users to read all contacts
    - Add policy for authenticated admin users to update contact status
  
  ## 3. Indexes
    - Index on email for faster lookups
    - Index on created_at for sorting by date
    - Index on status for filtering
  
  ## Important Notes
    - Public users can only INSERT (submit forms)
    - Only authenticated users (admin) can READ, UPDATE contacts
    - This ensures customer privacy while allowing form submissions
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (submit contact form)
CREATE POLICY "Anyone can submit contact form"
  ON contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can view contacts
CREATE POLICY "Authenticated users can view all contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Only authenticated users can update contact status
CREATE POLICY "Authenticated users can update contacts"
  ON contacts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();