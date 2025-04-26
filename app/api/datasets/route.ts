import { NextResponse } from "next/server"
import { query } from "@/lib/db"
import { authMiddleware, type AuthenticatedRequest } from "@/lib/auth-middleware"
import { verifyTransaction } from "@/lib/server-sui-client"
import { walrusServerStorage } from "@/lib/server-walrus-storage"

// GET /api/datasets - Get all datasets
export async function GET(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const search = searchParams.get("search") || ""
    const dataType = searchParams.get("dataType") || ""
    const owned = searchParams.get("owned") === "true"

    // Build query
    let sql = `
      SELECT d.*, u.wallet_address as owner_wallet_address, u.name as owner_name
      FROM datasets d
      JOIN users u ON d.owner_id = u.id
    `

    const queryParams: any[] = []
    const conditions: string[] = []

    // Add search condition
    if (search) {
      queryParams.push(`%${search}%`)
      conditions.push(`(d.title ILIKE $${queryParams.length} OR d.description ILIKE $${queryParams.length})`)
    }

    // Add data type condition
    if (dataType) {
      queryParams.push(dataType)
      conditions.push(`d.data_type = $${queryParams.length}`)
    }

    // Add owned condition
    if (owned) {
      queryParams.push(req.user!.id)
      conditions.push(`d.owner_id = $${queryParams.length}`)
    }

    // Add conditions to query
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`
    }

    // Add pagination
    sql += ` ORDER BY d.created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`
    queryParams.push(limit, offset)

    // Execute query
    const result = await query(sql, queryParams)

    // Get total count
    let countSql = `SELECT COUNT(*) FROM datasets d`
    if (conditions.length > 0) {
      countSql += ` WHERE ${conditions.join(" AND ")}`
    }

    const countResult = await query(countSql, queryParams.slice(0, -2))
    const total = Number.parseInt(countResult.rows[0].count)

    return NextResponse.json({
      datasets: result.rows,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error getting datasets:", error)
    return NextResponse.json({ error: "Failed to get datasets" }, { status: 500 })
  }
}

// POST /api/datasets - Create a new dataset
export async function POST(req: AuthenticatedRequest) {
  // Verify authentication
  const authResponse = await authMiddleware(req)
  if (authResponse) return authResponse

  try {
    const { title, description, dataType, licenseType, keywords, txHash, walrusCids, encrypted, encryptionType } =
      await req.json()

    // Validate required fields
    if (!title || !dataType || !licenseType || !txHash || !walrusCids || !Array.isArray(walrusCids)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify transaction on blockchain
    const txVerification = await verifyTransaction(txHash)
    if (!txVerification.valid) {
      return NextResponse.json({ error: "Invalid transaction" }, { status: 400 })
    }

    // Verify Walrus CIDs
    for (const cid of walrusCids) {
      const isValid = await walrusServerStorage.verifyCid(cid)
      if (!isValid) {
        return NextResponse.json({ error: `Invalid Walrus CID: ${cid}` }, { status: 400 })
      }
    }

    // Create dataset in database
    const result = await query(
      `INSERT INTO datasets 
       (title, description, data_type, license_type, keywords, owner_id, tx_hash, walrus_cids, encrypted, encryption_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        title,
        description,
        dataType,
        licenseType,
        keywords,
        req.user!.id,
        txHash,
        walrusCids,
        encrypted,
        encryptionType,
      ],
    )

    // Log audit event
    await query(
      `INSERT INTO audit_logs (action, dataset_id, user_id, details, tx_hash)
       VALUES ($1, $2, $3, $4, $5)`,
      ["data_registered", result.rows[0].id, req.user!.id, { title, dataType }, txHash],
    )

    return NextResponse.json({ dataset: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating dataset:", error)
    return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 })
  }
}
