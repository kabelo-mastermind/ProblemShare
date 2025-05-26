import { createSlice } from "@reduxjs/toolkit"

interface UiState {
  isNavOpen: boolean
  isDarkMode: boolean
  notifications: Array<{
    id: string
    message: string
    type: "success" | "error" | "info"
  }>
}

// Initialize with system preference if available in the browser
const getInitialDarkMode = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
  }
  return false
}

const initialState: UiState = {
  isNavOpen: false,
  isDarkMode: getInitialDarkMode(),
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleNav: (state) => {
      state.isNavOpen = !state.isNavOpen
    },
    setNavOpen: (state, action) => {
      state.isNavOpen = action.payload
    },
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now().toString(),
        ...action.payload,
      })
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  toggleNav,
  setNavOpen,
  toggleDarkMode,
  setDarkMode,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions
export default uiSlice.reducer
