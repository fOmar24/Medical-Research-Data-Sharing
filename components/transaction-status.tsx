"use client"

import { AlertCircleIcon, CheckCircleIcon, LoaderIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TransactionStatusProps {
  loading: boolean
  error: Error | null
  txId: string | null
  success: boolean
}

export function TransactionStatus({ loading, error, txId, success }: TransactionStatusProps) {
  if (!loading && !error && !txId) {
    return null
  }

  const explorerUrl = txId ? `https://explorer.sui.io/transaction/${txId}` : undefined

  return (
    <div
      className={`rounded-lg p-4 flex items-start gap-3 mt-4 ${
        error
          ? "bg-red-50 border border-red-200"
          : success
            ? "bg-green-50 border border-green-200"
            : "bg-blue-50 border border-blue-200"
      }`}
    >
      {loading && <LoaderIcon className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />}
      {error && <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />}
      {success && <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />}

      <div className="flex-1">
        {loading && <p className="text-sm text-blue-800 font-medium">Processing transaction...</p>}

        {error && (
          <>
            <p className="text-sm text-red-800 font-medium">Transaction failed</p>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
          </>
        )}

        {success && (
          <>
            <p className="text-sm text-green-800 font-medium">Transaction successful</p>
            {txId && (
              <p className="text-xs font-mono mt-1 text-green-700">
                Transaction ID: {txId.substring(0, 10)}...{txId.substring(txId.length - 6)}
              </p>
            )}
          </>
        )}
      </div>

      {txId && (
        <Button variant="outline" size="sm" className="shrink-0" onClick={() => window.open(explorerUrl, "_blank")}>
          <ExternalLinkIcon className="h-4 w-4 mr-1" />
          View
        </Button>
      )}
    </div>
  )
}
