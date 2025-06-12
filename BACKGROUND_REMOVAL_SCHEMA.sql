-- Background Removal Feature Schema
-- Add column to user_preferences table for background removal setting

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  background_removal_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only see their own preferences
CREATE POLICY "Users can view their own preferences" ON user_preferences 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences 
  FOR UPDATE USING (auth.uid() = user_id);

-- If table already exists, add the background removal column
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'background_removal_enabled'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN background_removal_enabled BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_preferences_background_removal 
ON user_preferences(background_removal_enabled);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id 
ON user_preferences(user_id);

-- Update existing users to have the default setting
UPDATE user_preferences 
SET background_removal_enabled = false 
WHERE background_removal_enabled IS NULL;
