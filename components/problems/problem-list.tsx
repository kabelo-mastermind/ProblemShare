"use client"

import { useState, useEffect } from "react"
import ProblemCard from "./problem-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, X, FilterX } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Database } from "@/types/supabase"
import { useDebounce } from "@/hooks/use-debounce"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import {
  fetchAllProblems,
  fetchUserProblems,
  deleteProblem,
  setSearchTerm,
  addSelectedTag,
  removeSelectedTag,
  clearFilters,
} from "@/lib/redux/slices/problemsSlice"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type Problem = Database["public"]["Tables"]["problems"]["Row"]

interface ProblemListProps {
  initialProblems: Problem[]
  userProblemsOnly?: boolean
}

export default function ProblemList({ initialProblems, userProblemsOnly = false }: ProblemListProps) {
  const [allTags, setAllTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.auth)
  const { allProblems, userProblems, searchTerm, selectedTags, isLoading } = useAppSelector((state) => state.problems)

  const problems = userProblemsOnly ? userProblems : allProblems
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Initialize problems in Redux store
  useEffect(() => {
    if (userProblemsOnly && user) {
      dispatch(fetchUserProblems(user.id))
    } else if (!userProblemsOnly) {
      dispatch(fetchAllProblems())
    }
  }, [dispatch, userProblemsOnly, user])

  // Extract all unique tags from problems
  useEffect(() => {
    const tags = new Set<string>()
    problems.forEach((problem) => {
      problem.tags?.forEach((tag) => tags.add(tag))
    })
    setAllTags(Array.from(tags))
  }, [problems])

  // Filter problems based on search term and selected tags
  const filteredProblems = problems.filter((problem) => {
    // Search term filter
    if (debouncedSearchTerm) {
      const lowerSearchTerm = debouncedSearchTerm.toLowerCase()
      if (
        !problem.title.toLowerCase().includes(lowerSearchTerm) &&
        !problem.description.toLowerCase().includes(lowerSearchTerm)
      ) {
        return false
      }
    }

    // Tags filter
    if (selectedTags.length > 0) {
      return selectedTags.every((tag) => problem.tags?.includes(tag))
    }

    return true
  })

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      dispatch(removeSelectedTag(tag))
    } else {
      dispatch(addSelectedTag(tag))
    }
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  const handleEdit = (id: string) => {
    router.push(`/problems/edit/${id}`)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this problem?")) {
      await dispatch(deleteProblem(id))
      router.refresh()
    }
  }

  if (problems.length === 0 && !isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center text-lg">No problems found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {userProblemsOnly ? (
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground">You haven't created any problems yet</p>
              <Button variant="outline" size="sm" onClick={() => router.push("/problems/create")} className="mt-2">
                Create your first problem
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">No problems have been added to the system yet</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" className="sm:hidden" onClick={() => setShowFilters(!showFilters)}>
            <FilterX className="h-4 w-4" />
            <span className="sr-only">Toggle filters</span>
          </Button>
        </div>

        {allTags.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${showFilters ? "block" : "hidden sm:flex"}`}>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
                }`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}

            {(selectedTags.length > 0 || searchTerm) && (
              <Button variant="ghost" size="sm" onClick={handleClearFilters} className="flex items-center gap-1 h-6">
                <X className="h-3 w-3" /> Clear filters
              </Button>
            )}
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      ) : filteredProblems.length === 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center text-lg">No problems found</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            {searchTerm || selectedTags.length > 0 ? (
              <div className="flex flex-col items-center">
                <p>No problems match your filters</p>
                <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-2">
                  Clear all filters
                </Button>
              </div>
            ) : userProblemsOnly ? (
              <div className="flex flex-col items-center">
                <p>You haven't created any problems yet</p>
                <Button variant="outline" size="sm" onClick={() => router.push("/problems/create")} className="mt-2">
                  Create your first problem
                </Button>
              </div>
            ) : (
              <p>No problems have been added to the system yet</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              showActions={userProblemsOnly}
              onEdit={userProblemsOnly ? handleEdit : undefined}
              onDelete={userProblemsOnly ? handleDelete : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}
