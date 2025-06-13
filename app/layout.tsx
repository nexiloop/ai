import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { PWAInstaller } from "@/app/components/pwa-installer"
import { ThemeBackground } from "@/app/components/theme-background"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AgentProvider } from "@/lib/agent-store/provider"
import { ChatsProvider } from "@/lib/chat-store/chats/provider"
import { ChatSessionProvider } from "@/lib/chat-store/session/provider"
import { APP_DESCRIPTION, APP_NAME } from "@/lib/config"
import { UserPreferencesProvider } from "@/lib/user-preference-store/provider"
import { UserProvider } from "@/lib/user-store/provider"
import { getUserProfile } from "@/lib/user/api"
import { ThemeProvider } from "next-themes"
import Script from "next/script"
import { LayoutClient } from "./layout-client"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: "nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support",
  manifest: '/manifest.json',
  metadataBase: new URL('https://nexiloop.chat'),
  keywords: [
    'AI chat',
    'artificial intelligence',
    'multi-model AI',
    'OpenAI',
    'Claude',
    'Gemini',
    'Mistral',
    'Ollama',
    'local AI',
    'chat assistant',
    'AI conversation',
    'machine learning',
    'natural language processing',
    'AI tools',
    'productivity',
    'open source AI',
    'Nexiloop',
    'CodeHat',
    'image generation',
    'background removal',
    'AI agents'
  ],
  authors: [{ name: 'Nexiloop', url: 'https://nexiloop.com' }],
  creator: 'Nexiloop',
  publisher: 'Nexiloop',
  category: 'Technology',
  classification: 'AI Software',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#151515' }
  ],
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192x192.png',
    shortcut: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://nexiloop.chat',
    siteName: 'nexiloop',
    title: 'nexiloop - Advanced AI Chat App with Multi-Model Support',
    description: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more. Features include image generation, background removal, and AI agents.',
    images: [
      {
        url: '/nl.png',
        width: 1200,
        height: 630,
        alt: 'nexiloop - Advanced AI Chat App',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@nexiloop',
    creator: '@nexiloop',
    title: 'nexiloop - Advanced AI Chat App with Multi-Model Support',
    description: 'nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more.',
    images: ['/nl.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://nexiloop.chat',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isDev = process.env.NODE_ENV === "development"
  const userProfile = await getUserProfile()

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "nexiloop",
              "description": "nexiloop AI is an advanced AI chat app developed by Nexiloop with multi-model support. Chat with OpenAI, Claude, Gemini, Mistral, Ollama and more. Features include image generation, background removal, and AI agents.",
              "url": "https://nexiloop.chat",
              "applicationCategory": "AI Chat Application",
              "operatingSystem": "Web Browser",
              "publisher": {
                "@type": "Organization",
                "name": "Nexiloop",
                "url": "https://nexiloop.com"
              },
              "author": {
                "@type": "Organization",
                "name": "Nexiloop",
                "url": "https://nexiloop.com"
              },
              "image": "https://nexiloop.chat/nl.png",
              "screenshot": "https://nexiloop.chat/nl.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1000"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "featureList": [
                "Multi-model AI support (OpenAI, Claude, Gemini, Mistral, Ollama)",
                "Image generation with Cloudflare Workers AI",
                "AI-powered background removal",
                "Local AI with Ollama integration",
                "AI agents and tool integration",
                "CodeHat workspace for development",
                "File uploads and context-aware answers",
                "Responsive design with light/dark themes",
                "Progressive Web App (PWA)",
                "Open source and self-hostable"
              ],
              "keywords": "AI chat, artificial intelligence, multi-model AI, OpenAI, Claude, Gemini, Mistral, Ollama, local AI, chat assistant, machine learning, natural language processing, AI tools, productivity, open source AI, Nexiloop, CodeHat, image generation, background removal, AI agents"
            })
          }}
        />
      </head>
      {!isDev ? (
        <Script
          async
          src="https://cloud.umami.is/script.js"
          data-website-id="c53ba79c-39f3-406e-a57e-5c732df61710"
        />
      ) : null}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWAInstaller />
        <LayoutClient />
        <UserProvider initialUser={userProfile}>
          <ChatsProvider userId={userProfile?.id}>
            <ChatSessionProvider>
              <AgentProvider userId={userProfile?.id}>
                <UserPreferencesProvider userId={userProfile?.id}>
                  <TooltipProvider delayDuration={200} skipDelayDuration={500}>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="light"
                      enableSystem
                      disableTransitionOnChange
                    >
                      <ThemeBackground />
                      <SidebarProvider defaultOpen>
                        <Toaster position="top-center" />
                        {children}
                      </SidebarProvider>
                    </ThemeProvider>
                  </TooltipProvider>
                </UserPreferencesProvider>
              </AgentProvider>
            </ChatSessionProvider>
          </ChatsProvider>
        </UserProvider>
      </body>
    </html>
  )
}
