"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { walrusStorage } from "@/lib/walrus-storage"
import { DownloadIcon, FileIcon, FileTextIcon, ImageIcon, DatabaseIcon, LoaderIcon } from "lucide-react"
import { useWallet } from "@/lib/sui-wallet"

interface WalrusDataViewerProps {
  cid: string
  title: string
  description?: string
  dataType?: string
  encrypted?: boolean
  hasAccess?: boolean
}

export function WalrusDataViewer({
  cid,
  title,
  description,
  dataType,
  encrypted = true,
  hasAccess = false,
}: WalrusDataViewerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { connected } = useWallet()

  const handleDownload = async () => {
    if (!connected || !hasAccess) return

    setLoading(true)
    setError(null)

    try {
      // Retrieve file from Walrus storage
      const blob = await walrusStorage.retrieveFile(cid)

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${title.replace(/\s+/g, "_")}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download file:", err)
      setError(err instanceof Error ? err : new Error("Failed to download file"))
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = () => {
    if (!dataType) return <FileIcon className="h-12 w-12 text-gray-400" />

    switch (dataType) {
      case "clinical":
        return <FileTextIcon className="h-12 w-12 text-blue-500" />
      case "genomic":
        return <DatabaseIcon className="h-12 w-12 text-purple-500" />
      case "imaging":
        return <ImageIcon className="h-12 w-12 text-green-500" />
      default:
        return <FileIcon className="h-12 w-12 text-gray-400" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-6 space-y-4">
          {getFileIcon()}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Stored on Walrus Decentralized Storage
              {encrypted && " (Encrypted)"}
            </p>
            <p className="text-xs font-mono mt-2 text-gray-500">{cid}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleDownload} disabled={loading || !connected || !hasAccess}>
          {loading ? (
            <>
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <DownloadIcon className="mr-2 h-4 w-4" />
              {hasAccess ? "Download Data" : "Request Access"}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
