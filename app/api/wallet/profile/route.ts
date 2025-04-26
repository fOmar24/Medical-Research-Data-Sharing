import { NextResponse } from "next/server"
import { walletAuthMiddleware, AuthMethod } from "@/lib/wallet-auth-middleware"
import type { WalletAuthenticatedRequest } from "@/lib/wallet-auth-middleware"
import { updateWalletInfo } from "@/lib/server-sui-wallet"

// GET /api/wallet/profile - Get wallet profile
export async function GET(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  // Return user profile
  return NextResponse.json({
    profile: {
      id: req.user!.id,
      walletAddress: req.user!.walletAddress,
      name: req.user!.name,
      email: req.user!.email,
    },
  })
}

// PUT /api/wallet/profile - Update wallet profile
export async function PUT(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  try {
    // Get profile updates from request body
    const updates = await req.json()

    // Update wallet info
    const updatedWallet = await updateWalletInfo(req.user!.walletAddress, updates)

    return NextResponse.json({
      profile: {
        id: updatedWallet.id,
        walletAddress: updatedWallet.wallet_address,
        name: updatedWallet.name,
        email: updatedWallet.email,
        organization: updatedWallet.organization,
      },
    })
  } catch (error) {
    console.error("Error updating wallet profile:", error)
    return NextResponse.json({ error: "Failed to update wallet profile" }, { status: 500 })
  }
}
