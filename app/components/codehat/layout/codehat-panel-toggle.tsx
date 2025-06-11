"use client"

import { Button } from "@/components/ui/button"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Code, CaretLeft } from "@phosphor-icons/react"
import { motion, AnimatePresence } from "motion/react"

export function CodeHatPanelToggle() {
  const { isPanelOpen, togglePanel, files } = useCodeHatStore()

  if (isPanelOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed right-4 top-1/2 z-50 -translate-y-1/2"
      >
        <Button
          onClick={togglePanel}
          variant="secondary"
          size="sm"
          className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-lg border bg-background/80 p-2 shadow-lg backdrop-blur-sm hover:bg-background/90"
        >
          <Code className="h-4 w-4" />
          <span className="text-xs">{files.length}</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  )
}
