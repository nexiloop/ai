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
    <AnimatePresence>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "50%", opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-background border-l border-border flex h-full flex-col overflow-hidden"
      >
        {/* Panel Header */}
        <div className="border-b border-border flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            <h2 className="font-semibold">
              {currentProject?.title || "CodeHat"}
            </h2>
            <Badge variant="secondary" className="text-xs">
              Beta
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
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
              className="gap-2"
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
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Project Info Block */}
        {currentProject && (
          <div className="border-b border-border p-4">
            <ProjectInfo project={currentProject} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "code" | "preview")}
            className="flex h-full flex-col"
          >
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger 
                value="code" 
                className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Code className="h-4 w-4" />
                Code
                {files.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {files.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="gap-2 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="code" className="m-0 flex-1 overflow-hidden">
              {files.length > 0 ? (
                <CodeEditor />
              ) : (
                <div className="flex h-full items-center justify-center p-8">
                  <div className="text-center">
                    <FolderOpen className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                    <h3 className="text-lg font-medium">No files yet</h3>
                    <p className="text-muted-foreground text-sm">
                      Start a conversation to generate code files
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="m-0 flex-1 overflow-hidden">
              <AppPreview />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
