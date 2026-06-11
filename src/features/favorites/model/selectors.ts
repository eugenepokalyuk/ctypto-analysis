import type { RootState } from '@/app/store'

export const selectFavoriteIds   = (state: RootState) => state.favorites.ids
export const selectIsFavorite    = (id: string) => (state: RootState) => state.favorites.ids.includes(id)
