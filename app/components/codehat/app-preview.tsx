"use client"

import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Button } from "@/components/ui/button"
import { Eye, ArrowSquareOut, ArrowsClockwise } from "@phosphor-icons/react"
import { useState } from "react"

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
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Eye className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-medium">No preview available</h3>
          <p className="text-muted-foreground text-sm">
            Start building an app to see the preview
          </p>
        </div>
      </div>
    )
  }

  if (!hasHtmlFiles && !previewUrl) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <Eye className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-lg font-medium">Preview coming soon</h3>
          <p className="text-muted-foreground text-sm">
            The preview will be available once you have UI components
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ArrowsClockwise className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ArrowsClockwise className="mr-2 h-4 w-4" />
            )}
            Check for Preview
          </Button>
        </div>
      </div>
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
