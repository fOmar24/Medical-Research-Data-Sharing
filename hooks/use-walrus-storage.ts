"use client"

import { useState } from "react"
import { walrusStorage, type WalrusUploadResult } from "@/lib/walrus-storage"

interface WalrusStorageState {
  uploading: boolean
  progress: number
  error: Error | null
  results: WalrusUploadResult[] | null
}

export function useWalrusStorage() {
  const [state, setState] = useState<WalrusStorageState>({
    uploading: false,
    progress: 0,
    error: null,
    results: null,
  })

  const uploadFiles = async (files: File[], metadata?: Record<string, any>) => {
    if (!files.length) {
      setState({
        ...state,
        error: new Error("No files to upload"),
      })
      return null
    }

    setState({
      uploading: true,
      progress: 0,
      error: null,
      results: null,
    })

    try {
      const results = await walrusStorage.uploadFiles(files, metadata, (progress) => {
        setState((prev) => ({
          ...prev,
          progress,
        }))
      })

      setState({
        uploading: false,
        progress: 100,
        error: null,
        results,
      })

      return results
    } catch (error) {
      setState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error : new Error("Failed to upload files"),
        results: null,
      })
      return null
    }
  }

  const uploadFile = async (file: File, metadata?: Record<string, any>) => {
    setState({
      uploading: true,
      progress: 0,
      error: null,
      results: null,
    })

    try {
      const result = await walrusStorage.uploadFile(file, metadata, (progress) => {
        setState((prev) => ({
          ...prev,
          progress,
        }))
      })

      setState({
        uploading: false,
        progress: 100,
        error: null,
        results: [result],
      })

      return result
    } catch (error) {
      setState({
        uploading: false,
        progress: 0,
        error: error instanceof Error ? error : new Error("Failed to upload file"),
        results: null,
      })
      return null
    }
  }

  return {
    uploadFile,
    uploadFiles,
    ...state,
  }
}
