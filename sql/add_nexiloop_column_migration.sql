-- Add created_by_nexiloop column to agents table
-- This allows us to track whether an agent should be displayed as created by Nexiloop
-- while still maintaining database integrity with real user IDs

ALTER TABLE agents 
ADD COLUMN created_by_nexiloop BOOLEAN DEFAULT false NOT NULL;

-- Update existing agents if needed (optional)
-- UPDATE agents SET created_by_nexiloop = true WHERE creator_id IS NULL;

-- Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_created_by_nexiloop ON agents(created_by_nexiloop);

-- Add comment to document the purpose
COMMENT ON COLUMN agents.created_by_nexiloop IS 'Whether this agent should be displayed as created by Nexiloop in the UI';
