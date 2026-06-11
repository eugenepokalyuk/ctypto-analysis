import { configureStore } from '@reduxjs/toolkit'

import { marketApi }      from '@/shared/api/marketApi'
import favoritesReducer   from '@/features/favorites/model/favoritesSlice'
import dataSourceReducer  from '@/features/data-source/model/dataSourceSlice'
import layoutReducer      from '@/features/layout-switcher/model/layoutSlice'
import portfolioReducer   from '@/entities/portfolio/model/portfolioSlice'

export const store = configureStore({
  reducer: {
    [marketApi.reducerPath]: marketApi.reducer,
    favorites:  favoritesReducer,
    dataSource: dataSourceReducer,
    layout:     layoutReducer,
    portfolio:  portfolioReducer,
  },
  middleware: getDefault => getDefault().concat(marketApi.middleware),
})

export type RootState   = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
