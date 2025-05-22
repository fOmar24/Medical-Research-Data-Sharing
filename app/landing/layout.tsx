'use client'

import { ThemeProvider } from '../../components/theme-provider'
import { WalletProvider } from '../../components/wallet-provider'

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <WalletProvider>{children}</WalletProvider>
    </ThemeProvider>
  )
}
