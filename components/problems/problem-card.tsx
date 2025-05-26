"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Database } from "@/types/supabase"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle } from "lucide-react"

type Problem = Database["public"]["Tables"]["problems"]["Row"]

interface ProblemCardProps {
  problem: Problem
  showActions?: boolean
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function ProblemCard({ problem, showActions = false, onEdit, onDelete }: ProblemCardProps) {
  // Check if problem has contact information
  const hasContactInfo =
    problem.contact_info && Object.values(problem.contact_info).some((value) => value && value !== "")

  return (
    <Card className="h-full transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl line-clamp-2">
          <Link href={`/problems/${problem.id}`} className="hover:underline">
            {problem.title}
          </Link>
        </CardTitle>
        <CardDescription>{formatDistanceToNow(new Date(problem.created_at), { addSuffix: true })}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="line-clamp-3 text-sm text-muted-foreground">{problem.description}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex flex-wrap gap-2">
          {problem.tags?.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex justify-between w-full">
          {hasContactInfo && (
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              <MessageCircle className="h-4 w-4 mr-1" />
              <span>Contact available</span>
            </div>
          )}

          <div className="flex gap-2 ml-auto">
            <Link
              href={`/problems/${problem.id}`}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              View
            </Link>
            {showActions && (
              <>
                {onEdit && (
                  <button
                    onClick={() => onEdit(problem.id)}
                    className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(problem.id)}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
