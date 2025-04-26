import { Ed25519Keypair, RawSigner } from "@mysten/sui.js/keypairs/ed25519"
import type { TransactionBlock } from "@mysten/sui.js/transactions"
import { verifyMessage } from "@mysten/sui.js/verify"
import { fromB64 } from "@mysten/sui.js/utils"
import { provider } from "./server-sui-client"
import { query } from "./db"

// Interface for wallet operations
export interface WalletOperations {
  getBalance: (address: string) => Promise<bigint>
  getOwnedObjects: (address: string) => Promise<any[]>
  verifySignature: (message: string, signature: string, address: string) => Promise<boolean>
  getTransactionHistory: (address: string, limit?: number) => Promise<any[]>
  createServerWallet: () => Promise<{ address: string; privateKey: string }>
  executeTransaction: (privateKey: string, txb: TransactionBlock) => Promise<any>
}

// Create a server wallet (for system operations)
export async function createServerWallet(): Promise<{ address: string; privateKey: string }> {
  // Generate a new keypair
  const keypair = new Ed25519Keypair()
  const address = keypair.getPublicKey().toSuiAddress()
  const privateKey = Buffer.from(keypair.export().privateKey).toString("base64")

  return { address, privateKey }
}

// Get wallet balance
export async function getWalletBalance(address: string): Promise<bigint> {
  try {
    const balance = await provider.getBalance({
      owner: address,
    })

    return BigInt(balance.totalBalance)
  } catch (error) {
    console.error("Error getting wallet balance:", error)
    throw error
  }
}

// Get owned objects
export async function getWalletOwnedObjects(address: string): Promise<any[]> {
  try {
    const objects = await provider.getOwnedObjects({
      owner: address,
    })

    return objects.data
  } catch (error) {
    console.error("Error getting owned objects:", error)
    throw error
  }
}

// Verify a signature
export async function verifyWalletSignature(message: string, signature: string, address: string): Promise<boolean> {
  try {
    return await verifyMessage({
      message,
      signature,
      address,
    })
  } catch (error) {
    console.error("Error verifying signature:", error)
    return false
  }
}

// Get transaction history
export async function getWalletTransactionHistory(address: string, limit = 10): Promise<any[]> {
  try {
    const transactions = await provider.queryTransactionBlocks({
      filter: {
        FromAddress: address,
      },
      options: {
        showInput: true,
        showEffects: true,
      },
      limit,
    })

    return transactions.data
  } catch (error) {
    console.error("Error getting transaction history:", error)
    throw error
  }
}

// Execute a transaction using a server wallet
export async function executeServerTransaction(privateKey: string, txb: TransactionBlock): Promise<any> {
  try {
    // Create keypair from private key
    const privateKeyBytes = fromB64(privateKey)
    const keypair = Ed25519Keypair.fromSecretKey(privateKeyBytes)

    // Create signer
    const signer = new RawSigner(keypair, provider)

    // Execute transaction
    const result = await signer.signAndExecuteTransactionBlock({
      transactionBlock: txb,
      options: {
        showEffects: true,
        showEvents: true,
      },
    })

    return result
  } catch (error) {
    console.error("Error executing transaction:", error)
    throw error
  }
}

// Get wallet operations
export function getWalletOperations(): WalletOperations {
  return {
    getBalance: getWalletBalance,
    getOwnedObjects: getWalletOwnedObjects,
    verifySignature: verifyWalletSignature,
    getTransactionHistory: getWalletTransactionHistory,
    createServerWallet,
    executeTransaction: executeServerTransaction,
  }
}

// Register a wallet in the database
export async function registerWallet(address: string, name?: string, email?: string): Promise<number> {
  try {
    // Check if wallet already exists
    const existingWallet = await query("SELECT id FROM users WHERE wallet_address = $1", [address])

    if (existingWallet.rows.length > 0) {
      return existingWallet.rows[0].id
    }

    // Insert new wallet
    const result = await query("INSERT INTO users (wallet_address, name, email) VALUES ($1, $2, $3) RETURNING id", [
      address,
      name || null,
      email || null,
    ])

    return result.rows[0].id
  } catch (error) {
    console.error("Error registering wallet:", error)
    throw error
  }
}

// Get wallet by address
export async function getWalletByAddress(address: string): Promise<any | null> {
  try {
    const result = await query("SELECT * FROM users WHERE wallet_address = $1", [address])

    if (result.rows.length === 0) {
      return null
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error getting wallet by address:", error)
    throw error
  }
}

// Update wallet information
export async function updateWalletInfo(
  address: string,
  updates: { name?: string; email?: string; organization?: string },
): Promise<any> {
  try {
    const { name, email, organization } = updates

    // Build update query
    const updateFields = []
    const params = [address]
    let paramIndex = 2

    if (name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`)
      params.push(name)
    }

    if (email !== undefined) {
      updateFields.push(`email = $${paramIndex++}`)
      params.push(email)
    }

    if (organization !== undefined) {
      updateFields.push(`organization = $${paramIndex++}`)
      params.push(organization)
    }

    if (updateFields.length === 0) {
      throw new Error("No fields to update")
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)

    // Execute update
    const result = await query(
      `UPDATE users SET ${updateFields.join(", ")} WHERE wallet_address = $1 RETURNING *`,
      params,
    )

    if (result.rows.length === 0) {
      throw new Error("Wallet not found")
    }

    return result.rows[0]
  } catch (error) {
    console.error("Error updating wallet info:", error)
    throw error
  }
}
