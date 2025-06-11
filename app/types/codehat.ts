import type { Tables } from "./database.types"

export type CodeHatProject = Tables<"codehat_projects">
export type CodeHatUsage = Tables<"codehat_usage">

export interface CodeHatFile {
  name: string
  content: string
  type: "component" | "page" | "style" | "config" | "other"
  language: string
}

export interface CodeHatProjectCreate {
  title: string
  description?: string
  framework?: string
}

export interface CodeHatProjectUpdate {
  title?: string
  description?: string
  status?: "draft" | "building" | "completed" | "error"
  files?: CodeHatFile[]
  preview_url?: string
  deploy_url?: string
  framework?: string
}

export type CodeHatPanelTab = "code" | "preview"

export interface CodeHatLimits {
  dailyProjects: number
  monthlyProjects: number
  remainingDaily: number
  remainingMonthly: number
  isUnlimited: boolean
}
