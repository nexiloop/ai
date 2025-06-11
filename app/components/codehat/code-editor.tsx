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
      <div className={cn(
        "border-r border-border bg-muted/30 transition-all duration-200",
        isFileTreeOpen ? "w-64" : "w-12"
      )}>
        <div className="border-b border-border flex items-center justify-between p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFileTreeOpen(!isFileTreeOpen)}
            className="gap-2"
          >
            <Folder className="h-4 w-4" />
            {isFileTreeOpen && <span>Files</span>}
            {isFileTreeOpen ? (
              <CaretDown className="h-3 w-3" />
            ) : (
              <CaretRight className="h-3 w-3" />
            )}
          </Button>
        </div>
        
        {isFileTreeOpen && (
          <ScrollArea className="h-[calc(100%-49px)]">
            <div className="p-2">
              {files.map((file) => (
                <Button
                  key={file.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(file.name)}
                  className={cn(
                    "w-full justify-start gap-2 truncate",
                    selectedFile === file.name && "bg-accent"
                  )}
                >
                  {getFileIcon(file.name)}
                  <span className="truncate">{file.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1">
        {currentFile ? (
          <div className="h-full">
            {/* File tab */}
            <div className="border-b border-border flex items-center px-4 py-2">
              {getFileIcon(currentFile.name)}
              <span className="ml-2 text-sm font-medium">{currentFile.name}</span>
            </div>
            
            {/* Monaco Editor */}
            <div className="h-[calc(100%-41px)]">
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
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileCode className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">Select a file</h3>
              <p className="text-muted-foreground text-sm">
                Choose a file from the file tree to edit
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
