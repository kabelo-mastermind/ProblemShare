"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Edit, Mail, Phone, MessageCircle } from "lucide-react"
import { formatDistanceToNow, format } from "date-fns"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchProblemById } from "@/lib/redux/slices/problemsSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.auth)
  const { currentProblem, isLoading, error } = useAppSelector((state) => state.problems)

  const id = params?.id as string

  useEffect(() => {
    // Special case handling for "create" route
    if (id === "create") {
      router.push("/problems/create")
      return
    }

    // Only fetch problem if we have a valid ID (not "create" or "new")
    if (id && id !== "new" && id !== "create") {
      dispatch(fetchProblemById(id))
    }
  }, [dispatch, id, router])

  // Check if we're on a special route
  if (id === "new" || id === "create") {
    return null
  }

  const isOwner = user && currentProblem && user.id === currentProblem.user_id

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">Loading problem details...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !currentProblem) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-red-500">Problem not found</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/explore">Back to Explore</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Helper function to render contact info
  const renderContactInfo = () => {
    if (!currentProblem.contact_info) return null

    const contactInfo = currentProblem.contact_info
    const hasContactInfo = Object.values(contactInfo).some((value) => value && value !== "")

    if (!hasContactInfo) return null

    return (
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 flex items-center">
          <MessageCircle className="mr-2 h-5 w-5" />
          Contact Information
        </h3>

        <div className="space-y-2">
          {contactInfo.preferred_method && (
            <p className="text-sm text-muted-foreground">
              Preferred contact method: <span className="font-medium">{contactInfo.preferred_method}</span>
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {contactInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{contactInfo.email}</span>
              </div>
            )}

            {contactInfo.whatsapp && (
              <div className="flex items-center">
                <svg
                  className="h-4 w-4 mr-2 text-green-600 dark:text-green-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="text-sm">{contactInfo.whatsapp}</span>
              </div>
            )}

            {contactInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">{contactInfo.phone}</span>
              </div>
            )}

            {contactInfo.telegram && (
              <div className="flex items-center">
                <svg className="h-4 w-4 mr-2 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.175.786-.841 3.757-1.192 5.084-.147.554-.49 1.38-.8 1.507-.645.257-1.347-.326-2.052-.638-.401-.176-1.769-.92-2.068-1.13-.874-.608-1.569-1.08-1.493-1.891.024-.252.325-.61.69-.932.192-.17 3.15-2.9 3.205-3.148.007-.033.014-.157-.059-.223-.073-.066-.203-.044-.292-.026-.123.024-2.09 1.33-5.9 3.921-.558.386-1.064.575-1.517.57-.5-.006-1.46-.294-2.17-.535-.885-.306-1.587-.468-1.527-.99.032-.275.344-.557.936-.843 3.65-1.588 6.094-2.64 7.33-3.152 3.483-1.445 4.206-1.698 4.68-1.707.106-.002.347.026.502.199.13.143.162.333.18.471.018.14.011.565-.001.789z" />
                </svg>
                <span className="text-sm">{contactInfo.telegram}</span>
              </div>
            )}

            {contactInfo.other && (
              <div className="flex items-center col-span-1 sm:col-span-2">
                <span className="text-sm font-medium mr-2">Other:</span>
                <span className="text-sm">{contactInfo.other}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 sm:py-10 px-4 sm:px-6">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/explore" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to problems
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <CardTitle className="text-2xl sm:text-3xl">{currentProblem.title}</CardTitle>
            {isOwner && (
              <Button asChild variant="outline" size="sm" className="self-start">
                <Link href={`/problems/edit/${currentProblem.id}`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center text-sm text-muted-foreground gap-4 mt-2">
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={currentProblem.created_at}>{format(new Date(currentProblem.created_at), "PPP")}</time>
              <span className="ml-1">
                ({formatDistanceToNow(new Date(currentProblem.created_at), { addSuffix: true })})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {currentProblem.tags?.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="whitespace-pre-wrap">{currentProblem.description}</div>

            {currentProblem.requirements && (
              <>
                <h2 className="text-xl font-semibold mt-8">Requirements</h2>
                <div className="whitespace-pre-wrap">{currentProblem.requirements}</div>
              </>
            )}

            {renderContactInfo()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
