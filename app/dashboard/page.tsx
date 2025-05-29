"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DatabaseIcon, UsersIcon, ClockIcon, FileTextIcon, LockIcon, UnlockIcon, AlertCircleIcon } from "lucide-react"
import { LayoutWithSidebar } from "@/components/layout-with-sidebar"
import Link from "next/link"
import { useCurrentAccount } from "@mysten/dapp-kit"

// Mock data for demonstration
const myDatasets = [
  {
    id: "data-001",
    name: "Cardiovascular Disease Study",
    type: "Clinical Trial",
    date: "2025-03-15",
    accessCount: 3,
    status: "active",
  },
  {
    id: "data-002",
    name: "Genomic Markers Research",
    type: "Genomic Data",
    date: "2025-02-28",
    accessCount: 1,
    status: "active",
  },
  {
    id: "data-003",
    name: "Neurological Response Patterns",
    type: "Imaging Data",
    date: "2025-01-10",
    accessCount: 0,
    status: "pending",
  },
]

const accessibleDatasets = [
  {
    id: "data-101",
    name: "Diabetes Treatment Outcomes",
    owner: "Dr. Sarah Chen",
    type: "Clinical Trial",
    date: "2025-03-01",
    expiresIn: "29 days",
  },
  {
    id: "data-102",
    name: "Respiratory Illness Patterns",
    owner: "Dr. James Wilson",
    type: "Epidemiological",
    date: "2025-02-15",
    expiresIn: "15 days",
  },
]

const accessRequests = [
  {
    id: "req-001",
    datasetName: "Cardiovascular Disease Study",
    requester: "Dr. Michael Johnson",
    requestDate: "2025-04-10",
    status: "pending",
  },
  {
    id: "req-002",
    datasetName: "Genomic Markers Research",
    requester: "Dr. Emily Rodriguez",
    requestDate: "2025-04-08",
    status: "pending",
  },
]

const recentActivity = [
  {
    id: "act-001",
    action: "Access Granted",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Lisa Thompson",
    date: "2025-04-12 14:30",
  },
  {
    id: "act-002",
    action: "Data Accessed",
    dataset: "Cardiovascular Disease Study",
    user: "Dr. Lisa Thompson",
    date: "2025-04-12 15:45",
  },
  {
    id: "act-003",
    action: "Access Request",
    dataset: "Genomic Markers Research",
    user: "Dr. Emily Rodriguez",
    date: "2025-04-08 09:15",
  },
  {
    id: "act-004",
    action: "Data Registered",
    dataset: "Neurological Response Patterns",
    user: "You",
    date: "2025-01-10 11:20",
  },
]

export default function Dashboard() {

  const account = useCurrentAccount();
  
  const connected = !!account;

  return (
    <LayoutWithSidebar>
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link href="/register">
              <Button className="bg-teal-600 hover:bg-teal-700">Register New Data</Button>
            </Link>
          </div>
        </div>

        {!connected && (
          <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800 dark:text-amber-200">
                Please connect your Sui wallet to access all features of the platform.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Datasets</CardTitle>
              <DatabaseIcon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myDatasets.length}</div>
              <p className="text-xs text-muted-foreground">
                {myDatasets.filter((d) => d.status === "active").length} active,{" "}
                {myDatasets.filter((d) => d.status === "pending").length} pending
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accessible Datasets</CardTitle>
              <UnlockIcon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessibleDatasets.length}</div>
              <p className="text-xs text-muted-foreground">
                From {new Set(accessibleDatasets.map((d) => d.owner)).size} different researchers
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Access Requests</CardTitle>
              <UsersIcon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accessRequests.length}</div>
              <p className="text-xs text-muted-foreground">
                {accessRequests.filter((r) => r.status === "pending").length} pending approval
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <ClockIcon className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentActivity.length}</div>
              <p className="text-xs text-muted-foreground">In the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="my-data" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-data">My Data</TabsTrigger>
            <TabsTrigger value="accessible">Accessible Data</TabsTrigger>
            <TabsTrigger value="requests">Access Requests</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="my-data" className="mt-6">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium">
                <div>Name</div>
                <div>Type</div>
                <div>Registered</div>
                <div>Access Count</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {myDatasets.map((dataset) => (
                  <div key={dataset.id} className="grid grid-cols-5 p-4 items-center">
                    <div className="font-medium">{dataset.name}</div>
                    <div>{dataset.type}</div>
                    <div>{dataset.date}</div>
                    <div>{dataset.accessCount}</div>
                    <div className="flex gap-2">
                      <Link href={`/data/${dataset.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                      <Link href={`/access/manage/${dataset.id}`}>
                        <Button variant="outline" size="sm">
                          Manage Access
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accessible" className="mt-6">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium">
                <div>Name</div>
                <div>Owner</div>
                <div>Type</div>
                <div>Access Expires</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {accessibleDatasets.map((dataset) => (
                  <div key={dataset.id} className="grid grid-cols-5 p-4 items-center">
                    <div className="font-medium">{dataset.name}</div>
                    <div>{dataset.owner}</div>
                    <div>{dataset.type}</div>
                    <div>In {dataset.expiresIn}</div>
                    <div className="flex gap-2">
                      <Link href={`/data/view/${dataset.id}`}>
                        <Button variant="outline" size="sm">
                          Access Data
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className="mt-6">
            <div className="rounded-md border">
              <div className="grid grid-cols-5 p-4 font-medium">
                <div>Dataset</div>
                <div>Requester</div>
                <div>Requested On</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {accessRequests.map((request) => (
                  <div key={request.id} className="grid grid-cols-5 p-4 items-center">
                    <div className="font-medium">{request.datasetName}</div>
                    <div>{request.requester}</div>
                    <div>{request.requestDate}</div>
                    <div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {request.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <div className="rounded-md border">
              <div className="grid grid-cols-4 p-4 font-medium">
                <div>Action</div>
                <div>Dataset</div>
                <div>User</div>
                <div>Date & Time</div>
              </div>
              <div className="divide-y">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="grid grid-cols-4 p-4 items-center">
                    <div>
                      {activity.action === "Access Granted" && (
                        <LockIcon className="h-4 w-4 text-teal-600 inline mr-1" />
                      )}
                      {activity.action === "Data Accessed" && (
                        <FileTextIcon className="h-4 w-4 text-blue-600 inline mr-1" />
                      )}
                      {activity.action === "Access Request" && (
                        <UsersIcon className="h-4 w-4 text-amber-600 inline mr-1" />
                      )}
                      {activity.action === "Data Registered" && (
                        <DatabaseIcon className="h-4 w-4 text-purple-600 inline mr-1" />
                      )}
                      {activity.action}
                    </div>
                    <div>{activity.dataset}</div>
                    <div>{activity.user}</div>
                    <div>{activity.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </LayoutWithSidebar>
  )
}
