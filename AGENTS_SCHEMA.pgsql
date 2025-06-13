-- Agents Schema for Nexiloop AI
-- Run this in your Supabase SQL editor to set up the agents system

-- =============================================
-- AGENTS TABLE
-- =============================================

-- Create agents table
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic agent info
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  
  -- Agent configuration
  system_prompt TEXT NOT NULL,
  tools TEXT[] DEFAULT '{}',
  max_steps INTEGER DEFAULT 5,
  
  -- Metadata
  avatar_url TEXT,
  category TEXT,
  tags TEXT[],
  example_inputs TEXT[],
  
  -- Permissions and visibility
  is_public BOOLEAN DEFAULT true,
  remixable BOOLEAN DEFAULT false,
  tools_enabled BOOLEAN DEFAULT true,
  
  -- Creator and attribution
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Model preferences
  model_preference TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove mcp_config column if it exists (MCP cleanup)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'agents' 
    AND column_name = 'mcp_config'
  ) THEN
    ALTER TABLE agents DROP COLUMN mcp_config;
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_agents_creator_id ON agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON agents(is_public);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at);
CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category);

-- =============================================
-- AGENT USAGE TRACKING
-- =============================================

-- Table to track agent usage and analytics
CREATE TABLE IF NOT EXISTS agent_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Usage metadata
  session_id TEXT,
  messages_count INTEGER DEFAULT 1,
  tools_used TEXT[],
  
  -- Performance metrics
  response_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_agent_usage_agent_id ON agent_usage(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_usage_user_id ON agent_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_usage_created_at ON agent_usage(created_at);

-- =============================================
-- AGENT RATINGS AND FEEDBACK
-- =============================================

-- Table for user ratings and feedback on agents
CREATE TABLE IF NOT EXISTS agent_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Rating data
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  
  -- Metadata
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent duplicate ratings
  UNIQUE(agent_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_ratings_agent_id ON agent_ratings(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_ratings_user_id ON agent_ratings(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_ratings ENABLE ROW LEVEL SECURITY;

-- Policies for agents table
CREATE POLICY "Anyone can view public agents" ON agents
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own agents" ON agents
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Authenticated users can create agents" ON agents
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own agents" ON agents
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own agents" ON agents
  FOR DELETE USING (auth.uid() = creator_id);

-- Policies for agent_usage
CREATE POLICY "Users can view own usage" ON agent_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert usage" ON agent_usage
  FOR INSERT WITH CHECK (true);

-- Policies for agent_ratings
CREATE POLICY "Anyone can view ratings" ON agent_ratings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can rate agents" ON agent_ratings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON agent_ratings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings" ON agent_ratings
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

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_agent_ratings_updated_at ON agent_ratings;
CREATE TRIGGER update_agent_ratings_updated_at
  BEFORE UPDATE ON agent_ratings
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Function to calculate agent rating average
CREATE OR REPLACE FUNCTION get_agent_rating_avg(agent_uuid UUID)
RETURNS DECIMAL(3,2) AS $$
BEGIN
  RETURN (
    SELECT COALESCE(AVG(rating), 0)::DECIMAL(3,2)
    FROM agent_ratings 
    WHERE agent_id = agent_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get agent usage count
CREATE OR REPLACE FUNCTION get_agent_usage_count(agent_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COALESCE(COUNT(*), 0)::INTEGER
    FROM agent_usage 
    WHERE agent_id = agent_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SAMPLE NEXILOOP AGENTS
-- =============================================

-- Insert default Nexiloop agents (using placeholder UUID)
-- Replace '00000000-0000-0000-0000-000000000000' with actual Nexiloop user ID

INSERT INTO agents (
  id,
  name,
  description,
  slug,
  system_prompt,
  tools,
  creator_id,
  is_public,
  category,
  example_inputs
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'Nexiloop Assistant',
  'A helpful AI assistant created by Nexiloop for general questions and tasks.',
  'nexiloop-assistant',
  'You are a helpful assistant created by Nexiloop. You help users with their questions and tasks. Be friendly, helpful, and informative in your responses. Always strive to provide accurate and useful information.',
  '{}',
  '00000000-0000-0000-0000-000000000000',
  true,
  'general',
  ARRAY[
    'How can you help me today?',
    'What are your capabilities?',
    'Can you assist me with my questions?'
  ]
),
(
  '22222222-2222-2222-2222-222222222222',
  'Code Helper',
  'A programming assistant that helps with coding questions, debugging, and development tasks.',
  'code-helper',
  'You are a programming assistant created by Nexiloop. You specialize in helping with coding questions, debugging, code reviews, and development tasks. Provide clear, practical solutions and explain your reasoning. Support multiple programming languages and best practices.',
  '{}',
  '00000000-0000-0000-0000-000000000000',
  true,
  'programming',
  ARRAY[
    'Help me debug this code',
    'What is the best way to implement this feature?',
    'Can you review my code for improvements?'
  ]
),
(
  '33333333-3333-3333-3333-333333333333',
  'Movie Finder',
  'Discover movies and TV shows with personalized recommendations and streaming links.',
  'movie-finder',
  'You are a movie and TV show expert created by Nexiloop. You help users discover new content, provide recommendations based on their preferences, and offer detailed information about movies and shows. You can search for specific titles, suggest similar content, and help users find what to watch next.',
  ARRAY['tmdbMovieSearch'],
  '00000000-0000-0000-0000-000000000000',
  true,
  'entertainment',
  ARRAY[
    'Recommend some good sci-fi movies',
    'Find information about a specific movie',
    'What are some popular TV shows to watch?'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- HELPFUL QUERIES
-- =============================================

/*
-- Get all public agents with ratings
SELECT 
  a.*,
  get_agent_rating_avg(a.id) as avg_rating,
  get_agent_usage_count(a.id) as usage_count
FROM agents a 
WHERE a.is_public = true 
ORDER BY a.created_at DESC;

-- Get user's agents
SELECT * FROM agents 
WHERE creator_id = auth.uid() 
ORDER BY created_at DESC;

-- Get agent usage statistics
SELECT 
  a.name,
  COUNT(au.id) as total_uses,
  COUNT(DISTINCT au.user_id) as unique_users,
  AVG(au.response_time_ms) as avg_response_time
FROM agents a
LEFT JOIN agent_usage au ON a.id = au.agent_id
GROUP BY a.id, a.name
ORDER BY total_uses DESC;

-- Get popular tools used
SELECT 
  unnest(tools_used) as tool_name,
  COUNT(*) as usage_count
FROM agent_usage 
WHERE tools_used IS NOT NULL 
GROUP BY tool_name 
ORDER BY usage_count DESC;
*/
