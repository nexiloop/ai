"use client"

import Editor from "@monaco-editor/react"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { FileCode } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "motion/react"

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
  const { files, selectedFile, updateFile } = useCodeHatStore()
  
  const currentFile = files.find(file => file.name === selectedFile)
  
  const handleEditorChange = (value: string | undefined) => {
    if (selectedFile && value !== undefined) {
      updateFile(selectedFile, value)
    }
  }

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Configure Monaco Editor settings
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0a0a0a',
      }
    })
    
    monaco.editor.defineTheme('custom-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
      }
    })
  }

  return (
    <div className="h-full">
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
            {/* Monaco Editor */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="h-full"
            >
              <Editor
                language={getMonacoLanguage(currentFile.name)}
                value={currentFile.content}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme={theme === 'dark' ? 'custom-dark' : 'custom-light'}
                loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
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
                  quickSuggestions: true,
                  parameterHints: { enabled: true },
                  autoIndent: 'full',
                  formatOnType: true,
                  formatOnPaste: true,
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
                Choose a file from the file explorer to edit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
