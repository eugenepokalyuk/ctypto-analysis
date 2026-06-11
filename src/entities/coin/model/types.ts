import type { Candle, Indicators, Signal, SignalReason } from '../../../shared/model/types'

export type { Candle, Indicators, Signal, SignalReason }

export interface CoinAnalysis {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  signal: Signal
  signalReasons: SignalReason[]
  indicators: Indicators
  candles: Candle[]
}
