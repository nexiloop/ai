"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { X } from "@phosphor-icons/react"
import Image from "next/image"
import { useState } from "react"
import { BackgroundRemovalButton } from "../chat/background-removal-button"

type FileItemProps = {
  file: File
  onRemove: (file: File) => void
  onFileProcessed?: (processedBlob: Blob, originalFile: File) => void
}

export function FileItem({ file, onRemove, onFileProcessed }: FileItemProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { preferences } = useUserPreferences()

  const handleRemove = () => {
    setIsRemoving(true)
    onRemove(file)
  }

  const isImage = file.type.includes("image")
  const showBackgroundRemoval = isImage && preferences.backgroundRemovalEnabled

  const handleFileProcessed = (processedBlob: Blob, originalFile: File) => {
    if (onFileProcessed) {
      onFileProcessed(processedBlob, originalFile)
    }
  }

  return (
    <div className="relative mr-2 mb-0 flex flex-col items-center gap-2">
      <div className="relative">
        <HoverCard
          open={isImage ? isOpen : false}
          onOpenChange={setIsOpen}
        >
          <HoverCardTrigger className="w-full">
            <div className="bg-background hover:bg-accent border-input flex w-full items-center gap-3 rounded-2xl border p-2 pr-3 transition-colors">
              <div className="bg-accent-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md">
                {isImage ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-center text-xs text-gray-400">
                    {file.name.split(".").pop()?.toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-xs font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)}kB
                </span>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent side="top">
            <Image
              src={URL.createObjectURL(file)}
              alt={file.name}
              width={200}
              height={200}
              className="h-full w-full object-cover"
            />
          </HoverCardContent>
        </HoverCard>
        {!isRemoving ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleRemove}
                className="border-background absolute top-1 right-1 z-10 inline-flex size-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] bg-black text-white shadow-none transition-colors"
                aria-label="Remove file"
              >
                <X className="size-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Remove file</TooltipContent>
          </Tooltip>
        ) : null}
      </div>
      
      {/* Background Removal Button */}
      {showBackgroundRemoval && (
        <BackgroundRemovalButton
          file={file}
          onProcessed={handleFileProcessed}
          variant="secondary"
          size="sm"
          className="w-full"
        />
      )}
    </div>
  )
}
