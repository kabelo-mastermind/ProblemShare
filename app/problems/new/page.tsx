"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ProblemForm from "@/components/problems/problem-form"
import { useAppSelector } from "@/lib/redux/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewProblemPage() {
  const router = useRouter()
  const { user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Please wait while we check your authentication status.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If user is authenticated, show the problem form
  if (user) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
        <ProblemForm />
      </div>
    )
  }

  // This should not be visible as the useEffect will redirect to login
  return null
}
