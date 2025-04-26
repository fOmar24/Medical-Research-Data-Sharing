"use client"

import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadProgressProps {
  uploading: boolean
  progress: number
  error: Error | null
  fileName?: string
}

export function UploadProgress({ uploading, progress, error, fileName }: UploadProgressProps) {
  if (!uploading && !error && progress === 0) {
    return null
  }

  return (
    <div
      className={`rounded-lg p-4 flex items-start gap-3 mt-4 ${
        error
          ? "bg-red-50 border border-red-200"
          : progress === 100
            ? "bg-green-50 border border-green-200"
            : "bg-blue-50 border border-blue-200"
      }`}
    >
      {uploading && <LoaderIcon className="h-5 w-5 text-blue-600 animate-spin mt-0.5" />}
      {error && <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />}
      {!uploading && !error && progress === 100 && <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5" />}

      <div className="flex-1">
        {uploading && (
          <>
            <p className="text-sm text-blue-800 font-medium">
              Uploading {fileName ? fileName : "files"} to Walrus storage...
            </p>
            <Progress value={progress} className="h-2 mt-2" />
            <p className="text-xs text-blue-600 mt-1">{progress}% complete</p>
          </>
        )}

        {error && (
          <>
            <p className="text-sm text-red-800 font-medium">Upload failed</p>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
          </>
        )}

        {!uploading && !error && progress === 100 && (
          <>
            <p className="text-sm text-green-800 font-medium">Upload complete</p>
            <p className="text-xs text-green-700 mt-1">
              {fileName ? fileName : "Files"} successfully uploaded to Walrus decentralized storage
            </p>
          </>
        )}
      </div>
    </div>
  )
}
