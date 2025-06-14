"use client"

import { SettingsContent } from "@/app/components/layout/settings/settings-content"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, agents, models, and preferences
          </p>
        </div>
        
        <div className="bg-card rounded-lg border shadow-sm">
          <SettingsContent onClose={() => {}} isDrawer={false} isStandalonePage={true} />
        </div>
      </div>
    </div>
  )
}
