"use client"

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react"
import { WalletContext, type WalletConnectionStatus, type SuiWallet } from "@/lib/sui-wallet"

// Mock wallet adapters for demonstration
// In a real implementation, you would import actual wallet adapters
const mockWallets: SuiWallet[] = [
  {
    name: "Sui Wallet",
    icon: "/sui-wallet-icon.png",
    adapter: {
      name: "Sui Wallet",
      connect: async () => ({ address: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b" }),
      disconnect: async () => {},
      signAndExecuteTransaction: async (tx: any) => ({
        digest: "0x123456789abcdef",
        effects: { status: { status: "success" } },
      }),
      signMessage: async (msg: string) => ({ signature: "0xsignature" }),
    },
  },
  {
    name: "Ethos Wallet",
    icon: "/ethos-wallet-icon.png",
    adapter: {
      name: "Ethos Wallet",
      connect: async () => ({ address: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c" }),
      disconnect: async () => {},
      signAndExecuteTransaction: async (tx: any) => ({
        digest: "0x123456789abcdef",
        effects: { status: { status: "success" } },
      }),
      signMessage: async (msg: string) => ({ signature: "0xsignature" }),
    },
  },
]

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // State
  const [wallets] = useState<SuiWallet[]>(mockWallets)
  const [wallet, setWallet] = useState<SuiWallet | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<WalletConnectionStatus>("disconnected")
  const [balance, setBalance] = useState<string>("0")
  const [network, setNetwork] = useState<string>("mainnet")
  const [error, setError] = useState<Error | null>(null)

  // Derived state
  const connecting = connectionStatus === "connecting"
  const connected = connectionStatus === "connected"

  // Check for stored wallet on mount
  useEffect(() => {
    const storedWalletName = localStorage.getItem("selectedWallet")
    if (storedWalletName) {
      const storedWallet = wallets.find((w) => w.name === storedWalletName)
      if (storedWallet) {
        setWallet(storedWallet)
        // Attempt to reconnect
        handleConnect(storedWallet).catch((err) => {
          console.error("Failed to reconnect to wallet:", err)
        })
      }
    }
  }, [wallets])

  // Select wallet
  const select = useCallback(
    (walletName: string) => {
      const selectedWallet = wallets.find((w) => w.name === walletName)
      if (selectedWallet) {
        setWallet(selectedWallet)
        localStorage.setItem("selectedWallet", walletName)
      }
    },
    [wallets],
  )

  // Connect to wallet
  const handleConnect = useCallback(async (walletToConnect: SuiWallet) => {
    if (!walletToConnect) return

    try {
      setConnectionStatus("connecting")
      setError(null)

      // Connect to wallet
      const response = await walletToConnect.adapter.connect()

      // Set account and connection status
      setAccount(response.address)
      setPublicKey(response.publicKey || null)
      setConnectionStatus("connected")

      // Fetch balance (mock implementation)
      setBalance("1000000")

      // In a real implementation, you would:
      // 1. Subscribe to account changes
      // 2. Subscribe to network changes
      // 3. Fetch actual balance from the blockchain
    } catch (err) {
      console.error("Failed to connect to wallet:", err)
      setConnectionStatus("error")
      setError(err instanceof Error ? err : new Error("Failed to connect to wallet"))
    }
  }, [])

  // Connect to selected wallet
  const connect = useCallback(async () => {
    if (!wallet) {
      setError(new Error("No wallet selected"))
      return
    }
    await handleConnect(wallet)
  }, [wallet, handleConnect])

  // Disconnect from wallet
  const disconnect = useCallback(async () => {
    if (!wallet) return

    try {
      await wallet.adapter.disconnect()
      setAccount(null)
      setPublicKey(null)
      setConnectionStatus("disconnected")
      setBalance("0")
      localStorage.removeItem("selectedWallet")
    } catch (err) {
      console.error("Failed to disconnect from wallet:", err)
      setError(err instanceof Error ? err : new Error("Failed to disconnect from wallet"))
    }
  }, [wallet])

  // Sign and execute transaction
  const signAndExecuteTransaction = useCallback(
    async (transaction: any) => {
      if (!wallet || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        return await wallet.adapter.signAndExecuteTransaction(transaction)
      } catch (err) {
        console.error("Failed to sign and execute transaction:", err)
        setError(err instanceof Error ? err : new Error("Failed to sign and execute transaction"))
        throw err
      }
    },
    [wallet, connected],
  )

  // Sign message
  const signMessage = useCallback(
    async (message: string) => {
      if (!wallet || !connected) {
        throw new Error("Wallet not connected")
      }

      try {
        return await wallet.adapter.signMessage(message)
      } catch (err) {
        console.error("Failed to sign message:", err)
        setError(err instanceof Error ? err : new Error("Failed to sign message"))
        throw err
      }
    },
    [wallet, connected],
  )

  // Context value
  const value = useMemo(
    () => ({
      wallets,
      wallet,
      account,
      publicKey,
      connecting,
      connected,
      connectionStatus,
      balance,
      network,
      select,
      connect,
      disconnect,
      signAndExecuteTransaction,
      signMessage,
      error,
    }),
    [
      wallets,
      wallet,
      account,
      publicKey,
      connecting,
      connected,
      connectionStatus,
      balance,
      network,
      select,
      connect,
      disconnect,
      signAndExecuteTransaction,
      signMessage,
      error,
    ],
  )

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
