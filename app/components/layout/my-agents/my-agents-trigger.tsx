"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Robot } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

export function MyAgentsTrigger() {
  const router = useRouter()

  const handleClick = () => {
    // Navigate to settings with focus on general tab which includes My Agents
    router.push("/?settings=general")
  }

  return (
    <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
      <Robot className="mr-2 h-4 w-4" />
      <span>My Agents</span>
    </DropdownMenuItem>
  )
}
