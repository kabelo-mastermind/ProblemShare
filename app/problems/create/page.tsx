"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ProblemForm from "@/components/problems/problem-form"
import { useAppSelector } from "@/lib/redux/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CreateProblemPage() {
  const router = useRouter()
  const { user, isLoading } = useAppSelector((state) => state.auth)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Only redirect if we've finished checking auth and there's no user
    if (!isLoading) {
      setAuthChecked(true)
      if (!user) {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  // Show loading state while checking authentication
  if (isLoading || !authChecked) {
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

  // If user is not authenticated, show a message
  if (!user) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center">You need to be logged in to create a problem.</p>
            <div className="flex justify-center">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If user is authenticated, show the problem form
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Problem</h1>
      <ProblemForm />
    </div>
  )
}
