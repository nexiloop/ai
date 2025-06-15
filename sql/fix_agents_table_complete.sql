-- Complete Migration: Fix all missing columns in agents table
-- This migration adds all missing columns and fixes schema issues

-- First, add all missing columns to the agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS slug TEXT,
ADD COLUMN IF NOT EXISTS example_inputs TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS model_preference TEXT,
ADD COLUMN IF NOT EXISTS remixable BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tools_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS max_steps INTEGER,
ADD COLUMN IF NOT EXISTS mcp_config JSONB;

-- Function to generate a slug from name and id
CREATE OR REPLACE FUNCTION generate_agent_slug(agent_name TEXT, agent_id TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Generate slug: lowercase name, replace spaces/special chars with hyphens, add part of ID
    RETURN lower(regexp_replace(regexp_replace(agent_name, '[^a-zA-Z0-9\s]', '', 'g'), '\s+', '-', 'g')) 
           || '-' || substring(agent_id from 7 for 6); -- Take 6 chars after 'agent_'
END;
$$ LANGUAGE plpgsql;

-- Update existing agents with generated slugs and default values
UPDATE public.agents 
SET 
    slug = CASE 
        WHEN slug IS NULL THEN generate_agent_slug(name, id)
        ELSE slug 
    END,
    example_inputs = CASE 
        WHEN example_inputs IS NULL THEN ARRAY[]::TEXT[]
        ELSE example_inputs 
    END,
    tags = CASE 
        WHEN tags IS NULL THEN ARRAY[]::TEXT[]
        ELSE tags 
    END,
    remixable = CASE 
        WHEN remixable IS NULL THEN FALSE
        ELSE remixable 
    END,
    tools_enabled = CASE 
        WHEN tools_enabled IS NULL THEN TRUE
        ELSE tools_enabled 
    END,
    max_steps = CASE 
        WHEN max_steps IS NULL THEN 5
        ELSE max_steps 
    END
WHERE slug IS NULL 
   OR example_inputs IS NULL 
   OR tags IS NULL 
   OR remixable IS NULL 
   OR tools_enabled IS NULL 
   OR max_steps IS NULL;

-- Make slug column NOT NULL after populating existing data
ALTER TABLE public.agents 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint to slug column (drop first if exists)
ALTER TABLE public.agents 
DROP CONSTRAINT IF EXISTS agents_slug_unique;

ALTER TABLE public.agents 
ADD CONSTRAINT agents_slug_unique UNIQUE (slug);

-- Set default values for other columns
ALTER TABLE public.agents 
ALTER COLUMN example_inputs SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN tags SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN remixable SET DEFAULT FALSE,
ALTER COLUMN tools_enabled SET DEFAULT TRUE,
ALTER COLUMN max_steps SET DEFAULT 5;

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_agent_slug(TEXT, TEXT);

-- Create indexes for better performance
DROP INDEX IF EXISTS idx_agents_slug;
CREATE INDEX idx_agents_slug ON public.agents(slug);

DROP INDEX IF EXISTS idx_agents_creator_id;
CREATE INDEX idx_agents_creator_id ON public.agents(creator_id);

DROP INDEX IF EXISTS idx_agents_is_public;
CREATE INDEX idx_agents_is_public ON public.agents(is_public);

DROP INDEX IF EXISTS idx_agents_is_curated;
CREATE INDEX idx_agents_is_curated ON public.agents(is_curated);

-- Verify the schema by selecting a sample record
SELECT id, name, slug, example_inputs, tags, category, model_preference, remixable, tools_enabled, max_steps
FROM public.agents 
LIMIT 1;
