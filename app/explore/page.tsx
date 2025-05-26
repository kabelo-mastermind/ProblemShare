"use client"

import { useEffect, useState } from "react"
import ProblemList from "@/components/problems/problem-list"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchAllProblems, clearError } from "@/lib/redux/slices/problemsSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, RefreshCw } from "lucide-react"

export default function ExplorePage() {
  const dispatch = useAppDispatch()
  const { allProblems, isLoading, error } = useAppSelector((state) => state.problems)
  const { user } = useAppSelector((state) => state.auth)
  const [fetchAttempted, setFetchAttempted] = useState(false)

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        await dispatch(fetchAllProblems()).unwrap()
      } catch (error) {
        console.error("Error fetching problems:", error)
      } finally {
        setFetchAttempted(true)
      }
    }

    fetchProblems()

    // Clean up error state when component unmounts
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const handleRetry = () => {
    setFetchAttempted(false)
    dispatch(clearError())
    dispatch(fetchAllProblems())
  }

  if (isLoading && !fetchAttempted) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Explore Problems</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Loading problems...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Explore Problems</h1>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error Loading Problems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">{error}</p>
            <div className="flex justify-center">
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Explore Problems</h1>
        {user && (
          <Button asChild>
            <Link href="/problems/create">
              <Plus className="mr-2 h-4 w-4" />
              New Problem
            </Link>
          </Button>
        )}
      </div>

      {allProblems.length === 0 && fetchAttempted ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-lg">No problems found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">There are no problems in the system yet. Be the first to add one!</p>
            {user ? (
              <Button asChild>
                <Link href="/problems/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Problem
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In to Create Problems</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ProblemList initialProblems={allProblems} />
      )}
    </div>
  )
}
