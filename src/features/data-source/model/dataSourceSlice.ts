import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { SourceId } from '@/shared/api/providers'

const STORAGE_KEY = 'crypto_source_v1'

interface DataSourceState {
  preferred: SourceId   // выбор пользователя
  active:    SourceId | null  // реально работающий
}

const dataSourceSlice = createSlice({
  name: 'dataSource',
  initialState: (): DataSourceState => ({
    preferred: (localStorage.getItem(STORAGE_KEY) as SourceId | null) ?? 'static',
    active:    null,
  }),
  reducers: {
    setPreferredSource(state, action: PayloadAction<SourceId>) {
      state.preferred = action.payload
      localStorage.setItem(STORAGE_KEY, action.payload)
    },
    setActiveSource(state, action: PayloadAction<SourceId>) {
      state.active = action.payload
    },
  },
})

export const { setPreferredSource, setActiveSource } = dataSourceSlice.actions
export default dataSourceSlice.reducer
