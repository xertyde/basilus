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

CREATE TABLE IF NOT EXISTS _test_connection (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE _test_connection ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to authenticated users"
  ON _test_connection
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert a test row
INSERT INTO _test_connection DEFAULT VALUES;