"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ImageGenerator } from "@/app/components/image-generator"
import { Image } from "@phosphor-icons/react"
import { useState } from "react"

type ButtonImageGeneratorProps = {
  isUserAuthenticated: boolean
}

export function ButtonImageGenerator({ isUserAuthenticated }: ButtonImageGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!isUserAuthenticated) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="secondary"
          className="border-border dark:bg-secondary rounded-full border bg-transparent transition-all duration-150 flex items-center gap-1 px-3 h-9"
          aria-label="Generate image"
          title="Generate image with AI"
        >
          <Image className="size-4" />
          <span className="text-sm">Image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <ImageGenerator onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
