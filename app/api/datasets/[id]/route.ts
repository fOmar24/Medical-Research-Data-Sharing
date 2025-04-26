import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"

// GET /api/datasets/:id - Get dataset details
export async function GET(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)

    // Get dataset details
    const datasetResult = await query(
      `SELECT d.*, u.wallet_address as owner_wallet_address, u.name as owner_name
       FROM datasets d
       JOIN users u ON d.owner_id = u.id
       WHERE d.id = $1`,
      [datasetId],
    )

    if (datasetResult.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    const dataset = datasetResult.rows[0]

    // Check if user has access to this dataset
    const hasAccess = await checkDatasetAccess(req.user!.id, datasetId)

    // Get access grants if user is the owner
    let accessGrants = []
    if (dataset.owner_id === req.user!.id) {
      const accessResult = await query(
        `SELECT ag.*, u.wallet_address as grantee_wallet_address, u.name as grantee_name
         FROM access_grants ag
         JOIN users u ON ag.grantee_id = u.id
         WHERE ag.dataset_id = $1 AND ag.revoked = false`,
        [datasetId],
      )

      accessGrants = accessResult.rows
    }

    // Log audit event for data access
    if (hasAccess && dataset.owner_id !== req.user!.id) {
      await query(
        `INSERT INTO audit_logs (action, dataset_id, user_id, details)
         VALUES ($1, $2, $3, $4)`,
        ["data_accessed", datasetId, req.user!.id, { title: dataset.title }],
      )
    }

    return NextResponse.json({
      dataset,
      hasAccess,
      accessGrants: dataset.owner_id === req.user!.id ? accessGrants : undefined,
    })
  } catch (error) {
    console.error("Error getting dataset details:", error)
    return NextResponse.json({ error: "Failed to get dataset details" }, { status: 500 })
  }
}

// PUT /api/datasets/:id - Update dataset
export async function PUT(req: AuthenticatedRequest, { params }: { params: { id: string } }) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const datasetId = Number.parseInt(params.id)
    const { title, description, keywords } = await req.json()

    // Check if user is the owner
    const ownerCheck = await query("SELECT owner_id FROM datasets WHERE id = $1", [datasetId])

    if (ownerCheck.rows.length === 0) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 })
    }

    if (ownerCheck.rows[0].owner_id !== req.user!.id) {
      return NextResponse.json({ error: "Not authorized to update this dataset" }, { status: 403 })
    }

    // Update dataset
    const updateResult = await query(
      `UPDATE datasets
       SET title = $1, description = $2, keywords = $3, updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [title, description, keywords, datasetId],
    )

    // Log audit event
    await query(
      `INSERT INTO audit_logs (action, dataset_id, user_id, details)
       VALUES ($1, $2, $3, $4)`,
      ["dataset_updated", datasetId, req.user!.id, { title }],
    )

    return NextResponse.json({ dataset: updateResult.rows[0] })
  } catch (error) {
    console.error("Error updating dataset:", error)
    return NextResponse.json({ error: "Failed to update dataset" }, { status: 500 })
  }
}

// Helper function to check if a user has access to a dataset
async function checkDatasetAccess(userId: number, datasetId: number): Promise<boolean> {
  // Check if user is the owner
  const ownerCheck = await query("SELECT owner_id FROM datasets WHERE id = $1", [datasetId])

  if (ownerCheck.rows.length === 0) {
    return false
  }

  if (ownerCheck.rows[0].owner_id === userId) {
    return true
  }

  // Check if user has an active access grant
  const accessCheck = await query(
    `SELECT id FROM access_grants
     WHERE dataset_id = $1 AND grantee_id = $2 AND revoked = false AND expires_at > CURRENT_TIMESTAMP`,
    [datasetId, userId],
  )

  return accessCheck.rows.length > 0
}
