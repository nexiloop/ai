-- Add created_by_nexiloop column to agents table
-- This tracks whether the agent should be displayed as created by Nexiloop
-- while maintaining proper foreign key relationships with the actual user

ALTER TABLE agents 
ADD created_by_nexiloop BOOLEAN DEFAULT false;

-- Add index for faster queries
CREATE INDEX idx_agents_created_by_nexiloop ON agents(created_by_nexiloop);

-- Update existing agents to show as created by Nexiloop by default
-- (optional - you can run this if you want existing agents to show Nexiloop branding)
-- UPDATE agents SET created_by_nexiloop = true WHERE created_by_nexiloop IS NULL;
