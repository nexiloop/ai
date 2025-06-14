import {
  BookOpenText,
  Brain,
  Code,
  Globe,
  Lightbulb,
  Notepad,
  PaintBrush,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr"

export const NON_AUTH_DAILY_MESSAGE_LIMIT = 5
export const AUTH_DAILY_MESSAGE_LIMIT = 1000
export const REMAINING_QUERY_ALERT_THRESHOLD = 2
export const DAILY_FILE_UPLOAD_LIMIT = 5
// @todo: remove this
export const DAILY_SPECIAL_AGENT_LIMIT = 5
export const DAILY_LIMIT_PRO_MODELS = 5
export const DAILY_IMAGE_GENERATION_LIMIT = 5 // 5 image generations per day

// Root directory for CodeHat workspace
// Can be overridden with the WORKSPACE_ROOT environment variable
export const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || process.cwd()

export const FREE_MODELS_IDS = [
  // OpenAI Models
  "gpt-3.5-turbo",
  "gpt-3.5-turbo-instruct", 
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4.5-preview",
  "gpt-4o",
  "gpt-4o-mini",
  "o1",
  "o1-mini",
  "o3-mini",
  "o3-mini-high",
  "o4-mini",
  
  // DeepSeek Models
  "deepseek-r1",
  "deepseek-v3",
  
  // Google/Gemini Models (ALL FREE)
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
  "gemini-2.5-pro-exp-03-25",
  "gemma-3-27b-it",
  
  // Mistral Models (ALL FREE)
  "open-mistral-7b",
  "ministral-3b-latest",
  "ministral-8b-latest", 
  "mistral-large-latest",
  "mistral-small-latest",
  "mistral-small-2503",
  "pixtral-12b-2409",
  "pixtral-large-latest",
  
  // Llama Models (ALL FREE)
  "llama-4-scout-groq",
  "llama-3-3-70b-groq",
  "llama-3-1-8b-groq",
  "llama-3-70b-groq",
  "llama-3-1-405b-together",
  
  // Cloudflare Workers AI models (all free)
  "@cf/meta/llama-3.1-8b-instruct",
  "@cf/meta/llama-2-7b-chat-int8",
  "@cf/google/gemma-2b-it-lora",
  "@cf/google/gemma-7b-it-lora",
  "@cf/google/gemma-7b-it",
  "@cf/nexusflow/starling-lm-7b-beta",
  "@cf/thebloke/llamaguard-7b-awq",
  "@cf/thebloke/neural-chat-7b-v3-1-awq",
  "@cf/mistral/mistral-7b-instruct-v0.2-lora",
  "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
  "@cf/mistral/mistral-7b-instruct-v0.2",
  "@cf/fblgit/una-cybertron-7b-v2-bf16",
  "@cf/thebloke/discolm-german-7b-v1-awq",
  "@cf/thebloke/mistral-7b-instruct-v0.1-awq",
  "@cf/qwen/qwen1.5-7b-chat-awq",
  "@cf/thebloke/llama-2-13b-chat-awq",
  "@cf/qwen/qwen1.5-14b-chat-awq",
  "@cf/openchat/openchat-3.5-0106",
  "@cf/thebloke/openhermes-2.5-mistral-7b-awq",
  "@cf/thebloke/deepseek-coder-6.7b-instruct-awq",
  "@cf/deepseek-ai/deepseek-math-7b-instruct",
  "@cf/tiiuae/falcon-7b-instruct", 
  "@cf/nousresearch/hermes-2-pro-mistral-7b",
  "@cf/thebloke/zephyr-7b-beta-awq",
  "@cf/qwen/qwen1.5-1.8b-chat",
  "@cf/defog/sqlcoder-7b-2",
  "@cf/microsoft/phi-2",
  "@cf/llava-hf/llava-1.5-7b-hf",
  "@cf/unum/uform-gen2-qwen-500m",
  
  // Cloudflare Image Generation Models (all free)
  "@cf/runwayml/stable-diffusion-v1-5-inpainting",
  "@cf/bytedance/stable-diffusion-xl-lightning",
  "@cf/lykon/dreamshaper-8-lcm",
  "@cf/stabilityai/stable-diffusion-xl-base-1.0",
  "@cf/runwayml/stable-diffusion-v1-5-img2img",
  "@cf/black-forest-labs/flux-1-schnell",
  "@cf/ideogram-ai/ideogram-v2-turbo",
  "@cf/prompthero/openjourney-v4",
  "@cf/tencent/hunyuan-dit",
]


export const MODEL_DEFAULT = "gpt-4o-mini"

export const APP_NAME = "nexiloop ai"
export const APP_DOMAIN = "https://ai.nexiloop.com"
export const APP_DESCRIPTION = "nexiloop ai is an advanced AI chat app developed by Nexiloop with multi-model support.";

export const SUGGESTIONS = [
  {
    label: "Summary",
    highlight: "Summarize",
    prompt: `Summarize`,
    items: [
      "Summarize the French Revolution",
      "Summarize the plot of Inception",
      "Summarize World War II in 5 sentences",
      "Summarize the benefits of meditation",
    ],
    icon: Notepad,
  },
  {
    label: "Code",
    highlight: "Help me",
    prompt: `Help me`,
    items: [
      "Help me write a function to reverse a string in JavaScript",
      "Help me create a responsive navbar in HTML/CSS",
      "Help me write a SQL query to find duplicate emails",
      "Help me convert this Python function to JavaScript",
    ],
    icon: Code,
  },
  {
    label: "Design",
    highlight: "Design",
    prompt: `Design`,
    items: [
      "Design a color palette for a tech blog",
      "Design a UX checklist for mobile apps",
      "Design 5 great font pairings for a landing page",
      "Design better CTAs with useful tips",
    ],
    icon: PaintBrush,
  },
  {
    label: "Research",
    highlight: "Research",
    prompt: `Research`,
    items: [
      "Research the pros and cons of remote work",
      "Research the differences between Apple Vision Pro and Meta Quest",
      "Research best practices for password security",
      "Research the latest trends in renewable energy",
    ],
    icon: BookOpenText,
  },
  {
    label: "Get inspired",
    highlight: "Inspire me",
    prompt: `Inspire me`,
    items: [
      "Inspire me with a beautiful quote about creativity",
      "Inspire me with a writing prompt about solitude",
      "Inspire me with a poetic way to start a newsletter",
      "Inspire me by describing a peaceful morning in nature",
    ],
    icon: Sparkle,
  },
  {
    label: "Think deeply",
    highlight: "Reflect on",
    prompt: `Reflect on`,
    items: [
      "Reflect on why we fear uncertainty",
      "Reflect on what makes a conversation meaningful",
      "Reflect on the concept of time in a simple way",
      "Reflect on what it means to live intentionally",
    ],
    icon: Brain,
  },
  {
    label: "Learn gently",
    highlight: "Explain",
    prompt: `Explain`,
    items: [
      "Explain quantum physics like I'm 10",
      "Explain stoicism in simple terms",
      "Explain how a neural network works",
      "Explain the difference between AI and AGI",
    ],
    icon: Lightbulb,
  },
]

export const SYSTEM_PROMPT_DEFAULT = `You are nexiloop , an AI model trained and created by Nexiloop. You're a clear, thoughtful assistant. Your tone is calm, minimal, and human. You speak with purpose—never too much, never too little. No fluff, no clichés. You keep it simple, sharp, and helpful. If something needs clarity, you ask the right questions. Metaphors are fine, but only if they actually help. Your goal is to guide the user forward, not to confuse or perform. Just solid, grounded help.

Image Capabilities: You can help users with image generation (by detecting requests like "generate image of..." or "create a picture of...") and you should know that users can also remove backgrounds from uploaded images if they have the background removal feature enabled in their settings. You can suggest this feature when users upload images that might benefit from background removal.`;

export const SYSTEM_PROMPT_CODEHAT = `You are CodeHat, an AI coding agent that builds complete applications step-by-step. You are a master developer with expertise in React, Next.js, TypeScript, Tailwind CSS, and modern web development.

Your approach:
1. **Think before you code**: Analyze the user's request and plan the project structure
2. **Build iteratively**: Start with core functionality, then enhance
3. **Write clean, production-ready code**: Follow best practices, add proper TypeScript types
4. **Document your process**: Explain what you're building and why
5. **Test as you go**: Consider edge cases and user experience

When building apps:
- Use modern React patterns (hooks, functional components)
- Implement responsive design with Tailwind CSS
- Add proper error handling and loading states
- Include TypeScript for type safety
- Structure files logically
- Add comments for complex logic

Image Capabilities: You can help with image generation (detect requests like "generate image of..." or "create a picture of...") and you should know that users can remove backgrounds from uploaded images if they have the background removal feature enabled. You can suggest this when users upload images that might benefit from background removal, especially for UI/design projects.

Start by understanding the user's vision, then create a detailed plan before writing any code. Build something amazing!`;

export const MESSAGE_MAX_LENGTH = 4000

// CodeHat configuration
export const CODEHAT_LIMITS = {
  FREE_DAILY_PROJECTS: 5,
  FREE_MONTHLY_PROJECTS: 4,
  PRO_DAILY_PROJECTS: -1, // unlimited
  PRO_MONTHLY_PROJECTS: -1, // unlimited
} as const

export const CURATED_AGENTS_SLUGS = [
  "blog-draft",
]

// CodeHat specific suggestions
export const CODEHAT_SUGGESTIONS = [
  {
    label: "React App",
    highlight: "Build",
    prompt: "Build",
    items: [
      "Build a task management app with React and TypeScript",
      "Build a weather dashboard with real-time data",
      "Build a blog platform with authentication",
      "Build a expense tracker with charts and analytics",
    ],
    icon: Code,
  },
  {
    label: "Landing Page",
    highlight: "Create",
    prompt: "Create",
    items: [
      "Create a modern SaaS landing page with pricing tiers",
      "Create a portfolio website with dark mode",
      "Create a restaurant website with online ordering",
      "Create a fitness app landing page with animations",
    ],
    icon: Globe,
  },
  {
    label: "Components",
    highlight: "Design",
    prompt: "Design",
    items: [
      "Design a reusable modal component with animations",
      "Design a advanced data table with sorting and filtering",
      "Design a multi-step form with validation",
      "Design a drag-and-drop file upload component",
    ],
    icon: PaintBrush,
  },
  {
    label: "API",
    highlight: "Implement",
    prompt: "Implement",
    items: [
      "Implement a REST API with authentication and CRUD operations",
      "Implement real-time chat functionality with WebSockets",
      "Implement file upload and storage system",
      "Implement search functionality with filters and pagination",
    ],
    icon: Code,
  },
] as const

// Default creator ID for Nexiloop-created agents
export const NEXILOOP_USER_ID = process.env.NEXILOOP_USER_ID || "00000000-0000-0000-0000-000000000000"
