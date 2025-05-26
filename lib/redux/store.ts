import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/authSlice"
import problemsReducer from "./slices/problemsSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for Supabase auth objects
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
