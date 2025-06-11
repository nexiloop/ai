"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { 
  FileText, 
  Code, 
  Image, 
  Folder,
  FileJs,
  FileCss,
  FileHtml,
  FileCode
} from "@phosphor-icons/react"

const getFileIcon = (fileName: string, type: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  
  switch (ext) {
    case 'js':
    case 'jsx':
      return <FileJs className="h-4 w-4 text-yellow-500" />
    case 'ts':
    case 'tsx':
      return <FileCode className="h-4 w-4 text-blue-500" />
    case 'css':
    case 'scss':
    case 'sass':
      return <FileCss className="h-4 w-4 text-purple-500" />
    case 'html':
      return <FileHtml className="h-4 w-4 text-orange-500" />
    case 'json':
      return <FileJs className="h-4 w-4 text-green-500" />
    case 'md':
      return <FileText className="h-4 w-4 text-gray-500" />
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
      return <Image className="h-4 w-4 text-pink-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-400" />
  }
}

export function FileExplorer() {
  const { files, selectedFile, setSelectedFile } = useCodeHatStore()

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border p-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Folder className="h-4 w-4" />
          <span>Files</span>
          <span className="text-muted-foreground">({files.length})</span>
        </div>
      </div>

      {/* File list */}
      <div className="flex-1 overflow-y-auto">
        {files.length === 0 ? (
          <div className="flex h-full items-center justify-center p-4">
            <div className="text-center">
              <Folder className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
              <p className="text-muted-foreground text-sm">No files yet</p>
            </div>
          </div>
        ) : (
          <div className="p-2">
            {files.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "mb-1 h-8 w-full justify-start gap-2 px-2 text-sm font-normal",
                    selectedFile === file.name && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setSelectedFile(file.name)}
                >
                  {getFileIcon(file.name, file.type)}
                  <span className="truncate">{file.name}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
