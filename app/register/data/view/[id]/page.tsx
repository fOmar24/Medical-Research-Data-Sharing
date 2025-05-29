"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatabaseIcon, FileTextIcon, LockIcon, ShieldIcon, UserIcon, CalendarIcon } from "lucide-react"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/lib/sui-wallet"
import { WalrusDataViewer } from "@/components/walrus-data-viewer"

// Mock data for demonstration
const datasets = {
  "data-101": {
    id: "data-101",
    name: "Diabetes Treatment Outcomes",
    owner: "Dr. Sarah Chen",
    ownerAddress: "0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c",
    type: "clinical",
    date: "2025-03-01",
    expiresIn: "29 days",
    description:
      "Long-term outcomes of various diabetes treatments across different demographics. This dataset includes patient records, treatment protocols, and outcome measurements over a 5-year period.",
    keywords: ["diabetes", "treatment", "clinical trial", "long-term", "demographics"],
    accessGranted: "2025-03-15",
    accessExpires: "2025-06-15",
    walrusCid: "walrus-a1b2c3d4e5f6g7h8i9j0-1234567890",
  },
  "data-102": {
    id: "data-102",
    name: "Respiratory Illness Patterns",
    owner: "Dr. James Wilson",
    ownerAddress: "0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d",
    type: "epidemiological",
    date: "2025-02-15",
    expiresIn: "15 days",
    description:
      "Analysis of respiratory illness patterns and environmental factors. This dataset includes geographical data, environmental measurements, and respiratory illness incidence rates.",
    keywords: ["respiratory", "epidemiology", "patterns", "environmental", "geographical"],
    accessGranted: "2025-02-20",
    accessExpires: "2025-05-20",
    walrusCid: "walrus-j0i9h8g7f6e5d4c3b2a1-0987654321",
  },
}

export default function DataView() {
  const params = useParams()
  const id = params.id as string
  const [dataset, setDataset] = useState<any>(null)
  const { connected, account } = useWallet()

  useEffect(() => {
    // In a real implementation, you would fetch the dataset from the blockchain
    // and check if the user has access to it
    if (id && datasets[id]) {
      setDataset(datasets[id])
    }
  }, [id])

  if (!dataset) {
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
                <Link href="/audit" className="transition-colors hover:text-foreground/80">
                  Audit Trail
                </Link>
              </nav>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <WalletButton />
            </div>
          </div>
        </header>

        <main className="flex-1 container py-8">
          <div className="flex flex-col items-center justify-center h-full">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <FileTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-xl font-bold mb-2">Dataset Not Found</h2>
                  <p className="text-muted-foreground mb-4">
                    The dataset you're looking for doesn't exist or you don't have access to it.
                  </p>
                  <Button asChild>
                    <Link href="/dashboard">Return to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

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
              <Link href="/audit" className="transition-colors hover:text-foreground/80">
                Audit Trail
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <WalletButton />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{dataset.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {dataset.type === "clinical"
                      ? "Clinical Trial"
                      : dataset.type === "genomic"
                        ? "Genomic Data"
                        : dataset.type === "imaging"
                          ? "Imaging Data"
                          : "Epidemiological"}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Access Granted
                  </Badge>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="data">Data</TabsTrigger>
                    <TabsTrigger value="access">Access Details</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-6 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dataset Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>{dataset.description}</p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          {dataset.keywords.map((keyword: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-gray-50">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Dataset Details</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-y-4">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Registered On:</span>
                          </div>
                          <div className="text-sm">{dataset.date}</div>

                          <div className="flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Owner:</span>
                          </div>
                          <div className="text-sm">{dataset.owner}</div>

                          <div className="flex items-center gap-2">
                            <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Encryption:</span>
                          </div>
                          <div className="text-sm">AES-256 with ZKP verification</div>

                          <div className="flex items-center gap-2">
                            <DatabaseIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Storage:</span>
                          </div>
                          <div className="text-sm">Walrus Decentralized Storage</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="data" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dataset Files</CardTitle>
                        <CardDescription>
                          Access the encrypted research data stored on Walrus decentralized storage
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                            <ShieldIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800">Zero-Knowledge Access Verification</h4>
                              <p className="text-sm text-blue-700 mt-1">
                                Your access rights are verified using Zero-Knowledge Proofs, ensuring privacy while
                                maintaining security. The data is encrypted and can only be accessed by authorized
                                users.
                              </p>
                            </div>
                          </div>

                          <WalrusDataViewer
                            cid={dataset.walrusCid}
                            title={dataset.name}
                            description={dataset.description}
                            dataType={dataset.type}
                            encrypted={true}
                            hasAccess={connected}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="access" className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Access Information</CardTitle>
                        <CardDescription>Details about your access to this dataset</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-y-4">
                            <div className="flex items-center gap-2">
                              <LockIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Access Level:</span>
                            </div>
                            <div className="text-sm">Read Only</div>

                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Access Granted:</span>
                            </div>
                            <div className="text-sm">{dataset.accessGranted}</div>

                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Access Expires:</span>
                            </div>
                            <div className="text-sm">{dataset.accessExpires}</div>
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <h4 className="font-medium text-amber-800">Access Expiration</h4>
                            <p className="text-sm text-amber-700 mt-1">
                              Your access to this dataset will expire in {dataset.expiresIn}. If you need continued
                              access, please request an extension from the dataset owner.
                            </p>
                          </div>

                          <div className="flex justify-end">
                            <Button variant="outline">Request Extension</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Owner Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center text-center">
                      <div className="h-16 w-16 rounded-full bg-teal-100 flex items-center justify-center mb-3">
                        <UserIcon className="h-8 w-8 text-teal-600" />
                      </div>
                      <h3 className="font-medium text-lg">{dataset.owner}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Dataset Owner</p>
                      <div className="text-xs font-mono bg-gray-50 p-2 rounded border mt-3 truncate">
                        {dataset.ownerAddress}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Record</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Transaction ID</span>
                        <span className="text-xs font-mono truncate">0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Walrus CID</span>
                        <span className="text-xs font-mono truncate">{dataset.walrusCid}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Registered On</span>
                        <span className="text-sm">{dataset.date}</span>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        View on Explorer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
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
