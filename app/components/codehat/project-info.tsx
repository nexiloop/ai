"use client"

import { Badge } from "@/components/ui/badge"
import { Code, Calendar, User } from "@phosphor-icons/react"
import type { CodeHatProject } from "@/app/types/codehat"
import { cn } from "@/lib/utils"

interface ProjectInfoProps {
  project: CodeHatProject
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    case 'building':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  const createdAt = new Date(project.created_at || '').toLocaleDateString()
  const updatedAt = new Date(project.updated_at || '').toLocaleDateString()

  return (
    <div className="space-y-3">
      {/* Title and Status */}
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg">{project.title}</h3>
        <Badge className={cn("capitalize", getStatusColor(project.status))}>
          {project.status}
        </Badge>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-muted-foreground text-sm">{project.description}</p>
      )}

      {/* Framework and Metadata */}
      <div className="flex flex-wrap gap-2 text-xs">
        {project.framework && (
          <div className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-full px-2 py-1">
            <Code className="h-3 w-3" />
            {project.framework}
          </div>
        )}
        
        <div className="text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Created: {createdAt}
        </div>
        
        {updatedAt !== createdAt && (
          <div className="text-muted-foreground flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Updated: {updatedAt}
          </div>
        )}
      </div>

      {/* File count */}
      {Array.isArray(project.files) && project.files.length > 0 && (
        <div className="text-muted-foreground flex items-center gap-1 text-xs">
          <Code className="h-3 w-3" />
          {project.files.length} files
        </div>
      )}
    </div>
  )
}
