-- Create the logs table
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  ts TIMESTAMPTZ DEFAULT now() NOT NULL,
  mood INTEGER,
  sleep_quality INTEGER,
  energy INTEGER,
  stability INTEGER,
  notes TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow users to select only their own logs
CREATE POLICY "Users can view their own logs" ON logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own logs
CREATE POLICY "Users can insert their own logs" ON logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own logs
CREATE POLICY "Users can update their own logs" ON logs
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow users to delete their own logs
CREATE POLICY "Users can delete their own logs" ON logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS logs_user_id_ts_idx ON logs (user_id, ts DESC);
CREATE INDEX IF NOT EXISTS logs_meta_gin_idx ON logs USING GIN (meta);

-- Create storage bucket for attachments if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for attachments bucket
CREATE POLICY "Users can upload their own attachments" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own attachments" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'attachments' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
