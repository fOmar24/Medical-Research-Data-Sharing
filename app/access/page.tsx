"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DatabaseIcon, UsersIcon, ShieldIcon, UserPlusIcon, UserMinusIcon, SearchIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for demonstration
const myDatasets = [
  {
    id: "data-001",
    name: "Cardiovascular Disease Study",
    type: "Clinical Trial",
    date: "2025-03-15",
    accessCount: 3,
    accessList: [
      {
        id: "user-001",
        name: "Dr. Lisa Thompson",
        email: "l.thompson@research.org",
        accessLevel: "read",
        granted: "2025-03-20",
        expires: "2025-06-20",
      },
      {
        id: "user-002",
        name: "Dr. Robert Chen",
        email: "r.chen@medcenter.edu",
        accessLevel: "read",
        granted: "2025-03-25",
        expires: "2025-06-25",
      },
      {
        id: "user-003",
        name: "Dr. Maria Garcia",
        email: "m.garcia@hospital.org",
        accessLevel: "read",
        granted: "2025-04-01",
        expires: "2025-07-01",
      },
    ],
  },
  {
    id: "data-002",
    name: "Genomic Markers Research",
    type: "Genomic Data",
    date: "2025-02-28",
    accessCount: 1,
    accessList: [
      {
        id: "user-004",
        name: "Dr. James Wilson",
        email: "j.wilson@genomics.org",
        accessLevel: "read",
        granted: "2025-03-10",
        expires: "2025-06-10",
      },
    ],
  },
]

const accessRequests = [
  {
    id: "req-001",
    datasetId: "data-001",
    datasetName: "Cardiovascular Disease Study",
    requester: { id: "user-005", name: "Dr. Michael Johnson", email: "m.johnson@research.edu" },
    requestDate: "2025-04-10",
    status: "pending",
    purpose: "Comparative analysis with similar cardiovascular studies",
  },
  {
    id: "req-002",
    datasetId: "data-002",
    datasetName: "Genomic Markers Research",
    requester: { id: "user-006", name: "Dr. Emily Rodriguez", email: "e.rodriguez@genomics.org" },
    requestDate: "2025-04-08",
    status: "pending",
    purpose: "Validation of genomic markers in diverse populations",
  },
]

const discoveryDatasets = [
  {
    id: "disc-001",
    name: "Diabetes Treatment Outcomes",
    owner: "Dr. Sarah Chen",
    type: "Clinical Trial",
    date: "2025-03-01",
    keywords: ["diabetes", "treatment", "clinical trial"],
    description: "Long-term outcomes of various diabetes treatments across different demographics",
  },
  {
    id: "disc-002",
    name: "Respiratory Illness Patterns",
    owner: "Dr. James Wilson",
    type: "Epidemiological",
    date: "2025-02-15",
    keywords: ["respiratory", "epidemiology", "patterns"],
    description: "Analysis of respiratory illness patterns and environmental factors",
  },
  {
    id: "disc-003",
    name: "Neural Imaging Database",
    owner: "Dr. Patricia Lee",
    type: "Imaging Data",
    date: "2025-01-20",
    keywords: ["neural", "imaging", "brain"],
    description: "Comprehensive database of neural imaging across various cognitive conditions",
  },
]

