import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import type { Database } from "@/types/supabase"

type Problem = Database["public"]["Tables"]["problems"]["Row"]

interface ProblemsState {
  allProblems: Problem[]
  userProblems: Problem[]
  currentProblem: Problem | null
  isLoading: boolean
  error: string | null
  searchTerm: string
  selectedTags: string[]
}

const initialState: ProblemsState = {
  allProblems: [],
  userProblems: [],
  currentProblem: null,
  isLoading: false,
  error: null,
  searchTerm: "",
  selectedTags: [],
}

// Async thunks
export const fetchAllProblems = createAsyncThunk("problems/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const supabase = createBrowserSupabaseClient()

    // Try to fetch problems - if the table doesn't exist, it will throw an error
    const { data, error } = await supabase.from("problems").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching all problems:", error)
      if (error.code === "42P01") {
        return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
      }
      return rejectWithValue(error.message)
    }

    return data || []
  } catch (err: any) {
    console.error("Exception in fetchAllProblems:", err)
    return rejectWithValue(err.message || "Failed to fetch problems")
  }
})

export const fetchUserProblems = createAsyncThunk(
  "problems/fetchUserProblems",
  async (userId: string, { rejectWithValue }) => {
    try {
      const supabase = createBrowserSupabaseClient()

      const { data, error } = await supabase
        .from("problems")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user problems:", error)
        if (error.code === "42P01") {
          return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
        }
        return rejectWithValue(error.message)
      }

      return data || []
    } catch (err: any) {
      console.error("Exception in fetchUserProblems:", err)
      return rejectWithValue(err.message || "Failed to fetch user problems")
    }
  },
)

export const fetchProblemById = createAsyncThunk("problems/fetchById", async (id: string, { rejectWithValue }) => {
  try {
    const supabase = createBrowserSupabaseClient()

    const { data, error } = await supabase.from("problems").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching problem by ID:", error)
      if (error.code === "42P01") {
        return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
      }
      return rejectWithValue(error.message)
    }

    return data
  } catch (err: any) {
    console.error("Exception in fetchProblemById:", err)
    return rejectWithValue(err.message || "Failed to fetch problem")
  }
})

// Update the createProblem thunk to include contact_info
export const createProblem = createAsyncThunk(
  "problems/create",
  async (problem: Omit<Problem, "id" | "created_at" | "updated_at">, { rejectWithValue }) => {
    const supabase = createBrowserSupabaseClient()

    console.log("Creating problem with data:", problem)

    // Ensure problem has the correct format
    const newProblem = {
      title: problem.title,
      description: problem.description,
      requirements: problem.requirements || null,
      tags: problem.tags || [],
      user_id: problem.user_id,
      contact_info: problem.contact_info || {},
    }

    try {
      // Check if user is authenticated
      const { data: userData, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error("User authentication error:", userError)
        return rejectWithValue("Authentication error: " + userError.message)
      }

      if (!userData.user) {
        console.error("No authenticated user found")
        return rejectWithValue("You must be logged in to create a problem")
      }

      // Verify user ID matches
      if (userData.user.id !== problem.user_id) {
        console.error("User ID mismatch:", userData.user.id, problem.user_id)
        return rejectWithValue("User authentication error: ID mismatch")
      }

      // Create the problem
      const { data, error } = await supabase.from("problems").insert(newProblem).select().single()

      if (error) {
        console.error("Supabase error creating problem:", error)
        if (error.code === "42P01") {
          return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
        }
        return rejectWithValue("Failed to create problem: " + error.message)
      }

      if (!data) {
        console.error("No data returned from problem creation")
        return rejectWithValue("Failed to create problem - no data returned")
      }

      console.log("Problem created successfully:", data)
      return data
    } catch (err: any) {
      console.error("Exception in createProblem thunk:", err)
      return rejectWithValue(err.message || "An unexpected error occurred")
    }
  },
)

