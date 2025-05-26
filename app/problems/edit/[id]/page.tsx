"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ProblemForm from "@/components/problems/problem-form"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProblemById } from "@/lib/redux/slices/problemsSlice"
import type { Database } from "@/types/supabase"

type Problem = Database["public"]["Tables"]["problems"]["Row"]

export default function EditProblemPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user, isLoading: authLoading } = useAppSelector((state) => state.auth)
  const { currentProblem, isLoading: problemLoading } = useAppSelector((state) => state.problems)

  const id = params?.id as string
  const [problem, setProblem] = useState<Problem | undefined>(undefined)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    } else if (id) {
      dispatch(fetchProblemById(id))
    }
  }, [dispatch, id, user, authLoading, router])

  useEffect(() => {
    if (currentProblem && user) {
      // Check if the user owns this problem
      if (currentProblem.user_id !== user.id) {
        router.push("/my-problems")
      } else {
        setProblem(currentProblem)
      }
    }
  }, [currentProblem, user, router])

  if (authLoading || problemLoading) {
    return (
      <div className="container py-10">
        <p className="text-center">Loading...</p>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="container py-10">
        <p className="text-center">Problem not found or you don't have permission to edit it.</p>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Edit Problem</h1>
      <ProblemForm problem={problem} />
    </div>
  )
}
