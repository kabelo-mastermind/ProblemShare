"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import { useEffect } from "react"
import { useAppDispatch } from "@/lib/redux/hooks"
import { setDarkMode } from "@/lib/redux/slices/uiSlice"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const dispatch = useAppDispatch()

  // Sync theme changes with Redux
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      if (props.enableSystem) {
        dispatch(setDarkMode(e.matches))
      }
    }

    // Initial sync
    if (props.enableSystem) {
      dispatch(setDarkMode(mediaQuery.matches))
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [dispatch, props.enableSystem])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
