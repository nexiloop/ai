"use client"

import { Agent } from "@/app/types/agent"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useMemo, useState } from "react"
import { AgentFeaturedSection } from "./agent-featured-section"
import { DialogCreateAgentTrigger } from "./dialog-create-agent/dialog-trigger-create-agent"
import { UserAgentsSection } from "./user-agent-section"

type AgentsPageProps = {
  curatedAgents: Agent[]
  userAgents: Agent[] | null
  publicAgents: Agent[] | null
  userId: string | null
}

export function AgentsPage({
  curatedAgents,
  userAgents,
  publicAgents,
  userId,
}: AgentsPageProps) {
  const [openAgentId, setOpenAgentId] = useState<string | null>(null)

  const randomAgents = useMemo(() => {
    return curatedAgents
      .filter((agent) => agent.id !== openAgentId)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4)
  }, [curatedAgents, openAgentId])

  const handleAgentClick = (agentId: string | null) => {
    setOpenAgentId(agentId)
  }

  return (
    <div className="bg-background min-h-screen px-4 pt-20 pb-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-20 text-center">
          <h1 className="text-foreground text-sm font-medium">
            Agents (experimental)
          </h1>
          <div className="text-foreground mx-auto my-4 max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
            Your every day AI assistant
          </div>
          <p className="text-muted-foreground mx-auto mb-4 max-w-2xl text-lg">
            a growing set of personal AI agents, built for ideas, writing, and
            product work.
          </p>
          <div className="flex gap-3 justify-center">
            <DialogCreateAgentTrigger
              trigger={
                <Button variant="outline" className="rounded-full">
                  Create an agent
                </Button>
              }
            />
            <Link href="/browse">
              <Button variant="ghost" className="rounded-full">
                Browse all agents
              </Button>
            </Link>
          </div>
        </div>

        <AgentFeaturedSection
          agents={curatedAgents}
          moreAgents={randomAgents}
          handleAgentClick={handleAgentClick}
          openAgentId={openAgentId}
          setOpenAgentId={setOpenAgentId}
        />
        <UserAgentsSection
          agents={userAgents || null}
          moreAgents={randomAgents}
          userId={userId || null}
          handleAgentClick={handleAgentClick}
          openAgentId={openAgentId}
          setOpenAgentId={setOpenAgentId}
        />
        
        {publicAgents && publicAgents.length > 0 && (
          <div className="mt-16">
            <h2 className="text-foreground mb-6 text-xl font-medium">
              Community Agents
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {publicAgents.map((agent) => (
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
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-foreground font-medium">{agent.name}</h3>
                      <p className="text-muted-foreground text-sm">{agent.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
