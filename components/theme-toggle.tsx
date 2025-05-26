"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { setDarkMode } from "@/lib/redux/slices/uiSlice"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const dispatch = useAppDispatch()
  const { isDarkMode } = useAppSelector((state) => state.ui)

  const toggleTheme = (theme: "light" | "dark" | "system") => {
    setTheme(theme)
    if (theme === "dark") {
      dispatch(setDarkMode(true))
    } else if (theme === "light") {
      dispatch(setDarkMode(false))
    } else {
      // If system, check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      dispatch(setDarkMode(prefersDark))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleTheme("light")}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTheme("system")}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
