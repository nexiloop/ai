-- Migration: Add slug column to agents table
-- This migration adds the missing slug column to the agents table
-- and populates it with generated slugs for existing agents

-- Add the slug column to the agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Function to generate a slug from name and id
CREATE OR REPLACE FUNCTION generate_agent_slug(agent_name TEXT, agent_id TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Simple slug generation: lowercase name, replace spaces with hyphens, add part of ID
    RETURN lower(regexp_replace(agent_name, '[^a-zA-Z0-9\s]', '', 'g')) 
           || '-' || substring(agent_id from 7 for 6); -- Take 6 chars after 'agent_'
END;
$$ LANGUAGE plpgsql;

-- Update existing agents with generated slugs
UPDATE public.agents 
SET slug = generate_agent_slug(name, id)
WHERE slug IS NULL;

-- Make slug column NOT NULL after populating existing data
ALTER TABLE public.agents 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint to slug column
ALTER TABLE public.agents 
ADD CONSTRAINT agents_slug_unique UNIQUE (slug);

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_agent_slug(TEXT, TEXT);

-- Create index on slug for better performance
CREATE INDEX IF NOT EXISTS idx_agents_slug ON public.agents(slug);
