"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, X } from "lucide-react"
import type { Database } from "@/types/supabase"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { createProblem, updateProblem } from "@/lib/redux/slices/problemsSlice"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type Problem = Database["public"]["Tables"]["problems"]["Row"]
type ContactInfo = NonNullable<Problem["contact_info"]>

interface ProblemFormProps {
  problem?: Problem
}

export default function ProblemForm({ problem }: ProblemFormProps) {
  const [title, setTitle] = useState(problem?.title || "")
  const [description, setDescription] = useState(problem?.description || "")
  const [requirements, setRequirements] = useState(problem?.requirements || "")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>(problem?.tags || [])
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Contact information states
  const [contactEmail, setContactEmail] = useState(problem?.contact_info?.email || "")
  const [contactWhatsapp, setContactWhatsapp] = useState(problem?.contact_info?.whatsapp || "")
  const [contactPhone, setContactPhone] = useState(problem?.contact_info?.phone || "")
  const [contactTelegram, setContactTelegram] = useState(problem?.contact_info?.telegram || "")
  const [contactOther, setContactOther] = useState(problem?.contact_info?.other || "")
  const [preferredMethod, setPreferredMethod] = useState(problem?.contact_info?.preferred_method || "email")

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading, error } = useAppSelector((state) => state.problems)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setIsSubmitting(true)

    if (!user) {
      setFormError("You must be logged in to create a problem")
      setIsSubmitting(false)
      return
    }

    // Prepare contact info object
    const contactInfo: ContactInfo = {
      preferred_method: preferredMethod,
    }

    if (contactEmail) contactInfo.email = contactEmail
    if (contactWhatsapp) contactInfo.whatsapp = contactWhatsapp
    if (contactPhone) contactInfo.phone = contactPhone
    if (contactTelegram) contactInfo.telegram = contactTelegram
    if (contactOther) contactInfo.other = contactOther

    try {
      if (problem) {
        // Update existing problem
        const resultAction = await dispatch(
          updateProblem({
            id: problem.id,
            problem: {
              title,
              description,
              requirements,
              tags,
              contact_info: contactInfo,
            },
          }),
        )

        if (updateProblem.fulfilled.match(resultAction)) {
          router.push("/my-problems")
        } else if (updateProblem.rejected.match(resultAction)) {
          console.error("Problem update failed:", resultAction.error)
          setFormError(resultAction.error?.message || "Failed to update problem")
        }
      } else {
        // Create new problem
        console.log("Creating new problem:", {
          title,
          description,
          requirements,
          tags,
          user_id: user.id,
          contact_info: contactInfo,
        })

        const resultAction = await dispatch(
          createProblem({
            title,
            description,
            requirements,
            tags,
            user_id: user.id,
            contact_info: contactInfo,
          }),
        )

        if (createProblem.fulfilled.match(resultAction)) {
          router.push("/my-problems")
        } else if (createProblem.rejected.match(resultAction)) {
          console.error("Problem creation failed:", resultAction.error)
          setFormError((resultAction.payload as string) || "Failed to create problem")
        }
      }
    } catch (err) {
      console.error("Error in form submission:", err)
      setFormError(err instanceof Error ? err.message : "An error occurred while saving the problem")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{problem ? "Edit Problem" : "Create New Problem"}</CardTitle>
        <CardDescription>
          {problem ? "Update your problem details below" : "Fill in the details to create a new problem"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || formError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || formError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the problem in detail"
              rows={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              value={requirements || ""}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="List any specific requirements"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add tags (press Enter)"
              />
              <Button type="button" onClick={handleAddTag} variant="secondary">
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-sm text-muted-foreground">Provide ways for others to contact you about this problem.</p>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactWhatsapp">WhatsApp</Label>
              <Input
                id="contactWhatsapp"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                placeholder="+1234567890"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1234567890"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactTelegram">Telegram</Label>
                <Input
                  id="contactTelegram"
                  value={contactTelegram}
                  onChange={(e) => setContactTelegram(e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactOther">Other Contact Method</Label>
              <Input
                id="contactOther"
                value={contactOther}
                onChange={(e) => setContactOther(e.target.value)}
                placeholder="Discord: username#1234, Slack, etc."
              />
            </div>

            <div className="space-y-2">
              <Label>Preferred Contact Method</Label>
              <RadioGroup
                value={preferredMethod}
                onValueChange={setPreferredMethod}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email" />
                  <Label htmlFor="email" className="cursor-pointer">
                    Email
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp" />
                  <Label htmlFor="whatsapp" className="cursor-pointer">
                    WhatsApp
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="phone" />
                  <Label htmlFor="phone" className="cursor-pointer">
                    Phone
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="telegram" id="telegram" />
                  <Label htmlFor="telegram" className="cursor-pointer">
                    Telegram
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="cursor-pointer">
                    Other
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isSubmitting}>
              {isLoading || isSubmitting ? "Saving..." : problem ? "Update Problem" : "Create Problem"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
