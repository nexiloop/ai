"use client"

import { groupChatsByDate } from "@/app/components/history/utils"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { useChats } from "@/lib/chat-store/chats/provider"
import {
  Code,
  GithubLogo,
  MagnifyingGlass,
  NotePencilIcon,
  X,
} from "@phosphor-icons/react"
import { useParams, useRouter } from "next/navigation"
import { useMemo } from "react"
import { HistoryTrigger } from "../../history/history-trigger"
import { SidebarList } from "../../layout/sidebar/sidebar-list"

export function CodeHatSidebar() {
  const isMobile = useBreakpoint(768)
  const { setOpenMobile } = useSidebar()
  const { chats, isLoading } = useChats()
  const params = useParams<{ chatId: string }>()
  const currentChatId = params.chatId

  // Filter chats for CodeHat (those that start with /codehat/)
  const codeHatChats = useMemo(() => {
    return chats.filter(chat => {
      // This would ideally be stored in the database, but for now we can use a pattern
      return chat.title?.toLowerCase().includes('codehat') || 
             chat.title?.toLowerCase().includes('app') ||
             chat.title?.toLowerCase().includes('build')
    })
  }, [chats])

  const groupedChats = useMemo(() => groupChatsByDate(codeHatChats, ""), [codeHatChats])
  const hasChats = codeHatChats.length > 0
  const router = useRouter()

  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="border-none">
      <SidebarHeader className="h-14 pl-3">
        <div className="flex justify-between">
          {isMobile ? (
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="text-muted-foreground hover:text-foreground hover:bg-muted inline-flex size-9 items-center justify-center rounded-md bg-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <X size={24} />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xl font-medium tracking-tight">
              <Code className="h-6 w-6" />
              CodeHat
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="mask-t-from-98% mask-t-to-100% mask-b-from-98% mask-b-to-100% px-3">
        <ScrollArea className="flex h-full [&>div>div]:!block">
          <div className="mt-3 mb-5 flex w-full flex-col items-start gap-0">
            <button
              className="hover:bg-accent/80 hover:text-foreground text-primary group/new-chat relative inline-flex w-full items-center rounded-md bg-transparent px-2 py-2 text-sm transition-colors"
              type="button"
              onClick={() => router.push("/codehat")}
            >
              <div className="flex items-center gap-2">
                <NotePencilIcon size={20} />
                New App
              </div>
              <div className="text-muted-foreground ml-auto text-xs opacity-0 duration-150 group-hover/new-chat:opacity-100">
                ⌘⇧U
              </div>
            </button>
            <HistoryTrigger
              hasSidebar={false}
              classNameTrigger="bg-transparent hover:bg-accent/80 hover:text-foreground text-primary relative inline-flex w-full items-center rounded-md px-2 py-2 text-sm transition-colors group/search"
              icon={<MagnifyingGlass size={24} className="mr-2" />}
              label={
                <div className="flex w-full items-center gap-2">
                  <span>Search</span>
                  <div className="text-muted-foreground ml-auto text-xs opacity-0 duration-150 group-hover/search:opacity-100">
                    ⌘+K
                  </div>
                </div>
              }
              hasPopover={false}
            />
          </div>
          {isLoading ? (
            <div className="h-full" />
          ) : hasChats ? (
            <div className="space-y-5">
              {groupedChats?.map((group) => (
                <SidebarList
                  key={group.name}
                  title={group.name}
                  items={group.chats}
                  currentChatId={currentChatId}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-[calc(100vh-160px)] flex-col items-center justify-center">
              <Code
                size={24}
                className="text-muted-foreground mb-1 opacity-40"
              />
              <div className="text-muted-foreground text-center">
                <p className="mb-1 text-base font-medium">No apps yet</p>
                <p className="text-sm opacity-70">Start building something amazing</p>
              </div>
            </div>
          )}
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="mb-2 p-3">
        <a
          href="https://nexiloop.com"
          className="hover:bg-muted flex flex-col gap-1 rounded-md p-2 transition-colors text-left"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Nexiloop official site"
        >
          <div className="text-sidebar-foreground text-sm font-medium">
            CodeHat - AI App Builder
          </div>
          <div className="text-sidebar-foreground/70 text-xs">
            Made with love by Nexiloop
          </div>
        </a>
      </SidebarFooter>
    </Sidebar>
  )
}
