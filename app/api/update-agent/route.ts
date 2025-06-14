import { NextRequest, NextResponse } from "next/server"
import { isSupabaseEnabled } from "@/lib/supabase/config"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "Supabase is not enabled" },
      { status: 500 }
    )
  }

  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      id,
      name, 
      description, 
      systemPrompt, 
      tools, 
      avatarUrl, 
      isPublic 
    } = body

    // Validate required fields
    if (!id || !name || !description || !systemPrompt) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if agent exists and user owns it
    const { data: existingAgent, error: fetchError } = await supabase
      .from("agents")
      .select("id, creator_id")
      .eq("id", id)
      .single()

    if (fetchError || !existingAgent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    if (existingAgent.creator_id !== userData.user.id) {
      return NextResponse.json(
        { error: "You can only edit your own agents" },
        { status: 403 }
      )
    }

    // Update the agent
    const { data: updatedAgent, error: updateError } = await supabase
      .from("agents")
      .update({
        name,
        description,
        system_prompt: systemPrompt,
        tools: tools || [],
        avatar_url: avatarUrl || null,
        is_public: isPublic || false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("creator_id", userData.user.id) // Double-check ownership
      .select()
      .single()

    if (updateError) {
      console.error("Error updating agent:", updateError)
      return NextResponse.json(
        { error: "Failed to update agent" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      agent: updatedAgent,
    })

  } catch (error) {
    console.error("Error in update-agent API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  if (!isSupabaseEnabled) {
    return NextResponse.json(
      { error: "Supabase is not enabled" },
      { status: 500 }
    )
  }

  try {
    const supabase = await createClient()
    
    if (!supabase) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      )
    }

    // Check if agent exists and user owns it
    const { data: existingAgent, error: fetchError } = await supabase
      .from("agents")
      .select("id, creator_id")
      .eq("id", id)
      .single()

    if (fetchError || !existingAgent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      )
    }

    if (existingAgent.creator_id !== userData.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own agents" },
        { status: 403 }
      )
    }

    // Delete the agent
    const { error: deleteError } = await supabase
      .from("agents")
      .delete()
      .eq("id", id)
      .eq("creator_id", userData.user.id) // Double-check ownership

    if (deleteError) {
      console.error("Error deleting agent:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete agent" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Agent deleted successfully",
    })

  } catch (error) {
    console.error("Error in delete-agent API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
