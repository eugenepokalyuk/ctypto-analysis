import { RSI, MACD, BollingerBands } from 'technicalindicators'
import type { Candle, Indicators, Signal, SignalReason } from './types'

export function computeIndicators(candles: Candle[]): Indicators | null {
  if (candles.length < 26) return null
  const closes = candles.map(c => c.close)

  const rsiArr  = RSI.calculate({ values: closes, period: 14 })
  const macdArr = MACD.calculate({ values: closes, fastPeriod: 12, slowPeriod: 26, signalPeriod: 9, SimpleMAOscillator: false, SimpleMASignal: false })
  const bbArr   = BollingerBands.calculate({ values: closes, period: 20, stdDev: 2 })

  if (!rsiArr.length || !macdArr.length || !bbArr.length) return null

  const rsi  = rsiArr.at(-1)!
  const macd = macdArr.at(-1)!
  const bb   = bbArr.at(-1)!

  return {
    rsi,
    macd:          macd.MACD ?? 0,
    macdSignal:    macd.signal ?? 0,
    macdHistogram: macd.histogram ?? 0,
    bbUpper:       bb.upper,
    bbMiddle:      bb.middle,
    bbLower:       bb.lower,
  }
}

export function generateSignal(indicators: Indicators, price: number): { signal: Signal; reasons: SignalReason[] } {
  const { rsi, macd, macdSignal, bbUpper, bbLower } = indicators
  const reasons: SignalReason[] = []
  let score = 0

  if (rsi < 30) {
    score += 2
    reasons.push({ indicator: 'RSI', sentiment: 'bullish', label: `RSI ${rsi.toFixed(1)}`, description: 'Перепродан — возможен отскок' })
  } else if (rsi < 40) {
    score += 1
    reasons.push({ indicator: 'RSI', sentiment: 'bullish', label: `RSI ${rsi.toFixed(1)}`, description: 'Зона накопления' })
  } else if (rsi > 70) {
    score -= 2
    reasons.push({ indicator: 'RSI', sentiment: 'bearish', label: `RSI ${rsi.toFixed(1)}`, description: 'Перекуплен — риск коррекции' })
  } else if (rsi > 60) {
    score -= 1
    reasons.push({ indicator: 'RSI', sentiment: 'bearish', label: `RSI ${rsi.toFixed(1)}`, description: 'Зона распределения' })
  } else {
    reasons.push({ indicator: 'RSI', sentiment: 'neutral', label: `RSI ${rsi.toFixed(1)}`, description: 'Нейтральная зона' })
  }

  if (macd > macdSignal) {
    score += 1
    reasons.push({ indicator: 'MACD', sentiment: 'bullish', label: 'MACD ▲', description: 'Выше сигнальной линии — бычий импульс' })
  } else {
    score -= 1
    reasons.push({ indicator: 'MACD', sentiment: 'bearish', label: 'MACD ▼', description: 'Ниже сигнальной линии — медвежий импульс' })
  }

  const bbRange  = bbUpper - bbLower
  const pricePos = bbRange > 0 ? (price - bbLower) / bbRange : 0.5
  const bbLabel  = `BB %B ${(pricePos * 100).toFixed(0)}%`

  if (pricePos < 0.2) {
    score += 1
    reasons.push({ indicator: 'BB', sentiment: 'bullish', label: bbLabel, description: 'У нижней полосы — зона поддержки' })
  } else if (pricePos > 0.8) {
    score -= 1
    reasons.push({ indicator: 'BB', sentiment: 'bearish', label: bbLabel, description: 'У верхней полосы — зона сопротивления' })
  } else {
    reasons.push({ indicator: 'BB', sentiment: 'neutral', label: bbLabel, description: 'Середина диапазона' })
  }

  if (score >= 3)  return { signal: 'STRONG_BUY',  reasons }
  if (score >= 1)  return { signal: 'BUY',          reasons }
  if (score <= -3) return { signal: 'STRONG_SELL',  reasons }
  if (score <= -1) return { signal: 'SELL',         reasons }
  return { signal: 'HOLD', reasons }
}
