# 🔧 Scripts - Handy Tools for Developers

> **All the shell scripts that make your life easier!**

## 🚀 What's In Here?

```
📁 scripts/
├── 🎬 test-movie-search.sh      # Test TMDB movie search functionality
├── 🎨 test-image-generation.sh  # Test AI image generation
├── 🔧 setup.sh                  # One-click project setup
├── 🗄️ db-migrate.sh             # Database migration helper
├── 🐳 docker-build.sh           # Docker build automation
└── 📖 README.md                 # You are here!
```

## 🎯 Quick Commands

### 🎬 Test Movie Search
```bash
./scripts/test-movie-search.sh
```
**What it does:** Tests the TMDB integration to make sure movie search is working properly.

### 🎨 Test Image Generation  
```bash
./scripts/test-image-generation.sh
```
**What it does:** Verifies that AI image generation is working with your Cloudflare setup.

### 🔧 Full Project Setup
```bash
./scripts/setup.sh
```
**What it does:** 
- Installs dependencies
- Sets up environment file
- Runs database migrations
- Starts the development server

### 🗄️ Database Migration
```bash
./scripts/db-migrate.sh
```
**What it does:** Applies database migrations and sets up required tables.

### 🐳 Docker Build
```bash
./scripts/docker-build.sh
```
**What it does:** Builds and tags Docker images for different environments.

## 🛠️ Making Scripts Executable

**If you get permission errors:**

```bash
# Make all scripts executable
chmod +x scripts/*.sh

# Or make specific script executable
chmod +x scripts/setup.sh
```

## 🎯 Usage Examples

### 🚀 First Time Setup
```bash
# Clone the repo
git clone https://github.com/mohameodo/agentai
cd agentai

# Run the setup script
./scripts/setup.sh

# Follow the prompts and you're done!
```

### 🧪 Testing Features
```bash
# Test movie search
./scripts/test-movie-search.sh "The Matrix"

# Test image generation
./scripts/test-image-generation.sh "A beautiful sunset"
```

### 🔄 Development Workflow
```bash
# Start development
npm run dev

# In another terminal, test your changes
./scripts/test-movie-search.sh
./scripts/test-image-generation.sh
```

## 📝 Script Details

### 🎬 test-movie-search.sh
**Purpose:** Verify TMDB movie search functionality
**Requirements:** TMDB_API_KEY in environment
**Usage:** `./test-movie-search.sh [movie-title]`
**Example:** `./test-movie-search.sh "Inception"`

### 🎨 test-image-generation.sh  
**Purpose:** Test AI image generation pipeline
**Requirements:** Cloudflare credentials in environment
**Usage:** `./test-image-generation.sh [prompt]`
**Example:** `./test-image-generation.sh "A robot coding"`

### 🔧 setup.sh
**Purpose:** Complete project setup automation
**What it does:**
- Checks Node.js version
- Installs dependencies
- Creates environment file from template
- Prompts for API keys
- Runs database setup
- Starts development server

### 🗄️ db-migrate.sh
**Purpose:** Database migration management
**What it does:**
- Connects to Supabase
- Runs pending migrations
- Sets up required tables
- Seeds initial data

### 🐳 docker-build.sh
**Purpose:** Docker image building and management
**What it does:**
- Builds development image
- Builds production image
- Tags images appropriately
- Optionally pushes to registry

## 🔧 Environment Variables

**These scripts may need environment variables:**

```bash
# For movie search testing
TMDB_API_KEY=your_tmdb_key

# For image generation testing
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token

# For database operations
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE=your_service_role
```

## 🎨 Customizing Scripts

**Want to modify a script?** They're designed to be readable and hackable:

```bash
# Copy a script to customize it
cp scripts/setup.sh scripts/my-setup.sh

# Edit your copy
nano scripts/my-setup.sh

# Make it executable
chmod +x scripts/my-setup.sh
```

## 🐛 Troubleshooting

### **Permission Denied**
```bash
chmod +x scripts/script-name.sh
```

### **Command Not Found**
```bash
# Make sure you're in the project root
cd /path/to/agentai
./scripts/script-name.sh
```

### **Environment Variable Missing**
```bash
# Check your .env.local file
cat .env.local | grep VARIABLE_NAME

# Or set it temporarily
VARIABLE_NAME=value ./scripts/script-name.sh
```

## 🚀 Creating New Scripts

**Want to add your own script?**

```bash
# Create the script
touch scripts/my-script.sh

# Make it executable
chmod +x scripts/my-script.sh

# Add the shebang and your code
echo '#!/bin/bash' > scripts/my-script.sh
echo 'echo "Hello, World!"' >> scripts/my-script.sh
```

**Script Template:**
```bash
#!/bin/bash

# Script: my-awesome-script.sh
# Purpose: Does something amazing
# Usage: ./scripts/my-awesome-script.sh

set -e  # Exit on error

echo "🚀 Starting awesome script..."

# Your code here

echo "✅ Done!"
```

## 🤝 Contributing Scripts

**Have a useful script to share?**

1. Add it to the `scripts/` folder
2. Make sure it's well-documented
3. Add it to this README
4. Submit a pull request!

---

**Happy scripting! 🔧✨**

*Making repetitive tasks fun since 2025*
