"use client"

import { ModelSelector } from "@/components/common/model-selector/base"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/prompt-kit/prompt-input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getModelInfo } from "@/lib/models"
import { cn } from "@/lib/utils"
import { ArrowUp, Stop, Code } from "@phosphor-icons/react"
import React, { useCallback, useState } from "react"
import { CodeHatPromptSystem } from "./codehat-prompt-system"
import { ButtonFileUpload } from "../chat-input/button-file-upload"
import { FileList } from "../chat-input/file-list"

type CodeHatChatInputProps = {
  value: string
  onValueChange: (value: string) => void
  onSend: () => void
  onSuggestion: (suggestion: string) => void
  isSubmitting?: boolean
  files: File[]
  onFileUpload: (files: File[]) => void
  onFileRemove: (file: File) => void
  hasSuggestions?: boolean
  onSelectModel: (model: string) => void
  selectedModel: string
  isUserAuthenticated: boolean
  stop: () => void
  status?: "streaming" | "ready" | "submitted" | "error"
  onSearchToggle?: (enabled: boolean, agentId: string | null) => void
}

export function CodeHatChatInput({
  value,
  onValueChange,
  onSend,
  onSuggestion,
  isSubmitting = false,
  files,
  onFileUpload,
  onFileRemove,
  hasSuggestions = false,
  onSelectModel,
  selectedModel,
  isUserAuthenticated,
  stop,
  status = "ready",
}: CodeHatChatInputProps) {
  const [isHovering, setIsHovering] = useState(false)
  
  const isStreaming = status === "streaming"
  const hasFiles = files.length > 0
  const canSubmit = value.trim().length > 0 && !isSubmitting
  const isOnlyWhitespace = (text: string) => !/[^\s]/.test(text)

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isSubmitting) {
        e.preventDefault()
        return
      }

      if (e.key === "Enter" && !e.shiftKey) {
        if (isOnlyWhitespace(value)) {
          return
        }
        e.preventDefault()
        onSend()
      }
    },
    [isSubmitting, onSend, value]
  )

  const handleSend = useCallback(() => {
    if (isSubmitting) return
    if (status === "streaming") {
      stop()
      return
    }
    onSend()
  }, [isSubmitting, onSend, status, stop])

  const modelInfo = getModelInfo(selectedModel)

  return (
    <div className="relative flex w-full flex-col gap-4">
      {hasSuggestions && (
        <CodeHatPromptSystem
          onValueChange={onValueChange}
          onSuggestion={onSuggestion}
          value={value}
        />
      )}

      <div className="relative order-2 px-2 pb-6 sm:pb-4 md:order-1">
        <PromptInput
          className="bg-popover relative z-10 p-0 pt-1 shadow-xs backdrop-blur-xl"
          maxHeight={200}
          value={value}
          onValueChange={onValueChange}
        >
          {/* CodeHat Indicator */}
          <div className="border-b border-border flex items-center gap-2 px-3 py-2">
            <Code className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">CodeHat Mode</span>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
            <div className="text-muted-foreground ml-auto text-xs">
              AI-powered app development
            </div>
          </div>

          <FileList files={files} onFileRemove={onFileRemove} />
          <PromptInputTextarea
            placeholder="Tell me what you want to build..."
            onKeyDown={handleKeyDown}
            className="min-h-[44px] pt-3 pl-4 text-base leading-[1.3] sm:text-base md:text-base"
          />
          <PromptInputActions className="mt-5 w-full justify-between px-3 pb-3">
            <div className="flex gap-2">
              <ButtonFileUpload
                onFileUpload={onFileUpload}
                isUserAuthenticated={isUserAuthenticated}
                model={selectedModel}
              />
              <ModelSelector
                selectedModelId={selectedModel}
                setSelectedModelId={onSelectModel}
                isUserAuthenticated={isUserAuthenticated}
                className="sm:px-2.5 sm:py-1.5 sm:text-xs"
              />
            </div>
            <PromptInputAction
              tooltip={status === "streaming" ? "Stop" : "Send"}
            >
              <Button
                size="sm"
                className="size-9 rounded-full transition-all duration-300 ease-out"
                disabled={!value || isSubmitting || isOnlyWhitespace(value)}
                type="button"
                variant="secondary"
                onClick={handleSend}
                aria-label={status === "streaming" ? "Stop" : "Send message"}
              >
                {status === "streaming" ? (
                  <Stop className="size-4" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </PromptInputAction>
          </PromptInputActions>
        </PromptInput>
      </div>
    </div>
  )
}
