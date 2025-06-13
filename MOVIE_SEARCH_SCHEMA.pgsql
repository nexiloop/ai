-- Movie Search and vlop.fun Integration Schema
-- Run this in your Supabase SQL editor to enable movie search functionality

-- =============================================
-- MOVIE SEARCH PREFERENCES TABLE
-- =============================================

-- Create user_preferences table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Layout and UI preferences
  layout TEXT DEFAULT 'fullscreen' CHECK (layout IN ('sidebar', 'fullscreen')),
  prompt_suggestions BOOLEAN DEFAULT true,
  show_tool_invocations BOOLEAN DEFAULT true,
  show_conversation_previews BOOLEAN DEFAULT true,
  
  -- Image generation preferences
  default_image_model TEXT DEFAULT '@cf/lykon/dreamshaper-8-lcm',
  background_removal_enabled BOOLEAN DEFAULT false,
  
  -- Movie search and streaming preferences
  video_streaming_enabled BOOLEAN DEFAULT true,
  vlop_enabled BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add video_streaming_enabled column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'video_streaming_enabled'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN video_streaming_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- Add vlop_enabled column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_preferences' 
    AND column_name = 'vlop_enabled'
  ) THEN
    ALTER TABLE user_preferences 
    ADD COLUMN vlop_enabled BOOLEAN DEFAULT true;
  END IF;
END $$;

-- =============================================
-- MOVIE SEARCH HISTORY (OPTIONAL)
-- =============================================

-- Table to track movie searches and results (optional, for analytics)
CREATE TABLE IF NOT EXISTS movie_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type TEXT DEFAULT 'multi' CHECK (search_type IN ('movie', 'tv', 'multi')),
  results_count INTEGER DEFAULT 0,
  
  -- Store search metadata
  tmdb_results JSONB,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_movie_searches_user_id ON movie_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_searches_created_at ON movie_searches(created_at);

-- =============================================
-- MOVIE FAVORITES (OPTIONAL)
-- =============================================

-- Table to store user's favorite movies/shows
CREATE TABLE IF NOT EXISTS user_movie_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- TMDB data
  tmdb_id INTEGER NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  poster_path TEXT,
  release_date TEXT,
  vote_average DECIMAL(3,1),
  
  -- vlop.fun streaming URL
  vlop_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(user_id, tmdb_id, media_type)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_user_movie_favorites_user_id ON user_movie_favorites(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_movie_favorites ENABLE ROW LEVEL SECURITY;

-- Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for movie_searches
CREATE POLICY "Users can view own searches" ON movie_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own searches" ON movie_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policies for user_movie_favorites
CREATE POLICY "Users can view own favorites" ON user_movie_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_movie_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites" ON user_movie_favorites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_movie_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_preferences
DROP TRIGGER IF EXISTS update_user_preferences_updated_at ON user_preferences;
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- =============================================
-- SAMPLE DATA (OPTIONAL)
-- =============================================

-- Insert default preferences for existing users (optional)
-- Uncomment the following if you want to set defaults for existing users

/*
INSERT INTO user_preferences (user_id, video_streaming_enabled, vlop_enabled)
SELECT 
  id as user_id,
  true as video_streaming_enabled,
  true as vlop_enabled
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM user_preferences)
ON CONFLICT (user_id) DO NOTHING;
*/

-- =============================================
-- HELPFUL QUERIES
-- =============================================

/*
-- Check user preferences
SELECT * FROM user_preferences WHERE user_id = auth.uid();

-- Get user's movie search history
SELECT search_query, search_type, results_count, created_at 
FROM movie_searches 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC 
LIMIT 10;

-- Get user's favorite movies
SELECT title, media_type, vote_average, vlop_url, created_at
FROM user_movie_favorites 
WHERE user_id = auth.uid() 
ORDER BY created_at DESC;

-- Count total movie searches
SELECT COUNT(*) as total_searches 
FROM movie_searches 
WHERE user_id = auth.uid();
*/
