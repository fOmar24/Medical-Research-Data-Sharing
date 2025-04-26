import { NextResponse } from "next/server"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { walrusServerStorage } from "@/lib/server-walrus-storage"

// POST /api/storage/upload-url - Get pre-signed upload URL
export async function POST(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const { fileName, contentType, metadata } = await req.json()

    // Validate required fields
    if (!fileName || !contentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate pre-signed URL
    const uploadUrl = await walrusServerStorage.getUploadUrl(fileName, contentType, {
      ...metadata,
      owner: req.user!.walletAddress,
    })

    return NextResponse.json(uploadUrl)
  } catch (error) {
    console.error("Error generating upload URL:", error)
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 })
  }
}
