import { NextResponse } from "next/server"
import { walletAuthMiddleware, AuthMethod } from "@/lib/wallet-auth-middleware"
import type { WalletAuthenticatedRequest } from "@/lib/wallet-auth-middleware"
import { getWalletTransactionHistory } from "@/lib/server-sui-wallet"

// GET /api/wallet/transactions - Get wallet transaction history
export async function GET(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  try {
    // Get limit from query params
    const { searchParams } = new URL(req.url)
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    // Get transaction history
    const transactions = await getWalletTransactionHistory(req.user!.walletAddress, limit)

    return NextResponse.json({
      transactions,
      walletAddress: req.user!.walletAddress,
    })
  } catch (error) {
    console.error("Error getting wallet transactions:", error)
    return NextResponse.json({ error: "Failed to get wallet transactions" }, { status: 500 })
  }
}
