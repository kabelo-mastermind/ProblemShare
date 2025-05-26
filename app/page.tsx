import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Compass } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-theme(spacing.14))] px-4 py-10 text-center">
      <div className="max-w-3xl space-y-6">
        <div className="inline-block p-4 bg-blue-100 rounded-full">
          <Compass className="h-12 w-12 text-blue-600" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Share and discover problems worth solving</h1>

        <p className="text-xl text-muted-foreground">
          ProblemShare is a platform where you can share problems you've encountered and discover interesting challenges
          posted by others.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild size="lg" className="text-base">
            <Link href="/explore">Explore Problems</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-6 bg-background rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Share Your Problems</h3>
          <p className="text-muted-foreground">
            Document and share problems you've encountered in your work or studies.
          </p>
        </div>

        <div className="p-6 bg-background rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Discover Solutions</h3>
          <p className="text-muted-foreground">
            Find interesting problems and contribute your own solutions and insights.
          </p>
        </div>

        <div className="p-6 bg-background rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Real-time Updates</h3>
          <p className="text-muted-foreground">Get notified in real-time when new problems are added or updated.</p>
        </div>
      </div>
    </div>
  )
}
