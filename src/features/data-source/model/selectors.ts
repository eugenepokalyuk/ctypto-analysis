import type { RootState } from '@/app/store'

export const selectPreferredSource = (state: RootState) => state.dataSource.preferred
export const selectActiveSource    = (state: RootState) => state.dataSource.active
