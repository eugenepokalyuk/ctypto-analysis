import { COINS } from '@/shared/config/coins'
import type { Candle } from '@/shared/model/types'

import type { DataProvider, ProviderResult } from './types'

const BASE = 'https://api.coingecko.com/api/v3'
const IDS  = COINS.map(c => c.id).join(',')

export const coinGeckoProvider: DataProvider = {
  id:          'coingecko',
  name:        'CoinGecko',
  description: 'Агрегированные цены. Free tier: 50 req/мин.',

  async fetch(): Promise<ProviderResult> {
    const [pricesRes, ...ohlcResults] = await Promise.all([
      fetch(`${BASE}/simple/price?ids=${IDS}&vs_currencies=usd&include_24hr_change=true`),
      ...COINS.map(c => fetch(`${BASE}/coins/${c.id}/ohlc?vs_currency=usd&days=30`)),
    ])

    if (!pricesRes.ok) throw new Error(`CoinGecko prices: ${pricesRes.status}`)

    const prices = await pricesRes.json()
    const candles: Record<string, Candle[]> = {}

    for (let i = 0; i < COINS.length; i++) {
      const r = ohlcResults[i]
      if (r.ok) {
        const raw: [number, number, number, number, number][] = await r.json()
        candles[COINS[i].id] = raw.map(([t, o, h, l, c]) => ({
          time: Math.floor(t / 1000), open: o, high: h, low: l, close: c,
        }))
      } else {
        candles[COINS[i].id] = []
      }
    }

    return { prices, candles }
  },
}
