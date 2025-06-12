import { loadAgent } from "@/lib/agents/load-agent"
import { SYSTEM_PROMPT_DEFAULT } from "@/lib/config"
import { loadMCPToolsFromURL } from "@/lib/mcp/load-mcp-from-url"
import { getAllModels } from "@/lib/models"
import { getProviderForModel } from "@/lib/openproviders/provider-map"
import { Provider } from "@/lib/user-keys"
import { Attachment } from "@ai-sdk/ui-utils"
import { Message as MessageAISDK, streamText, ToolSet } from "ai"
import {
  logUserMessage,
  storeAssistantMessage,
  trackSpecialAgentUsage,
  validateAndTrackUsage,
} from "./api"
import { cleanMessagesForTools } from "./utils"

export const maxDuration = 60

type ChatRequest = {
  messages: MessageAISDK[]
  chatId: string
  userId: string
  model: string
  isAuthenticated: boolean
  systemPrompt: string
  agentId?: string
  preferredImageModel?: string
}

// Image generation keywords and patterns
const IMAGE_GENERATION_PATTERNS = [
  /\b(generate|create|make|draw|paint|design|produce)\s+(?:an?\s+)?(image|picture|photo|artwork|illustration|drawing|painting)\b/i,
  /\b(image|picture|photo|artwork|illustration|drawing|painting)\s+(?:of|for|with|showing|depicting)\b/i,
  /\b(visualize|illustrate|depict|show\s+me)\b/i,
  /\b(text\s*to\s*image|t2i)\b/i,
]

function detectImageGenerationRequest(content: string): boolean {
  return IMAGE_GENERATION_PATTERNS.some(pattern => pattern.test(content))
}

async function handleImageGeneration(
  content: string, 
  userId: string, 
  isAuthenticated: boolean,
  chatId: string,
  supabase: any,
  preferredImageModel?: string
): Promise<Response> {
  try {
    // Extract the prompt from the message
    let prompt = content
    
    // Clean up the prompt by removing generation keywords
    prompt = prompt.replace(/\b(please\s+)?(generate|create|make|draw|paint|design|produce)\s+(?:an?\s+)?(image|picture|photo|artwork|illustration|drawing|painting)\s+(?:of|for|with|showing|depicting)?\s*/gi, '').trim()
    prompt = prompt.replace(/\b(visualize|illustrate|depict|show\s+me)\s*/gi, '').trim()
    
    if (!prompt) {
      prompt = content // Fallback to original content if cleaning removes everything
    }

    // Use user's preferred model or default
    const defaultImageModel = preferredImageModel || "@cf/black-forest-labs/flux-1-schnell"

    // Generate image using the existing API
    const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        model: defaultImageModel,
        userId,
        isAuthenticated,
      }),
    })

    const imageData = await imageResponse.json()

    if (!imageResponse.ok) {
      throw new Error(imageData.error || "Failed to generate image")
    }

    // Create a response message with the generated image
    const assistantMessage = `I've generated an image for you: "${prompt}"

![Generated Image](${imageData.imageUrl})

The image was created using Cloudflare's FLUX.1 Schnell model. You have ${imageData.remainingGenerations} image generations remaining today.`

    // Store the assistant message if we have supabase
    if (supabase) {
      await supabase.from("messages").insert({
        chat_id: chatId,
        role: "assistant", 
        content: assistantMessage,
        user_id: userId,
      })
    }

    // Return a streaming response that immediately provides the result
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the assistant message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'text',
          content: assistantMessage
        })}\n\n`))
        
        // End the stream
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Chat-Id': chatId,
      }
    })

  } catch (error) {
    console.error("Image generation error:", error)
    
    // Return error as assistant message
    const errorMessage = `I apologize, but I couldn't generate an image right now. ${(error as Error).message || 'Please try again later.'}`
    
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({
          type: 'text', 
          content: errorMessage
        })}\n\n`))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Chat-Id': chatId,
      }
    })
  }
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      chatId,
      userId,
      model,
      isAuthenticated,
      systemPrompt,
      agentId,
      preferredImageModel,
    } = (await req.json()) as ChatRequest

    if (!messages || !chatId || !userId) {
      return new Response(
        JSON.stringify({ error: "Error, missing information" }),
        { status: 400 }
      )
    }

    const supabase = await validateAndTrackUsage({
      userId,
      model,
      isAuthenticated,
    })

    const userMessage = messages[messages.length - 1]

    if (supabase && userMessage?.role === "user") {
      await logUserMessage({
        supabase,
        userId,
        chatId,
        content: userMessage.content,
        attachments: userMessage.experimental_attachments as Attachment[],
        model,
        isAuthenticated,
      })
    }

    // Check if this is an image generation request
    if (userMessage?.role === "user" && typeof userMessage.content === "string") {
      if (detectImageGenerationRequest(userMessage.content)) {
        return await handleImageGeneration(
          userMessage.content,
          userId,
          isAuthenticated,
          chatId,
          supabase,
          preferredImageModel
        )
      }
    }

    let agentConfig = null

    if (agentId) {
      agentConfig = await loadAgent(agentId)
    }

    const allModels = await getAllModels()
    const modelConfig = allModels.find((m) => m.id === model)

    if (!modelConfig || !modelConfig.apiSdk) {
      throw new Error(`Model ${model} not found`)
    }

    const effectiveSystemPrompt =
      agentConfig?.systemPrompt || systemPrompt || SYSTEM_PROMPT_DEFAULT

    let toolsToUse = undefined

    if (agentConfig?.mcpConfig) {
      const { tools } = await loadMCPToolsFromURL(agentConfig.mcpConfig.server)
      toolsToUse = tools
    } else if (agentConfig?.tools) {
      toolsToUse = agentConfig.tools
      if (supabase) {
        await trackSpecialAgentUsage(supabase, userId)
      }
    }

    // Clean messages when switching between agents with different tool capabilities
    const hasTools = !!toolsToUse && Object.keys(toolsToUse).length > 0
    const cleanedMessages = cleanMessagesForTools(messages, hasTools)

    let streamError: Error | null = null

    let apiKey: string | undefined
    if (isAuthenticated && userId) {
      const { getEffectiveApiKey } = await import("@/lib/user-keys")
      const provider = getProviderForModel(model)
      apiKey =
        (await getEffectiveApiKey(userId, provider as Provider)) || undefined
    }

    const result = streamText({
      model: modelConfig.apiSdk(apiKey),
      system: effectiveSystemPrompt,
      messages: cleanedMessages,
      tools: toolsToUse as ToolSet,
      maxSteps: 10,
      onError: (err: unknown) => {
        console.error("🛑 streamText error:", err)
        streamError = new Error(
          (err as { error?: string })?.error ||
            "AI generation failed. Please check your model or API key."
        )
      },

      onFinish: async ({ response }) => {
        if (supabase) {
          await storeAssistantMessage({
            supabase,
            chatId,
            messages:
              response.messages as unknown as import("@/app/types/api.types").Message[],
          })
        }
      },
    })

    if (streamError) {
      throw streamError
    }

    const originalResponse = result.toDataStreamResponse({
      sendReasoning: true,
      sendSources: true,
    })
    const headers = new Headers(originalResponse.headers)
    headers.set("X-Chat-Id", chatId)

    return new Response(originalResponse.body, {
      status: originalResponse.status,
      headers,
    })
  } catch (err: unknown) {
    console.error("Error in /api/chat:", err)
    // Return a structured error response if the error is a UsageLimitError.
    const error = err as { code?: string; message?: string }
    if (error.code === "DAILY_LIMIT_REACHED") {
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 403 }
      )
    }

    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    )
  }
}
