# 🐳 Docker Setup - Containerize Your AI Dreams!

> **Get this app running in containers faster than you can say "Docker compose up"!**

## 🚀 Quick Start (Zero to Hero)

**Want to run everything in containers?** We got you covered!

```bash
# Development setup (the easy way)
docker-compose up -d

# With Ollama for local AI models (the cool way)  
docker-compose -f docker-compose.ollama.yml up -d

# Production ready (the pro way)
docker-compose -f docker-compose.prod.yml up -d
```

**That's it!** 🎉 Your app is now running in containers!

## 📁 What's In Here?

```
🐳 docker/
├── 🐳 docker-compose.yml         # Main development setup
├── 🤖 docker-compose.ollama.yml  # With local AI models
├── 🏭 docker-compose.prod.yml    # Production configuration
├── 📋 Dockerfile                 # Main app container
├── 🔧 Dockerfile.ollama          # Ollama container setup
└── 📖 README.md                  # You are here!
```

## 🛠️ Configuration Options

### 🔧 Development Setup

**Perfect for local development:**

```yaml
# Basic setup with hot reload
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
```

### 🤖 With Ollama (Local AI Models)

**Want to run AI models locally?** This setup includes Ollama for privacy and speed:

```bash
# Start everything including Ollama
docker-compose -f docker-compose.ollama.yml up -d

# Pull some models
docker exec -it ollama ollama pull llama2
docker exec -it ollama ollama pull codellama
```

### 🏭 Production Ready

**Going live?** Use the production configuration:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Environment Variables

**Set these up in your `.env` file:**

```bash
# Essential stuff
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE=your_service_role

# AI API Keys (get the good stuff)
OPENAI_API_KEY=sk-your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

# For Ollama setup
OLLAMA_BASE_URL=http://ollama:11434
```

## 🎯 Common Commands

```bash
# Start everything
docker-compose up -d

# View logs (see what's happening)
docker-compose logs -f

# Stop everything
docker-compose down

# Rebuild and restart (when you change something)
docker-compose up --build -d

# Check what's running
docker-compose ps

# Access the app container
docker-compose exec app bash

# Clean up everything (nuclear option)
docker-compose down -v --rmi all
```

## 🐛 Troubleshooting

**Something not working?** Here are the most common fixes:

### 🔄 Port Already in Use
```bash
# Find what's using port 3000
lsof -i :3000

# Or use a different port
docker-compose up -d --env PORT=3001
```

### 📁 Volume Issues
```bash
# Reset volumes
docker-compose down -v
docker-compose up -d
```

### 🔧 Build Problems
```bash
# Clean rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### 🤖 Ollama Not Working
```bash
# Check Ollama status
docker-compose exec ollama ollama list

# Restart Ollama service
docker-compose restart ollama
```

## 🚀 Performance Tips

**Make it faster:**

1. **Use Build Cache** - Don't rebuild unnecessarily
2. **Volume Mounts** - For development, mount source code
3. **Multi-stage Builds** - Smaller production images
4. **Health Checks** - Monitor container health
5. **Resource Limits** - Set memory and CPU limits

## 🔐 Security Best Practices

**Keep it secure:**

- 🔒 Never commit `.env` files
- 🛡️ Use secrets for production
- 🚫 Don't run as root in containers
- 🔍 Scan images for vulnerabilities
- 🚪 Limit exposed ports

## 🌍 Deployment Options

### ☁️ Cloud Platforms

**Deploy anywhere:**

- **Vercel** - `vercel deploy`
- **Netlify** - Connect GitHub repo
- **Railway** - One-click deploy
- **DigitalOcean** - App Platform
- **AWS** - ECS or App Runner
- **Google Cloud** - Cloud Run

### 🏠 Self-Hosted

**Run on your own server:**

```bash
# On your server
git clone https://github.com/mohameodo/agentai
cd agentai/docker
cp .env.example .env
# Edit .env with your values
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Monitoring

**Keep an eye on things:**

```bash
# Resource usage
docker stats

# Container health
docker-compose ps

# Application logs
docker-compose logs app

# Database logs  
docker-compose logs db
```

## 🤝 Need Help?

**We're here for you:**

- 🐛 **Bug Reports:** [GitHub Issues](https://github.com/mohameodo/agentai/issues)
- 💬 **Questions:** [Discussions](https://github.com/mohameodo/agentai/discussions)
- 📖 **Documentation:** [Main Docs](../docs/)
- 🌟 **Feature Requests:** [Feature Template](https://github.com/mohameodo/agentai/issues/new?template=feature_request.md)

---

**Happy containerizing! 🐳✨**

*Made with 💜 by developers who actually use Docker*
