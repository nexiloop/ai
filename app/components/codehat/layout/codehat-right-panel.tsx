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
          className="flex flex-1 overflow-hidden"
        >
          {/* File Explorer Sidebar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="border-r border-border flex-shrink-0 overflow-hidden"
          >
            <FileExplorer />
          </motion.div>

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Tab Bar */}
            <div className="border-b border-border bg-muted/20">
              <Tabs 
                value={currentMainTab} 
                onValueChange={(value) => setCurrentMainTab(value as "code" | "terminal" | "preview")}
                className="w-full"
              >
                <TabsList className="w-full justify-start rounded-none border-none bg-transparent p-0">
                  <TabsTrigger 
                    value="code" 
                    className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50 transition-all duration-200 px-4 py-2"
                  >
                    <Code className="h-4 w-4" />
                    <span className="text-sm">Code</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="terminal" 
                    className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50 transition-all duration-200 px-4 py-2"
                  >
                    <Terminal className="h-4 w-4" />
                    <span className="text-sm">Terminal</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="preview" 
                    className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50 transition-all duration-200 px-4 py-2"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Preview</span>
                  </TabsTrigger>
                </TabsList>

                {/* Current file indicator for code tab */}
                {selectedFile && currentMainTab === "code" && (
                  <div className="border-t border-border bg-muted/10 px-4 py-1">
                    <span className="text-xs text-muted-foreground">
                      {selectedFile}
                    </span>
                  </div>
                )}

                <TabsContent value="code" className="m-0 flex-1 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <CodeEditor />
                  </motion.div>
                </TabsContent>

                <TabsContent value="terminal" className="m-0 flex-1 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <CodeHatTerminalEnhanced />
                  </motion.div>
                </TabsContent>

                <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <AppPreview />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
