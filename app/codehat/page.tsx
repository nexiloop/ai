import { CodeHatChat } from "@/app/components/codehat/codehat-chat"
import { LayoutCodeHat } from "@/app/components/codehat/layout/layout-codehat"
import { MessagesProvider } from "@/lib/chat-store/messages/provider"

export const dynamic = "force-dynamic"

export default function CodeHatHome() {
  return (
    <MessagesProvider>
      <LayoutCodeHat>
        <CodeHatChat />
      </LayoutCodeHat>
    </MessagesProvider>
  )
}
