import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"

// GET /api/audit - Get audit logs
export async function GET(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const datasetId = searchParams.get("datasetId")
    const action = searchParams.get("action")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build query
    let sql = `
      SELECT al.*, 
             d.title as dataset_title, 
             u.wallet_address as user_wallet_address,
             u.name as user_name
      FROM audit_logs al
      LEFT JOIN datasets d ON al.dataset_id = d.id
      LEFT JOIN users u ON al.user_id = u.id
    `

    const queryParams: any[] = []
    const conditions: string[] = []

    // Add dataset filter
    if (datasetId) {
      queryParams.push(Number.parseInt(datasetId))
      conditions.push(`al.dataset_id = $${queryParams.length}`)
    }

    // Add action filter
    if (action) {
      queryParams.push(action)
      conditions.push(`al.action = $${queryParams.length}`)
    }

    // Add date range filter
    if (startDate) {
      queryParams.push(new Date(startDate))
      conditions.push(`al.created_at >= $${queryParams.length}`)
    }

    if (endDate) {
      queryParams.push(new Date(endDate))
      conditions.push(`al.created_at <= $${queryParams.length}`)
    }

    // Add user filter - only show logs for datasets owned by the user or actions performed by the user
    queryParams.push(req.user!.id)
    conditions.push(`(d.owner_id = $${queryParams.length} OR al.user_id = $${queryParams.length})`)

    // Add conditions to query
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`
    }

    // Add pagination
    sql += ` ORDER BY al.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`
    queryParams.push(limit, offset)

    // Execute query
    const result = await query(sql, queryParams)

    // Get total count
    let countSql = `
      SELECT COUNT(*) 
      FROM audit_logs al
      LEFT JOIN datasets d ON al.dataset_id = d.id
    `

    if (conditions.length > 0) {
      countSql += ` WHERE ${conditions.join(" AND ")}`
    }

    const countResult = await query(countSql, queryParams.slice(0, -2))
    const total = Number.parseInt(countResult.rows[0].count)

    return NextResponse.json({
      auditLogs: result.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error getting audit logs:", error)
    return NextResponse.json({ error: "Failed to get audit logs" }, { status: 500 })
  }
}
