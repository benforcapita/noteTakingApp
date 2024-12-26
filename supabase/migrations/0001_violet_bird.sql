/*
  # Create notes table for meeting summaries

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `content` (text)
      - `timestamp` (timestamptz)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to manage their own notes
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  timestamp timestamptz NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own notes"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);