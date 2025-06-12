"use client"

import { Message as MessageType } from "@ai-sdk/react"
import React, { useState } from "react"
import { MessageAssistant } from "../chat/message-assistant"
import { MessageUser } from "../chat/message-user"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, FolderOpen, Copy, Check } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

type CodeHatMessageProps = {
  variant: MessageType["role"]
  children: string
  id: string
  attachments?: MessageType["experimental_attachments"]
  isLast?: boolean
  onDelete: (id: string) => void
  onEdit: (id: string, newText: string) => void
  onReload: () => void
  hasScrollAnchor?: boolean
  parts?: MessageType["parts"]
  status?: "streaming" | "ready" | "submitted" | "error"
  imageGenerationData?: any
}

export function CodeHatMessage({
  variant,
  children,
  id,
  attachments,
  isLast,
  onDelete,
  onEdit,
  onReload,
  hasScrollAnchor,
  parts,
  status,
  imageGenerationData,
}: CodeHatMessageProps) {
  const [copied, setCopied] = useState(false)
  const [copiedCodeBlock, setCopiedCodeBlock] = useState<number | null>(null)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 1000)
  }

  const copyCodeBlock = (code: string, index: number) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeBlock(index)
    setTimeout(() => setCopiedCodeBlock(null), 1000)
  }

  // Extract code blocks for enhanced display
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
  const codeBlocks: { language: string; code: string; index: number }[] = []
  let match
  let lastIndex = 0
  const textParts: { type: 'text' | 'code'; content: string; language?: string; index?: number }[] = []

  // Parse message content
  while ((match = codeBlockRegex.exec(children)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = children.substring(lastIndex, match.index)
      if (textContent.trim()) {
        textParts.push({ type: 'text', content: textContent })
      }
    }

    const language = match[1] || 'text'
    const code = match[2]
    const blockIndex = codeBlocks.length

    codeBlocks.push({ language, code, index: blockIndex })
    textParts.push({ type: 'code', content: code, language, index: blockIndex })

    lastIndex = match.index + match[0].length
  }

  // Add remaining text
  if (lastIndex < children.length) {
    const remainingText = children.substring(lastIndex)
    if (remainingText.trim()) {
      textParts.push({ type: 'text', content: remainingText })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* For user messages, use the standard component */}
      {variant === "user" ? (
        <MessageUser
          hasScrollAnchor={hasScrollAnchor}
          attachments={attachments}
        >
          {children}
        </MessageUser>
      ) : (
        /* Enhanced assistant message with code blocks */
        <div className="flex w-full flex-col space-y-4">
          {/* Regular message content for non-code parts */}
          {textParts.some(part => part.type === 'text') && (
            <MessageAssistant
              copied={copied}
              copyToClipboard={copyToClipboard}
              onReload={onReload}
              isLast={isLast}
              hasScrollAnchor={hasScrollAnchor}
              status={status}
              parts={parts}
              imageGenerationData={imageGenerationData}
            >
              {textParts.filter(part => part.type === 'text').map(part => part.content).join('\n')}
            </MessageAssistant>
          )}

          {/* Enhanced code blocks */}
          {textParts.filter(part => part.type === 'code').map((part, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              className="group relative"
            >
              {/* Code block header */}
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-border rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  <Badge variant="secondary" className="text-xs">
                    {part.language}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Generated Code
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCodeBlock(part.content, part.index!)}
                    className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {copiedCodeBlock === part.index ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Code content */}
              <div className="relative">
                <pre className={cn(
                  "p-4 bg-muted/30 border-x border-b border-border rounded-b-lg overflow-x-auto",
                  "text-sm font-mono leading-relaxed"
                )}>
                  <code className={`language-${part.language}`}>
                    {part.content}
                  </code>
                </pre>
                
                {/* Gradient overlay for long code */}
                {part.content.split('\n').length > 15 && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/30 to-transparent pointer-events-none rounded-b-lg" />
                )}
              </div>

              {/* File generation indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"
              >
                <FolderOpen className="h-3 w-3" />
                <span>This code will be available in the editor panel</span>
              </motion.div>
            </motion.div>
          ))}

          {/* Show code blocks summary */}
          {codeBlocks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="mt-6 p-3 bg-primary/5 border border-primary/20 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Code className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Generated {codeBlocks.length} code file{codeBlocks.length > 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Check the editor panel on the right to view and edit your generated code files.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}
