"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

type GeneratedImageProps = {
  imageUrl: string
  prompt: string
  model: string
  remainingGenerations?: number
  className?: string
}

export function GeneratedImage({ 
  imageUrl, 
  prompt, 
  model, 
  remainingGenerations,
  className 
}: GeneratedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nexiloop-generated-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to download image:', error)
    }
  }

  const handleOpenInNewTab = () => {
    window.open(imageUrl, '_blank')
  }

  return (
    <div className={cn("w-full max-w-lg mx-auto", className)}>
      <div className="relative rounded-lg overflow-hidden bg-muted">
        {/* Main Image */}
        <div className="relative aspect-square">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="text-muted-foreground text-sm">Loading image...</div>
            </div>
          )}
          
          <Image
            src={imageUrl}
            alt={prompt}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
            unoptimized // Since it's an external URL
          />

          {/* Watermark Overlay */}
          {!isLoading && !hasError && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1">
              <Image
                src="/nl.svg"
                alt="Nexiloop"
                width={16}
                height={16}
                className="opacity-80"
              />
              <span className="text-white text-xs font-medium opacity-80">nexiloop</span>
            </div>
          )}

          {/* Error State */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-muted-foreground text-sm">Failed to load image</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isLoading && !hasError && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-none h-8 w-8 p-0"
              onClick={handleDownload}
              title="Download image"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white border-none h-8 w-8 p-0"
              onClick={handleOpenInNewTab}
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Image Info */}
      <div className="mt-3 space-y-1">
        <div className="text-sm font-medium line-clamp-2">{prompt}</div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model: {model.replace('@cf/', '').replace(/[_-]/g, ' ')}</span>
          {remainingGenerations !== undefined && (
            <span>{remainingGenerations} generations remaining today</span>
          )}
        </div>
      </div>
    </div>
  )
}
