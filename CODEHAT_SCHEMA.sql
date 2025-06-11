-- CodeHat Extension Schema
-- Add these tables to your existing Supabase database

-- CodeHat Projects table
CREATE TABLE codehat_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  chat_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'building', 'completed', 'error')),
  files JSONB DEFAULT '[]'::jsonb, -- Array of file objects with name, content, type
  preview_url TEXT,
  deploy_url TEXT,
  framework TEXT, -- 'react', 'vue', 'vanilla', etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT codehat_projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT codehat_projects_chat_id_fkey FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
);

-- CodeHat Usage Tracking (for free user limits)
CREATE TABLE codehat_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  project_count_daily INTEGER DEFAULT 0,
  project_count_monthly INTEGER DEFAULT 0,
  daily_reset TIMESTAMPTZ,
  monthly_reset TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT codehat_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add RLS policies
ALTER TABLE codehat_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE codehat_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own projects
CREATE POLICY "Users can view their own codehat projects" ON codehat_projects 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codehat projects" ON codehat_projects 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codehat projects" ON codehat_projects 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own codehat projects" ON codehat_projects 
  FOR DELETE USING (auth.uid() = user_id);

-- Users can only see their own usage
CREATE POLICY "Users can view their own codehat usage" ON codehat_usage 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own codehat usage" ON codehat_usage 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own codehat usage" ON codehat_usage 
  FOR UPDATE USING (auth.uid() = user_id);