export default function AccessControl() {
  const [activeDataset, setActiveDataset] = useState(myDatasets[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)

  const connectWallet = () => {
    // In a real implementation, this would connect to the Sui wallet
    setWalletConnected(true)
  }

  const filteredDiscoveryDatasets = discoveryDatasets.filter(
    (dataset) =>
      dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dataset.keywords.some((keyword) => keyword.toLowerCase().includes(searchTerm.toLowerCase())) ||
      dataset.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
              <Link href="/access" className="text-teal-600 transition-colors hover:text-teal-700">
                Access Control
              </Link>
              <Link href="/audit" className="transition-colors hover:text-foreground/80">
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
            <h1 className="text-3xl font-bold tracking-tight">Access Control</h1>
            <div className="flex items-center gap-2">
              <Link href="/register">
                <Button className="bg-teal-600 hover:bg-teal-700">Register New Data</Button>
              </Link>
            </div>
          </div>

          <Tabs defaultValue="manage" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="manage">Manage Access</TabsTrigger>
              <TabsTrigger value="requests">Access Requests</TabsTrigger>
              <TabsTrigger value="discover">Discover Data</TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="md:col-span-1">
                  <CardHeader>
                    <CardTitle>My Datasets</CardTitle>
                    <CardDescription>Select a dataset to manage access</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {myDatasets.map((dataset) => (
                        <div
                          key={dataset.id}
                          className={`p-3 rounded-md cursor-pointer ${activeDataset.id === dataset.id ? "bg-teal-50 border border-teal-200" : "hover:bg-gray-50 border border-transparent"}`}
                          onClick={() => setActiveDataset(dataset)}
                        >
                          <div className="font-medium">{dataset.name}</div>
                          <div className="text-sm text-muted-foreground">{dataset.type}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {dataset.accessCount} users with access
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-3">
                  <CardHeader>
                    <CardTitle>Access Control for {activeDataset.name}</CardTitle>
                    <CardDescription>Manage who can access this dataset and their permission levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="space-y-1">
                          <h3 className="font-medium">Current Access List</h3>
                          <p className="text-sm text-muted-foreground">
                            {activeDataset.accessList.length} researchers currently have access to this dataset
                          </p>
                        </div>
                        <Button className="flex items-center gap-1">
                          <UserPlusIcon className="h-4 w-4" />
                          <span>Grant Access</span>
                        </Button>
                      </div>

                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Researcher</TableHead>
                            <TableHead>Access Level</TableHead>
                            <TableHead>Granted On</TableHead>
                            <TableHead>Expires On</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeDataset.accessList.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </TableCell>
                              <TableCell>
                                <Select defaultValue={user.accessLevel}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="read">Read Only</SelectItem>
                                    <SelectItem value="read-write">Read & Write</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{user.granted}</TableCell>
                              <TableCell>{user.expires}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    Extend
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                  >
                                    <UserMinusIcon className="h-4 w-4" />
                                    <span className="sr-only">Revoke</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                        <ShieldIcon className="h-5 w-5 text-amber-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800">Zero-Knowledge Access Verification</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            Access verification is performed using Zero-Knowledge Proofs, ensuring that sensitive
                            information remains private while still verifying access rights.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Access Requests</CardTitle>
                  <CardDescription>Review and manage requests to access your datasets</CardDescription>
                </CardHeader>
                <CardContent>
                  {accessRequests.length > 0 ? (
                    <div className="space-y-6">
                      {accessRequests.map((request) => (
                        <div key={request.id} className="border rounded-lg p-4 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{request.requester.name}</h3>
                              <p className="text-sm text-muted-foreground">{request.requester.email}</p>
                            </div>
                            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                              {request.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 text-sm">
                            <div className="text-muted-foreground">Dataset:</div>
                            <div>{request.datasetName}</div>

                            <div className="text-muted-foreground">Requested On:</div>
                            <div>{request.requestDate}</div>

                            <div className="text-muted-foreground">Purpose:</div>
                            <div>{request.purpose}</div>
                          </div>

                          <div className="flex gap-3 pt-2">
                            <Button className="bg-teal-600 hover:bg-teal-700">Approve</Button>
                            <Button variant="outline">Deny</Button>
                            <Button variant="outline">Request More Info</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                        <UsersIcon className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="font-medium text-lg">No Pending Requests</h3>
                      <p className="text-muted-foreground mt-1">
                        You don't have any pending access requests at the moment.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Discover Research Data</CardTitle>
                  <CardDescription>Find and request access to relevant research data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="relative">
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by title, researcher, keywords..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>

                    <div className="space-y-4">
                      {filteredDiscoveryDatasets.map((dataset) => (
                        <div key={dataset.id} className="border rounded-lg p-4 space-y-3">
                          <div>
                            <h3 className="font-medium text-lg">{dataset.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              By {dataset.owner} • {dataset.type}
                            </p>
                          </div>

                          <p className="text-sm">{dataset.description}</p>

                          <div className="flex flex-wrap gap-2">
                            {dataset.keywords.map((keyword, index) => (
                              <Badge key={index} variant="outline" className="bg-gray-50">
                                {keyword}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <div className="text-sm text-muted-foreground">Registered on {dataset.date}</div>
                            <Button>Request Access</Button>
                          </div>
                        </div>
                      ))}

                      {filteredDiscoveryDatasets.length === 0 && (
                        <div className="text-center py-8">
                          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                            <SearchIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <h3 className="font-medium text-lg">No Results Found</h3>
                          <p className="text-muted-foreground mt-1">Try adjusting your search terms or filters.</p>
                        </div>
                      )}
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
