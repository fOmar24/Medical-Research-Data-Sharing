import { type NextRequest, NextResponse } from "next/server"
import { generateWalletNonce } from "@/lib/db-wallet-schema"

// GET /api/wallet/nonce?address={walletAddress} - Get a nonce for wallet authentication
export async function GET(req: NextRequest) {
  try {
    // Get wallet address from query params
    const { searchParams } = new URL(req.url)
    const walletAddress = searchParams.get("address")

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // Generate nonce
    const nonce = await generateWalletNonce(walletAddress)

    return NextResponse.json({ nonce })
  } catch (error) {
    console.error("Error generating nonce:", error)
    return NextResponse.json({ error: "Failed to generate nonce" }, { status: 500 })
  }
}
