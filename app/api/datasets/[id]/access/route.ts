import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { verifyTransaction } from "@/lib/server-sui-client"

// GET /api/datasets/:id/access - Get access grants for a dataset
export async function GET(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)

    // Check if user is the owner
    const ownerCheck = await query("SELECT owner_id FROM datasets WHERE id = $1", [datasetId])

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    if (ownerCheck.rows[0].owner_id !== req.user!.id) {
      return NextResponse.json({ error: "Not authorized to view access grants" }, { status: 403 })
    }

    // Get access grants
    const accessResult = await query(
      `SELECT ag.*, u.wallet_address as grantee_wallet_address, u.name as grantee_name
       FROM access_grants ag
       JOIN users u ON ag.grantee_id = u.id
       WHERE ag.dataset_id = $1
       ORDER BY ag.granted_at DESC`,
      [datasetId],
    )

    return NextResponse.json({ accessGrants: accessResult.rows })
  } catch (error) {
    console.error("Error getting access grants:", error)
    return NextResponse.json({ error: "Failed to get access grants" }, { status: 500 })
  }
}

// POST /api/datasets/:id/access - Grant access to a dataset
export async function POST(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)
    const { granteeWalletAddress, accessLevel, expiresAt, txHash } = await req.json()

    // Validate required fields
    if (!granteeWalletAddress || !accessLevel || !expiresAt || !txHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user is the owner
    const ownerCheck = await query("SELECT owner_id FROM datasets WHERE id = $1", [datasetId])

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    if (ownerCheck.rows[0].owner_id !== req.user!.id) {
      return NextResponse.json({ error: "Not authorized to grant access" }, { status: 403 })
    }

    // Verify transaction on blockchain
    const txVerification = await verifyTransaction(txHash)
    if (!txVerification.valid) {
      return NextResponse.json({ error: "Invalid transaction" }, { status: 400 })
    }

    // Get or create grantee user
    let granteeId
    const granteeCheck = await query("SELECT id FROM users WHERE wallet_address = $1", [granteeWalletAddress])

    if (granteeCheck.rows.length === 0) {
      // Create new user
      const newUserResult = await query("INSERT INTO users (wallet_address) VALUES ($1) RETURNING id", [
        granteeWalletAddress,
      ])
      granteeId = newUserResult.rows[0].id
    } else {
      granteeId = granteeCheck.rows[0].id
    }

    // Check if there's an existing active grant
    const existingGrantCheck = await query(
      `SELECT id FROM access_grants
       WHERE dataset_id = $1 AND grantee_id = $2 AND revoked = false AND expires_at > CURRENT_TIMESTAMP`,
      [datasetId, granteeId],
    )

    if (existingGrantCheck.rows.length > 0) {
      // Update existing grant
      const updateResult = await query(
        `UPDATE access_grants
         SET access_level = $1, expires_at = $2, tx_hash = $3, granted_at = CURRENT_TIMESTAMP
         WHERE id = $4
         RETURNING *`,
        [accessLevel, new Date(expiresAt), txHash, existingGrantCheck.rows[0].id],
      )

      // Log audit event
      await query(
        `INSERT INTO audit_logs (action, dataset_id, user_id, details, tx_hash)
         VALUES ($1, $2, $3, $4, $5)`,
        ["access_updated", datasetId, req.user!.id, { granteeWalletAddress, accessLevel }, txHash],
      )

      return NextResponse.json({ accessGrant: updateResult.rows[0] })
    } else {
      // Create new grant
      const newGrantResult = await query(
        `INSERT INTO access_grants
         (dataset_id, grantee_id, access_level, granted_by, expires_at, tx_hash)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [datasetId, granteeId, accessLevel, req.user!.id, new Date(expiresAt), txHash],
      )

      // Log audit event
      await query(
        `INSERT INTO audit_logs (action, dataset_id, user_id, details, tx_hash)
         VALUES ($1, $2, $3, $4, $5)`,
        ["access_granted", datasetId, req.user!.id, { granteeWalletAddress, accessLevel }, txHash],
      )

      // Check if there was a pending request and update it
      await query(
        `UPDATE access_requests
         SET status = 'approved', processed_at = CURRENT_TIMESTAMP, processed_by = $1, tx_hash = $2
         WHERE dataset_id = $3 AND requester_id = $4 AND status = 'pending'`,
        [req.user!.id, txHash, datasetId, granteeId],
      )

      return NextResponse.json({ accessGrant: newGrantResult.rows[0] }, { status: 201 })
    }
  } catch (error) {
    console.error("Error granting access:", error)
    return NextResponse.json({ error: "Failed to grant access" }, { status: 500 })
  }
}
