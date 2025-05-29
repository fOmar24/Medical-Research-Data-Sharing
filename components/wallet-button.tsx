"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WalletModal } from "@/components/wallet-modal"
import { useCurrentAccount } from '@mysten/dapp-kit';
import { ConnectButton } from "@mysten/dapp-kit"

export function WalletButton() {
  const account = useCurrentAccount();

  const isConnected = !!account;

  return (
    <div>
      <WalletModal
        trigger={
          isConnected ? (
            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1 cursor-pointer">
              {account?.address.substring(0, 6)}...{account?.address.substring(account.address.length - 4)}
            </Badge>
          ) : (
            <ConnectButton />
          )
        }
      />
      <div className="mt-2 text-sm">
        {isConnected ? (
          <span className="text-green-600">Wallet Connected</span>
        ) : (
          <span className="text-red-600">Wallet Not Connected</span>
        )}
      </div>
    </div>
  )
}
