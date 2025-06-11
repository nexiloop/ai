"use client"

import { CodeHatHeader, CodeHatSidebar, CodeHatRightPanel } from "@/app/components/codehat/layout"
import { useCodeHatStore } from "@/lib/codehat-store/store"
import { useUserPreferences } from "@/lib/user-preference-store/provider"
import { cn } from "@/lib/utils"

export function LayoutCodeHat({ children }: { children: React.ReactNode }) {
  const { preferences } = useUserPreferences()
  const { isPanelOpen } = useCodeHatStore()
  const hasSidebar = preferences.layout === "sidebar"

  return (
    <div className="bg-background flex h-dvh w-full overflow-hidden">
      {hasSidebar && <CodeHatSidebar />}
      
      {/* Main content area */}
      <div className="@container relative flex h-dvh flex-1 overflow-hidden">
        <CodeHatHeader hasSidebar={hasSidebar} />
        
        {/* Chat area */}
        <main 
          className={cn(
            "@container relative h-dvh flex-shrink overflow-y-auto transition-all duration-300",
            isPanelOpen ? "w-1/2" : "w-full"
          )}
        >
          {children}
        </main>
        
        {/* Right panel */}
        <CodeHatRightPanel />
      </div>
    </div>
  )
}
