"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, X, Save, Trash2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import type { Agent } from "@/app/types/agent"
import { ToolsSection } from "./tools-section"

type EditAgentFormData = {
  name: string
  description: string
  systemPrompt: string
  tools: string[]
  avatarUrl: string
  isPublic: boolean
}

type EditAgentFormProps = {
  agent: Agent
  onClose: () => void
  onSave: (data: EditAgentFormData) => Promise<void>
  onDelete: () => Promise<void>
  isDrawer?: boolean
}

export function EditAgentForm({
  agent,
  onClose,
  onSave,
  onDelete,
  isDrawer = false,
}: EditAgentFormProps) {
  const [formData, setFormData] = useState<EditAgentFormData>({
    name: agent.name,
    description: agent.description,
    systemPrompt: agent.system_prompt,
    tools: agent.tools || [],
    avatarUrl: agent.avatar_url || "",
    isPublic: agent.is_public,
  })

  const [error, setError] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error[name]) {
      setError(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleToolsChange = (selectedTools: string[]) => {
    setFormData(prev => ({ ...prev, tools: selectedTools }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError({})

    try {
      // Validate form
      const newErrors: { [key: string]: string } = {}

      if (!formData.name.trim()) {
        newErrors.name = "Agent name is required"
      }

      if (!formData.description.trim()) {
        newErrors.description = "Description is required"
      }

      if (!formData.systemPrompt.trim()) {
        newErrors.systemPrompt = "System prompt is required"
      }

      if (Object.keys(newErrors).length > 0) {
        setError(newErrors)
        return
      }

      await onSave(formData)
    } catch (err) {
      console.error("Failed to save agent:", err)
      setError({ general: "Failed to save agent. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setIsLoading(true)
    try {
      await onDelete()
    } catch (err) {
      console.error("Failed to delete agent:", err)
      setError({ general: "Failed to delete agent. Please try again." })
    } finally {
      setIsLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div
      className={`space-y-0 ${isDrawer ? "p-0 pb-16" : "py-0"} overflow-y-auto`}
    >
      {isDrawer && (
        <div className="border-border mb-2 flex items-center justify-between border-b px-4 pb-2">
          <h2 className="text-lg font-medium">Edit Agent</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="px-6 py-4">
        <div className="bg-muted/50 mb-6 rounded-lg p-3">
          <p className="text-sm">
            Edit your agent's settings, description, and tools. Changes will be saved immediately.
          </p>
        </div>

        {error.general && (
          <div className="mb-4 flex items-center rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>{error.general}</span>
          </div>
        )}

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

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">Avatar URL (optional)</Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              placeholder="https://example.com/avatar.jpg"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              className={error.avatarUrl ? "border-red-500" : ""}
            />
            <p className="text-muted-foreground text-xs">
              URL to an image for your agent's avatar
            </p>
            {error.avatarUrl && (
              <div className="mt-1 flex items-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{error.avatarUrl}</span>
              </div>
            )}
          </div>

          {/* Public/Private Toggle */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isPublic">Visibility</Label>
                <p className="text-muted-foreground text-xs">
                  Make this agent discoverable by other users
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="isPublic" className="text-sm font-normal">
                  {formData.isPublic ? "Public" : "Private"}
                </Label>
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, isPublic: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="systemPrompt">System prompt</Label>
            <Textarea
              id="systemPrompt"
              name="systemPrompt"
              placeholder="You are a helpful assistant that..."
              value={formData.systemPrompt}
              onChange={handleInputChange}
              rows={4}
              className={error.systemPrompt ? "border-red-500" : ""}
            />
            <p className="text-muted-foreground text-xs">
              Instructions that define your agent's behavior and personality
            </p>
            {error.systemPrompt && (
              <div className="mt-1 flex items-center text-sm text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                <span>{error.systemPrompt}</span>
              </div>
            )}
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <Label>Tools</Label>
            <ToolsSection
              onSelectTools={handleToolsChange}
            />
            <p className="text-muted-foreground text-xs">
              Select tools that your agent can use during conversations
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
            
            <Button
              type="button"
              variant={showDeleteConfirm ? "destructive" : "outline"}
              onClick={handleDelete}
              disabled={isLoading}
              className="w-full"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {showDeleteConfirm ? "Confirm Delete" : "Delete Agent"}
            </Button>

            {showDeleteConfirm && (
              <p className="text-sm text-muted-foreground text-center">
                Click "Confirm Delete" again to permanently delete this agent
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
