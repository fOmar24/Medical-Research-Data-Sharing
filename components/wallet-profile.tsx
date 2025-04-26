"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWallet } from "@/lib/sui-wallet"
import { useWalletBackend } from "@/hooks/use-wallet-backend"
import { AlertCircle, Loader2, RefreshCw, User, Wallet } from "lucide-react"

export function WalletProfile() {
  const { connected, account } = useWallet()
  const {
    loading,
    error,
    profile,
    balance,
    transactions,
    isAuthenticated,
    authenticate,
    checkSession,
    logout,
    getBalance,
    updateProfile,
  } = useWalletBackend()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [organization, setOrganization] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  // Check session on mount
  useEffect(() => {
    if (connected) {
      checkSession()
    }
  }, [connected])

  // Update form values when profile changes
  useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      setEmail(profile.email || "")
      setOrganization(profile.organization || "")
    }
  }, [profile])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile({ name, email, organization })
    setIsEditing(false)
  }

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-teal-600 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading wallet profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-red-600 mb-4" />
            <p className="text-red-600 font-medium mb-2">Error</p>
            <p className="text-muted-foreground text-center">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => checkSession()}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render not connected state
  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Wallet className="h-8 w-8 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Connect your wallet to view your profile</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render not authenticated state
  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wallet Authentication</CardTitle>
          <CardDescription>Authenticate with your wallet to access your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-4">
            <Wallet className="h-8 w-8 text-teal-600 mb-4" />
            <p className="text-muted-foreground mb-4">Your wallet is connected but not authenticated</p>
            <Button onClick={authenticate}>Authenticate Wallet</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render profile
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Profile</CardTitle>
        <CardDescription>Manage your wallet profile and view your balance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Wallet Address */}
          <div className="bg-muted p-3 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Wallet Address</p>
                <p className="text-xs font-mono mt-1">{account}</p>
              </div>
              {balance && (
                <div className="text-right">
                  <p className="text-sm font-medium">Balance</p>
                  <p className="text-sm font-medium text-teal-600">{balance.formatted} SUI</p>
                  <button className="text-xs text-muted-foreground flex items-center mt-1" onClick={() => getBalance()}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="organization">Organization</Label>
                <Input
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="Your organization"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium">{profile?.name || "Unnamed User"}</h3>
                  <p className="text-sm text-muted-foreground">{profile?.email || "No email provided"}</p>
                </div>
              </div>

              {profile?.organization && (
                <div>
                  <p className="text-sm font-medium">Organization</p>
                  <p className="text-sm">{profile.organization}</p>
                </div>
              )}

              <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          )}

          {/* Recent Transactions */}
          {transactions && transactions.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
              <div className="space-y-2">
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.digest} className="bg-muted p-2 rounded-md text-xs">
                    <div className="flex justify-between">
                      <span className="font-mono truncate max-w-[200px]">{tx.digest}</span>
                      <span>{new Date(tx.timestampMs).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
          Disconnect Wallet
        </Button>
      </CardFooter>
    </Card>
  )
}
