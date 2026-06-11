import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type LayoutType = 'grid' | 'list' | 'table'

const STORAGE_KEY = 'crypto_layout_v1'

const layoutSlice = createSlice({
  name: 'layout',
  initialState: (): { type: LayoutType } => ({
    type: (localStorage.getItem(STORAGE_KEY) as LayoutType | null) ?? 'grid',
  }),
  reducers: {
    setLayout(state, action: PayloadAction<LayoutType>) {
      state.type = action.payload
      localStorage.setItem(STORAGE_KEY, action.payload)
    },
  },
})

export const { setLayout } = layoutSlice.actions
export default layoutSlice.reducer
