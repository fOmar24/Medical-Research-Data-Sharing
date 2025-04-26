"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useWallet } from "@/lib/sui-wallet"
import { WalletIcon, AlertCircleIcon } from "lucide-react"
import Image from "next/image"

interface WalletModalProps {
  trigger?: React.ReactNode
}

export function WalletModal({ trigger }: WalletModalProps) {
  const { wallets, wallet, select, connect, connecting, connected, disconnect, error, account } = useWallet()
  const [open, setOpen] = useState(false)

  const handleSelectWallet = (walletName: string) => {
    select(walletName)
  }

  const handleConnect = async () => {
    try {
      await connect()
      setOpen(false)
    } catch (err) {
      console.error("Failed to connect:", err)
    }
  }

  const handleDisconnect = async () => {
    try {
      await disconnect()
      setOpen(false)
    } catch (err) {
      console.error("Failed to disconnect:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="flex items-center gap-2">
            <WalletIcon className="h-4 w-4" />
            {connected ? "Wallet Connected" : "Connect Wallet"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{connected ? "Wallet Connected" : "Connect Wallet"}</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
            <AlertCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="text-sm text-red-800">{error.message}</p>
            </div>
          </div>
        )}

        {connected ? (
          <div className="space-y-4">
            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                {wallet?.icon && (
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-white p-1">
                    <Image src={wallet.icon || "/placeholder.svg"} alt={wallet.name} width={24} height={24} />
                  </div>
                )}
                <div>
                  <p className="font-medium">{wallet?.name}</p>
                  <p className="text-sm text-muted-foreground">Connected</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm font-medium">Wallet Address</p>
                <p className="text-xs font-mono bg-white p-2 rounded border mt-1 truncate">{account}</p>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={handleDisconnect}>
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect your Sui wallet to register and manage medical research data on the blockchain.
            </p>

            <div className="space-y-2">
              {wallets.map((w) => (
                <div
                  key={w.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    wallet?.name === w.name
                      ? "border-teal-200 bg-teal-50"
                      : "border-gray-200 hover:border-teal-200 hover:bg-teal-50"
                  }`}
                  onClick={() => handleSelectWallet(w.name)}
                >
                  <div className="flex items-center gap-3">
                    {w.icon && (
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-white p-1">
                        <Image src={w.icon || "/placeholder.svg"} alt={w.name} width={24} height={24} />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{w.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {wallet?.name === w.name ? "Selected" : "Click to select"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className="w-full bg-teal-600 hover:bg-teal-700"
              onClick={handleConnect}
              disabled={!wallet || connecting}
            >
              {connecting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
