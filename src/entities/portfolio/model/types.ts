import type { Signal } from '@/shared/model/types'

export interface PortfolioEntry {
  coinId:   string
  amount:   number
  buyPrice: number
}

export interface PortfolioRow {
  coinId:       string
  symbol:       string
  name:         string
  amount:       number
  buyPrice:     number
  currentPrice: number
  currentValue: number
  signal:       Signal
  pnl:          number
  pnlPct:       number
}
