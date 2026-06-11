import type { RootState } from '@/app/store'

export const selectLayout = (state: RootState) => state.layout.type
