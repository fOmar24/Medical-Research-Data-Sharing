import { type NextRequest, NextResponse } from "next/server"
import { verifyMessage } from "@mysten/sui.js/verify"
import { query } from "./db"

// Interface for authenticated request
export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    walletAddress: string
  }
}

// Verify authentication
export async function verifyAuth(req: AuthenticatedRequest): Promise<NextResponse | null> {
  // Get authorization header
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Extract token
  const token = authHeader.split(" ")[1]

  try {
    // Parse token (format: walletAddress:signature:message:timestamp)
    const [walletAddress, signature, message, timestamp] = token.split(":")

    // Verify timestamp is recent (within 5 minutes)
    const msgTimestamp = Number.parseInt(timestamp)
    const currentTime = Date.now()
    if (currentTime - msgTimestamp > 5 * 60 * 1000) {
      return NextResponse.json({ error: "Authentication expired" }, { status: 401 })
    }

    // Verify signature
    const isValid = await verifyMessage({
      message,
      signature,
      address: walletAddress,
    })

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Get user from database
    const userResult = await query("SELECT id FROM users WHERE wallet_address = $1", [walletAddress])

    if (userResult.rows.length === 0) {
      // Create new user if not exists
      const newUserResult = await query("INSERT INTO users (wallet_address) VALUES ($1) RETURNING id", [walletAddress])

      req.user = {
        id: newUserResult.rows[0].id,
        walletAddress,
      }
    } else {
      req.user = {
        id: userResult.rows[0].id,
        walletAddress,
      }
    }

    return null // Authentication successful
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

// Authentication middleware
export async function authMiddleware(req: AuthenticatedRequest): Promise<NextResponse | null> {
  return await verifyAuth(req)
}
