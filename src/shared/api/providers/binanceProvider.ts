import { COINS } from '@/shared/config/coins'
import { EXCHANGE_SYMBOLS } from '@/shared/config/exchangeSymbols'
import type { Candle } from '@/shared/model/types'

import type { DataProvider, PriceMap, ProviderResult } from './types'

const BASE         = 'https://api.binance.com/api/v3'
const SYMBOLS_JSON = JSON.stringify(COINS.map(c => EXCHANGE_SYMBOLS[c.id].binance))

export const binanceProvider: DataProvider = {
  id:          'binance',
  name:        'Binance',
  description: 'Реальные данные крупнейшей биржи. Без ключа, без rate limit для публичных эндпоинтов.',

  async fetch(): Promise<ProviderResult> {
    const [tickerRes, ...klineResults] = await Promise.all([
      fetch(`${BASE}/ticker/24hr?symbols=${SYMBOLS_JSON}`),
      ...COINS.map(c =>
        fetch(`${BASE}/klines?symbol=${EXCHANGE_SYMBOLS[c.id].binance}&interval=1d&limit=30`)
      ),
    ])

    if (!tickerRes.ok) throw new Error(`Binance ticker: ${tickerRes.status}`)

    type BinanceTicker = { symbol: string; lastPrice: string; priceChangePercent: string }
    const tickers: BinanceTicker[] = await tickerRes.json()

    const prices: PriceMap = {}
    for (const coin of COINS) {
      const sym    = EXCHANGE_SYMBOLS[coin.id].binance
      const ticker = tickers.find(t => t.symbol === sym)
      if (ticker) {
        prices[coin.id] = {
          usd:            parseFloat(ticker.lastPrice),
          usd_24h_change: parseFloat(ticker.priceChangePercent),
        }
      }
    }

    const candles: Record<string, Candle[]> = {}
    for (let i = 0; i < COINS.length; i++) {
      const r = klineResults[i]
      if (r.ok) {
        // Binance kline: [openTime, open, high, low, close, volume, ...]
        const raw: string[][] = await r.json()
        candles[COINS[i].id] = raw.map(k => ({
          time:  Math.floor(Number(k[0]) / 1000),
          open:  parseFloat(k[1]),
          high:  parseFloat(k[2]),
          low:   parseFloat(k[3]),
          close: parseFloat(k[4]),
        }))
      } else {
        candles[COINS[i].id] = []
      }
    }

    return { prices, candles }
  },
}
