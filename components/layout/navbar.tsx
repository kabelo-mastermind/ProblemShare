"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Compass, LogOut, Plus, UserIcon, Settings, List, PlusCircle } from "lucide-react"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { signOut } from "@/lib/redux/slices/authSlice"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { user, isLoading } = useAppSelector((state) => state.auth)

  const handleSignOut = async () => {
    await dispatch(signOut())
    router.push("/")
  }

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Compass className="h-5 w-5" />
          <span>ProblemShare</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6 mx-6">
          <Link
            href="/explore"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive("/explore") ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            Explore
          </Link>
          {user && (
            <Link
              href="/my-problems"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/my-problems") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              My Problems
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {!isLoading && (
            <>
              {user ? (
                <>
                  <div className="hidden sm:flex items-center gap-2">
                    <Button variant="default" size="sm" onClick={() => router.push("/problems/create")}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Problem
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          Manage Problems
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => router.push("/my-problems")}>
                          <List className="mr-2 h-4 w-4" />
                          <span>My Problems</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/problems/create")}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          <span>Create New Problem</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <UserIcon className="h-5 w-5" />
                        <span className="sr-only">User menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled>
                        <span className="text-sm font-medium">{user.email}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/my-problems">
                          <List className="mr-2 h-4 w-4" />
                          <span>My Problems</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/manage-problems">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Manage Problems</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/problems/create">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          <span>Create Problem</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button size="sm" onClick={() => router.push("/login")}>
                  Sign In
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  )
}
