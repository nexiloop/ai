# nexiloop

[nexiloop.chat](https://nexiloop.chat)

**nexiloop** is the open-source interface for AI chat.

[![Chat with this repo](https://nexiloop.chat/button/github.svg)](https://nexiloop.chat/?agent=github/ibelick/nexiloop)

![nexiloop screenshot](./public/nl.png)

## Features

- **Multi-model support**: OpenAI, Mistral, Claude, Gemini, **Ollama (local models)**, **Cloudflare Workers AI**
- **🎨 Integrated Image Generation**: 
  - Natural language image generation directly in chat
  - Simply type "generate image of a sunset" or "create a picture of a cat"
  - 9 Cloudflare Workers AI image models (FLUX.1 Schnell, SDXL Lightning, Ideogram v2 Turbo, etc.)
  - Completely free with daily usage limits (5 images/day)
  - Configurable preferred image model in settings
- **✂️ AI Background Removal** (Beta):
  - Remove backgrounds from uploaded images instantly
  - AI-powered background removal using @imgly/background-removal
  - One-click processing with smooth animations
  - Auto-download processed images as PNG
  - Enable/disable in Settings → Model Preferences
- **Smart Chat Integration**: Auto-detects image generation requests in natural conversation
- File uploads with context-aware answers
- Clean, responsive UI with light/dark themes
- Built with Tailwind, shadcn/ui, and prompt-kit
- Fully open-source and self-hostable
- Customizable: user system prompt, multiple layout options, preferred image models
- **Local AI with Ollama**: Run models locally with automatic model detection

## Agent Features (WIP)

- `@agent` mentions
- Early tool and MCP integration for agent workflows
- Foundation for more powerful, customizable agents (more coming soon)

## Quick Start

### Option 1: With OpenAI (Cloud)

```bash
git clone https://github.com/ibelick/nexiloop.git
cd nexiloop
npm install
echo "OPENAI_API_KEY=your-key" > .env.local
npm run dev
```

### Option 2: With Ollama (Local)

```bash
# Install and start Ollama
curl -fsSL https://ollama.ai/install.sh | sh
ollama pull llama3.2  # or any model you prefer

# Clone and run nexiloop
git clone https://github.com/ibelick/nexiloop.git
cd nexiloop
npm install
npm run dev
```

nexiloop will automatically detect your local Ollama models!

### Option 3: Docker with Ollama

```bash
git clone https://github.com/ibelick/nexiloop.git
cd nexiloop
docker-compose -f docker-compose.ollama.yml up
```

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ibelick/nexiloop)

To unlock features like auth, file uploads, agents, and background removal, see [INSTALL.md](./INSTALL.md).

## CodeHat Workspace

CodeHat generates files and runs commands inside a local workspace.
By default the workspace root is the project directory, but you can
override it with the `WORKSPACE_ROOT` environment variable:

```bash
WORKSPACE_ROOT=/path/to/workspace npm run dev
```

All projects are saved under `codehat-projects` inside this workspace
and the interactive terminal operates from that directory.

## Image Generation

nexiloop includes integrated AI image generation powered by Cloudflare Workers AI:

### Features
- **Natural Language**: Simply type "generate image of a sunset" or "create a picture of a cat" in any chat
- **Multiple Models**: Choose from 9+ high-quality image models (FLUX.1 Schnell, SDXL Lightning, Ideogram v2, etc.)
- **Daily Limits**: 5 free image generations per day for all users
- **Inline Results**: Generated images appear directly in your chat conversation
- **Model Selection**: Configure your preferred image model in Settings → General → Model Preferences

### Supported Models
- **FLUX.1 Schnell** - Ultra-fast, exceptional quality (default)
- **SDXL Lightning** - Lightning-fast 1024px images  
- **Ideogram v2 Turbo** - Excellent text rendering
- **Stable Diffusion XL** - High-quality, versatile generation
- **DreamShaper 8** - Artistic and creative styles
- **OpenJourney v4** - Midjourney-style artistic generation
- **Hunyuan DiT** - High-quality transformer-based generation

### Setup
Add your Cloudflare credentials to `.env.local`:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

### Usage Examples
- "generate image of a futuristic city"
- "create a picture of a golden retriever in a park"  
- "make an illustration of a space station"
- "draw a painting of mountains at sunset"
- "show me a visualization of neural networks"
- "remove the background from this image" (when uploading images)

### Setup
Add your Cloudflare credentials to enable image generation:
```bash
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## Background Removal (Beta)

nexiloop includes AI-powered background removal for uploaded images using advanced machine learning models.

### Features
- **Instant Processing**: Remove backgrounds from images with one click
- **AI-Powered**: Uses state-of-the-art neural networks for precise background detection
- **High Quality**: Preserves fine details like hair, fur, and complex edges
- **Batch Support**: Process multiple images in your file uploads
- **Auto-Download**: Processed images automatically download as PNG with transparency
- **Smart Integration**: Appears automatically when you upload images (if enabled)

### How to Use

#### Enable Background Removal
1. Go to **Settings** → **General** → **Model Preferences**
2. Toggle **Background Removal** to **ON** (marked as Beta)
3. The feature will now appear when you upload images

#### Process Images
1. **Upload an Image**: Click the **+** button or drag and drop images into chat
2. **Remove Background**: Click the **"Remove BG"** button that appears below image uploads
3. **Download**: The processed image will automatically download to your device

#### Supported Formats
- **Input**: JPEG, PNG, WEBP, GIF, HEIC, HEIF
- **Output**: PNG with transparent background

### Technical Details
- **Model**: Uses ISNET FP16 for optimal balance of speed and quality
- **Processing**: Client-side processing (no data sent to external servers)
- **Performance**: Optimized for CPU processing with optional GPU acceleration
- **Privacy**: All processing happens locally in your browser

### Usage Examples
- Remove backgrounds from profile photos
- Create transparent product images for websites
- Prepare images for presentations or design work
- Extract subjects from complex backgrounds
- Create cutout effects for creative projects

### Database Setup
If you're self-hosting, run the background removal schema:

```sql
-- Run this in your Supabase SQL editor or database
-- See BACKGROUND_REMOVAL_SCHEMA.sql for the complete setup
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  background_removal_enabled BOOLEAN DEFAULT false,
  -- ... other columns
);
```

### Troubleshooting
- **Slow Processing**: Try smaller images (< 2MB) for faster results
- **Poor Quality**: Works best with clear subject-background separation
- **Browser Issues**: Requires modern browser with WebAssembly support
- **Memory Errors**: Close other tabs if processing fails on large images

## Built with

- [prompt-kit](https://prompt-kit.com/) — AI components
- [shadcn/ui](https://ui.shadcn.com) — core components
- [motion-primitives](https://motion-primitives.com) — animated components
- [vercel ai sdk](https://vercel.com/blog/introducing-the-vercel-ai-sdk) — model integration, AI features
- [supabase](https://supabase.com) — auth and storage

## Sponsors

<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

## License

Apache License 2.0

## Notes

This is a beta release. The codebase is evolving and may change.
