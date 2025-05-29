"use client"

import { useState } from "react"
import { useWallet } from "@/lib/sui-wallet"

interface WalletBackendState {
  loading: boolean
  error: string | null
  sessionToken: string | null
  sessionExpiry: Date | null
  profile: {
    organization: string
    id: number
    walletAddress: string
    name?: string
    email?: string
  } | null
  balance: {
    value: string
    formatted: string
  } | null
  transactions: any[] | null
}

export function useWalletBackend() {
  const { connected, account, signMessage } = useWallet()
  const [state, setState] = useState<WalletBackendState>({
    loading: false,
    error: null,
    sessionToken: null,
    sessionExpiry: null,
    profile: null,
    balance: null,
    transactions: null,
  })

  // Helper to make authenticated requests
  const fetchWithAuth = async (url: string, method = "GET", body?: any) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add session token if available
      if (state.sessionToken) {
        headers["Authorization"] = `Session ${state.sessionToken}`
      }

      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Request failed")
      }

      setState((prev) => ({ ...prev, loading: false }))
      return data
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }))
      throw error
    }
  }

  // Get nonce for authentication
  const getNonce = async (): Promise<string> => {
    if (!connected || !account) {
      throw new Error("Wallet not connected")
    }

    const response = await fetch(`/api/wallet/nonce?address=${account}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Failed to get nonce")
    }

    return data.nonce
  }

  // Authenticate with wallet
  const authenticate = async (): Promise<void> => {
    if (!connected || !account) {
      setState((prev) => ({
        ...prev,
        error: "Wallet not connected",
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      // Get nonce
      const nonce = await getNonce()

      // Create message to sign
      const message = `Authenticate to MedChain: ${nonce}`

      // Sign message
      const signature = await signMessage(message)

      // Create authentication token
      const authToken = `${account}:${signature}:${message}:${nonce}`

      // Authenticate with backend
      const response = await fetch("/api/wallet/auth", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Store session token
      setState((prev) => ({
        ...prev,
        loading: false,
        sessionToken: data.sessionToken,
        sessionExpiry: new Date(data.expiresAt),
        profile: data.user,
      }))

      // Store session token in cookie for persistence
      document.cookie = `session_token=${data.sessionToken}; path=/; expires=${new Date(data.expiresAt).toUTCString()}`

      // Fetch additional wallet data
      await Promise.all([getBalance(), getTransactions()])
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Authentication failed",
      }))
    }
  }

  // Check session
  const checkSession = async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch("/api/wallet/session")

      if (!response.ok) {
        setState((prev) => ({
          ...prev,
          loading: false,
          sessionToken: null,
          sessionExpiry: null,
          profile: null,
        }))
        return false
      }

      const data = await response.json()

      setState((prev) => ({
        ...prev,
        loading: false,
        sessionToken:
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("session_token="))
            ?.split("=")[1] || null,
        sessionExpiry: new Date(data.session.expiresAt),
        profile: data.user,
      }))

      return true
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Session check failed",
        sessionToken: null,
        sessionExpiry: null,
        profile: null,
      }))
      return false
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      await fetchWithAuth("/api/wallet/session", "DELETE")

      // Clear state
      setState({
        loading: false,
        error: null,
        sessionToken: null,
        sessionExpiry: null,
        profile: null,
        balance: null,
        transactions: null,
      })

      // Clear cookie
      document.cookie = "session_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Logout failed",
      }))
    }
  }

  // Get wallet balance
  const getBalance = async (): Promise<void> => {
    try {
      const data = await fetchWithAuth("/api/wallet/balance")

      setState((prev) => ({
        ...prev,
        balance: {
          value: data.balance,
          formatted: data.formatted,
        },
      }))
    } catch (error) {
      console.error("Failed to get balance:", error)
      // Don't update state to avoid overriding other data
    }
  }

  // Get wallet transactions
  const getTransactions = async (limit = 10): Promise<void> => {
    try {
      const data = await fetchWithAuth(`/api/wallet/transactions?limit=${limit}`)

      setState((prev) => ({
        ...prev,
        transactions: data.transactions,
      }))
    } catch (error) {
      console.error("Failed to get transactions:", error)
      // Don't update state to avoid overriding other data
    }
  }

  // Update profile
  const updateProfile = async (updates: { name?: string; email?: string; organization?: string }): Promise<void> => {
    try {
      const data = await fetchWithAuth("/api/wallet/profile", "PUT", updates)

      setState((prev) => ({
        ...prev,
        profile: data.profile,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to update profile",
      }))
    }
  }

  return {
    ...state,
    authenticate,
    checkSession,
    logout,
    getBalance,
    getTransactions,
    updateProfile,
    isAuthenticated: !!state.sessionToken && !!state.profile,
  }
}
