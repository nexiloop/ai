"use client"

import { useEffect, useState } from "react"
import Editor from "@monaco-editor/react"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { 
  FileCode, 
  FileCss, 
  FileJs, 
  FileText,
  Folder,
  CaretRight,
  CaretDown
} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'tsx':
    case 'jsx':
    case 'ts':
    case 'js':
      return <FileJs className="h-4 w-4 text-yellow-500" />
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCss className="h-4 w-4 text-blue-500" />
    case 'html':
      return <FileCode className="h-4 w-4 text-orange-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getMonacoLanguage = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return 'typescriptreact'
    case 'ts':
      return 'typescript'
    case 'js':
      return 'javascript'
    case 'css':
      return 'css'
    case 'scss':
    case 'sass':
      return 'scss'
    case 'html':
      return 'html'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    default:
      return 'plaintext'
  }
}

export function CodeEditor() {
  const { theme } = useTheme()
  const { files, selectedFile, setSelectedFile, updateFile } = useCodeHatStore()
  const [isFileTreeOpen, setIsFileTreeOpen] = useState(true)
  
  const currentFile = files.find(file => file.name === selectedFile)
  
  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      updateFile(selectedFile, value)
    }
  }

  // Set initial selected file if none selected
  useEffect(() => {
    if (files.length > 0 && !selectedFile) {
      setSelectedFile(files[0].name)
    }
  }, [files, selectedFile, setSelectedFile])

  return (
    <div className="flex h-full">
      {/* File Tree */}
      <motion.div 
        animate={{ width: isFileTreeOpen ? 256 : 48 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="border-r border-border bg-muted/30"
      >
        <div className="border-b border-border flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            className="gap-2 hover:scale-105 transition-transform"
          >
            <motion.div
              animate={{ rotate: isFileTreeOpen ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <Folder className="h-4 w-4" />
            </motion.div>
            {isFileTreeOpen && <span>Files</span>}
          </Button>
        </div>
        
        <AnimatePresence>
          {isFileTreeOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "calc(100% - 49px)" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ScrollArea className="h-full">
                <div className="p-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={file.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(file.name)}
                        className={cn(
                          "w-full justify-start gap-2 truncate hover:scale-105 transition-all",
                          selectedFile === file.name && "bg-accent scale-105"
                        )}
                      >
                        {getFileIcon(file.name)}
                        <span className="truncate">{file.name}</span>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Editor */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {currentFile ? (
            <motion.div
              key={currentFile.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {/* File tab */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="border-b border-border flex items-center px-4 py-2 bg-gradient-to-r from-muted/20 to-background"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {getFileIcon(currentFile.name)}
                </motion.div>
                <span className="ml-2 text-sm font-medium">{currentFile.name}</span>
              </motion.div>
              
              {/* Monaco Editor */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="h-[calc(100%-41px)]"
              >
                <Editor
                  language={getMonacoLanguage(currentFile.name)}
                  value={currentFile.content}
                  onChange={handleEditorChange}
                  theme={theme === 'dark' ? 'vs-dark' : 'light'}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    insertSpaces: true,
                    wordWrap: 'on',
                    contextmenu: false,
                    folding: true,
                    lineDecorationsWidth: 10,
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                  }}
                />
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="no-file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex h-full items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <FileCode className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                </motion.div>
                <h3 className="text-lg font-medium">Select a file</h3>
                <p className="text-muted-foreground text-sm">
                  Choose a file from the file tree to edit
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