// Update the updateProblem thunk to include contact_info
export const updateProblem = createAsyncThunk(
  "problems/update",
  async ({ id, problem }: { id: string; problem: Partial<Problem> }, { rejectWithValue }) => {
    try {
      const supabase = createBrowserSupabaseClient()

      // Ensure problem update has the correct format
      const updatedFields = {
        title: problem.title,
        description: problem.description,
        requirements: problem.requirements || null,
        tags: problem.tags || [],
        contact_info: problem.contact_info || {},
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("problems").update(updatedFields).eq("id", id).select().single()

      if (error) {
        console.error("Error updating problem:", error)
        if (error.code === "42P01") {
          return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
        }
        return rejectWithValue(error.message)
      }

      if (!data) {
        return rejectWithValue("Failed to update problem")
      }

      return data
    } catch (err: any) {
      console.error("Exception in updateProblem:", err)
      return rejectWithValue(err.message || "Failed to update problem")
    }
  },
)

export const deleteProblem = createAsyncThunk("problems/delete", async (id: string, { rejectWithValue }) => {
  try {
    const supabase = createBrowserSupabaseClient()

    const { error } = await supabase.from("problems").delete().eq("id", id)

    if (error) {
      console.error("Error deleting problem:", error)
      if (error.code === "42P01") {
        return rejectWithValue("The problems table doesn't exist. Please run the database setup script.")
      }
      return rejectWithValue(error.message)
    }

    return id
  } catch (err: any) {
    console.error("Exception in deleteProblem:", err)
    return rejectWithValue(err.message || "Failed to delete problem")
  }
})

const problemsSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload
    },
    addSelectedTag: (state, action) => {
      if (!state.selectedTags.includes(action.payload)) {
        state.selectedTags.push(action.payload)
      }
    },
    removeSelectedTag: (state, action) => {
      state.selectedTags = state.selectedTags.filter((tag) => tag !== action.payload)
    },
    clearFilters: (state) => {
      state.searchTerm = ""
      state.selectedTags = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // fetchAllProblems
    builder.addCase(fetchAllProblems.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchAllProblems.fulfilled, (state, action) => {
      state.allProblems = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchAllProblems.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to fetch problems"
    })

    // fetchUserProblems
    builder.addCase(fetchUserProblems.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchUserProblems.fulfilled, (state, action) => {
      state.userProblems = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchUserProblems.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to fetch user problems"
    })

    // fetchProblemById
    builder.addCase(fetchProblemById.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(fetchProblemById.fulfilled, (state, action) => {
      state.currentProblem = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchProblemById.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to fetch problem"
    })

    // createProblem
    builder.addCase(createProblem.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(createProblem.fulfilled, (state, action) => {
      state.userProblems = [action.payload, ...state.userProblems]
      state.allProblems = [action.payload, ...state.allProblems]
      state.isLoading = false
      state.error = null
    })
    builder.addCase(createProblem.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to create problem"
      console.error("Problem creation rejected:", action.payload)
    })

    // updateProblem
    builder.addCase(updateProblem.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateProblem.fulfilled, (state, action) => {
      const updatedProblem = action.payload
      state.userProblems = state.userProblems.map((p) => (p.id === updatedProblem.id ? updatedProblem : p))
      state.allProblems = state.allProblems.map((p) => (p.id === updatedProblem.id ? updatedProblem : p))
      state.currentProblem = updatedProblem
      state.isLoading = false
    })
    builder.addCase(updateProblem.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to update problem"
    })

    // deleteProblem
    builder.addCase(deleteProblem.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(deleteProblem.fulfilled, (state, action) => {
      const deletedId = action.payload
      state.userProblems = state.userProblems.filter((p) => p.id !== deletedId)
      state.allProblems = state.allProblems.filter((p) => p.id !== deletedId)
      if (state.currentProblem?.id === deletedId) {
        state.currentProblem = null
      }
      state.isLoading = false
    })
    builder.addCase(deleteProblem.rejected, (state, action) => {
      state.isLoading = false
      state.error = (action.payload as string) || "Failed to delete problem"
    })
  },
})

export const { setSearchTerm, setSelectedTags, addSelectedTag, removeSelectedTag, clearFilters, clearError } =
  problemsSlice.actions
export default problemsSlice.reducer
