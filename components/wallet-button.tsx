"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletModal } from "@/components/wallet-modal"
import { useWallet } from "@/lib/sui-wallet"
import { WalletIcon } from "lucide-react"

export function WalletButton() {
  const { connected, account } = useWallet()

  return (
    <WalletModal
      trigger={
        connected ? (
          <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1 cursor-pointer">
            {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
          </Badge>
        ) : (
          <Button variant="outline" className="flex items-center gap-2">
            <WalletIcon className="h-4 w-4" />
            Connect Wallet
          </Button>
        )
      }
    />
  )
}
