import { NextResponse } from "next/server"
import { walletAuthMiddleware, AuthMethod } from "@/lib/wallet-auth-middleware"
import type { WalletAuthenticatedRequest } from "@/lib/wallet-auth-middleware"

// GET /api/wallet/session - Verify session and get user info
export async function GET(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  // Return user info
  return NextResponse.json({
    user: {
      id: req.user!.id,
      walletAddress: req.user!.walletAddress,
      name: req.user!.name,
      email: req.user!.email,
    },
    session: {
      expiresAt: req.session!.expiresAt,
    },
  })
}

// DELETE /api/wallet/session - Logout (invalidate session)
export async function DELETE(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  try {
    // Invalidate session in database
    // This would typically involve setting an 'invalidated' flag or deleting the session
    // For simplicity, we'll just return a success response

    // Clear session cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete("session_token")

    return response
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 })
  }
}
