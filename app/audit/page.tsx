"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DatabaseIcon,
  FileTextIcon,
  LockIcon,
  UnlockIcon,
  UsersIcon,
  FilterIcon,
  DownloadIcon,
  ShieldIcon,
  UploadIcon,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for demonstration
const auditLogs = [
  {
    id: "log-001",
    action: "Data Registered",
    dataset: "Cardiovascular Disease Study",
    user: "You",
    date: "2025-01-10 11:20:45",
    details: "Initial registration of dataset",
    txHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9",
  },
  {
    id: "log-002",
    action: "Access Granted",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Lisa Thompson",
    date: "2025-03-20 09:15:32",
    details: "Read access granted for 3 months",
    txHash: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c",
  },
  {
    id: "log-003",
    action: "Data Accessed",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Lisa Thompson",
    date: "2025-03-20 14:30:12",
    details: "First access after permission granted",
    txHash: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
  },
  {
    id: "log-004",
    action: "Access Granted",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Robert Chen",
    date: "2025-03-25 10:45:18",
    details: "Read access granted for 3 months",
    txHash: "0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e",
  },
  {
    id: "log-005",
    action: "Data Registered",
    dataset: "Genomic Markers Research",
    user: "You",
    date: "2025-02-28 13:40:22",
    details: "Initial registration of dataset",
    txHash: "0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f",
  },
  {
    id: "log-006",
    action: "Access Granted",
    dataset: "Genomic Markers Research",
    user: "Dr. James Wilson",
    date: "2025-03-10 11:25:40",
    details: "Read access granted for 3 months",
    txHash: "0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a",
  },
  {
    id: "log-007",
    action: "Access Request",
    dataset: "Genomic Markers Research",
    user: "Dr. Emily Rodriguez",
    date: "2025-04-08 09:15:55",
    details: "Access requested for validation purposes",
    txHash: "0x3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
  },
  {
    id: "log-008",
    action: "Data Accessed",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Lisa Thompson",
    date: "2025-04-12 15:45:30",
    details: "Data accessed for analysis",
    txHash: "0x4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c",
  },
  {
    id: "log-009",
    action: "Access Request",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Michael Johnson",
    date: "2025-04-10 14:20:15",
    details: "Access requested for comparative analysis",
    txHash: "0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
  },
  {
    id: "log-010",
    action: "Access Granted",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Maria Garcia",
    date: "2025-04-01 16:10:05",
    details: "Read access granted for 3 months",
    txHash: "0x6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
  },
]

// Statistics
const actionCounts = {
  "Data Registered": 2,
  "Access Granted": 4,
  "Data Accessed": 2,
  "Access Request": 2,
}

