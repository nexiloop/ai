# Database Migration Instructions

## Issues
1. The agents table is missing a `slug` column (causing 400 errors - SQLSTATE 42703)
2. The agents table is missing `example_inputs` column (causing 500 errors in create-agent API)
3. Several other columns are missing that the application expects

## IMMEDIATE FIX - Run This Now

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `IMMEDIATE_FIX.sql`
4. Click "Run" to execute the script

### Step 2: Alternative Manual Commands
If you prefer to run commands individually, execute these in order:

```sql
-- Add all missing columns
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

-- Generate slugs for existing agents
UPDATE public.agents 
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9\s]', '', 'g')) || '-' || substring(id from 7 for 6)
WHERE slug IS NULL;

-- Make slug NOT NULL
ALTER TABLE public.agents 
ALTER COLUMN slug SET NOT NULL;

-- Add unique constraint
ALTER TABLE public.agents 
ADD CONSTRAINT agents_slug_unique UNIQUE (slug);
```

### Step 3: Add Missing Curated Agent
The frontend expects a "blog-draft" agent. Add it:

```sql
INSERT INTO public.agents (
    id, name, slug, description, system_prompt, creator_id, creator_name, 
    avatar_url, is_public, is_curated, tools, example_inputs, tags, category, 
    remixable, tools_enabled, max_steps
) VALUES (
    'agent_blog_draft',
    'Blog Draft Writer',
    'blog-draft',
    'Expert AI assistant for creating engaging blog drafts and content outlines',
    'You are a professional blog writer and content strategist. You specialize in creating compelling blog drafts, content outlines, and engaging articles.',
    (SELECT id FROM public.users WHERE email = 'system@nexiloop.com' LIMIT 1),
    'Nexiloop',
    null,
    true,
    true,
    ARRAY[]::TEXT[],
    ARRAY['Write a blog about AI trends', 'Create content outline', 'Draft article about productivity']::TEXT[],
    ARRAY['blogging', 'content', 'writing']::TEXT[],
    'Writing',
    false,
    true,
    8
) ON CONFLICT (id) DO NOTHING;
```

## What This Fixes
✅ Resolves 400 error: "column agents.slug does not exist"  
✅ Resolves 500 error: "Could not find the 'example_inputs' column"  
✅ Resolves null constraint violation for slug column  
✅ Adds the expected "blog-draft" curated agent  
✅ Adds all missing columns the create-agent API expects  

## Verification
After running the migration:
1. Try creating a new agent through the UI
2. Check that the "blog-draft" agent appears in curated agents
3. Verify no more 400/500 errors in the browser console

## Complete Schema Recreation (Optional)
If you want to start fresh with the complete schema, you can:
1. Drop the existing agents table
2. Run the updated `COMPLETE_AGENTS_SCHEMA.sql` file

**Warning**: This will delete all existing agent data!
