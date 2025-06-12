"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

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
    <motion.div 
      className={cn("w-full max-w-lg mx-auto", className)}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] // Custom easing for smooth animation
      }}
    >
      <motion.div 
        className="relative rounded-lg overflow-hidden bg-muted shadow-lg"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Main Image */}
        <div className="relative aspect-square">
          {isLoading && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="text-muted-foreground text-sm"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1, 0.98]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Loading image...
              </motion.div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={imageUrl}
              alt={prompt}
              fill
              className="object-cover"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setHasError(true)
              }}
              unoptimized // Since it's an external URL
            />
          </motion.div>

          {/* Watermark Overlay */}
          {!isLoading && !hasError && (
            <motion.div 
              className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1 flex items-center gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Image
                src="/nl.svg"
                alt="Nexiloop"
                width={16}
                height={16}
                className="opacity-80"
              />
              <span className="text-white text-xs font-medium opacity-80">nexiloop</span>
            </motion.div>
          )}

          {/* Error State */}
          {hasError && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-muted-foreground text-sm">Failed to load image</div>
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        {!isLoading && !hasError && (
          <motion.div 
            className="absolute top-2 right-2 flex gap-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
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
          </motion.div>
        )}
      </motion.div>

      {/* Image Info */}
      <motion.div 
        className="mt-3 space-y-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <div className="text-sm font-medium line-clamp-2">{prompt}</div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Model: {model.replace('@cf/', '').replace(/[_-]/g, ' ')}</span>
          {remainingGenerations !== undefined && (
            <span>{remainingGenerations} generations remaining today</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
