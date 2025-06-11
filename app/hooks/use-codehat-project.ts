"use client"

import { useState, useCallback } from "react"
import { useUser } from "@/lib/user-store/provider"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { API_ROUTE_CODEHAT } from "@/lib/routes"
import type { CodeHatProject, CodeHatProjectCreate, CodeHatFile } from "@/app/types/codehat"
import { toast } from "@/components/ui/toast"

export function useCodeHatProject() {
  const { user } = useUser()
  const { setCurrentProject, setFiles } = useCodeHatStore()
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const createProject = useCallback(async (
    chatId: string,
    projectData: CodeHatProjectCreate
  ): Promise<CodeHatProject | null> => {
    if (!user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to create projects",
        status: "error"
      })
      return null
    }

    setIsCreating(true)

    try {
      const response = await fetch(API_ROUTE_CODEHAT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          chatId,
          ...projectData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Usage limit reached",
            description: `Daily: ${data.limits?.remainingDaily || 0}, Monthly: ${data.limits?.remainingMonthly || 0} remaining`,
            status: "error"
          })
        } else {
          throw new Error(data.error || "Failed to create project")
        }
        return null
      }

      const project = data.project
      setCurrentProject(project)
      
      toast({
        title: "Project created",
        description: "Your new CodeHat project is ready!",
        status: "success"
      })

      return project
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create project"
      toast({
        title: "Error",
        description: message,
        status: "error"
      })
      return null
    } finally {
      setIsCreating(false)
    }
  }, [user?.id, setCurrentProject])

  const updateProject = useCallback(async (
    projectId: string,
    updates: Partial<CodeHatProject>
  ): Promise<boolean> => {
    setIsUpdating(true)

    try {
      const response = await fetch(`${API_ROUTE_CODEHAT}/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update project")
      }

      setCurrentProject(data.project)
      
      // Update files in store if they were updated
      if (updates.files) {
        const files = Array.isArray(updates.files) ? updates.files as unknown as CodeHatFile[] : []
        setFiles(files)
      }

      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update project"
      toast({
        title: "Error",
        description: message,
        status: "error"
      })
      return false
    } finally {
      setIsUpdating(false)
    }
  }, [setCurrentProject, setFiles])

  const loadProject = useCallback(async (projectId: string): Promise<CodeHatProject | null> => {
    try {
      const response = await fetch(`${API_ROUTE_CODEHAT}/${projectId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to load project")
      }

      const project = data.project
      setCurrentProject(project)
      
      // Load files into store
      if (Array.isArray(project.files)) {
        setFiles(project.files as unknown as CodeHatFile[])
      }

      return project
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load project"
      toast({
        title: "Error",
        description: message,
        status: "error"
      })
      return null
    }
  }, [setCurrentProject, setFiles])

  return {
    createProject,
    updateProject,
    loadProject,
    isCreating,
    isUpdating
  }
}
