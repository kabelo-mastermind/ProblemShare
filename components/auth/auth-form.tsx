"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { signIn, signUp, clearError } from "@/lib/redux/slices/authSlice"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { isLoading, error, user } = useAppSelector((state) => state.auth)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/explore")
    }
  }, [user, router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    try {
      if (isSignUp) {
        await dispatch(signUp({ email, password })).unwrap()
        // Show success message for sign up
        setFormError("Account created! Please check your email to verify your account.")
      } else {
        const resultAction = await dispatch(signIn({ email, password }))
        if (signIn.fulfilled.match(resultAction)) {
          router.push("/explore")
        }
      }
    } catch (err: any) {
      setFormError(typeof err === "string" ? err : "Authentication failed")
    }
  }

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
    dispatch(clearError())
    setFormError(null)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Sign in"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Enter your email below to create your account" : "Enter your email and password to sign in"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {(error || formError) && (
            <Alert variant={formError && isSignUp ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || formError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="w-full" onClick={toggleAuthMode}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </Button>
      </CardFooter>
    </Card>
  )
}
