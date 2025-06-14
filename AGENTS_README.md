# AI Agents System

This document explains the AI Agents system in the nexiloop AI application.

## Overview

The AI Agents system allows users to create, customize, and share AI assistants with specific personalities, capabilities, and tool access. Each agent has its own system prompt, tool configuration, and visibility settings.

## Features

### Agent Creation
- **Custom System Prompts**: Define how your agent behaves and responds
- **Tool Selection**: Choose which tools your agent can access during conversations
- **Avatar Customization**: Set a custom avatar URL for your agent
- **Visibility Control**: Make agents public for community use or keep them private
- **Curated Agents**: Featured agents created by Nexiloop for common use cases

### Agent Management
- **Edit Agents**: Modify your agent's settings, prompt, and tools
- **Delete Agents**: Remove agents you no longer need
- **My Agents**: View and manage all your created agents in settings
- **Public Directory**: Browse and discover public agents created by the community

### Agent Usage
- **Direct Access**: Use agents via `/agents/{agent-id}` URLs
- **@ Mentions**: Reference agents in chat using @ mentions
- **Share Agents**: Share public agent URLs with others
- **Chat Integration**: Start conversations with any agent

## Database Schema

### Agents Table
```sql
CREATE TABLE public.agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    system_prompt TEXT NOT NULL,
    creator_id UUID REFERENCES public.users(id),
    creator_name TEXT,
    avatar_url TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    is_curated BOOLEAN DEFAULT FALSE,
    tools TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Available Tools
- `terminal`: Execute shell commands
- `file_handling`: Read, write, and manage files
- `image_generation`: Generate images using AI
- `background_removal`: Remove backgrounds from images
- `web_search`: Search the web for information
- `calculator`: Perform mathematical calculations
- `code_execution`: Execute code in various languages

## API Endpoints

### Create Agent
```
POST /api/create-agent
```

### Update Agent
```
PUT /api/update-agent
```

### Delete Agent
```
DELETE /api/update-agent?id={agent-id}
```

## Pages and Components

### Agent Pages
- `/agents` - Browse curated and user agents
- `/agents/browse` - Browse all public agents
- `/agents/{id}` - Use a specific agent
- `/agents/{id}/edit` - Edit an agent (owner only)

### Components
- `CreateAgentForm` - Create new agents
- `EditAgentForm` - Edit existing agents
- `AgentsPage` - Main agents listing
- `BrowseAgentsPage` - Public agents directory
- `MyAgentsSection` - User agent management in settings

## Usage Examples

### Creating an Agent
1. Navigate to the agents page
2. Click "Create Agent"
3. Fill in the form with name, description, and system prompt
4. Select tools your agent should have access to
5. Set visibility (public/private)
6. Submit to create the agent

### Using an Agent
1. Navigate to `/agents/{agent-id}` or click on an agent card
2. Start chatting with the agent
3. The agent will respond according to its system prompt and available tools

### Managing Your Agents
1. Go to Settings > General > My Agents
2. View all your created agents
3. Click edit to modify an agent
4. Click delete to remove an agent

## Security and Privacy

### Row Level Security (RLS)
- Users can only edit/delete their own agents
- Public agents are visible to all users
- Private agents are only visible to their creators

### Authentication
- Agent creation requires user authentication
- Agent editing requires ownership verification
- Public browsing doesn't require authentication

## Best Practices

### System Prompts
- Be specific about the agent's role and capabilities
- Include personality traits and communication style
- Mention any specific knowledge domains or expertise
- Keep prompts concise but comprehensive

### Tool Selection
- Only select tools that are relevant to your agent's purpose
- Consider security implications of tool access
- Test your agent with selected tools to ensure proper functionality

### Naming and Descriptions
- Use clear, descriptive names that indicate the agent's purpose
- Write engaging descriptions that help users understand what the agent does
- Include relevant keywords for discoverability

## Troubleshooting

### Common Issues
1. **Agent not found**: Check if the agent ID is correct and the agent is public
2. **Permission denied**: Ensure you're the creator of the agent you're trying to edit
3. **Database errors**: Check if all required fields are provided
4. **Tool errors**: Verify that selected tools are properly configured

### Error Messages
- "Authentication required": User must be logged in
- "Agent not found": Invalid agent ID or agent doesn't exist
- "You can only edit your own agents": User doesn't own the agent
- "Missing required fields": Required form fields are empty

## Development

### Adding New Tools
1. Add tool definition to the tools system
2. Update the ToolsSection component
3. Add tool handling in the chat system
4. Update documentation

### Database Migrations
When updating the agents schema, ensure:
1. Backward compatibility
2. Proper constraints and indexes
3. RLS policy updates
4. Data migration scripts if needed

## Support

For issues or questions about the agents system:
1. Check this documentation first
2. Review error messages for specific guidance
3. Check the browser console for detailed error information
4. Contact support with specific error details and steps to reproduce
