"use client"

import { AnimatePresence } from "motion/react"
import React, { memo } from "react"
import { CodeHatSuggestions } from "./codehat-suggestions"

type CodeHatPromptSystemProps = {
  onValueChange: (value: string) => void
  onSuggestion: (suggestion: string) => void
  value: string
}

export const CodeHatPromptSystem = memo(function CodeHatPromptSystem({
  onValueChange,
  onSuggestion,
  value,
}: CodeHatPromptSystemProps) {
  return (
    <>
      <div className="relative order-1 w-full md:absolute md:bottom-[-70px] md:order-2 md:h-[70px]">
        <AnimatePresence mode="popLayout">
          <CodeHatSuggestions
            onValueChange={onValueChange}
            onSuggestion={onSuggestion}
            value={value}
          />
        </AnimatePresence>
      </div>
    </>
  )
})
