import { COINS } from '@/shared/config/coins'

import type { Candle } from '@/shared/model/types'
import type { DataProvider, ProviderResult } from './types'

const STATIC_URL = `${import.meta.env.BASE_URL}data.json`

export const staticProvider: DataProvider = {
  id:          'static',
  name:        'GitHub Cache',
  description: 'Кэш из GitHub Actions, обновляется каждые 5 мин. Нулевой rate limit.',

  async fetch(): Promise<ProviderResult> {
    const res = await fetch(`${STATIC_URL}?t=${Math.floor(Date.now() / 60000)}`)
    if (!res.ok) throw new Error('Static file not found')

    const snap = await res.json() as {
      updatedAt: string | null
      prices:   Record<string, { usd: number; usd_24h_change: number }>
      candles:  Record<string, [number, number, number, number, number][]>
    }

    if (!snap.updatedAt || Object.keys(snap.prices).length === 0) {
      throw new Error('Static data is empty placeholder')
    }

    const candles: Record<string, Candle[]> = {}
    for (const coin of COINS) {
      candles[coin.id] = (snap.candles[coin.id] ?? []).map(
        ([t, o, h, l, c]) => ({ time: t, open: o, high: h, low: l, close: c })
      )
    }

    return { prices: snap.prices, candles }
  },
}
