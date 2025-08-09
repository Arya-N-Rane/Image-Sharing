/*
  # Create images table for photo sharing app

  1. New Tables
    - `images`
      - `id` (uuid, primary key)
      - `filename` (text, not null)
      - `url` (text, not null) 
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `images` table
    - Add policy for public read access
    - Add policy for public insert access
*/

CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all images
CREATE POLICY "Public read access for images"
  ON images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow public insert access for new images
CREATE POLICY "Public insert access for images"
  ON images
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);