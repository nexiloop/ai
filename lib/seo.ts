// Google Analytics 4 Configuration
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'

// Google Tag Manager Configuration
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'

// Microsoft Clarity Configuration
export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'xxxxxxxxx'

// Hotjar Configuration
export const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID || 'xxxxxxx'

// Google Search Console
export const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'your-verification-code'

// Bing Webmaster Tools
export const BING_SITE_VERIFICATION = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || 'your-verification-code'

// Yandex Webmaster
export const YANDEX_SITE_VERIFICATION = process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || 'your-verification-code'

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
  }
}

// SEO Configuration
export const SEO_CONFIG = {
  defaultTitle: 'nexiloop AI - Advanced AI Chat App with Multi-Model Support',
  titleTemplate: '%s | nexiloop AI',
  defaultDescription: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more. Features include image generation, background removal, and AI agents.',
  siteUrl: 'https://ai.nexiloop.com',
  defaultImage: '/nl.png',
  twitterHandle: '@nexiloop',
  facebookAppId: 'your-facebook-app-id',
  
  // Additional SEO settings
  canonical: 'https://ai.nexiloop.com',
  noindex: false,
  nofollow: false,
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai.nexiloop.com',
    siteName: 'nexiloop AI',
    title: 'nexiloop AI - Advanced AI Chat App with Multi-Model Support',
    description: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more.',
    images: [
      {
        url: '/nl.png',
        width: 1200,
        height: 630,
        alt: 'nexiloop AI - Advanced AI Chat App',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter
  twitter: {
    handle: '@nexiloop',
    site: '@nexiloop',
    cardType: 'summary_large_image',
  },
  
  // Additional meta tags
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'AI chat, artificial intelligence, multi-model AI, OpenAI, Claude, Gemini, Mistral, Ollama, local AI, chat assistant, machine learning, natural language processing, AI tools, productivity, open source AI, Nexiloop, CodeHat, image generation, background removal, AI agents, conversational AI, chatbot, AI assistant, GPT-4, language model, neural network, deep learning, automation, workflow optimization'
    },
    {
      name: 'author',
      content: 'Nexiloop'
    },
    {
      name: 'publisher',
      content: 'Nexiloop'
    },
    {
      name: 'robots',
      content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    },
    {
      name: 'googlebot',
      content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    },
    {
      name: 'bingbot',
      content: 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
    }
  ],
  
  // Additional link tags
  additionalLinkTags: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: 'anonymous'
    },
    {
      rel: 'dns-prefetch',
      href: 'https://www.google-analytics.com'
    },
    {
      rel: 'dns-prefetch',
      href: 'https://www.googletagmanager.com'
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'nexiloop AI RSS Feed',
      href: '/feed.xml'
    }
  ]
}

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track events
export const event = ({ action, category, label, value }: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}
