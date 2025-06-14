import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { EditAgentPage } from "./edit-agent-page"

export const dynamic = "force-dynamic"

export default async function Page({
  params,
}: {
  params: Promise<{ agentSlug: string }>
}) {
  if (!isSupabaseEnabled) {
    notFound()
  }

  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user?.id) {
    redirect("/auth/login")
  }

  const { agentSlug } = await params

  // Get the agent
  const { data: agent, error } = await supabase
    .from("agents")
    .select("*")
    .eq("slug", agentSlug)
    .single()

  if (error || !agent) {
    notFound()
  }

  // Check if user owns this agent
  if (agent.creator_id !== userData.user.id) {
    notFound()
  }

  return (
    <MessagesProvider>
      <LayoutApp>
        <EditAgentPage agent={agent} />
      </LayoutApp>
    </MessagesProvider>
  )
}
