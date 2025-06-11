"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/user-store/provider"
import { API_ROUTE_CODEHAT } from "@/lib/routes"
import type { CodeHatLimits } from "@/app/types/codehat"

export function useCodeHatLimits() {
  const { user } = useUser()
  const [limits, setLimits] = useState<CodeHatLimits | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkLimits = async () => {
    if (!user?.id) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_ROUTE_CODEHAT}?userId=${user.id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to check limits")
      }

      setLimits({
        dailyProjects: data.isPremium ? -1 : 5,
        monthlyProjects: data.isPremium ? -1 : 4,
        remainingDaily: data.remainingDaily,
        remainingMonthly: data.remainingMonthly,
        isUnlimited: data.isPremium
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      checkLimits()
    }
  }, [user?.id])

  return {
    limits,
    isLoading,
    error,
    refetch: checkLimits
  }
}
