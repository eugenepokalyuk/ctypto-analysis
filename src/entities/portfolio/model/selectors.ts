import { createSelector } from '@reduxjs/toolkit'

import { COINS } from '@/shared/config/coins'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import type { RootState } from '@/app/store'

import type { PortfolioRow } from './types'

export const selectPortfolioEntries = (state: RootState) => state.portfolio

export const selectPortfolioRows = (marketData: CoinAnalysis[]) =>
  createSelector(selectPortfolioEntries, (entries): PortfolioRow[] =>
    entries.flatMap(e => {
      const coin = marketData.find(c => c.id === e.coinId)
      const meta = COINS.find(c => c.id === e.coinId)
      if (!coin || !meta) return []

      const currentValue = e.amount * coin.price
      const costBasis    = e.amount * e.buyPrice
      const pnl          = currentValue - costBasis
      const pnlPct       = costBasis > 0 ? (pnl / costBasis) * 100 : 0

      return [{
        coinId:       e.coinId,
        symbol:       meta.symbol,
        name:         meta.name,
        amount:       e.amount,
        buyPrice:     e.buyPrice,
        currentPrice: coin.price,
        signal:       coin.signal,
        currentValue,
        pnl,
        pnlPct,
      }]
    })
  )

export const selectPortfolioTotals = (marketData: CoinAnalysis[]) =>
  createSelector(selectPortfolioRows(marketData), rows => ({
    totalValue: rows.reduce((s, r) => s + r.currentValue, 0),
    totalPnl:   rows.reduce((s, r) => s + r.pnl, 0),
    totalCost:  rows.reduce((s, r) => s + r.amount * r.buyPrice, 0),
  }))
