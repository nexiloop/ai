import { Markdown } from "@/components/prompt-kit/markdown"
import { cn } from "@/lib/utils"
import { CaretDown, Brain } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

type ReasoningProps = {
  reasoning: string
}

const TRANSITION = {
  type: "spring",
  duration: 0.2,
  bounce: 0,
}

export function Reasoning({ reasoning }: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="mb-4">
      <button
        className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors px-3 py-2 rounded-lg bg-muted/30 hover:bg-muted/50 border border-border/50"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
      >
        <Brain className="size-4 text-blue-500" />
        <span className="font-medium">AI Thinking Process</span>
        <CaretDown
          className={cn(
            "size-3 transition-transform ml-auto",
            isExpanded ? "rotate-180" : ""
          )}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="mt-2 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
          >
            <div className="text-muted-foreground border-muted-foreground/20 bg-muted/20 rounded-lg border p-4">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <Markdown>{reasoning}</Markdown>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
