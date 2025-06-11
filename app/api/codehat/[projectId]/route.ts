import { NextRequest, NextResponse } from "next/server"
import { updateCodeHatProject, getCodeHatProject } from "@/lib/codehat/api"
import { isSupabaseEnabled } from "@/lib/supabase/config"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "CodeHat requires Supabase to be enabled" },
      { status: 500 }
    )
  }

  try {
    const { projectId } = await params
    const project = await getCodeHatProject(projectId)
    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error getting CodeHat project:", error)
    return NextResponse.json(
      { error: "Failed to get project" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "CodeHat requires Supabase to be enabled" },
      { status: 500 }
    )
  }

  try {
    const { projectId } = await params
    const updates = await request.json()
    const project = await updateCodeHatProject(projectId, updates)
    return NextResponse.json({ project })
  } catch (error) {
    console.error("Error updating CodeHat project:", error)
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    )
  }
}
