"use client"

import type { ReactNode } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { WalletButton } from "@/components/wallet-button"

interface LayoutWithSidebarProps {
  children: ReactNode
}

export function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  return (
    <SidebarProvider>
      <SidebarNavigation />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <SidebarTrigger className="md:hidden" />
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden md:block">
              <WalletButton />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
