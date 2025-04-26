import { query } from "./db"

// Initialize wallet-related database schema
export async function initializeWalletSchema() {
  // Add wallet_type column to users table if it doesn't exist
  await query(`
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS wallet_type TEXT DEFAULT 'sui',
    ADD COLUMN IF NOT EXISTS wallet_metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0
  `)

  // Create wallet_sessions table
  await query(`
    CREATE TABLE IF NOT EXISTS wallet_sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      session_token TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create wallet_nonces table for preventing replay attacks
  await query(`
    CREATE TABLE IF NOT EXISTS wallet_nonces (
      id SERIAL PRIMARY KEY,
      wallet_address TEXT NOT NULL,
      nonce TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(wallet_address, nonce)
    )
  `)

  // Create wallet_activity table
  await query(`
    CREATE TABLE IF NOT EXISTS wallet_activity (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) NOT NULL,
      activity_type TEXT NOT NULL,
      details JSONB DEFAULT '{}'::jsonb,
      ip_address TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  console.log("Wallet schema initialized successfully")
}

// Generate a nonce for wallet authentication
export async function generateWalletNonce(walletAddress: string): Promise<string> {
  try {
    // Generate a random nonce
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration time (5 minutes from now)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000)

    // Store nonce in database
    await query("INSERT INTO wallet_nonces (wallet_address, nonce, expires_at) VALUES ($1, $2, $3)", [
      walletAddress,
      nonce,
      expiresAt,
    ])

    return nonce
  } catch (error) {
    console.error("Error generating wallet nonce:", error)
    throw error
  }
}

// Verify and consume a nonce
export async function verifyAndConsumeNonce(walletAddress: string, nonce: string): Promise<boolean> {
  try {
    // Check if nonce exists and is valid
    const result = await query(
      `SELECT id FROM wallet_nonces 
       WHERE wallet_address = $1 AND nonce = $2 AND expires_at > CURRENT_TIMESTAMP AND used = FALSE`,
      [walletAddress, nonce],
    )

    if (result.rows.length === 0) {
      return false
    }

    // Mark nonce as used
    await query("UPDATE wallet_nonces SET used = TRUE WHERE id = $1", [result.rows[0].id])

    return true
  } catch (error) {
    console.error("Error verifying nonce:", error)
    return false
  }
}

// Create a session for a wallet
export async function createWalletSession(userId: number, ipAddress?: string, userAgent?: string): Promise<string> {
  try {
    // Generate a random session token
    const sessionToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

    // Set expiration time (7 days from now)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    // Store session in database
    await query(
      `INSERT INTO wallet_sessions (user_id, session_token, expires_at, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, sessionToken, expiresAt, ipAddress || null, userAgent || null],
    )

    // Update user's last login and increment login count
    await query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP, login_count = login_count + 1 
       WHERE id = $1`,
      [userId],
    )

    return sessionToken
  } catch (error) {
    console.error("Error creating wallet session:", error)
    throw error
  }
}

// Verify a session token
export async function verifySessionToken(sessionToken: string): Promise<any | null> {
  try {
    // Check if session exists and is valid
    const result = await query(
      `SELECT ws.*, u.wallet_address, u.name, u.email 
       FROM wallet_sessions ws
       JOIN users u ON ws.user_id = u.id
       WHERE ws.session_token = $1 AND ws.expires_at > CURRENT_TIMESTAMP`,
      [sessionToken],
    )

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error verifying session token:", error)
    return null
  }
}

// Log wallet activity
export async function logWalletActivity(
  userId: number,
  activityType: string,
  details: any = {},
  ipAddress?: string,
): Promise<void> {
  try {
    await query(
      `INSERT INTO wallet_activity (user_id, activity_type, details, ip_address) 
       VALUES ($1, $2, $3, $4)`,
      [userId, activityType, details, ipAddress || null],
    )
  } catch (error) {
    console.error("Error logging wallet activity:", error)
    // Don't throw error to prevent disrupting the main flow
  }
}

// Initialize wallet schema on first import in development
if (process.env.NODE_ENV === "development") {
  initializeWalletSchema().catch(console.error)
}
