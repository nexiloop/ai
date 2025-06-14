-- Complete Agents Schema for Supabase PostgreSQL
-- This file contains all necessary tables and columns for the agent system

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table with all required columns
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- User profile info
    name TEXT,
    avatar_url TEXT,
    
    -- Usage tracking
    special_agent_count INTEGER DEFAULT 0,
    special_agent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    premium BOOLEAN DEFAULT FALSE,
    
    -- User preferences
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Create agents table
CREATE TABLE IF NOT EXISTS public.agents (
    id TEXT PRIMARY KEY DEFAULT 'agent_' || generate_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    
    -- Creator information
    creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
    max_steps INTEGER,
    mcp_config JSONB,
    
    -- Tool configuration
    tools TEXT[] DEFAULT ARRAY[]::TEXT[],
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT agents_name_length CHECK (length(name) >= 1 AND length(name) <= 100),
    CONSTRAINT agents_description_length CHECK (length(description) >= 1 AND length(description) <= 500),
    CONSTRAINT agents_system_prompt_length CHECK (length(system_prompt) >= 1),
    CONSTRAINT agents_slug_unique UNIQUE (slug)
);

-- Create chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id TEXT PRIMARY KEY DEFAULT 'chat_' || generate_random_uuid(),
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT chats_title_length CHECK (length(title) <= 200),
    CONSTRAINT chats_temperature_range CHECK (temperature >= 0 AND temperature <= 2),
    CONSTRAINT chats_max_tokens_range CHECK (max_tokens > 0 AND max_tokens <= 200000)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id TEXT PRIMARY KEY DEFAULT 'msg_' || generate_random_uuid(),
    chat_id TEXT REFERENCES public.chats(id) ON DELETE CASCADE,
    
    -- Message content
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    
    -- Message metadata
    model_provider TEXT,
    model_name TEXT,
    tokens_used INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT messages_content_not_empty CHECK (length(content) > 0)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
CREATE INDEX IF NOT EXISTS idx_agents_creator_id ON public.agents(creator_id);
CREATE INDEX IF NOT EXISTS idx_agents_is_public ON public.agents(is_public);
CREATE INDEX IF NOT EXISTS idx_agents_is_curated ON public.agents(is_curated);
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_agent_id ON public.chats(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON public.messages(chat_id);

-- Comments for documentation
COMMENT ON TABLE public.agents IS 'AI agents created by users';
COMMENT ON COLUMN public.agents.slug IS 'URL-friendly unique identifier for agent';
COMMENT ON COLUMN public.agents.is_curated IS 'Whether this is a featured/official agent';
COMMENT ON COLUMN public.agents.tools IS 'Array of enabled tool names for this agent';

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
    BEFORE UPDATE ON public.agents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_chats_updated_at ON public.chats;
CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON public.chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;
CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for agents
DROP POLICY IF EXISTS "Anyone can view public agents" ON public.agents;
CREATE POLICY "Anyone can view public agents" ON public.agents
    FOR SELECT USING (is_public = true OR creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can create agents" ON public.agents;
CREATE POLICY "Users can create agents" ON public.agents
    FOR INSERT WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own agents" ON public.agents;
CREATE POLICY "Users can update their own agents" ON public.agents
    FOR UPDATE USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own agents" ON public.agents;
CREATE POLICY "Users can delete their own agents" ON public.agents
    FOR DELETE USING (creator_id = auth.uid());

-- Create RLS policies for chats
DROP POLICY IF EXISTS "Users can view their own chats" ON public.chats;
CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create their own chats" ON public.chats;
CREATE POLICY "Users can create their own chats" ON public.chats
    FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own chats" ON public.chats;
CREATE POLICY "Users can update their own chats" ON public.chats
    FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete their own chats" ON public.chats;
CREATE POLICY "Users can delete their own chats" ON public.chats
    FOR DELETE USING (user_id = auth.uid());

-- Create RLS policies for messages
DROP POLICY IF EXISTS "Users can view messages from their chats" ON public.messages;
CREATE POLICY "Users can view messages from their chats" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can insert messages to their chats" ON public.messages;
CREATE POLICY "Users can insert messages to their chats" ON public.messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update messages in their chats" ON public.messages;
CREATE POLICY "Users can update messages in their chats" ON public.messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete messages from their chats" ON public.messages;
CREATE POLICY "Users can delete messages from their chats" ON public.messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.chats 
            WHERE chats.id = messages.chat_id 
            AND chats.user_id = auth.uid()
        )
    );

