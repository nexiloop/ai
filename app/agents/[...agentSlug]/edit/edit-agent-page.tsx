"use client"

import { EditAgentForm } from "@/app/components/agents/dialog-create-agent/edit-agent-form"
import type { Agent } from "@/app/types/agent"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EditAgentPageProps {
  agent: Agent
}

export function EditAgentPage({ agent }: EditAgentPageProps) {
  const router = useRouter()

  const handleSave = async (formData: {
    name: string
    description: string
    systemPrompt: string
    tools: string[]
    avatarUrl: string
    isPublic: boolean
  }) => {
    try {
      const response = await fetch("/api/update-agent", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: agent.id,
          name: formData.name,
          description: formData.description,
          systemPrompt: formData.systemPrompt,
          tools: formData.tools,
          avatarUrl: formData.avatarUrl,
          isPublic: formData.isPublic,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update agent")
      }

      toast.success("Agent updated successfully")
      router.push(`/agents/${agent.id}`)
      router.refresh()
    } catch (error) {
      console.error("Failed to update agent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update agent")
      throw error
    }
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/update-agent?id=${agent.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete agent")
      }

      toast.success("Agent deleted successfully")
      router.push("/agents")
      router.refresh()
    } catch (error) {
      console.error("Failed to delete agent:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete agent")
      throw error
    }
  }

  const handleClose = () => {
    router.push(`/agents/${agent.id}`)
  }

  return (
    <div className="bg-background min-h-screen px-4 pt-20 pb-20 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Edit Agent</h1>
          <p className="text-muted-foreground">
            Update your agent's settings and configuration
          </p>
        </div>

        <div className="bg-card border rounded-lg">
          <EditAgentForm
            agent={agent}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={handleClose}
          />
        </div>
      </div>
    </div>
  )
}
