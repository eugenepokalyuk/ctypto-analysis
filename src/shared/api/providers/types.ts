import type { Candle } from '@/shared/model/types'

export type SourceId = 'static' | 'coingecko' | 'binance' | 'cryptocompare' | 'coincap'

export type PriceMap  = Record<string, { usd: number; usd_24h_change: number }>
export type CandleMap = Record<string, Candle[]>

export interface ProviderResult {
  prices:  PriceMap
  candles: CandleMap
}

export interface DataProvider {
  id:          SourceId
  name:        string
  description: string
  fetch:       () => Promise<ProviderResult>
}
