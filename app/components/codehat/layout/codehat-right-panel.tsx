"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Code, 
  Eye, 
  Download, 
  Rocket, 
  FolderOpen,
  X 
} from "@phosphor-icons/react"
import { CodeEditor, AppPreview } from "@/app/components/codehat"
import { ProjectInfo } from "@/app/components/codehat/project-info"
import { AnimatePresence, motion } from "motion/react"

export function CodeHatRightPanel() {
  const { 
    isPanelOpen, 
    activeTab, 
    setActiveTab, 
    togglePanel,
    currentProject,
    files 
  } = useCodeHatStore()

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
          ease: [0.23, 1, 0.32, 1], // Custom easing for smooth feel
          opacity: { duration: 0.3 },
          x: { duration: 0.4 }
        }}
        className="bg-background border-l border-border flex h-full flex-col overflow-hidden backdrop-blur-sm"
      >
        {/* Panel Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="border-b border-border flex items-center justify-between p-4 bg-gradient-to-r from-background to-muted/30"
        >
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
            >
              <Code className="h-5 w-5 text-primary" />
            </motion.div>
            <h2 className="font-semibold">
              {currentProject?.title || "CodeHat"}
            </h2>
            <Badge variant="secondary" className="text-xs animate-pulse">
              Beta
            </Badge>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:scale-105 transition-transform"
              disabled
            >
              <Download className="h-4 w-4" />
              Download
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:scale-105 transition-transform"
              disabled
            >
              <Rocket className="h-4 w-4" />
              Deploy
              <Badge variant="secondary" className="text-xs">
                Soon
              </Badge>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePanel}
              className="hover:scale-110 transition-transform"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Project Info Block */}
        {currentProject && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="border-b border-border p-4 bg-gradient-to-r from-muted/20 to-background"
          >
            <ProjectInfo project={currentProject} />
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="flex-1 overflow-hidden"
        >
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "code" | "preview")}
            className="flex h-full flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger 
                value="code" 
                className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Code
                  {files.length > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                    >
                      <Badge variant="secondary" className="ml-1 text-xs bg-primary/20">
                        {files.length}
                      </Badge>
                    </motion.div>
                  )}
                </motion.div>
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent hover:bg-muted/50 transition-all duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </motion.div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="m-0 flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {files.length > 0 ? (
                  <motion.div
                    key="code-editor"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <CodeEditor />
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-files"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="flex h-full items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          rotateY: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FolderOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                      </motion.div>
                      <h3 className="text-lg font-medium mb-2">No files yet</h3>
                      <p className="text-muted-foreground text-sm">
                        Start a conversation to generate code files
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <AppPreview />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
