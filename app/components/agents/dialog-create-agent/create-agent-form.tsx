"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, X } from "lucide-react"
import type React from "react"
import { ToolsSection } from "./tools-section"

type AgentFormData = {
  name: string
  description: string
  systemPrompt: string
  tools: string[]
  useNexiloopAsCreator: boolean
}

type CreateAgentFormProps = {
  formData: AgentFormData
  error: { [key: string]: string }
  isLoading: boolean
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void
  handleToolsChange: (selectedTools: string[]) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleFormDataChange: (data: Partial<AgentFormData>) => void
  onClose: () => void
  isDrawer?: boolean
}

export function CreateAgentForm({
  formData,
  error,
  isLoading,
  handleInputChange,
  handleToolsChange,
  handleSubmit,
  handleFormDataChange,
  onClose,
  isDrawer = false,
}: CreateAgentFormProps) {
  return (
    <div
      className={`space-y-0 ${isDrawer ? "p-0 pb-16" : "py-0"} overflow-y-auto`}
    >
      {isDrawer && (
        <div className="border-border mb-2 flex items-center justify-between border-b px-4 pb-2">
          <h2 className="text-lg font-medium">Create agent (experimental)</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="px-6 py-4">
        <div className="bg-muted/50 mb-6 rounded-lg p-3">
          <p className="text-sm">
            Create custom agents with personalized system prompts and tool selections. 
            All agents are simple, lightweight, and ready to help with your tasks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Agent name</Label>
            <Input
              id="name"
              name="name"
              placeholder="My Agent"
              value={formData.name}
              onChange={handleInputChange}
              className={error.name ? "border-red-500" : ""}
            />

            {error.name && (
              <div className="mt-1 flex items-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{error.name}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="A short description of what this agent does"
              value={formData.description}
              onChange={handleInputChange}
              className={error.description ? "border-red-500" : ""}
            />
            <p className="text-muted-foreground text-xs">
              Short sentence, used in list/search
            </p>
            {error.description && (
              <div className="mt-1 flex items-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{error.description}</span>
              </div>
            )}
          </div>

          <ToolsSection onSelectTools={handleToolsChange} />

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System prompt</Label>
            <Textarea
              id="systemPrompt"
              name="systemPrompt"
              placeholder="You are a helpful assistant created by Nexiloop. You help users with their questions and tasks. Be friendly, helpful, and informative in your responses."
              value={formData.systemPrompt}
              onChange={handleInputChange}
              className={`h-32 font-mono ${error.systemPrompt ? "border-red-500" : ""}`}
            />
            {error.systemPrompt && (
              <div className="mt-1 flex items-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{error.systemPrompt}</span>
              </div>
            )}
          </div>

          {/* Creator Choice */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeMe"
                checked={!formData.useNexiloopAsCreator}
                onCheckedChange={(checked: boolean) =>
                  handleFormDataChange({
                    useNexiloopAsCreator: !checked
                  })
                }
              />
              <Label
                htmlFor="includeMe"
                className="text-sm font-normal cursor-pointer"
              >
                Credit me as the creator instead of Nexiloop
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              By default, agents are created by Nexiloop. Check this box if you want to be credited as the creator.
            </p>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Agent..." : "Create Agent"}
          </Button>
        </form>
      </div>
    </div>
  )
}
