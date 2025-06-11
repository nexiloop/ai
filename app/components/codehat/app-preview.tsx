"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Button } from "@/components/ui/button"
import { Eye, ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"

export function AppPreview() {
  const { currentProject, previewUrl, files } = useCodeHatStore()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)

  const handleRefresh = () => {
    setIsRefreshing(true)
    generatePreview()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Generate live preview from files
  const generatePreview = () => {
    const htmlFile = files.find(file => file.name.endsWith('.html'))
    const cssFiles = files.filter(file => file.name.endsWith('.css'))
    const jsFiles = files.filter(file => file.name.endsWith('.js') || file.name.endsWith('.jsx'))
    
    if (htmlFile) {
      let html = htmlFile.content
      
      // Inject CSS content directly into HTML
      cssFiles.forEach(cssFile => {
        const cssTag = `<style>\n${cssFile.content}\n</style>`
        html = html.replace('</head>', `${cssTag}\n</head>`)
      })
      
      // Inject JS content directly into HTML
      jsFiles.forEach(jsFile => {
        const jsTag = `<script>\n${jsFile.content}\n</script>`
        html = html.replace('</body>', `${jsTag}\n</body>`)
      })
      
      setPreviewContent(html)
    } else if (cssFiles.length > 0 || jsFiles.length > 0) {
      // Generate basic HTML structure
      const css = cssFiles.map(f => f.content).join('\n')
      const js = jsFiles.map(f => f.content).join('\n')
      
      const generatedHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CodeHat Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        ${css}
    </style>
</head>
<body>
    <div id="root"></div>
    <div id="app"></div>
    <script>
        ${js}
    </script>
</body>
</html>`
      
      setPreviewContent(generatedHtml)
    }
  }

  // Auto-generate preview when files change
  useEffect(() => {
    if (files.length > 0) {
      generatePreview()
    }
  }, [files])

  const hasWebFiles = files.some(file => 
    file.name.endsWith('.html') || 
    file.name.endsWith('.css') ||
    file.name.endsWith('.js') ||
    file.name.endsWith('.jsx') ||
    file.name.endsWith('.tsx')
  )

  if (!currentProject && files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex h-full items-center justify-center p-8"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Eye className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          </motion.div>
          <h3 className="text-lg font-medium">No preview available</h3>
          <p className="text-muted-foreground text-sm">
            Start building an app to see the preview
          </p>
        </div>
      </motion.div>
    )
  }

  if (!hasWebFiles && !previewUrl && !previewContent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex h-full items-center justify-center p-8"
      >
        <div className="text-center">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Eye className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          </motion.div>
          <h3 className="text-lg font-medium">Preview coming soon</h3>
          <p className="text-muted-foreground text-sm mb-4">
            The preview will be available once you have UI components
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <motion.div
                animate={{ rotate: isRefreshing ? 360 : 0 }}
                transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0 }}
              >
                <ArrowsClockwise className="h-4 w-4" />
              </motion.div>
              {isRefreshing ? 'Refreshing...' : 'Check for Preview'}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Preview Header */}
      <div className="border-b border-border flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ArrowsClockwise className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowsClockwise className="h-4 w-4" />
            )}
          </Button>
          
          {previewUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(previewUrl, '_blank')}
            >
              <ArrowSquareOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-white">
        <AnimatePresence mode="wait">
          {previewContent ? (
            <motion.div
              key="preview-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <iframe
                srcDoc={previewContent}
                className="h-full w-full border-0"
                title="App Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </motion.div>
          ) : previewUrl ? (
            <motion.div
              key="preview-url"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full w-full"
            >
              <iframe
                src={previewUrl}
                className="h-full w-full border-0"
                title="App Preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview-placeholder"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex h-full items-center justify-center"
            >
              <div className="bg-card rounded-lg p-8 text-center shadow-sm">
                <motion.div
                  animate={{ 
                    background: [
                      "linear-gradient(45deg, #3b82f6, #8b5cf6)",
                      "linear-gradient(45deg, #8b5cf6, #ec4899)",
                      "linear-gradient(45deg, #ec4899, #f59e0b)",
                      "linear-gradient(45deg, #f59e0b, #3b82f6)"
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="mb-4 h-32 w-48 rounded-lg"
                />
                <h3 className="mb-2 font-medium">Preview Placeholder</h3>
                <p className="text-muted-foreground text-sm">
                  Your app preview will appear here once it's built
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
