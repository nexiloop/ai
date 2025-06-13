# Nexiloop AI - Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **My Agents Management**: Added comprehensive agent management system
  - New "My Agents" section in settings for viewing and managing created agents
  - "My Agents" option in user profile dropdown for quick access
  - Agent creation, editing, and deletion capabilities
  - Display of agent tools and descriptions in management interface

- **Agent Mentions (@) System**: Enhanced chat input with agent mention functionality
  - Type `@` in chat to see available agents
  - Search and filter agents by name
  - Seamless switching between agents during conversations
  - Support for both curated and user-created agents

- **vlop.fun Movie Streaming Integration**: Complete movie discovery and streaming platform
  - AI-powered movie and TV show search using TMDB integration
  - Smart movie recommendation engine
  - One-click streaming through vlop.fun platform
  - Movie search only appears when users mention movies in their queries
  - User preference toggle for enabling/disabling vlop.fun streaming
  - Search history and user favorites tracking
  - Advanced filtering by genre, language, and content ratings

- **Simplified Agent Creation**: Streamlined agent creation process
  - Removed complex MCP (Model Context Protocol) configurations
  - Focus on custom system prompts and tool selection
  - Default Nexiloop branding with option for user attribution
  - Clean, user-friendly interface for agent customization

### Enhanced
- **Settings Organization**: Improved settings layout and navigation
  - Better categorization of features and preferences
  - Enhanced user experience with intuitive grouping
  - Quick access to frequently used settings

- **Agent System**: Complete overhaul of agent architecture
  - Removed MCP dependencies for simplified management
  - Enhanced agent storage and retrieval system
  - Improved agent discovery and selection

### Fixed
- **Database Schema**: Updated database structure for better performance
  - Added proper indexing for agent queries
  - Enhanced Row Level Security (RLS) policies
  - Optimized agent filtering and search capabilities

### Security
- **Row Level Security**: Implemented comprehensive RLS policies
  - Users can only access their own agents and preferences
  - Secure agent creation and modification workflows
  - Protected movie search history and favorites

### Technical Improvements
- **SQL Schema Updates**: Added comprehensive database schemas
  - `AGENTS_SCHEMA.sql`: Updated agents table with new fields
  - `MOVIE_TMDB_SCHEMA.sql`: Complete movie functionality schema
  - Proper PostgreSQL syntax and optimization

- **Code Quality**: Improved codebase organization
  - Better TypeScript typing and error handling
  - Enhanced component modularity and reusability
  - Optimized API endpoints and data fetching

## [Previous Versions]

### Key Features Already Available
- **Multi-Model AI Support**: OpenAI, Anthropic, Google, Ollama, and more
- **Real-time Chat**: Fast, responsive AI conversations
- **Image Generation**: AI-powered image creation capabilities
- **Background Removal**: Advanced image editing tools
- **User Authentication**: Secure user accounts and data management
- **Responsive Design**: Mobile-friendly interface
- **Dark/Light Themes**: Customizable appearance options

---

## How to Use New Features

### Managing Your Agents
1. Go to **Settings** → **General** → **My Agents**
2. Click **Create Agent** to make a new custom agent
3. Configure system prompt and select tools
4. Choose whether to credit yourself or use Nexiloop branding

### Using Agent Mentions
1. In any chat, type `@` to see available agents
2. Search by name or scroll through the list
3. Select an agent to switch to it for the conversation
4. The selected agent will handle subsequent messages

### Movie Discovery with vlop.fun
1. Enable **Video Streaming & Movie Search** in **Settings** → **Features**
2. Ask about movies: "What are some good sci-fi movies?"
3. Get recommendations: "Show me popular thriller series"
4. Click "Watch on vlop.fun" to stream content instantly
5. Browse your search history and favorites in the interface

### Getting Started
1. Create your first custom agent in Settings
2. Try the @ mention system in chat
3. Ask about movies to test vlop.fun integration
4. Explore the enhanced settings for personalization

---

*For technical support or feature requests, please visit our [GitHub repository](https://github.com/nexiloop/agentai) or contact our support team.*
