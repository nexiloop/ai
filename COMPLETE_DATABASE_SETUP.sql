-- COMPLETE DATABASE SETUP FOR NEXILOOP AI AGENT SYSTEM
-- This file contains the complete database schema and setup
-- Run this entire file in Supabase SQL Editor to set up everything

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_crypto";

-- Drop existing tables if they exist (careful - this will delete data!)
-- Uncomment the lines below only if you want to start fresh
-- DROP TABLE IF EXISTS public.messages CASCADE;
-- DROP TABLE IF EXISTS public.chats CASCADE;
-- DROP TABLE IF EXISTS public.agents CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table with all required columns
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User profile info
    name TEXT,
    avatar_url TEXT,
    profile_image TEXT,
    
    -- Usage tracking
    special_agent_count INTEGER DEFAULT 0,
    special_agent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    premium BOOLEAN DEFAULT FALSE,
    daily_pro_message_count INTEGER DEFAULT 0,
    daily_pro_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User preferences
    preferences JSONB DEFAULT '{}'::jsonb,
    system_prompt TEXT
);

-- Create agents table with ALL required columns
CREATE TABLE IF NOT EXISTS public.agents (
    id TEXT PRIMARY KEY DEFAULT 'agent_' || encode(gen_random_bytes(6), 'hex'),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    
    -- Creator information
    creator_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    creator_name TEXT,
    
    -- Agent settings
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_curated BOOLEAN DEFAULT FALSE,
    remixable BOOLEAN DEFAULT FALSE,
    tools_enabled BOOLEAN DEFAULT FALSE,
    
    -- Additional agent metadata
    example_inputs TEXT[],
    tags TEXT[],
    category TEXT,
    model_preference TEXT,
    max_steps INTEGER DEFAULT 5,
    mcp_config JSONB,
    
    -- Tool configuration
    tools TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id TEXT PRIMARY KEY DEFAULT 'chat_' || encode(gen_random_bytes(8), 'hex'),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    agent_id TEXT REFERENCES public.agents(id) ON DELETE SET NULL,
    
    -- Chat metadata
    title TEXT,
    summary TEXT,
    
    -- Settings
    model_provider TEXT DEFAULT 'openai',
    model_name TEXT DEFAULT 'gpt-4o',
    temperature REAL DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 4000,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT 'msg_' || encode(gen_random_bytes(8), 'hex'),
    chat_id TEXT REFERENCES public.chats(id) ON DELETE CASCADE,
    
    -- Message content
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- Message metadata
    model_provider TEXT,
    model_name TEXT,
    tokens_used INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add constraints (with safe handling for existing constraints)
DO $$ 
BEGIN
    -- Add agents constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agents_name_length') THEN
        ALTER TABLE public.agents ADD CONSTRAINT agents_name_length 
            CHECK (length(name) >= 1 AND length(name) <= 100);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agents_description_length') THEN
        ALTER TABLE public.agents ADD CONSTRAINT agents_description_length 
            CHECK (length(description) >= 1 AND length(description) <= 500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agents_system_prompt_length') THEN
        ALTER TABLE public.agents ADD CONSTRAINT agents_system_prompt_length 
            CHECK (length(system_prompt) >= 1);
    END IF;

    -- Add chats constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chats_title_length') THEN
        ALTER TABLE public.chats ADD CONSTRAINT chats_title_length 
            CHECK (title IS NULL OR length(title) <= 200);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chats_temperature_range') THEN
        ALTER TABLE public.chats ADD CONSTRAINT chats_temperature_range 
            CHECK (temperature >= 0 AND temperature <= 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chats_max_tokens_range') THEN
        ALTER TABLE public.chats ADD CONSTRAINT chats_max_tokens_range 
            CHECK (max_tokens > 0 AND max_tokens <= 200000);
    END IF;

    -- Add messages constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'messages_content_not_empty') THEN
        ALTER TABLE public.messages ADD CONSTRAINT messages_content_not_empty 
            CHECK (length(content) > 0);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_creator_id ON public.agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON public.agents(is_public);
CREATE INDEX IF NOT EXISTS idx_agents_is_curated ON public.agents(is_curated);
CREATE INDEX IF NOT EXISTS idx_agents_category ON public.agents(category);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_agent_id ON public.chats(agent_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON public.chats(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create a system user for default agents
INSERT INTO public.users (
    id, 
    email, 
    name, 
    created_at, 
    updated_at
)
VALUES (
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'system@nexiloop.com',
    'Nexiloop System',
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- Insert default curated agents
INSERT INTO public.agents (
    id, 
    name, 
    slug, 
    description, 
    system_prompt, 
    creator_id, 
    avatar_url, 
    is_public, 
    is_curated, 
    remixable,
    tools_enabled,
    tools,
    example_inputs,
    category,
    max_steps
) VALUES 
(
    'agent_general',
    'General Assistant',
    'general-assistant',
    'A helpful AI assistant for general tasks and questions',
    'You are a helpful, harmless, and honest AI assistant created by Nexiloop. You provide accurate, helpful responses while being friendly and professional.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    null,
    true,
    true,
    false,
    false,
    ARRAY[]::TEXT[],
    ARRAY['What can you help me with today?', 'Explain quantum computing in simple terms', 'Help me plan my day']::TEXT[],
    'General',
    5
),
(
    'agent_code',
    'Code Helper',
    'code-helper',
    'Specialized AI assistant for programming and development tasks',
    'You are a programming assistant created by Nexiloop. You help with coding, debugging, code reviews, and technical questions. Provide clear, well-commented code examples and explanations.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    null,
    true,
    true,
    false,
    true,
    ARRAY['terminal', 'file_handling']::TEXT[],
    ARRAY['Debug my Python code', 'Write a React component', 'Explain this algorithm']::TEXT[],
    'Programming',
    10
),
(
    'agent_writing',
    'Writing Assistant',
    'writing-assistant',
    'AI assistant specialized in writing, editing, and content creation',
    'You are a writing assistant created by Nexiloop. You help with writing, editing, proofreading, and content creation. Provide clear, engaging, and well-structured content.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    null,
    true,
    true,
    false,
    false,
    ARRAY[]::TEXT[],
    ARRAY['Write a blog post about AI', 'Proofread my essay', 'Create a marketing email']::TEXT[],
    'Writing',
    5
),
(
    'agent_blog_draft',
    'Blog Draft Writer',
    'blog-draft',
    'Specialized assistant for creating engaging blog post drafts',
    'You are a blog writing specialist created by Nexiloop. You help create engaging, well-structured blog posts with compelling headlines, clear sections, and SEO-friendly content. Focus on readability and engagement.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    null,
    true,
    true,
    false,
    false,
    ARRAY[]::TEXT[],
    ARRAY['Write a blog post about the future of AI', 'Create a how-to guide for beginners', 'Draft a technical blog post']::TEXT[],
    'Writing',
    8
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    system_prompt = EXCLUDED.system_prompt,
    example_inputs = EXCLUDED.example_inputs,
    category = EXCLUDED.category,
    max_steps = EXCLUDED.max_steps,
    updated_at = NOW();

-- Set up Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Agents policies
CREATE POLICY "Anyone can view public agents" ON public.agents
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own agents" ON public.agents
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can create agents" ON public.agents
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users can update own agents" ON public.agents
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete own agents" ON public.agents
    FOR DELETE USING (auth.uid() = creator_id);

-- Chats policies
CREATE POLICY "Users can view own chats" ON public.chats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats" ON public.chats
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chats" ON public.chats
    FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view messages from own chats" ON public.messages
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.chats WHERE id = chat_id
        )
    );

CREATE POLICY "Users can create messages in own chats" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT user_id FROM public.chats WHERE id = chat_id
        )
    );

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;

-- Add helpful comments for documentation
COMMENT ON TABLE public.users IS 'User accounts and profiles';
COMMENT ON TABLE public.agents IS 'AI agents created by users';
COMMENT ON TABLE public.chats IS 'Chat conversations between users and agents';
COMMENT ON TABLE public.messages IS 'Individual messages within chats';

COMMENT ON COLUMN public.agents.slug IS 'URL-friendly unique identifier for agent';
COMMENT ON COLUMN public.agents.is_curated IS 'Whether this is a featured/official agent';
COMMENT ON COLUMN public.agents.tools IS 'Array of enabled tool names for this agent';
COMMENT ON COLUMN public.agents.example_inputs IS 'Sample prompts to help users get started';
COMMENT ON COLUMN public.agents.mcp_config IS 'Model Context Protocol configuration (JSON)';

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON public.agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON public.chats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to generate agent slugs
CREATE OR REPLACE FUNCTION public.generate_agent_slug(agent_name TEXT)
RETURNS TEXT AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 1;
BEGIN
    -- Create base slug from name
    base_slug := lower(regexp_replace(agent_name, '[^a-zA-Z0-9\s]', '', 'g'));
    base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
    base_slug := trim(base_slug, '-');
    
    -- Ensure slug is not empty
    IF base_slug = '' THEN
        base_slug := 'agent';
    END IF;
    
    -- Check if slug already exists and add counter if needed
    final_slug := base_slug;
    WHILE EXISTS (SELECT 1 FROM public.agents WHERE slug = final_slug) LOOP
        final_slug := base_slug || '-' || counter;
        counter := counter + 1;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Created tables: users, agents, chats, messages';
    RAISE NOTICE 'Created % curated agents', (SELECT COUNT(*) FROM public.agents WHERE is_curated = true);
    RAISE NOTICE 'All indexes, constraints, and RLS policies are in place';
END $$;
