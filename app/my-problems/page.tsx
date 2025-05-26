"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ProblemList from "@/components/problems/problem-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchUserProblems } from "@/lib/redux/slices/problemsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyProblemsPage() {
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

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Problems</h1>
        <Button asChild>
          <Link href="/problems/create">
            <Plus className="mr-2 h-4 w-4" />
            New Problem
          </Link>
        </Button>
      </div>

      <ProblemList initialProblems={userProblems} userProblemsOnly={true} />
    </div>
  )
}
