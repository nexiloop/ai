-- Image Generation Extension Schema
-- Add this table to your existing Supabase database

-- Image Generations tracking table
CREATE TABLE image_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT image_generations_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE image_generations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own image generations
CREATE POLICY "Users can view their own image generations" ON image_generations 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own image generations" ON image_generations 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index for efficient daily usage queries
CREATE INDEX idx_image_generations_user_created ON image_generations(user_id, created_at);

-- Optional: Create a view for daily usage counts
CREATE OR REPLACE VIEW daily_image_usage AS
SELECT 
  user_id,
  DATE(created_at) as generation_date,
  COUNT(*) as generation_count
FROM image_generations
GROUP BY user_id, DATE(created_at);
