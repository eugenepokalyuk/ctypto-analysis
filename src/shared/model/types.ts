export interface Candle {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export type Signal = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL'

export type Sentiment = 'bullish' | 'bearish' | 'neutral'

export interface SignalReason {
  indicator: 'RSI' | 'MACD' | 'BB'
  sentiment: Sentiment
  label: string
  description: string
}

export interface Indicators {
  rsi: number
  macd: number
  macdSignal: number
  macdHistogram: number
  bbUpper: number
  bbMiddle: number
  bbLower: number
}
