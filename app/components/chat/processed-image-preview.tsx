"use client"

import { Button } from "@/components/ui/button"
import { downloadProcessedImage, ProcessedImageData, revokeImageUrl } from "@/lib/background-removal"
import { Download, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ProcessedImagePreviewProps {
  processedImage: ProcessedImageData
  onRemove?: () => void
  onDownload?: () => void
}

export function ProcessedImagePreview({ 
  processedImage, 
  onRemove, 
  onDownload 
}: ProcessedImagePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  // Clean up the preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (processedImage.previewUrl) {
        revokeImageUrl(processedImage.previewUrl)
      }
    }
  }, [processedImage.previewUrl])

  const handleDownload = async () => {
    try {
      setIsDownloading(true)
      downloadProcessedImage(processedImage.processedBlob, processedImage.filename)
      onDownload?.()
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleRemove = () => {
    if (processedImage.previewUrl) {
      revokeImageUrl(processedImage.previewUrl)
    }
    onRemove?.()
  }

  return (
    <div className="relative group">
      <div className="relative overflow-hidden rounded-lg border border-border/50 bg-background/50 p-2">
        <Image
          src={processedImage.previewUrl}
          alt="Background removed"
          width={160}
          height={120}
          className="w-40 h-30 object-cover rounded-md"
        />
        
        {/* Action buttons overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-white/90 hover:bg-white text-black shadow-sm"
          >
            <Download className="h-4 w-4" />
          </Button>
          
          {onRemove && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRemove}
              className="bg-white/90 hover:bg-white text-black shadow-sm"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* File info */}
      <div className="mt-1 px-1">
        <p className="text-xs text-muted-foreground truncate max-w-40">
          {processedImage.filename}
        </p>
        <p className="text-xs text-muted-foreground">
          Background removed
        </p>
      </div>
    </div>
  )
}
