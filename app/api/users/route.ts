import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"

// GET /api/users/me - Get current user profile
export async function GET(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    // Get user profile
    const userResult = await query(
      "SELECT id, wallet_address, name, email, organization, created_at FROM users WHERE id = $1",
      [req.user!.id],
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: userResult.rows[0] })
  } catch (error) {
    console.error("Error getting user profile:", error)
    return NextResponse.json({ error: "Failed to get user profile" }, { status: 500 })
  }
}

// PUT /api/users/me - Update current user profile
export async function PUT(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const { name, email, organization } = await req.json()

    // Update user profile
    const updateResult = await query(
      `UPDATE users 
       SET name = $1, email = $2, organization = $3, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $4 
       RETURNING id, wallet_address, name, email, organization, created_at, updated_at`,
      [name, email, organization, req.user!.id],
    )

    return NextResponse.json({ user: updateResult.rows[0] })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
  }
}
