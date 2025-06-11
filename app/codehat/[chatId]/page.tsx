import { CodeHatChat } from "@/app/components/codehat/codehat-chat"
import { LayoutCodeHat } from "@/app/components/codehat/layout/layout-codehat"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function CodeHatPage() {
  if (isSupabaseEnabled) {
    const supabase = await createClient()
    if (supabase) {
      const { data: userData, error: userError } = await supabase.auth.getUser()
      if (userError || !userData?.user) {
        redirect("/")
      }
    }
  }

  return (
    <MessagesProvider>
      <LayoutCodeHat>
        <CodeHatChat />
      </LayoutCodeHat>
    </MessagesProvider>
  )
}
