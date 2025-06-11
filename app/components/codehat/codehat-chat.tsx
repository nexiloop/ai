"use client"

import { CodeHatChatInput } from "@/app/components/codehat/codehat-chat-input"
import { Conversation } from "@/app/components/chat/conversation"
import { useChatDraft } from "@/app/hooks/use-chat-draft"
import { useCodeHatProject } from "@/app/hooks/use-codehat-project"
import { toast } from "@/components/ui/toast"
import { useAgent } from "@/lib/agent-store/provider"
import { getOrCreateGuestUserId } from "@/lib/api"
import { useChats } from "@/lib/chat-store/chats/provider"
import { useMessages } from "@/lib/chat-store/messages/provider"
import { useChatSession } from "@/lib/chat-store/session/provider"
import {
  MESSAGE_MAX_LENGTH,
  MODEL_DEFAULT,
  SYSTEM_PROMPT_CODEHAT,
} from "@/lib/config"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Attachment } from "@/lib/file-handling"
import { API_ROUTE_CHAT } from "@/lib/routes"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { useUser } from "@/lib/user-store/provider"
import { cn } from "@/lib/utils"
import { useChat } from "@ai-sdk/react"
import { AnimatePresence, motion } from "motion/react"
import dynamic from "next/dynamic"
import { redirect, useSearchParams } from "next/navigation"
import { Suspense, useCallback, useEffect, useRef, useState } from "react"
import { useChatHandlers } from "../chat/use-chat-handlers"
import { useChatUtils } from "../chat/use-chat-utils"
import { useFileUpload } from "../chat/use-file-upload"

const FeedbackWidget = dynamic(
  () => import("../chat/feedback-widget").then((mod) => mod.FeedbackWidget),
  { ssr: false }
)

const DialogAuth = dynamic(
  () => import("../chat/dialog-auth").then((mod) => mod.DialogAuth),
  { ssr: false }
)

// Create a separate component that uses useSearchParams
function SearchParamsProvider({
  setInput,
}: {
  setInput: (input: string) => void
}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const prompt = searchParams.get("prompt")
    if (prompt) {
      setInput(prompt)
    }
  }, [searchParams, setInput])

  return null
}

