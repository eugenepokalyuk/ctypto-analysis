import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const STORAGE_KEY = 'crypto_favorites_v1'

function loadIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function persistIds(ids: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

interface FavoritesState {
  ids: string[]
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: (): FavoritesState => ({ ids: loadIds() }),
  reducers: {
    toggleFavorite(state, action: PayloadAction<string>) {
      const idx = state.ids.indexOf(action.payload)
      if (idx >= 0) {
        state.ids.splice(idx, 1)
      } else {
        state.ids.unshift(action.payload) // новые избранные — в начало
      }
      persistIds(state.ids)
    },
  },
})

export const { toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer
