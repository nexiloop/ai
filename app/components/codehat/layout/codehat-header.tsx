"use client"

import { AppInfoTrigger } from "@/app/components/layout/app-info/app-info-trigger"
import { HeaderSidebarTrigger } from "@/app/components/layout/header-sidebar-trigger"
import { useBreakpoint } from "@/app/hooks/use-breakpoint"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { APP_NAME } from "@/lib/config"
import { useUser } from "@/lib/user-store/provider"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { Code, Info } from "@phosphor-icons/react"
import Link from "next/link"

interface CodeHatHeaderProps {
  hasSidebar: boolean
}

export function CodeHatHeader({ hasSidebar }: CodeHatHeaderProps) {
  const isMobile = useBreakpoint(768)
  const { user } = useUser()
  // Removed panel toggle functionality for cleaner header

  const isLoggedIn = !!user

  return (
    <header className="h-app-header pointer-events-none fixed top-0 right-0 left-0 z-50">
      <div className="relative mx-auto flex h-full max-w-full items-center justify-between bg-transparent px-4 sm:px-6 lg:bg-transparent lg:px-8">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex flex-1 items-center gap-2 pl-0 md:pl-0.5">
            {hasSidebar && <HeaderSidebarTrigger />}
            <div className="flex-1">
              <Link
                href="/codehat"
                className="pointer-events-auto flex items-center gap-2 text-xl font-medium tracking-tight"
              >
                <Code className="h-6 w-6" />
                CodeHat
                <Badge variant="secondary" className="text-xs">
                  Beta
                </Badge>
              </Link>
            </div>
          </div>
          
          <div />
          
          {!isLoggedIn ? (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-4">
              <AppInfoTrigger
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-background hover:bg-muted text-muted-foreground h-8 w-8 rounded-full"
                    aria-label={`About ${APP_NAME}`}
                  >
                    <Info className="size-4" />
                  </Button>
                }
              />
              <Link
                href="/auth"
                className="font-base text-muted-foreground hover:text-foreground text-base transition-colors"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="pointer-events-auto flex flex-1 items-center justify-end gap-2">
              {/* Panel toggle removed for clean header */}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
