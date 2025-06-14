import { LayoutApp } from "@/app/components/layout/layout-app"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BrowseAgentsPage } from "@/app/components/agents/browse-agents-page"

export const dynamic = "force-dynamic"

export default async function Page() {
  if (!isSupabaseEnabled) {
    notFound()
  }

  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  const { data: userData } = await supabase.auth.getUser()

  // Get all public agents
  const { data: publicAgents, error: publicAgentsError } = await supabase
    .from("agents")
    .select("*")
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  if (publicAgentsError) {
    console.error(publicAgentsError)
    return <div>Error loading agents</div>
  }

  return (
    <MessagesProvider>
      <LayoutApp>
        <BrowseAgentsPage
          agents={publicAgents || []}
          userId={userData?.user?.id || null}
        />
      </LayoutApp>
    </MessagesProvider>
  )
}