export default function AuditTrail() {
  const [filterDataset, setFilterDataset] = useState("all")
  const [filterAction, setFilterAction] = useState("all")
  const [filterUser, setFilterUser] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [walletConnected, setWalletConnected] = useState(false)

  const connectWallet = () => {
    // In a real implementation, this would connect to the Sui wallet
    setWalletConnected(true)
  }

  // Filter logs based on selected filters
  const filteredLogs = auditLogs.filter((log) => {
    if (filterDataset !== "all" && log.dataset !== filterDataset) return false
    if (filterAction !== "all" && log.action !== filterAction) return false
    if (filterUser !== "all" && log.user !== filterUser) return false

    // Date range filtering would be implemented here

    return true
  })

  // Get unique datasets, actions, and users for filters
  const datasets = [...new Set(auditLogs.map((log) => log.dataset))]
  const actions = [...new Set(auditLogs.map((log) => log.action))]
  const users = [...new Set(auditLogs.map((log) => log.user))]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <DatabaseIcon className="h-6 w-6 text-teal-600" />
              <span className="hidden font-bold sm:inline-block">MedChain</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/register" className="transition-colors hover:text-foreground/80">
                Register Data
              </Link>
              <Link href="/access" className="transition-colors hover:text-foreground/80">
                Access Control
              </Link>
              <Link href="/audit" className="text-teal-600 transition-colors hover:text-teal-700">
                Audit Trail
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {walletConnected ? (
              <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-200 px-3 py-1">
                Wallet Connected
              </Badge>
            ) : (
              <Button variant="outline" onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
            <Button variant="outline" className="flex items-center gap-1">
              <DownloadIcon className="h-4 w-4" />
              <span>Export Logs</span>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Registered</CardTitle>
                <DatabaseIcon className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionCounts["Data Registered"]}</div>
                <p className="text-xs text-muted-foreground">Datasets registered on blockchain</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Granted</CardTitle>
                <UnlockIcon className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionCounts["Access Granted"]}</div>
                <p className="text-xs text-muted-foreground">Access permissions granted</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Accessed</CardTitle>
                <FileTextIcon className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionCounts["Data Accessed"]}</div>
                <p className="text-xs text-muted-foreground">Times data was accessed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Access Requests</CardTitle>
                <UsersIcon className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionCounts["Access Request"]}</div>
                <p className="text-xs text-muted-foreground">Pending access requests</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="logs" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="logs">Audit Logs</TabsTrigger>
              <TabsTrigger value="verification">Verification</TabsTrigger>
            </TabsList>

            <TabsContent value="logs" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Audit Logs</CardTitle>
                  <CardDescription>
                    Complete, immutable record of all actions related to your medical research data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                        <div>
                          <Label htmlFor="filter-dataset">Dataset</Label>
                          <Select value={filterDataset} onValueChange={setFilterDataset}>
                            <SelectTrigger id="filter-dataset">
                              <SelectValue placeholder="All Datasets" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Datasets</SelectItem>
                              {datasets.map((dataset) => (
                                <SelectItem key={dataset} value={dataset}>
                                  {dataset}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="filter-action">Action</Label>
                          <Select value={filterAction} onValueChange={setFilterAction}>
                            <SelectTrigger id="filter-action">
                              <SelectValue placeholder="All Actions" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Actions</SelectItem>
                              {actions.map((action) => (
                                <SelectItem key={action} value={action}>
                                  {action}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="filter-user">User</Label>
                          <Select value={filterUser} onValueChange={setFilterUser}>
                            <SelectTrigger id="filter-user">
                              <SelectValue placeholder="All Users" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Users</SelectItem>
                              {users.map((user) => (
                                <SelectItem key={user} value={user}>
                                  {user}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="filter-date">Date Range</Label>
                          <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger id="filter-date">
                              <SelectValue placeholder="All Time" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="today">Today</SelectItem>
                              <SelectItem value="week">Last 7 Days</SelectItem>
                              <SelectItem value="month">Last 30 Days</SelectItem>
                              <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button variant="outline" className="md:self-end flex items-center gap-1">
                        <FilterIcon className="h-4 w-4" />
                        <span>Apply Filters</span>
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Action</TableHead>
                          <TableHead>Dataset</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead>Transaction</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {log.action === "Data Registered" && (
                                  <DatabaseIcon className="h-4 w-4 text-purple-600" />
                                )}
                                {log.action === "Access Granted" && <UnlockIcon className="h-4 w-4 text-teal-600" />}
                                {log.action === "Data Accessed" && <FileTextIcon className="h-4 w-4 text-blue-600" />}
                                {log.action === "Access Request" && <UsersIcon className="h-4 w-4 text-amber-600" />}
                                {log.action}
                              </div>
                            </TableCell>
                            <TableCell>{log.dataset}</TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.date}</TableCell>
                            <TableCell>{log.details}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <span className="font-mono text-xs truncate max-w-[100px]">
                                  {log.txHash.substring(0, 10)}...
                                </span>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-external-link"
                                  >
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                    <polyline points="15 3 21 3 21 9"></polyline>
                                    <line x1="10" y1="14" x2="21" y2="3"></line>
                                  </svg>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verification" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blockchain Verification</CardTitle>
                  <CardDescription>
                    Verify the authenticity and integrity of audit logs using blockchain proof
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start gap-3">
                      <ShieldIcon className="h-5 w-5 text-teal-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-teal-800">Immutable Audit Trail</h4>
                        <p className="text-sm text-teal-700 mt-1">
                          All actions related to your medical research data are recorded on the Sui blockchain, creating
                          an immutable audit trail that can be independently verified.
                        </p>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="font-medium text-lg mb-4">Verify Transaction</h3>

                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="tx-hash">Transaction Hash</Label>
                          <div className="flex gap-2">
                            <Input id="tx-hash" placeholder="Enter transaction hash to verify" className="font-mono" />
                            <Button>Verify</Button>
                          </div>
                        </div>

                        <div className="text-center py-8">
                          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <LockIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-lg">Enter a Transaction Hash</h3>
                          <p className="text-muted-foreground mt-1">
                            Enter a transaction hash from the audit logs to verify its authenticity on the blockchain.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-6">
                      <h3 className="font-medium text-lg mb-4">Batch Verification</h3>

                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Verify multiple transactions at once by uploading a CSV file with transaction hashes.
                        </p>

                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                          <UploadIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Drag and drop a CSV file, or click to browse</p>
                          <Input id="file-upload" type="file" accept=".csv" className="hidden" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("file-upload")?.click()}
                          >
                            Select File
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500 dark:text-gray-400">© 2025 MedChain. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
