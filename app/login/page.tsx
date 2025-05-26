"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AuthForm from "@/components/auth/auth-form"
import { useAppSelector } from "@/lib/redux/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/explore")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container max-w-md py-10">
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

  return (
    <div className="container max-w-md py-10">
      <AuthForm />
    </div>
  )
}
