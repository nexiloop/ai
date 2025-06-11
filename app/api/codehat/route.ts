import { NextRequest, NextResponse } from "next/server"
import { checkCodeHatUsage, createCodeHatProject } from "@/lib/codehat/api"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "CodeHat requires Supabase to be enabled" },
      { status: 500 }
    )
  }

  try {
    const { userId, chatId, title, description, framework } = await request.json()

    if (!userId || !chatId || !title) {
      return NextResponse.json(
        { error: "Missing required fields: userId, chatId, title" },
        { status: 400 }
      )
    }

    // Check usage limits
    const usage = await checkCodeHatUsage(userId)
    if (!usage.canCreate) {
      return NextResponse.json(
        { 
          error: "Usage limit reached",
          limits: {
            remainingDaily: usage.remainingDaily,
            remainingMonthly: usage.remainingMonthly
          }
        },
        { status: 429 }
      )
    }

    // Create project
    const project = await createCodeHatProject({
      userId,
      chatId,
      title,
      description,
      framework
    })

    return NextResponse.json({ 
      project,
      limits: {
        remainingDaily: usage.remainingDaily - 1,
        remainingMonthly: usage.remainingMonthly - 1
      }
    })

  } catch (error) {
    console.error("Error creating CodeHat project:", error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "CodeHat requires Supabase to be enabled" },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      )
    }

    const usage = await checkCodeHatUsage(userId)

    return NextResponse.json(usage)

  } catch (error) {
    console.error("Error checking CodeHat usage:", error)
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: 500 }
    )
  }
}
