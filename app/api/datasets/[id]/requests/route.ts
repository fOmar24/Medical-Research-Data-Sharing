import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"

// GET /api/datasets/:id/requests - Get access requests for a dataset
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
      return NextResponse.json({ error: "Not authorized to view access requests" }, { status: 403 })
    }

    // Get access requests
    const requestsResult = await query(
      `SELECT ar.*, u.wallet_address as requester_wallet_address, u.name as requester_name, u.email as requester_email
       FROM access_requests ar
       JOIN users u ON ar.requester_id = u.id
       WHERE ar.dataset_id = $1
       ORDER BY ar.requested_at DESC`,
      [datasetId],
    )

    return NextResponse.json({ accessRequests: requestsResult.rows })
  } catch (error) {
    console.error("Error getting access requests:", error)
    return NextResponse.json({ error: "Failed to get access requests" }, { status: 500 })
  }
}

// POST /api/datasets/:id/requests - Request access to a dataset
export async function POST(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)
    const { purpose } = await req.json()

    // Validate required fields
    if (!purpose) {
      return NextResponse.json({ error: "Missing purpose" }, { status: 400 })
    }

    // Check if dataset exists
    const datasetCheck = await query("SELECT id, owner_id FROM datasets WHERE id = $1", [datasetId])

    if (datasetCheck.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    // Check if user is not the owner
    if (datasetCheck.rows[0].owner_id === req.user!.id) {
      return NextResponse.json({ error: "Cannot request access to your own dataset" }, { status: 400 })
    }

    // Check if user already has access
    const accessCheck = await query(
      `SELECT id FROM access_grants
       WHERE dataset_id = $1 AND grantee_id = $2 AND revoked = false AND expires_at > CURRENT_TIMESTAMP`,
      [datasetId, req.user!.id],
    )

    if (accessCheck.rows.length > 0) {
      return NextResponse.json({ error: "You already have access to this dataset" }, { status: 400 })
    }

    // Check if there's already a pending request
    const pendingCheck = await query(
      `SELECT id FROM access_requests
       WHERE dataset_id = $1 AND requester_id = $2 AND status = 'pending'`,
      [datasetId, req.user!.id],
    )

    if (pendingCheck.rows.length > 0) {
      return NextResponse.json({ error: "You already have a pending request for this dataset" }, { status: 400 })
    }

    // Create access request
    const requestResult = await query(
      `INSERT INTO access_requests (dataset_id, requester_id, purpose)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [datasetId, req.user!.id, purpose],
    )

    // Log audit event
    await query(
      `INSERT INTO audit_logs (action, dataset_id, user_id, details)
       VALUES ($1, $2, $3, $4)`,
      ["access_requested", datasetId, req.user!.id, { purpose }],
    )

    return NextResponse.json({ accessRequest: requestResult.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error requesting access:", error)
    return NextResponse.json({ error: "Failed to request access" }, { status: 500 })
  }
}
