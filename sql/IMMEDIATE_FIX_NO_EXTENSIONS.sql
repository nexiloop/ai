-- IMMEDIATE FIX FOR MISSING COLUMNS (NO PROBLEMATIC EXTENSIONS)
-- Run this in Supabase SQL Editor to quickly fix missing columns

-- Add missing columns to agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS example_inputs TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS model_preference TEXT,
ADD COLUMN IF NOT EXISTS remixable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tools_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS max_steps INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS mcp_config JSONB;

-- Generate slugs for existing agents that don't have them
UPDATE public.agents 
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g')) || '-' || substr(md5(random()::text), 1, 6)
WHERE slug IS NULL;

-- Make slug NOT NULL
ALTER TABLE public.agents 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint to slug (drop first if exists)
ALTER TABLE public.agents 
DROP CONSTRAINT IF EXISTS agents_slug_unique;

ALTER TABLE public.agents 
ADD CONSTRAINT agents_slug_unique UNIQUE (slug);

-- Add the blog-draft agent that's expected by the frontend
INSERT INTO public.agents (
    id, name, slug, description, system_prompt, creator_id, creator_name, 
    avatar_url, is_public, is_curated, tools, example_inputs, tags, category, 
    remixable, tools_enabled, max_steps
) VALUES (
    'agent_blog_draft',
    'Blog Draft Writer',
    'blog-draft',
    'Expert AI assistant for creating engaging blog drafts and content outlines',
    'You are a professional blog writer and content strategist. You specialize in creating compelling blog drafts, content outlines, and engaging articles. Focus on SEO-friendly content, clear structure, and reader engagement.',
    (SELECT id FROM public.users WHERE email = 'system@nexiloop.com' LIMIT 1),
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
    8
) ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Immediate fix applied successfully!';
    RAISE NOTICE 'All missing columns added to agents table';
    RAISE NOTICE 'Blog-draft agent created';
    RAISE NOTICE 'No problematic extensions used';
END $$;
