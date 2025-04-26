"use client"

import { useState } from "react"
import { useWallet } from "@/lib/sui-wallet"

interface TransactionState {
  loading: boolean
  error: Error | null
  txId: string | null
  success: boolean
}

export function useSuiTransaction() {
  const { connected, signAndExecuteTransaction } = useWallet()
  const [state, setState] = useState<TransactionState>({
    loading: false,
    error: null,
    txId: null,
    success: false,
  })

  const executeTransaction = async (transaction: any) => {
    if (!connected) {
      setState({
        loading: false,
        error: new Error("Wallet not connected"),
        txId: null,
        success: false,
      })
      return null
    }

    setState({
      loading: true,
      error: null,
      txId: null,
      success: false,
    })

    try {
      const response = await signAndExecuteTransaction(transaction)

      // Check if transaction was successful
      const success = response.effects?.status?.status === "success"

      setState({
        loading: false,
        error: null,
        txId: response.digest,
        success,
      })

      return response
    } catch (error) {
      setState({
        loading: false,
        error: error instanceof Error ? error : new Error("Transaction failed"),
        txId: null,
        success: false,
      })
      return null
    }
  }

  return {
    executeTransaction,
    ...state,
  }
}
