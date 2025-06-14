"use client"

import { Agent } from "@/app/types/agent"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"
import { DialogCreateAgentTrigger } from "./dialog-create-agent/dialog-trigger-create-agent"

type BrowseAgentsPageProps = {
  agents: Agent[]
  userId: string | null
}

export function BrowseAgentsPage({ agents, userId }: BrowseAgentsPageProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openAgentId, setOpenAgentId] = useState<string | null>(null)

  const filteredAgents = useMemo(() => {
    if (!searchQuery) return agents
    
    const query = searchQuery.toLowerCase()
    return agents.filter(
      (agent) =>
        agent.name.toLowerCase().includes(query) ||
        agent.description.toLowerCase().includes(query)
    )
  }, [agents, searchQuery])

  const handleAgentClick = (agentId: string) => {
    setOpenAgentId(agentId)
  }

  return (
    <div className="bg-background min-h-screen px-4 pt-20 pb-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-foreground text-sm font-medium">Browse Agents</h1>
          <div className="text-foreground mx-auto my-4 max-w-2xl text-3xl font-medium tracking-tight md:text-4xl">
            Discover AI Agents
          </div>
          <p className="text-muted-foreground mx-auto mb-6 max-w-2xl text-lg">
            Explore public agents created by the community
          </p>
          
          <div className="mx-auto mb-6 max-w-md">
            <div className="relative">
              <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <DialogCreateAgentTrigger
            trigger={
              <Button variant="outline" className="rounded-full">
                Create an agent
              </Button>
            }
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="border-border bg-card hover:bg-accent/50 cursor-pointer rounded-lg border p-4 transition-colors"
              onClick={() => handleAgentClick(agent.id)}
            >
              <div className="flex items-start gap-3">
                {agent.avatar_url && (
                  <img
                    src={agent.avatar_url}
                    alt={agent.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-foreground font-medium truncate">{agent.name}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {agent.description}
                  </p>
                  {agent.category && (
                    <div className="mt-2">
                      <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded">
                        {agent.category}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No agents found matching your search" : "No public agents yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
