"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Home, Plus, User, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"
import { cn } from "@/lib/utils"

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const { isDarkMode } = useAppSelector((state) => state.ui)

  const isActive = (path: string) => pathname === path

  if (pathname === "/login") return null

  return (
    <>
      {/* Floating action button for adding new problem */}
      {user && (
        <div className="fixed right-4 bottom-20 z-40 sm:hidden">
          <div className="flex flex-col gap-3 items-end">
            <Button
              size="icon"
              variant="outline"
              className={cn("h-12 w-12 rounded-full shadow-lg", isDarkMode ? "bg-zinc-800" : "bg-white")}
              onClick={() => router.push("/my-problems")}
            >
              <List className="h-5 w-5" />
              <span className="sr-only">My Problems</span>
            </Button>

            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => router.push("/problems/create")}
            >
              <Plus className="h-6 w-6" />
              <span className="sr-only">New Problem</span>
            </Button>
          </div>
        </div>
      )}

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 z-40 w-full border-t bg-background sm:hidden">
        <div className="grid h-16 grid-cols-3">
          <Link
            href="/explore"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/explore") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Link>

          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 ${
              isActive("/") ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Link>

          {user ? (
            <Link
              href="/my-problems"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive("/my-problems") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">My Problems</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive("/login") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-xs">Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
