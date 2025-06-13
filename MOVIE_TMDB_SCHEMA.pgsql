-- TMDB Movie and TV Show Schema for Supabase
-- This enables movie search functionality with vlop.fun integration

-- Table to store movie search history and user preferences
CREATE TABLE IF NOT EXISTS movie_searches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    tmdb_results JSONB,
    search_type TEXT CHECK (search_type IN ('movie', 'tv', 'multi')) DEFAULT 'multi',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store user movie preferences and watchlist
CREATE TABLE IF NOT EXISTS user_movie_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    preferred_genres TEXT[],
    blocked_genres TEXT[],
    preferred_languages TEXT[] DEFAULT ARRAY['en'],
    adult_content_enabled BOOLEAN DEFAULT false,
    vlop_streaming_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table to store favorite movies/shows
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    tmdb_id INTEGER NOT NULL,
    media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
    title TEXT NOT NULL,
    poster_path TEXT,
    vlop_url TEXT,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, tmdb_id, media_type)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movie_searches_user_id ON movie_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_movie_searches_created_at ON movie_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_tmdb_id ON user_favorites(tmdb_id);

-- Row Level Security (RLS) Policies
ALTER TABLE movie_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_movie_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- Users can only access their own movie data
CREATE POLICY "Users can view their own movie searches" ON movie_searches
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movie searches" ON movie_searches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movie searches" ON movie_searches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own movie searches" ON movie_searches
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own movie preferences" ON user_movie_preferences
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own movie preferences" ON user_movie_preferences
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own movie preferences" ON user_movie_preferences
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_movie_searches_updated_at
    BEFORE UPDATE ON movie_searches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_movie_preferences_updated_at
    BEFORE UPDATE ON user_movie_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
