import { Database } from "@/app/types/database.types"
import { createClient } from "@/lib/supabase/server"
import { CODEHAT_LIMITS } from "@/lib/config"
import type { SupabaseClient } from "@supabase/supabase-js"

export async function checkCodeHatUsage(userId: string): Promise<{
  canCreate: boolean
  remainingDaily: number
  remainingMonthly: number
  isPremium: boolean
}> {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  // Get user data to check if premium
  const { data: userData } = await supabase
    .from("users")
    .select("premium")
    .eq("id", userId)
    .single()

  const isPremium = userData?.premium || false

  // If premium, unlimited usage
  if (isPremium) {
    return {
      canCreate: true,
      remainingDaily: -1,
      remainingMonthly: -1,
      isPremium: true
    }
  }

  // Get or create usage record
  let { data: usage } = await supabase
    .from("codehat_usage")
    .select("*")
    .eq("user_id", userId)
    .single()

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  if (!usage) {
    // Create new usage record
    const { data: newUsage } = await supabase
      .from("codehat_usage")
      .insert({
        user_id: userId,
        project_count_daily: 0,
        project_count_monthly: 0,
        daily_reset: today.toISOString(),
        monthly_reset: thisMonth.toISOString()
      })
      .select()
      .single()

    usage = newUsage!
  }

  // Check if we need to reset counters
  const dailyReset = usage.daily_reset ? new Date(usage.daily_reset) : null
  const monthlyReset = usage.monthly_reset ? new Date(usage.monthly_reset) : null

  let dailyCount = usage.project_count_daily
  let monthlyCount = usage.project_count_monthly

  if (!dailyReset || dailyReset < today) {
    dailyCount = 0
    await supabase
      .from("codehat_usage")
      .update({
        project_count_daily: 0,
        daily_reset: today.toISOString()
      })
      .eq("user_id", userId)
  }

  if (!monthlyReset || monthlyReset < thisMonth) {
    monthlyCount = 0
    await supabase
      .from("codehat_usage")
      .update({
        project_count_monthly: 0,
        monthly_reset: thisMonth.toISOString()
      })
      .eq("user_id", userId)
  }

  const remainingDaily = Math.max(0, CODEHAT_LIMITS.FREE_DAILY_PROJECTS - dailyCount)
  const remainingMonthly = Math.max(0, CODEHAT_LIMITS.FREE_MONTHLY_PROJECTS - monthlyCount)

  return {
    canCreate: remainingDaily > 0 && remainingMonthly > 0,
    remainingDaily,
    remainingMonthly,
    isPremium: false
  }
}

export async function incrementCodeHatUsage(userId: string): Promise<void> {
  const supabase = await createClient()
  if (!supabase) return

  const { data: usage } = await supabase
    .from("codehat_usage")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (usage) {
    await supabase
      .from("codehat_usage")
      .update({
        project_count_daily: usage.project_count_daily + 1,
        project_count_monthly: usage.project_count_monthly + 1,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", userId)
  }
}

export async function createCodeHatProject({
  userId,
  chatId,
  title,
  description,
  framework = "react"
}: {
  userId: string
  chatId: string
  title: string
  description?: string
  framework?: string
}) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("codehat_projects")
    .insert({
      user_id: userId,
      chat_id: chatId,
      title,
      description,
      framework,
      status: "draft",
      files: []
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create project: ${error.message}`)
  }

  // Increment usage
  await incrementCodeHatUsage(userId)

  return data
}

export async function updateCodeHatProject(
  projectId: string,
  updates: {
    title?: string
    description?: string
    status?: "draft" | "building" | "completed" | "error"
    files?: any[]
    preview_url?: string
    deploy_url?: string
    framework?: string
  }
) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("codehat_projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", projectId)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update project: ${error.message}`)
  }

  return data
}

export async function getCodeHatProject(projectId: string) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("codehat_projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (error) {
    throw new Error(`Failed to get project: ${error.message}`)
  }

  return data
}

export async function getUserCodeHatProjects(userId: string) {
  const supabase = await createClient()
  if (!supabase) {
    throw new Error("Supabase not available")
  }

  const { data, error } = await supabase
    .from("codehat_projects")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to get projects: ${error.message}`)
  }

  return data
}
