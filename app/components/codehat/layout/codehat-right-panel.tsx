"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Code, 
  Eye, 
  X,
  Terminal,
  Files,
  Folder
} from "@phosphor-icons/react"
import { CodeEditor, AppPreview } from "@/app/components/codehat"
import { FileExplorer } from "@/app/components/codehat/file-explorer"
import { DownloadProjectButton } from "@/app/components/codehat/download-project-button"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import dynamic from "next/dynamic"

// Dynamic import to avoid SSR issues with terminal
const CodeHatTerminalEnhanced = dynamic(
  () => import("@/app/components/codehat/codehat-terminal-enhanced").then(mod => ({ default: mod.CodeHatTerminalEnhanced })),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
        <div className="text-gray-400 flex items-center gap-2">
          <Terminal size={20} />
          <span>Loading terminal...</span>
        </div>
      </div>
    )
  }
)

export function CodeHatRightPanel() {
  const { 
    isPanelOpen, 
    activeTab, 
    setActiveTab, 
    togglePanel,
    currentProject,
    files,
    selectedFile
  } = useCodeHatStore()
  
  const [currentMainTab, setCurrentMainTab] = useState<"code" | "terminal" | "preview">("code")

  if (!isPanelOpen) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="right-panel"
        initial={{ width: 0, opacity: 0, x: 50 }}
        animate={{ width: "50%", opacity: 1, x: 0 }}
        exit={{ width: 0, opacity: 0, x: 50 }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1],
          opacity: { duration: 0.3 },
          x: { duration: 0.4 }
        }}
        className="bg-background border-l border-border flex h-full flex-col overflow-hidden"
      >
        {/* IDE Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="border-b border-border flex items-center justify-between bg-muted/30 px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            <span className="text-sm font-medium">CodeHat IDE</span>
            {files.length > 1 && (
              <Badge variant="secondary" className="text-xs">
                {files.length} files
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <DownloadProjectButton />
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePanel}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* IDE Layout */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="flex flex-1 overflow-hidden items-center justify-center"
        >
          {/* Coming Soon Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-col items-center justify-center text-center p-8 space-y-4"
          >
            <div className="p-4 rounded-full bg-muted/50 border border-border">
              <Code className="h-12 w-12 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Coming Soon</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                CodeHat IDE features are currently in development. 
                Stay tuned for code editing, terminal, and preview capabilities!
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
