import { type NextRequest, NextResponse } from "next/server"
import { verifyWalletSignatureAuth } from "@/lib/wallet-auth-middleware"
import type { WalletAuthenticatedRequest } from "@/lib/wallet-auth-middleware"

// POST /api/wallet/auth - Authenticate with wallet signature
export async function POST(req: NextRequest) {
  try {
    const authReq = req as WalletAuthenticatedRequest
    const response = await verifyWalletSignatureAuth(authReq)

    if (response) {
      return response
    }

    // This should not happen as verifyWalletSignatureAuth should always return a response
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  } catch (error) {
    console.error("Error authenticating wallet:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
