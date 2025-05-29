import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import RootLayoutClient from "./root-layout-client"
import WalletProviderWrapper from "@/components/WalletWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MedChain - Decentralized Medical Research Data Sharing",
  description:
    "Secure, private, and controlled sharing of medical research data using blockchain technology",
 
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>
          <WalletProviderWrapper>
            {children}
          </WalletProviderWrapper>
        </RootLayoutClient>
      </body>
    </html>
  )
}