-- Insert default curated agents including blog-draft
INSERT INTO public.agents (
    id, name, slug, description, system_prompt, creator_id, creator_name, 
    avatar_url, is_public, is_curated, tools, example_inputs, tags, category, 
    remixable, tools_enabled, max_steps, model_preference, mcp_config
) VALUES 
(
    'agent_general',
    'General Assistant',
    'general-assistant',
    'A helpful AI assistant for general tasks and questions',
    'You are a helpful, harmless, and honest AI assistant created by Nexiloop. You provide accurate, helpful responses while being friendly and professional.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'Nexiloop',
    null,
    true,
    true,
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    ARRAY[]::TEXT[],
    'General',
    false,
    true,
    5,
    null,
    null
),
(
    'agent_code',
    'Code Helper',
    'code-helper',
    'Specialized AI assistant for programming and development tasks',
    'You are a programming assistant created by Nexiloop. You help with coding, debugging, code reviews, and technical questions. Provide clear, well-commented code examples and explanations.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'Nexiloop',
    null,
    true,
    true,
    ARRAY['terminal', 'file_handling']::TEXT[],
    ARRAY['Debug my code', 'Review this function', 'Write a Python script']::TEXT[],
    ARRAY['programming', 'development', 'coding']::TEXT[],
    'Programming',
    false,
    true,
    10,
    null,
    null
),
(
    'agent_writing',
    'Writing Assistant',
    'writing-assistant',
    'AI assistant specialized in writing, editing, and content creation',
    'You are a writing assistant created by Nexiloop. You help with writing, editing, proofreading, and content creation. Provide clear, engaging, and well-structured content.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'Nexiloop',
    null,
    true,
    true,
    ARRAY[]::TEXT[],
    ARRAY['Write a blog post', 'Edit this text', 'Create marketing copy']::TEXT[],
    ARRAY['writing', 'editing', 'content']::TEXT[],
    'Writing',
    false,
    true,
    5,
    null,
    null
),
(
    'agent_blog_draft',
    'Blog Draft Writer',
    'blog-draft',
    'Expert AI assistant for creating engaging blog drafts and content outlines',
    'You are a professional blog writer and content strategist created by Nexiloop. You specialize in creating compelling blog drafts, content outlines, and engaging articles. Focus on SEO-friendly content, clear structure, and reader engagement.',
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'Nexiloop',
    null,
    true,
    true,
    ARRAY[]::TEXT[],
    ARRAY['Write a blog about AI trends', 'Create content outline for tech blog', 'Draft article about productivity']::TEXT[],
    ARRAY['blogging', 'content', 'writing', 'seo']::TEXT[],
    'Writing',
    false,
    true,
    8,
    null,
    null
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    system_prompt = EXCLUDED.system_prompt,
    example_inputs = EXCLUDED.example_inputs,
    tags = EXCLUDED.tags,
    category = EXCLUDED.category,
    remixable = EXCLUDED.remixable,
    tools_enabled = EXCLUDED.tools_enabled,
    max_steps = EXCLUDED.max_steps,
    updated_at = NOW();

-- Create a system user for default agents if it doesn't exist
INSERT INTO public.users (id, email, name, created_at, updated_at)
VALUES (
    'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f',
    'system@nexiloop.com',
    'Nexiloop System',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Update the curated agents to use the system user ID
UPDATE public.agents 
SET creator_id = 'b8a5c8e4-7d6f-4c9b-a2e1-3f8b9c2d5e6f'
WHERE is_curated = true;
