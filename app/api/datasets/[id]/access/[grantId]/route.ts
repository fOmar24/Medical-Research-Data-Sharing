import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { verifyTransaction } from "@/lib/server-sui-client"

// DELETE /api/datasets/:id/access/:grantId - Revoke access
export async function DELETE(req: AuthenticatedRequest, { params }: { params: { id: string; grantId: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)
    const grantId = Number.parseInt(params.grantId)
    const { txHash } = await req.json()

    // Validate required fields
    if (!txHash) {
      return NextResponse.json({ error: "Missing transaction hash" }, { status: 400 })
    }

    // Check if user is the owner
    const ownerCheck = await query("SELECT owner_id FROM datasets WHERE id = $1", [datasetId])

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    if (ownerCheck.rows[0].owner_id !== req.user!.id) {
      return NextResponse.json({ error: "Not authorized to revoke access" }, { status: 403 })
    }

    // Verify transaction on blockchain
    const txVerification = await verifyTransaction(txHash)
    if (!txVerification.valid) {
      return NextResponse.json({ error: "Invalid transaction" }, { status: 400 })
    }

    // Get grant details
    const grantCheck = await query(
      `SELECT ag.*, u.wallet_address as grantee_wallet_address
       FROM access_grants ag
       JOIN users u ON ag.grantee_id = u.id
       WHERE ag.id = $1 AND ag.dataset_id = $2`,
      [grantId, datasetId],
    )

    if (grantCheck.rows.length === 0) {
      return NextResponse.json({ error: "Access grant not found" }, { status: 404 })
    }

    // Revoke access
    const revokeResult = await query(
      `UPDATE access_grants
       SET revoked = true, revoked_at = CURRENT_TIMESTAMP, revoked_by = $1, revocation_tx_hash = $2
       WHERE id = $3
       RETURNING *`,
      [req.user!.id, txHash, grantId],
    )

    // Log audit event
    await query(
      `INSERT INTO audit_logs (action, dataset_id, user_id, details, tx_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        "access_revoked",
        datasetId,
        req.user!.id,
        { granteeWalletAddress: grantCheck.rows[0].grantee_wallet_address },
        txHash,
      ],
    )

    return NextResponse.json({ success: true, accessGrant: revokeResult.rows[0] })
  } catch (error) {
    console.error("Error revoking access:", error)
    return NextResponse.json({ error: "Failed to revoke access" }, { status: 500 })
  }
}
