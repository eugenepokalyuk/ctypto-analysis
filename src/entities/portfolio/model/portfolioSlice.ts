import { createSlice, current } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import type { PortfolioEntry } from './types'

const STORAGE_KEY = 'crypto_portfolio_v1'

const load = (): PortfolioEntry[] => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}

const persist = (entries: PortfolioEntry[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: load,
  reducers: {
    upsertEntry(state, { payload }: PayloadAction<PortfolioEntry>) {
      const idx = state.findIndex(e => e.coinId === payload.coinId)
      if (idx >= 0) state[idx] = payload
      else state.push(payload)
      persist(current(state))
    },
    removeEntry(state, { payload: coinId }: PayloadAction<string>) {
      const next = state.filter(e => e.coinId !== coinId)
      persist(next)
      return next
    },
  },
})

export const { upsertEntry, removeEntry } = portfolioSlice.actions
export default portfolioSlice.reducer
