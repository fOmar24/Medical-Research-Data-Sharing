import { JsonRpcProvider, Connection } from "@mysten/sui.js"

// Configure Sui RPC provider
const connection = new Connection({
  fullnode: process.env.SUI_RPC_URL || "https://fullnode.mainnet.sui.io",
})

// Create provider instance
const provider = new JsonRpcProvider(connection)

export { provider }

// Helper function to verify a transaction
export async function verifyTransaction(txHash: string) {
  try {
    const txResponse = await provider.getTransactionBlock({
      digest: txHash,
      options: {
        showEffects: true,
        showInput: true,
      },
    })

    return {
      valid: txResponse.effects?.status.status === "success",
      timestamp: txResponse.timestampMs,
      sender: txResponse.transaction?.data.sender,
      effects: txResponse.effects,
    }
  } catch (error) {
    console.error("Error verifying transaction:", error)
    return { valid: false }
  }
}

// Helper function to get object data
export async function getObjectData(objectId: string) {
  try {
    const objectResponse = await provider.getObject({
      id: objectId,
      options: {
        showContent: true,
        showOwner: true,
      },
    })

    return objectResponse
  } catch (error) {
    console.error("Error getting object data:", error)
    throw error
  }
}
