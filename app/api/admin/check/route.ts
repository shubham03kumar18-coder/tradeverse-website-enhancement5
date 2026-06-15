import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        {
          isAdmin: false,
          error: "Not authenticated",
        },
        { status: 401 }
      )
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,is_admin")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.error("Profile Error:", profileError)

      return NextResponse.json(
        {
          isAdmin: false,
          error: "Profile not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      isAdmin: profile.is_admin === true,
    })
  } catch (error) {
    console.error("Admin Check Error:", error)

    return NextResponse.json(
      {
        isAdmin: false,
        error: "Server Error",
      },
      { status: 500 }
    )
  }
}
