"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DatabaseIcon,
  LayoutDashboardIcon,
  UploadIcon as FileUploadIcon,
  ShieldIcon,
  ClipboardListIcon,
  UserIcon,
  LogOutIcon,
} from "lucide-react"

import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/lib/sui-wallet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

export function SidebarNavigation() {
  const pathname = usePathname()
  const { connected, account, disconnect } = useWallet()

  const navigation = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Register Data",
      href: "/register",
      icon: FileUploadIcon,
    },
    {
      title: "Access Control",
      href: "/access",
      icon: ShieldIcon,
    },
    {
      title: "Audit Trail",
      href: "/audit",
      icon: ClipboardListIcon,
    },
  ]

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="pb-0">
        <div className="flex items-center gap-2 px-4 py-2">
          <DatabaseIcon className="h-6 w-6 text-teal-600" />
          <span className="font-bold">MedChain</span>
        </div>
        <div className="px-2 pt-2 pb-4">
          <WalletButton />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {connected && (
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-teal-600" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">Connected Wallet</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="w-full justify-center bg-teal-50 text-teal-700 border-teal-200">
                  Connected
                </Badge>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        {connected && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => disconnect()}>
                <LogOutIcon className="h-4 w-4" />
                <span>Disconnect</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        <div className="px-3 py-2 text-xs text-center text-muted-foreground">© 2025 MedChain</div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
