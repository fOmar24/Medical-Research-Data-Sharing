import { type NextRequest, NextResponse } from "next/server"
import { verifyWalletSignature } from "./server-sui-wallet"
import { verifyAndConsumeNonce, createWalletSession, logWalletActivity } from "./db-wallet-schema"
import { verifySessionToken } from "./db-wallet-schema"
import { getWalletByAddress, registerWallet } from "./server-sui-wallet"

// Interface for authenticated request
export interface WalletAuthenticatedRequest extends NextRequest {
  user?: {
    id: number
    walletAddress: string
    name?: string
    email?: string
  }
  session?: {
    id: number
    token: string
    expiresAt: Date
  }
}

// Authentication methods
export enum AuthMethod {
  SIGNATURE = "signature",
  SESSION = "session",
}

// Verify wallet signature authentication
export async function verifyWalletSignatureAuth(req: WalletAuthenticatedRequest): Promise<NextResponse | null> {
  // Get authorization header
  const authHeader = req.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Extract token
  const token = authHeader.split(" ")[1]

  try {
    // Parse token (format: walletAddress:signature:message:nonce)
    const [walletAddress, signature, message, nonce] = token.split(":")

    // Verify nonce
    const isValidNonce = await verifyAndConsumeNonce(walletAddress, nonce)
    if (!isValidNonce) {
      return NextResponse.json({ error: "Invalid or expired nonce" }, { status: 401 })
    }

    // Verify signature
    const isValid = await verifyWalletSignature(message, signature, walletAddress)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    // Get or create user
    const wallet = await getWalletByAddress(walletAddress)
    let userId: number

    if (!wallet) {
      // Register new wallet
      userId = await registerWallet(walletAddress)
    } else {
      userId = wallet.id
    }

    // Create session
    const ipAddress = req.headers.get("x-forwarded-for") || req.ip
    const userAgent = req.headers.get("user-agent")
    const sessionToken = await createWalletSession(userId, ipAddress as string, userAgent as string)

    // Log activity
    await logWalletActivity(userId, "login", { method: "signature" }, ipAddress as string)

    // Set user in request
    req.user = {
      id: userId,
      walletAddress,
      name: wallet?.name,
      email: wallet?.email,
    }

    // Set session in request
    req.session = {
      id: 0, // We don't have the session ID here
      token: sessionToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }

    // Return session token in response
    return NextResponse.json({
      sessionToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      user: {
        id: userId,
        walletAddress,
        name: wallet?.name,
        email: wallet?.email,
      },
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

// Verify session token authentication
export async function verifySessionAuth(req: WalletAuthenticatedRequest): Promise<NextResponse | null> {
  // Get session token from cookie or authorization header
  const sessionToken =
    req.cookies.get("session_token")?.value ||
    (req.headers.get("authorization")?.startsWith("Session ") ? req.headers.get("authorization")?.split(" ")[1] : null)

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Verify session token
    const session = await verifySessionToken(sessionToken)

    if (!session) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 })
    }

    // Set user in request
    req.user = {
      id: session.user_id,
      walletAddress: session.wallet_address,
      name: session.name,
      email: session.email,
    }

    // Set session in request
    req.session = {
      id: session.id,
      token: sessionToken,
      expiresAt: session.expires_at,
    }

    return null // Authentication successful
  } catch (error) {
    console.error("Session authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
  }
}

// Wallet authentication middleware
export async function walletAuthMiddleware(
  req: WalletAuthenticatedRequest,
  method: AuthMethod = AuthMethod.SESSION,
): Promise<NextResponse | null> {
  if (method === AuthMethod.SIGNATURE) {
    return await verifyWalletSignatureAuth(req)
  } else {
    return await verifySessionAuth(req)
  }
}
