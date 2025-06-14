-- Add missing column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS special_agent_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW();