export function CodeHatChat() {
  const { chatId } = useChatSession()
  const {
    createNewChat,
    getChatById,
    updateChatModel,
    isLoading: isChatsLoading,
  } = useChats()
  const currentChat = chatId ? getChatById(chatId) : null
  const { messages: initialMessages, cacheAndAddMessage } = useMessages()
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { preferences } = useUserPreferences()
  const [hasDialogAuth, setHasDialogAuth] = useState(false)
  const [searchAgentId, setSearchAgentId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const { currentProject, setCurrentProject } = useCodeHatStore()
  const { setFiles: updateFiles } = useCodeHatStore()
  const { createProject } = useCodeHatProject()
  
  const {
    files,
    setFiles,
    handleFileUploads,
    createOptimisticAttachments,
    cleanupOptimisticAttachments,
    handleFileUpload,
    handleFileRemove,
  } = useFileUpload()
  const [selectedModel, setSelectedModel] = useState(
    currentChat?.model || user?.preferred_model || MODEL_DEFAULT
  )
  
  // Use CodeHat system prompt instead of default
  const systemPrompt = SYSTEM_PROMPT_CODEHAT

  const hasSentFirstMessageRef = useRef(false)

  const isAuthenticated = !!user?.id

  const { draftValue, clearDraft } = useChatDraft(chatId)

  const {
    messages,
    input,
    handleSubmit,
    status,
    error,
    reload,
    stop,
    setMessages,
    setInput,
    append,
  } = useChat({
    api: API_ROUTE_CHAT,
    initialMessages,
    initialInput: draftValue,
    onFinish: async (message) => {
      // Store the assistant message in the cache
      await cacheAndAddMessage(message)
      
      // Process the message for file generation
      await processCodeHatMessage(message.content)
    },
  })

  const { checkLimitsAndNotify, ensureChatExists } = useChatUtils({
    isAuthenticated,
    chatId,
    messages,
    input,
    selectedModel,
    systemPrompt,
    selectedAgentId: null, // CodeHat doesn't use agents
    createNewChat,
    setHasDialogAuth,
  })

  const { handleInputChange, handleModelChange, handleDelete, handleEdit } =
    useChatHandlers({
      messages,
      setMessages,
      setInput,
      setSelectedModel,
      selectedModel,
      chatId,
      updateChatModel,
      user,
    })

  // Process AI messages for file generation
  const processCodeHatMessage = useCallback(async (content: string) => {
    if (!chatId || !user?.id) return

    // Look for code blocks in the message
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const matches = []
    let match

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text'
      const code = match[2]
      matches.push({ language, code })
    }

    if (matches.length === 0) return

    // Create project if it doesn't exist
    if (!currentProject) {
      const project = await createProject(chatId, {
        title: "New CodeHat Project",
        description: "Generated by CodeHat",
      })
      
      if (!project) return
    }

    // Extract file paths and content from the message
    const fileUpdates = extractFilesFromMessage(content)
    
    if (fileUpdates.length > 0) {
      // Update files with smooth animation
      updateFiles(fileUpdates)
      
      // Auto-open the right panel if it's closed
      const { isPanelOpen, setIsPanelOpen, setActiveTab } = useCodeHatStore.getState()
      if (!isPanelOpen) {
        setTimeout(() => {
          setIsPanelOpen(true)
          setActiveTab('code')
        }, 500) // Small delay for smooth transition
      }
      
      // Show success notification
      toast({
        title: `Generated ${fileUpdates.length} file${fileUpdates.length > 1 ? 's' : ''}`,
        description: "Your code is ready in the editor!",
        status: "success"
      })
    }
  }, [chatId, user?.id, currentProject, createProject, updateFiles])

  // Extract files from AI message content
  const extractFilesFromMessage = (content: string) => {
    const files: any[] = []
    
    // Look for file paths in the content
    const filePathRegex = /(?:File:|Create file|Update file)\s*[`"]?([^`"\n]+\.[a-zA-Z]+)[`"]?/gi
    const codeBlockRegex = /```(\w+)?\s*(?:\/\/\s*([^\n]+))?\n([\s\S]*?)```/g
    
    let match
    const codeBlocks = []
    
    // Extract all code blocks
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text'
      const possiblePath = match[2]
      const code = match[3]
      
      codeBlocks.push({ language, possiblePath, code })
    }
    
    // Try to match file paths with code blocks
    const pathMatches: string[] = []
    let pathMatch
    while ((pathMatch = filePathRegex.exec(content)) !== null) {
      pathMatches.push(pathMatch[1])
    }
    
    // Create files from code blocks
    codeBlocks.forEach((block, index) => {
      let filePath = block.possiblePath || pathMatches[index]
      
      if (!filePath) {
        // Generate a filename based on language
        const extension = getExtensionForLanguage(block.language)
        filePath = `file${index + 1}.${extension}`
      }
      
      files.push({
        id: `file-${Date.now()}-${index}`,
        name: filePath.split('/').pop() || filePath,
        path: filePath,
        content: block.code,
        language: block.language,
        type: 'file' as const
      })
    })
    
    return files
  }

  const getExtensionForLanguage = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      go: 'go',
      rust: 'rs',
      php: 'php',
      ruby: 'rb',
      swift: 'swift',
      kotlin: 'kt',
      sql: 'sql',
      xml: 'xml',
      yaml: 'yml',
      toml: 'toml',
      dockerfile: 'dockerfile',
      bash: 'sh',
      shell: 'sh',
      text: 'txt'
    }
    
    return extensions[language.toLowerCase()] || 'txt'
  }

  // when chatId is null, set messages to an empty array
  useEffect(() => {
    if (chatId === null) {
      setMessages([])
    }
  }, [chatId, setMessages])

  useEffect(() => {
    setHydrated(true)
  }, [])

  // handle errors
  useEffect(() => {
    if (error) {
      let errorMsg = "Something went wrong."
      try {
        const parsed = JSON.parse(error.message)
        errorMsg = parsed.error || errorMsg
      } catch {
        errorMsg = error.message || errorMsg
      }
      toast({
        title: errorMsg,
        status: "error",
      })
    }
  }, [error])

  const submit = async () => {
    setIsSubmitting(true)

    const uid = await getOrCreateGuestUserId(user)
    if (!uid) return

    const optimisticId = `optimistic-${Date.now().toString()}`
    const optimisticAttachments =
      files.length > 0 ? createOptimisticAttachments(files) : []

    const optimisticMessage = {
      id: optimisticId,
      content: input,
      role: "user" as const,
      createdAt: new Date(),
      experimental_attachments:
        optimisticAttachments.length > 0 ? optimisticAttachments : undefined,
    }

    setMessages((prev) => [...prev, optimisticMessage])
    setInput("")

    const submittedFiles = [...files]
    setFiles([])

    const allowed = await checkLimitsAndNotify(uid)
    if (!allowed) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      setIsSubmitting(false)
      return
    }

    const currentChatId = await ensureChatExists(uid)

    if (!currentChatId) {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      setIsSubmitting(false)
      return
    }

    const attachments = await handleFileUploads(uid, currentChatId)

    if (attachments && attachments.length > 0) {
      const updatedMessage = {
        ...optimisticMessage,
        experimental_attachments: attachments,
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === optimisticId ? updatedMessage : msg
        )
      )
    }

    try {
      const options = {
        body: {
          chatId: currentChatId,
          userId: uid,
          model: selectedModel,
          isAuthenticated,
          systemPrompt: systemPrompt,
        },
        experimental_attachments: attachments || undefined,
      }

      handleSubmit(undefined, options)
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
      cacheAndAddMessage(optimisticMessage)
      clearDraft()
      hasSentFirstMessageRef.current = true
    } catch {
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      cleanupOptimisticAttachments(optimisticMessage.experimental_attachments)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSuggestion = useCallback(
    async (suggestion: string) => {
      setIsSubmitting(true)
      const optimisticId = `optimistic-${Date.now().toString()}`
      const optimisticMessage = {
        id: optimisticId,
        content: suggestion,
        role: "user" as const,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, optimisticMessage])

      const uid = await getOrCreateGuestUserId(user)

      if (!uid) {
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const allowed = await checkLimitsAndNotify(uid)
      if (!allowed) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const currentChatId = await ensureChatExists(uid)

      if (!currentChatId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
        setIsSubmitting(false)
        return
      }

      const options = {
        body: {
          chatId: currentChatId,
          userId: uid,
          model: selectedModel,
          isAuthenticated,
          systemPrompt: systemPrompt,
        },
      }

      append(
        {
          role: "user",
          content: suggestion,
        },
        options
      )
      setMessages((prev) => prev.filter((msg) => msg.id !== optimisticId))
      setIsSubmitting(false)
    },
    [
      ensureChatExists,
      selectedModel,
      user,
      append,
      checkLimitsAndNotify,
      isAuthenticated,
      setMessages,
      systemPrompt,
    ]
  )

  const handleReload = async () => {
    const uid = await getOrCreateGuestUserId(user)
    if (!uid) {
      return
    }

    const options = {
      body: {
        chatId,
        userId: uid,
        model: selectedModel,
        isAuthenticated,
        systemPrompt: systemPrompt,
      },
    }

    reload(options)
  }

  // Handle search agent toggle (disabled for CodeHat)
  const handleSearchToggle = useCallback(
    (enabled: boolean, agentId: string | null) => {
      // CodeHat doesn't support search agents
      setSearchAgentId(null)
    },
    []
  )

  // not user chatId and no messages
  if (hydrated && chatId && !isChatsLoading && !currentChat) {
    return redirect("/codehat")
  }

  return (
    <div
      className={cn(
        "@container/main relative flex h-full flex-col items-center justify-end md:justify-center"
      )}
    >
      <DialogAuth open={hasDialogAuth} setOpen={setHasDialogAuth} />

      {/* Add Suspense boundary for SearchParamsProvider */}
      <Suspense>
        <SearchParamsProvider setInput={setInput} />
      </Suspense>

      <AnimatePresence initial={false} mode="popLayout">
        {!chatId && messages.length === 0 ? (
          <motion.div
            key="onboarding"
            className="absolute bottom-[60%] mx-auto max-w-[50rem] md:relative md:bottom-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout="position"
            layoutId="onboarding"
            transition={{
              layout: {
                duration: 0,
              },
            }}
          >
            {user?.display_name && (
              <p className="mb-2 text-center text-md text-muted-foreground">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user.display_name.split(' ')[0]}
              </p>
            )}
            <h1 className="mb-6 text-center text-3xl font-medium tracking-tight">
              What would you like me to build today?
            </h1>
          </motion.div>
        ) : (
          <Conversation
            key="conversation"
            messages={messages}
            status={status}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onReload={handleReload}
          />
        )}
      </AnimatePresence>
      <motion.div
        className={cn(
          "relative inset-x-0 bottom-0 z-50 mx-auto w-full max-w-3xl"
        )}
        layout="position"
        layoutId="chat-input-container"
        transition={{
          layout: {
            duration: messages.length === 1 ? 0.3 : 0,
          },
        }}
      >
        <CodeHatChatInput
          value={input}
          onSuggestion={handleSuggestion}
          onValueChange={handleInputChange}
          onSend={submit}
          isSubmitting={isSubmitting}
          files={files}
          onFileUpload={handleFileUpload}
          onFileRemove={handleFileRemove}
          hasSuggestions={
            preferences.promptSuggestions && !chatId && messages.length === 0
          }
          onSelectModel={handleModelChange}
          selectedModel={selectedModel}
          isUserAuthenticated={isAuthenticated}
          stop={stop}
          status={status}
          onSearchToggle={handleSearchToggle}
        />
      </motion.div>

      <FeedbackWidget authUserId={user?.id} />
    </div>
  )
}
