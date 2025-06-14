"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star } from "@phosphor-icons/react"

interface ProModelDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  currentModel: string
}

export function ProModelDialog({
  isOpen,
  setIsOpen,
  currentModel,
}: ProModelDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="size-5 text-yellow-500" />
            Coming Soon
          </DialogTitle>
          <DialogDescription>
            This model is coming soon! We're working hard to bring you access to the latest AI models.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The model "{currentModel}" will be available in a future update. 
            Stay tuned for more powerful AI capabilities!
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
