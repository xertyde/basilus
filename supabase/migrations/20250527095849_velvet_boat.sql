/*
  # Create contacts table for form submissions

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `pack` (text)
      - `addons` (text array)
      - `message` (text)
      - `created_at` (timestamp with timezone)

  2. Security
    - Enable RLS on contacts table
    - Allow anonymous users to insert contacts
    - Allow authenticated users to view contacts
*/

-- Drop existing table and policies if they exist
DROP POLICY IF EXISTS "Anyone can insert contacts" ON contacts;
DROP POLICY IF EXISTS "Only authenticated users can view contacts" ON contacts;
DROP TABLE IF EXISTS contacts;

-- Create the contacts table
CREATE TABLE contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  pack text NOT NULL,
  addons text[] DEFAULT '{}',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can insert contacts"
  ON contacts
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (true);