import { COINS } from '@/shared/config/coins'
import { EXCHANGE_SYMBOLS } from '@/shared/config/exchangeSymbols'
import type { Candle } from '@/shared/model/types'

import type { DataProvider, PriceMap, ProviderResult } from './types'

const BASE = 'https://api.coincap.io/v2'

export const coinCapProvider: DataProvider = {
  id:          'coincap',
  name:        'CoinCap',
  description: 'Простой публичный API без ключа. 200 req/мин. Данные от ShapeShift.',

  async fetch(): Promise<ProviderResult> {
    const ids        = COINS.map(c => EXCHANGE_SYMBOLS[c.id].coincapId).join(',')
    const end        = Date.now()
    const start      = end - 30 * 24 * 60 * 60 * 1000

    const [assetsRes, ...histResults] = await Promise.all([
      fetch(`${BASE}/assets?ids=${ids}`),
      ...COINS.map(c =>
        fetch(`${BASE}/assets/${EXCHANGE_SYMBOLS[c.id].coincapId}/history?interval=d1&start=${start}&end=${end}`)
      ),
    ])

    if (!assetsRes.ok) throw new Error(`CoinCap assets: ${assetsRes.status}`)

    type CoinCapAsset = { id: string; priceUsd: string; changePercent24Hr: string }
    const assetsData: { data: CoinCapAsset[] } = await assetsRes.json()

    const prices: PriceMap = {}
    for (const coin of COINS) {
      const capId  = EXCHANGE_SYMBOLS[coin.id].coincapId
      const asset  = assetsData.data.find(a => a.id === capId)
      if (asset) {
        prices[coin.id] = {
          usd:            parseFloat(asset.priceUsd),
          usd_24h_change: parseFloat(asset.changePercent24Hr),
        }
      }
    }

    // CoinCap возвращает только цену в точке — строим псевдо-свечи из price history
    const candles: Record<string, Candle[]> = {}
    for (let i = 0; i < COINS.length; i++) {
      const r = histResults[i]
      if (r.ok) {
        type CapPoint = { priceUsd: string; time: number }
        const hist: { data: CapPoint[] } = await r.json()
        candles[COINS[i].id] = hist.data.map((p, idx, arr) => {
          const close = parseFloat(p.priceUsd)
          const prev  = idx > 0 ? parseFloat(arr[idx - 1].priceUsd) : close
          return {
            time:  Math.floor(p.time / 1000),
            open:  prev,
            high:  Math.max(prev, close) * 1.001,
            low:   Math.min(prev, close) * 0.999,
            close,
          }
        })
      } else {
        candles[COINS[i].id] = []
      }
    }

    return { prices, candles }
  },
}
