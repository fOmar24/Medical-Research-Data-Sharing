"use client"

import { useState } from "react"
import { useWallet } from "@/lib/sui-wallet"

// API response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

// API hook options
export interface UseApiOptions {
  requireAuth?: boolean
}

export function useApi(options: UseApiOptions = {}) {
  const { requireAuth = true } = options
  const { connected, account, signMessage } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generate authentication token
  const getAuthToken = async (): Promise<string | null> => {
    if (!connected || !account) return null

    try {
      // Create message with timestamp to prevent replay attacks
      const timestamp = Date.now()
      const message = `Authenticate to MedChain: ${timestamp}`

      // Sign message
      const signature = await signMessage(message)

      // Format token as walletAddress:signature:message:timestamp
      return `${account}:${signature}:${message}:${timestamp}`
    } catch (err) {
      console.error("Failed to generate auth token:", err)
      return null
    }
  }

  // Generic fetch function with authentication
  const fetchWithAuth = async <T,>(url: string, method: string, body?: any): Promise<ApiResponse<T>> => {
    setLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      }

      // Add authentication if required
      if (requireAuth) {
        if (!connected) {
          setError("Wallet not connected")
          setLoading(false)
          return { error: "Wallet not connected", status: 401 }
        }

        const token = await getAuthToken()
        if (!token) {
          setError("Failed to authenticate")
          setLoading(false)
          return { error: "Failed to authenticate", status: 401 }
        }

        headers["Authorization"] = `Bearer ${token}`
      }

      // Make request
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      // Parse response
      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || "An error occurred"
        setError(errorMessage)
        setLoading(false)
        return { error: errorMessage, status: response.status }
      }

      setLoading(false)
      return { data, status: response.status }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      setLoading(false)
      return { error: errorMessage, status: 500 }
    }
  }

  // API methods
  const api = {
    // User endpoints
    getProfile: () => fetchWithAuth<{ user: any }>("/api/users/me", "GET"),
    updateProfile: (data: any) => fetchWithAuth<{ user: any }>("/api/users/me", "PUT", data),

    // Dataset endpoints
    getDatasets: (params?: Record<string, string>) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
      return fetchWithAuth<{ datasets: any[]; pagination: any }>(`/api/datasets${queryString}`, "GET")
    },
    getDataset: (id: string) => fetchWithAuth<{ dataset: any; hasAccess: boolean }>(`/api/datasets/${id}`, "GET"),
    createDataset: (data: any) => fetchWithAuth<{ dataset: any }>("/api/datasets", "POST", data),
    updateDataset: (id: string, data: any) => fetchWithAuth<{ dataset: any }>(`/api/datasets/${id}`, "PUT", data),

    // Access control endpoints
    getAccessGrants: (datasetId: string) =>
      fetchWithAuth<{ accessGrants: any[] }>(`/api/datasets/${datasetId}/access`, "GET"),
    grantAccess: (datasetId: string, data: any) =>
      fetchWithAuth<{ accessGrant: any }>(`/api/datasets/${datasetId}/access`, "POST", data),
    revokeAccess: (datasetId: string, grantId: string, data: any) =>
      fetchWithAuth<{ success: boolean }>(`/api/datasets/${datasetId}/access/${grantId}`, "DELETE", data),

    // Access request endpoints
    getAccessRequests: (datasetId: string) =>
      fetchWithAuth<{ accessRequests: any[] }>(`/api/datasets/${datasetId}/requests`, "GET"),
    requestAccess: (datasetId: string, data: any) =>
      fetchWithAuth<{ accessRequest: any }>(`/api/datasets/${datasetId}/requests`, "POST", data),

    // Audit endpoints
    getAuditLogs: (params?: Record<string, string>) => {
      const queryString = params ? `?${new URLSearchParams(params).toString()}` : ""
      return fetchWithAuth<{ auditLogs: any[]; pagination: any }>(`/api/audit${queryString}`, "GET")
    },

    // Storage endpoints
    getUploadUrl: (data: { fileName: string; contentType: string; metadata?: any }) =>
      fetchWithAuth<{ url: string; cid: string; expires: Date }>("/api/storage/upload-url", "POST", data),
  }

  return {
    api,
    loading,
    error,
  }
}
