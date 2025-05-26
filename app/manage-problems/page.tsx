"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProblemList from "@/components/problems/problem-list"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchUserProblems } from "@/lib/redux/slices/problemsSlice"

export default function ManageProblemsPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { userProblems, isLoading: problemsLoading } = useAppSelector((state) => state.problems)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (user) {
      dispatch(fetchUserProblems(user.id))
    }
  }, [dispatch, user, authLoading, router])

  if (authLoading || problemsLoading) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Loading your problems...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Get counts for different problem statuses
  const totalProblems = userProblems?.length || 0
  const recentProblems = userProblems
    ? [...userProblems].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5)
    : []

  return (
    <div className="container py-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/explore">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explore
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Problem Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Problem Dashboard</CardTitle>
            <CardDescription>Manage your problems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Problems</span>
                <span className="font-medium">{totalProblems}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/problems/create">
                <Plus className="mr-2 h-4 w-4" />
                Create New Problem
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Problems</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ProblemList initialProblems={userProblems} userProblemsOnly={true} />
            </TabsContent>
            <TabsContent value="recent">
              <ProblemList initialProblems={recentProblems} userProblemsOnly={true} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
