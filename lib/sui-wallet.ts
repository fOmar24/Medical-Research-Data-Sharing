"use client"

import { createContext, useContext } from "react"

// Define wallet adapter types
export type SuiWallet = {
  name: string
  icon: string
  adapter: any
}

// Define wallet connection states
export type WalletConnectionStatus = "disconnected" | "connecting" | "connected" | "error"

// Define wallet context state
export interface WalletContextState {
  wallets: SuiWallet[]
  wallet: SuiWallet | null
  account: string | null
  publicKey: string | null
  connecting: boolean
  connected: boolean
  connectionStatus: WalletConnectionStatus
  balance: string
  network: string
  select: (walletName: string) => void
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signAndExecuteTransaction: (transaction: any) => Promise<any>
  signMessage: (message: string) => Promise<any>
  error: Error | null
}

// Default context state
export const DEFAULT_WALLET_STATE: WalletContextState = {
  wallets: [],
  wallet: null,
  account: null,
  publicKey: null,
  connecting: false,
  connected: false,
  connectionStatus: "disconnected",
  balance: "0",
  network: "mainnet",
  select: () => {},
  connect: async () => {},
  disconnect: async () => {},
  signAndExecuteTransaction: async () => ({}),
  signMessage: async () => ({}),
  error: null,
}

// Create context
export const WalletContext = createContext<WalletContextState>(DEFAULT_WALLET_STATE)

// Hook to use wallet context
export const useWallet = () => useContext(WalletContext)
