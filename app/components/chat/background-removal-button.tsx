"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Scissors, Download, Loader2 } from "lucide-react"
import { removeBackground, createImageFromBlob, downloadProcessedImage } from "@/lib/background-removal"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "motion/react"

type BackgroundRemovalButtonProps = {
  file: File
  onProcessed?: (processedBlob: Blob, originalFile: File) => void
  className?: string
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
}

export function BackgroundRemovalButton({
  file,
  onProcessed,
  className,
  variant = "outline",
  size = "sm"
}: BackgroundRemovalButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRemoveBackground = async () => {
    if (isProcessing) return

    setIsProcessing(true)
    setError(null)
    setIsCompleted(false)

    try {
      console.log('Starting background removal for:', file.name)
      
      const processedBlob = await removeBackground(file)
      
      console.log('Background removal completed successfully')
      
      // Create a new file name
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
      const newFileName = `${nameWithoutExt}-bg-removed.png`
      
      // Call the callback if provided
      if (onProcessed) {
        onProcessed(processedBlob, file)
      } else {
        // Default behavior: download the processed image
        downloadProcessedImage(processedBlob, newFileName)
      }
      
      setIsCompleted(true)
      
      // Reset completed state after 2 seconds
      setTimeout(() => setIsCompleted(false), 2000)
      
    } catch (err) {
      console.error('Background removal failed:', err)
      setError(err instanceof Error ? err.message : 'Background removal failed')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("inline-block", className)}
    >
      <Button
        onClick={handleRemoveBackground}
        disabled={isProcessing}
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden transition-all duration-200",
          isCompleted && "bg-green-500 hover:bg-green-600 text-white",
          error && "bg-red-500 hover:bg-red-600 text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Removing BG...</span>
            </motion.div>
          ) : isCompleted ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span>Downloaded!</span>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Scissors className="h-4 w-4" />
              <span>Try Again</span>
            </motion.div>
          ) : (
            <motion.div
              key="default"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <Scissors className="h-4 w-4" />
              <span>Remove BG</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full mt-1 left-0 right-0"
        >
          <Badge variant="destructive" className="text-xs">
            {error}
          </Badge>
        </motion.div>
      )}
    </motion.div>
  )
}
