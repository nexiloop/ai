"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Button } from "@/components/ui/button"
import { Eye, ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react"
import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export function AppPreview() {
  const { currentProject, previewUrl, files } = useCodeHatStore()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const hasHtmlFiles = files.some(file => 
    file.name.endsWith('.html') || 
    file.name.endsWith('.tsx') || 
    file.name.endsWith('.jsx')
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

  if (!hasHtmlFiles && !previewUrl) {
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
        {previewUrl ? (
          <iframe
            src={previewUrl}
            className="h-full w-full border-0"
            title="App Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="bg-card rounded-lg p-8 text-center shadow-sm">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 mb-4 h-32 w-48 rounded-lg"></div>
              <h3 className="mb-2 font-medium">Preview Placeholder</h3>
              <p className="text-muted-foreground text-sm">
                Your app preview will appear here once it's built
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
