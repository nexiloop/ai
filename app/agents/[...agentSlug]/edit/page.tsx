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
  params: { agentSlug: string[] }
}) {
  if (!isSupabaseEnabled) {
    notFound()
  }

  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  const { data: userData } = await supabase.auth.getUser()

  if (!userData?.user) {
    redirect("/auth")
  }

  const agentId = params.agentSlug?.[0]
  const action = params.agentSlug?.[1]

  if (!agentId || action !== "edit") {
    notFound()
  }

  // Get the agent
  const { data: agent, error: agentError } = await supabase
    .from("agents")
    .select("*")
    .eq("id", agentId)
    .single()

  if (agentError || !agent) {
    notFound()
  }

  // Check if user owns this agent
  if (agent.creator_id !== userData.user.id) {
    redirect(`/agents/${agentId}`)
  }

  return (
    <MessagesProvider>
      <LayoutApp>
        <EditAgentPage agent={agent} />
      </LayoutApp>
    </MessagesProvider>
  )
}
