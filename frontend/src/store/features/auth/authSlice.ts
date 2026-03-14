import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  user: object | null,
  error:string| object | null,
  loading: boolean,
  accessToken: string | null,
  toast: { type: "success" | "error", message: string } | null,
}

const initialState: CounterState = {
  user: null,
  error: null,
  loading: true,
  accessToken: null,
  toast: null,
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | object>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setToast: (state, action: PayloadAction<{ type: "success" | "error", message: string } | null>) => {
      state.toast = action.payload;
    },
  },
})

export const { setError, setLoading, setUser, setAccessToken, setToast } = authSlice.actions

export default authSlice.reducer