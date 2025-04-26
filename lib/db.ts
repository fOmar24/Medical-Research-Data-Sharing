import { Pool } from "pg"
import { initializeWalletSchema } from "./db-wallet-schema"

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Error executing query", { text, error })
    throw error
  }
}

// Database schema initialization
export async function initializeDatabase() {
  // Create users table
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      wallet_address TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      organization TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create datasets table
  await query(`
    CREATE TABLE IF NOT EXISTS datasets (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      data_type TEXT NOT NULL,
      license_type TEXT NOT NULL,
      keywords TEXT[],
      owner_id INTEGER REFERENCES users(id) NOT NULL,
      tx_hash TEXT,
      walrus_cids TEXT[],
      encrypted BOOLEAN DEFAULT TRUE,
      encryption_type TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create access_grants table
  await query(`
    CREATE TABLE IF NOT EXISTS access_grants (
      id SERIAL PRIMARY KEY,
      dataset_id INTEGER REFERENCES datasets(id) NOT NULL,
      grantee_id INTEGER REFERENCES users(id) NOT NULL,
      access_level TEXT NOT NULL,
      granted_by INTEGER REFERENCES users(id) NOT NULL,
      granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      tx_hash TEXT,
      revoked BOOLEAN DEFAULT FALSE,
      revoked_at TIMESTAMP WITH TIME ZONE,
      revoked_by INTEGER REFERENCES users(id),
      revocation_tx_hash TEXT
    )
  `)

  // Create access_requests table
  await query(`
    CREATE TABLE IF NOT EXISTS access_requests (
      id SERIAL PRIMARY KEY,
      dataset_id INTEGER REFERENCES datasets(id) NOT NULL,
      requester_id INTEGER REFERENCES users(id) NOT NULL,
      purpose TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      processed_at TIMESTAMP WITH TIME ZONE,
      processed_by INTEGER REFERENCES users(id),
      tx_hash TEXT
    )
  `)

  // Create audit_logs table
  await query(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id SERIAL PRIMARY KEY,
      action TEXT NOT NULL,
      dataset_id INTEGER REFERENCES datasets(id),
      user_id INTEGER REFERENCES users(id),
      details JSONB,
      tx_hash TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Initialize wallet schema
  await initializeWalletSchema()

  console.log("Database initialized successfully")
}

// Initialize database on first import in development
if (process.env.NODE_ENV === "development") {
  initializeDatabase().catch(console.error)
}
