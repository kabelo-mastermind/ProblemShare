import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchUser = createAsyncThunk("auth/fetchUser", async (_, { rejectWithValue }) => {
  try {
    const supabase = createBrowserSupabaseClient()
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.log("Error fetching user:", error.message)
      return rejectWithValue(null) // Return null instead of throwing an error
    }

    return data.user
  } catch (error: any) {
    console.error("Exception in fetchUser:", error)
    return rejectWithValue(null) // Return null instead of throwing an error
  }
})

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sign in")
    }
  },
)

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        return rejectWithValue(error.message)
      }

      return data.user
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to sign up")
    }
  },
)

export const signOut = createAsyncThunk("auth/signOut", async (_, { rejectWithValue }) => {
  try {
    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return rejectWithValue(error.message)
    }

    return null
  } catch (error: any) {
    return rejectWithValue(error.message || "Failed to sign out")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.isLoading = false
    },
    clearError: (state) => {
      state.error = null
    },
    startLoading: (state) => {
      state.isLoading = true
    },
    stopLoading: (state) => {
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {
    // fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.isLoading = false
      state.user = null
      // Don't set error for missing session
      state.error = null
    })

    // signIn
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoading = false
    })
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // signUp
    builder.addCase(signUp.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.user = action.payload
      state.isLoading = false
    })
    builder.addCase(signUp.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // signOut
    builder.addCase(signOut.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(signOut.fulfilled, (state) => {
      state.user = null
      state.isLoading = false
    })
    builder.addCase(signOut.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { setUser, clearError, startLoading, stopLoading } = authSlice.actions
export default authSlice.reducer
