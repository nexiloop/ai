import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/prompt-kit/message"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { cn } from "@/lib/utils"
import type { Message as MessageAISDK } from "@ai-sdk/react"
import { ArrowClockwise, Check, Copy, ThumbsDown, ThumbsUp } from "@phosphor-icons/react"
import { useState } from "react"
import { toast } from "@/components/ui/toast"
import { getSources } from "./get-sources"
import { Reasoning } from "./reasoning"
import { SearchImages } from "./search-images"
import { SourcesList } from "./sources-list"
import { ToolInvocation } from "./tool-invocation"
import { GeneratedImage } from "./generated-image"
import { MovieSearchResults } from "./movie-search-results"

type MessageAssistantProps = {
  children: string
  isLast?: boolean
  hasScrollAnchor?: boolean
  copied?: boolean
  copyToClipboard?: () => void
  onReload?: () => void
  parts?: MessageAISDK["parts"]
  status?: "streaming" | "ready" | "submitted" | "error"
  imageGenerationData?: any
}

export function MessageAssistant({
  children,
  isLast,
  hasScrollAnchor,
  copied,
  copyToClipboard,
  onReload,
  parts,
  status,
  imageGenerationData,
}: MessageAssistantProps) {
  const { preferences } = useUserPreferences()
  const [feedbackGiven, setFeedbackGiven] = useState<'up' | 'down' | null>(null)
  
  const sources = getSources(parts)
  const handleThumbsUp = () => {
    setFeedbackGiven('up')
    toast({
      title: "Thanks for your feedback!",
      description: "This helps us improve the AI responses.",
      status: "success"
    })
    // TODO: Send feedback to analytics/database
  }

  const handleThumbsDown = () => {
    setFeedbackGiven('down')
    toast({
      title: "Feedback received",
      description: "We'll use this to improve future responses.",
      status: "info"
    })
    // TODO: Send feedback to analytics/database
  }

  const toolInvocationParts = parts?.filter(
    (part) => part.type === "tool-invocation"
  )
  const reasoningParts = parts?.find((part) => part.type === "reasoning")
  const contentNullOrEmpty = children === null || children === ""
  const isLastStreaming = status === "streaming" && isLast
  const searchImageResults =
    parts
      ?.filter(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation?.state === "result" &&
          part.toolInvocation?.toolName === "imageSearch" &&
          part.toolInvocation?.result?.content?.[0]?.type === "images"
      )
      .flatMap((part) =>
        part.type === "tool-invocation" &&
        part.toolInvocation?.state === "result" &&
        part.toolInvocation?.toolName === "imageSearch" &&
        part.toolInvocation?.result?.content?.[0]?.type === "images"
          ? (part.toolInvocation?.result?.content?.[0]?.results ?? [])
          : []
      ) ?? []

  const movieSearchResults =
    parts
      ?.filter(
        (part) =>
          part.type === "tool-invocation" &&
          part.toolInvocation?.state === "result" &&
          part.toolInvocation?.toolName === "tmdbMovieSearch" &&
          part.toolInvocation?.result?.content?.[0]?.type === "movies"
      )
      .flatMap((part) =>
        part.type === "tool-invocation" &&
        part.toolInvocation?.state === "result" &&
        part.toolInvocation?.toolName === "tmdbMovieSearch" &&
        part.toolInvocation?.result?.content?.[0]?.type === "movies"
          ? {
              results: part.toolInvocation?.result?.content?.[0]?.results ?? [],
              query: part.toolInvocation?.result?.content?.[0]?.query ?? "",
              totalResults: part.toolInvocation?.result?.content?.[0]?.totalResults ?? 0
            }
          : null
      )
      .filter(Boolean)[0] ?? null

  return (
    <Message
      className={cn(
        "group flex w-full max-w-3xl flex-1 items-start gap-4 px-6 pb-2",
        hasScrollAnchor && "min-h-scroll-anchor"
      )}
    >
      <div className={cn("flex min-w-full flex-col gap-2", isLast && "pb-8")}>
        {reasoningParts && reasoningParts.reasoning && (
          <Reasoning reasoning={reasoningParts.reasoning} />
        )}

        {toolInvocationParts &&
          toolInvocationParts.length > 0 &&
          preferences.showToolInvocations && (
            <ToolInvocation toolInvocations={toolInvocationParts} />
          )}

        {searchImageResults.length > 0 && (
          <SearchImages results={searchImageResults} />
        )}

        {movieSearchResults && movieSearchResults.results.length > 0 && (
          <MovieSearchResults 
            results={movieSearchResults.results}
            query={movieSearchResults.query}
            totalResults={movieSearchResults.totalResults}
          />
        )}

        {contentNullOrEmpty ? null : (
          <MessageContent
            className={cn(
              "prose dark:prose-invert relative min-w-full bg-transparent p-0",
              "prose-h1:scroll-m-20 prose-h1:text-2xl prose-h1:font-semibold prose-h2:mt-8 prose-h2:scroll-m-20 prose-h2:text-xl prose-h2:mb-3 prose-h2:font-medium prose-h3:scroll-m-20 prose-h3:text-base prose-h3:font-medium prose-h4:scroll-m-20 prose-h5:scroll-m-20 prose-h6:scroll-m-20 prose-strong:font-medium prose-table:block prose-table:overflow-y-auto"
            )}
            markdown={true}
          >
            {children}
          </MessageContent>
        )}

        {imageGenerationData && (
          <GeneratedImage
            imageUrl={imageGenerationData.imageUrl}
            prompt={imageGenerationData.prompt}
            model={imageGenerationData.model}
            remainingGenerations={imageGenerationData.remainingGenerations}
            className="mt-4"
          />
        )}

        {sources && sources.length > 0 && <SourcesList sources={sources} />}

        {Boolean(isLastStreaming || contentNullOrEmpty) ? null : (
          <MessageActions
            className={cn(
              "-ml-2 flex gap-0 transition-opacity duration-200",
              // Show on hover for larger screens, always visible on smaller screens
              "opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            )}
          >
            <MessageAction
              tooltip={copied ? "Copied!" : "Copy text"}
              side="bottom"
              delayDuration={0}
            >
              <button
                className="hover:bg-accent/60 text-muted-foreground hover:text-foreground flex size-7.5 items-center justify-center rounded-full bg-transparent transition"
                aria-label="Copy text"
                onClick={copyToClipboard}
                type="button"
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </MessageAction>
            <MessageAction tooltip="Regenerate" side="bottom" delayDuration={0}>
              <button
                className="hover:bg-accent/60 text-muted-foreground hover:text-foreground flex size-7.5 items-center justify-center rounded-full bg-transparent transition"
                aria-label="Regenerate"
                onClick={onReload}
                type="button"
              >
                <ArrowClockwise className="size-4" />
              </button>
            </MessageAction>
            <MessageAction tooltip="Good response" side="bottom" delayDuration={0}>
              <button
                className={cn(
                  "hover:bg-accent/60 text-muted-foreground flex size-7.5 items-center justify-center rounded-full bg-transparent transition",
                  feedbackGiven === 'up' 
                    ? "text-green-600 bg-green-100/50" 
                    : "hover:text-green-600"
                )}
                aria-label="Good response"
                onClick={handleThumbsUp}
                type="button"
                disabled={feedbackGiven !== null}
              >
                <ThumbsUp className="size-4" />
              </button>
            </MessageAction>
            <MessageAction tooltip="Bad response" side="bottom" delayDuration={0}>
              <button
                className={cn(
                  "hover:bg-accent/60 text-muted-foreground flex size-7.5 items-center justify-center rounded-full bg-transparent transition",
                  feedbackGiven === 'down' 
                    ? "text-red-600 bg-red-100/50" 
                    : "hover:text-red-600"
                )}
                aria-label="Bad response"
                onClick={handleThumbsDown}
                type="button"
                disabled={feedbackGiven !== null}
              >
                <ThumbsDown className="size-4" />
              </button>
            </MessageAction>
          </MessageActions>
        )}
      </div>
    </Message>
  )
}
