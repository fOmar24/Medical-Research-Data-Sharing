"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useApi } from "@/hooks/use-api"
import { useWallet } from "@/lib/sui-wallet"
import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from "lucide-react"

export function ApiIntegrationDemo() {
  const { connected } = useWallet()
  const { api, loading, error } = useApi()
  const [profile, setProfile] = useState<any>(null)
  const [datasets, setDatasets] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])

  // Load profile when connected
  useEffect(() => {
    if (connected) {
      loadProfile()
    }
  }, [connected])

  // Load profile
  const loadProfile = async () => {
    const response = await api.getProfile()
    if (response.data) {
      setProfile(response.data.user)
    }
  }

  // Load datasets
  const loadDatasets = async () => {
    const response = await api.getDatasets({ limit: "5" })
    if (response.data) {
      setDatasets(response.data.datasets)
    }
  }

  // Load audit logs
  const loadAuditLogs = async () => {
    const response = await api.getAuditLogs({ limit: "5" })
    if (response.data) {
      setAuditLogs(response.data.auditLogs)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Backend API Integration</CardTitle>
        <CardDescription>Interact with the backend API</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {profile && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <h3 className="font-medium text-green-800">Profile Loaded</h3>
              <p className="text-sm text-green-700 mt-1">Wallet Address: {profile.wallet_address}</p>
            </div>
          )}

          {datasets.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h3 className="font-medium text-blue-800">Datasets Loaded</h3>
              <p className="text-sm text-blue-700 mt-1">{datasets.length} datasets found</p>
            </div>
          )}

          {auditLogs.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <h3 className="font-medium text-purple-800">Audit Logs Loaded</h3>
              <p className="text-sm text-purple-700 mt-1">{auditLogs.length} audit logs found</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button onClick={loadProfile} disabled={loading || !connected} className="flex-1">
            {loading ? (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircleIcon className="mr-2 h-4 w-4" />
            )}
            Load Profile
          </Button>
          <Button onClick={loadDatasets} disabled={loading || !connected} className="flex-1">
            {loading ? (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircleIcon className="mr-2 h-4 w-4" />
            )}
            Load Datasets
          </Button>
        </div>
        <Button onClick={loadAuditLogs} disabled={loading || !connected} className="w-full">
          {loading ? (
            <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircleIcon className="mr-2 h-4 w-4" />
          )}
          Load Audit Logs
        </Button>
      </CardFooter>
    </Card>
  )
}
