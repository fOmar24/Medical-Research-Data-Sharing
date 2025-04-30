'use client';

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon, DatabaseIcon, ShieldIcon, FileTextIcon } from "lucide-react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"

export default function Home() {
  return (
    <LayoutWithSidebar>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-teal-50 to-white dark:from-slate-900 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Decentralized Medical Research Data Sharing
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Secure, private, and controlled sharing of medical research data using Sui blockchain technology and
                Zero-Knowledge Proofs.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/dashboard">
                  <Button className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-square">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-lg opacity-20 blur-xl"></div>
                <div className="relative bg-white dark:bg-slate-800 border rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                    <div className="flex flex-col items-center p-4 bg-teal-50 dark:bg-slate-700 rounded-lg">
                      <LockIcon className="h-10 w-10 text-teal-600 mb-2" />
                      <h3 className="font-medium text-center">Encrypted Data</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-teal-50 dark:bg-slate-700 rounded-lg">
                      <ShieldIcon className="h-10 w-10 text-teal-600 mb-2" />
                      <h3 className="font-medium text-center">Zero-Knowledge Proofs</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-teal-50 dark:bg-slate-700 rounded-lg">
                      <FileTextIcon className="h-10 w-10 text-teal-600 mb-2" />
                      <h3 className="font-medium text-center">Smart Contracts</h3>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-teal-50 dark:bg-slate-700 rounded-lg">
                      <DatabaseIcon className="h-10 w-10 text-teal-600 mb-2" />
                      <h3 className="font-medium text-center">Decentralized</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Our platform leverages blockchain technology to provide secure and private medical data sharing.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <DatabaseIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold">Register Data</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Researchers register encrypted medical data as assets on the Sui blockchain.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <LockIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold">Control Access</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Data owners grant and revoke access to specific researchers using smart contracts.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <ShieldIcon className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold">Verify Access</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Zero-Knowledge Proofs verify access rights without revealing sensitive information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Decentralized Data Ownership</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Researchers maintain full control over their data assets.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Privacy-Preserving Access</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Zero-Knowledge Proofs protect sensitive information during verification.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Granular Access Control</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Grant and revoke access to specific researchers with detailed permissions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-600 dark:bg-teal-900">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-3.5 w-3.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Immutable Audit Trail</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Blockchain-based tracking of all access and modifications for compliance.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Data Registration</CardTitle>
                  <CardDescription>Register your medical research data securely</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Upload and encrypt your data before registering it on the blockchain.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/register">
                    <Button variant="outline" className="w-full">
                      Register Data
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Access Management</CardTitle>
                  <CardDescription>Control who can access your data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Grant and revoke access to other researchers with detailed permissions.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/access">
                    <Button variant="outline" className="w-full">
                      Manage Access
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Data Discovery</CardTitle>
                  <CardDescription>Find relevant research data</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Search for available research data based on metadata and request access.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/discover">
                    <Button variant="outline" className="w-full">
                      Discover Data
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>Track all data access and modifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View a complete history of who accessed your data and when.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link href="/audit">
                    <Button variant="outline" className="w-full">
                      View Audit Trail
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </LayoutWithSidebar>
  )
}
