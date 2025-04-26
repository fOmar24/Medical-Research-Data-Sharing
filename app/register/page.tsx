"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DatabaseIcon,
  UploadIcon,
  ShieldIcon,
  LockIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HardDriveIcon,
} from "lucide-react"
import { WalletButton } from "@/components/wallet-button"
import { useWallet } from "@/lib/sui-wallet"
import { useSuiTransaction } from "@/hooks/use-sui-transaction"
import { TransactionStatus } from "@/components/transaction-status"
import { useWalrusStorage } from "@/hooks/use-walrus-storage"
import { UploadProgress } from "@/components/upload-progress"

export default function RegisterData() {
  const [step, setStep] = useState(1)
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { connected } = useWallet()
  const { executeTransaction, loading, error, txId, success } = useSuiTransaction()
  const { uploadFiles, uploading, progress, error: uploadError, results: uploadResults } = useWalrusStorage()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dataType: "",
    licenseType: "",
    keywords: "",
    files: [] as File[],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        files: Array.from(e.target.files || []),
      }))
    }
  }

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleEncrypt = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEncrypting(true)

    try {
      // Upload files to Walrus decentralized storage
      if (formData.files.length > 0) {
        const metadata = {
          name: formData.title,
          description: formData.description,
          dataType: formData.dataType,
          licenseType: formData.licenseType,
          keywords: formData.keywords,
          encrypted: true,
          encryptionType: "AES-256",
        }

        await uploadFiles(formData.files, metadata)
      }

      // Move to next step after upload completes
      setTimeout(() => {
        setIsEncrypting(false)
        setStep(3)
      }, 1000)
    } catch (err) {
      console.error("Failed to encrypt and upload data:", err)
      setIsEncrypting(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsRegistering(true)

    try {
      // Get CIDs from upload results
      const cids = uploadResults?.map((result) => result.cid) || []

      // Create a mock transaction for registering data on Sui blockchain
      const transaction = {
        kind: "moveCall",
        data: {
          packageObjectId: "0x1234567890abcdef",
          module: "medical_data",
          function: "register_data",
          typeArguments: [],
          arguments: [
            formData.title,
            formData.description,
            formData.dataType,
            formData.licenseType,
            formData.keywords,
            // Include Walrus storage CIDs in the transaction
            JSON.stringify(cids),
          ],
          gasBudget: 10000,
        },
      }

      // Execute the transaction
      const result = await executeTransaction(transaction)

      if (result) {
        setIsComplete(true)
      }
    } catch (err) {
      console.error("Failed to register data:", err)
    } finally {
      setIsRegistering(false)
    }
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
              <Link href="/register" className="text-teal-600 transition-colors hover:text-teal-700">
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
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Register Medical Research Data</h1>
              <p className="text-muted-foreground mt-2">
                Securely register your medical research data on the Sui blockchain with encryption and Walrus
                decentralized storage.
              </p>
            </div>

            {!connected && (
              <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertCircleIcon className="h-5 w-5 text-amber-600" />
                  <p className="text-amber-800 dark:text-amber-200">
                    Please connect your Sui wallet to register data on the blockchain.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 1 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  1
                </div>
                <div className={`h-1 w-16 ${step >= 2 ? "bg-teal-600" : "bg-gray-200"}`}></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 2 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  2
                </div>
                <div className={`h-1 w-16 ${step >= 3 ? "bg-teal-600" : "bg-gray-200"}`}></div>
                <div
                  className={`rounded-full h-8 w-8 flex items-center justify-center ${step >= 3 ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-500"}`}
                >
                  3
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {step === 1 && "Upload Data"}
                {step === 2 && "Encrypt & Store Data"}
                {step === 3 && "Register on Blockchain"}
              </div>
            </div>

            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Research Data</CardTitle>
                  <CardDescription>Upload your medical research data files and provide metadata.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpload} className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title">Dataset Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="e.g., Cardiovascular Disease Study"
                          required
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Describe your research data, methodology, and potential use cases"
                          className="min-h-[100px]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="dataType">Data Type</Label>
                          <Select
                            value={formData.dataType}
                            onValueChange={(value) => handleSelectChange("dataType", value)}
                            required
                          >
                            <SelectTrigger id="dataType">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="clinical">Clinical Trial</SelectItem>
                              <SelectItem value="genomic">Genomic Data</SelectItem>
                              <SelectItem value="imaging">Imaging Data</SelectItem>
                              <SelectItem value="epidemiological">Epidemiological</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="licenseType">License Type</Label>
                          <Select
                            value={formData.licenseType}
                            onValueChange={(value) => handleSelectChange("licenseType", value)}
                            required
                          >
                            <SelectTrigger id="licenseType">
                              <SelectValue placeholder="Select license" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="research-only">Research Only</SelectItem>
                              <SelectItem value="academic">Academic Use</SelectItem>
                              <SelectItem value="commercial">Commercial Use Allowed</SelectItem>
                              <SelectItem value="custom">Custom License</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="keywords">Keywords (comma separated)</Label>
                        <Input
                          id="keywords"
                          name="keywords"
                          value={formData.keywords}
                          onChange={handleInputChange}
                          placeholder="e.g., cardiovascular, clinical trial, heart disease"
                        />
                      </div>

                      <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                        <UploadIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Drag and drop your data files here, or click to browse
                        </p>
                        <Input id="file-upload" type="file" multiple onChange={handleFileChange} className="hidden" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById("file-upload")?.click()}
                        >
                          Select Files
                        </Button>
                        {formData.files.length > 0 && (
                          <p className="text-sm text-teal-600 mt-2">{formData.files.length} file(s) selected</p>
                        )}
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled>
                    Back
                  </Button>
                  <Button onClick={handleUpload} disabled={!connected || formData.files.length === 0}>
                    Continue to Encryption & Storage
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Encrypt & Store Your Data</CardTitle>
                  <CardDescription>
                    Your data will be encrypted and stored on Walrus decentralized storage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEncrypt} className="space-y-6">
                    <div className="space-y-4">
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start gap-3">
                        <ShieldIcon className="h-5 w-5 text-teal-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-teal-800">End-to-End Encryption</h4>
                          <p className="text-sm text-teal-700 mt-1">
                            Your data will be encrypted using AES-256 encryption before being stored on Walrus. Only
                            users with proper access rights will be able to decrypt and access your data.
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                        <HardDriveIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Walrus Decentralized Storage</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Your encrypted data will be stored on Walrus, a decentralized storage network. This ensures
                            your data remains available and tamper-proof, while only the references to your data are
                            stored on the blockchain.
                          </p>
                        </div>
                      </div>

                      <Tabs defaultValue="standard">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="standard">Standard Encryption</TabsTrigger>
                          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                        </TabsList>
                        <TabsContent value="standard" className="space-y-4 pt-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Automatic Key Management</Label>
                              <p className="text-sm text-muted-foreground">
                                Let the system manage encryption keys securely
                              </p>
                            </div>
                            <Switch checked={true} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Zero-Knowledge Proof Support</Label>
                              <p className="text-sm text-muted-foreground">
                                Enable ZKP for privacy-preserving access verification
                              </p>
                            </div>
                            <Switch checked={true} />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label>Walrus Storage Redundancy</Label>
                              <p className="text-sm text-muted-foreground">
                                Store data across multiple nodes for high availability
                              </p>
                            </div>
                            <Switch checked={true} />
                          </div>
                        </TabsContent>
                        <TabsContent value="advanced" className="space-y-4 pt-4">
                          <div className="grid gap-2">
                            <Label htmlFor="encryption-algorithm">Encryption Algorithm</Label>
                            <Select defaultValue="aes256">
                              <SelectTrigger id="encryption-algorithm">
                                <SelectValue placeholder="Select algorithm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aes256">AES-256 (Recommended)</SelectItem>
                                <SelectItem value="aes128">AES-128</SelectItem>
                                <SelectItem value="rsa">RSA-4096</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="key-management">Key Management Strategy</Label>
                            <Select defaultValue="threshold">
                              <SelectTrigger id="key-management">
                                <SelectValue placeholder="Select strategy" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="threshold">Threshold Cryptography</SelectItem>
                                <SelectItem value="mpc">Multi-Party Computation</SelectItem>
                                <SelectItem value="standard">Standard Key Pair</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="zkp-type">Zero-Knowledge Proof Type</Label>
                            <Select defaultValue="snark">
                              <SelectTrigger id="zkp-type">
                                <SelectValue placeholder="Select ZKP type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="snark">zk-SNARKs</SelectItem>
                                <SelectItem value="stark">zk-STARKs</SelectItem>
                                <SelectItem value="bulletproof">Bulletproofs</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor="storage-redundancy">Storage Redundancy</Label>
                            <Select defaultValue="high">
                              <SelectTrigger id="storage-redundancy">
                                <SelectValue placeholder="Select redundancy level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low (3x)</SelectItem>
                                <SelectItem value="medium">Medium (5x)</SelectItem>
                                <SelectItem value="high">High (7x)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TabsContent>
                      </Tabs>

                      <UploadProgress
                        uploading={uploading || isEncrypting}
                        progress={progress}
                        error={uploadError}
                        fileName={formData.files.length === 1 ? formData.files[0].name : undefined}
                      />
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} disabled={uploading || isEncrypting}>
                    Back
                  </Button>
                  <Button
                    onClick={handleEncrypt}
                    disabled={uploading || isEncrypting || !connected || formData.files.length === 0}
                  >
                    {uploading || isEncrypting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Encrypting & Storing...
                      </>
                    ) : (
                      "Encrypt & Store Data"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Register on Blockchain</CardTitle>
                  <CardDescription>Register your encrypted data on the Sui blockchain.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-4">
                      {isComplete ? (
                        <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 flex flex-col items-center justify-center gap-3">
                          <div className="rounded-full bg-teal-100 p-3">
                            <CheckCircleIcon className="h-8 w-8 text-teal-600" />
                          </div>
                          <h3 className="text-xl font-medium text-teal-800">Registration Complete!</h3>
                          <p className="text-center text-teal-700">
                            Your medical research data has been successfully encrypted, stored on Walrus, and registered
                            on the Sui blockchain.
                          </p>
                          <div className="mt-2 text-sm bg-white rounded-md border p-3 font-mono w-full overflow-x-auto">
                            Transaction ID:{" "}
                            {txId || "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9"}
                          </div>
                          {uploadResults && uploadResults.length > 0 && (
                            <div className="mt-2 text-sm bg-white rounded-md border p-3 font-mono w-full overflow-x-auto">
                              Walrus Storage CID: {uploadResults[0].cid}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-start gap-3">
                            <LockIcon className="h-5 w-5 text-teal-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-teal-800">Data Ready for Registration</h4>
                              <p className="text-sm text-teal-700 mt-1">
                                Your data has been encrypted and stored on Walrus decentralized storage. Now it's time
                                to register it on the Sui blockchain. This will create a secure, immutable record of
                                your data ownership.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-4 border rounded-lg p-4">
                            <h4 className="font-medium">Registration Summary</h4>

                            <div className="grid grid-cols-2 gap-y-2 text-sm">
                              <div className="text-muted-foreground">Dataset Title:</div>
                              <div>{formData.title || "Cardiovascular Disease Study"}</div>

                              <div className="text-muted-foreground">Data Type:</div>
                              <div>
                                {formData.dataType
                                  ? {
                                      clinical: "Clinical Trial",
                                      genomic: "Genomic Data",
                                      imaging: "Imaging Data",
                                      epidemiological: "Epidemiological",
                                      other: "Other",
                                    }[formData.dataType]
                                  : "Clinical Trial"}
                              </div>

                              <div className="text-muted-foreground">License:</div>
                              <div>
                                {formData.licenseType
                                  ? {
                                      "research-only": "Research Only",
                                      academic: "Academic Use",
                                      commercial: "Commercial Use Allowed",
                                      custom: "Custom License",
                                    }[formData.licenseType]
                                  : "Research Only"}
                              </div>

                              <div className="text-muted-foreground">Encryption:</div>
                              <div>AES-256 with ZKP support</div>

                              <div className="text-muted-foreground">Storage:</div>
                              <div>Walrus Decentralized Storage</div>

                              <div className="text-muted-foreground">File Count:</div>
                              <div>
                                {formData.files.length || 3} files (
                                {formData.files.length
                                  ? Math.round(formData.files.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024))
                                  : 245}{" "}
                                MB)
                              </div>

                              {uploadResults && uploadResults.length > 0 && (
                                <>
                                  <div className="text-muted-foreground">Walrus CID:</div>
                                  <div className="font-mono truncate">{uploadResults[0].cid}</div>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                            <label htmlFor="terms" className="text-sm text-muted-foreground">
                              I confirm that I have the rights to register this data and agree to the platform's terms
                              of service.
                            </label>
                          </div>

                          <TransactionStatus loading={loading} error={error} txId={txId} success={success} />
                        </>
                      )}
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isComplete ? (
                    <>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">Return to Dashboard</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/access/manage/data-001">Manage Access</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" onClick={() => setStep(2)} disabled={isRegistering || loading}>
                        Back
                      </Button>
                      <Button
                        onClick={handleRegister}
                        disabled={isRegistering || loading || !connected || !uploadResults}
                      >
                        {isRegistering || loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Registering on Blockchain...
                          </>
                        ) : (
                          "Register Data"
                        )}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            )}
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
