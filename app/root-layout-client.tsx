'use client'

import { ThemeProvider } from "@/components/theme-provider"
import WalletProviderWrapper from "@/components/WalletWrapper"

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <WalletProviderWrapper>{children}</WalletProviderWrapper>
    </ThemeProvider>
  )
}
