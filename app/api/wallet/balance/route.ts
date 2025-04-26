import { NextResponse } from "next/server"
import { walletAuthMiddleware, AuthMethod } from "@/lib/wallet-auth-middleware"
import type { WalletAuthenticatedRequest } from "@/lib/wallet-auth-middleware"
import { getWalletBalance } from "@/lib/server-sui-wallet"

// GET /api/wallet/balance - Get wallet balance
export async function GET(req: WalletAuthenticatedRequest) {
  // Verify session
  const authResponse = await walletAuthMiddleware(req, AuthMethod.SESSION)
  if (authResponse) return authResponse

  try {
    // Get wallet balance
    const balance = await getWalletBalance(req.user!.walletAddress)

    return NextResponse.json({
      balance: balance.toString(),
      formatted: formatBalance(balance),
      walletAddress: req.user!.walletAddress,
    })
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    return NextResponse.json({ error: "Failed to get wallet balance" }, { status: 500 })
  }
}

// Helper function to format balance
function formatBalance(balance: bigint): string {
  // Convert to SUI (1 SUI = 10^9 MIST)
  const sui = Number(balance) / 1_000_000_000
  return sui.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}
