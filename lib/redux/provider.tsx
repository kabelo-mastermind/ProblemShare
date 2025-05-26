"use client"

import type React from "react"

import { store } from "./store"
import { Provider } from "react-redux"
import { useEffect } from "react"
import { setUser, startLoading, stopLoading } from "./slices/authSlice"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        // Set loading state
        store.dispatch(startLoading())

        // Check if user is already authenticated
        const supabase = createBrowserSupabaseClient()
        const { data, error } = await supabase.auth.getSession()

        if (data?.session?.user) {
          store.dispatch(setUser(data.session.user))
        } else {
          store.dispatch(stopLoading())
        }

        // Set up auth listener
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          console.log("Auth state changed:", event, session?.user?.email)
          if (session?.user) {
            store.dispatch(setUser(session.user))
          } else if (event === "SIGNED_OUT") {
            store.dispatch(setUser(null))
          }
        })

        return () => {
          authListener.subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        store.dispatch(stopLoading())
      }
    }

    initAuth()
  }, [])

  return <Provider store={store}>{children}</Provider>
}
