/*
  # Create test connection table
  
  1. New Tables
    - `_test_connection`: Simple table to test database connectivity
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `_test_connection` table
    - Add policy for authenticated users to read data
*/

-- Drop existing table and policy if they exist
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON _test_connection;
DROP TABLE IF EXISTS _test_connection;

-- Create the table
CREATE TABLE _test_connection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE _test_connection ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Allow read access to authenticated users"
  ON _test_connection
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert a test row
INSERT INTO _test_connection DEFAULT VALUES;