import { COINS } from '@/shared/config/coins'
import { EXCHANGE_SYMBOLS } from '@/shared/config/exchangeSymbols'
import type { Candle } from '@/shared/model/types'

import type { DataProvider, PriceMap, ProviderResult } from './types'

const BASE    = 'https://min-api.cryptocompare.com/data'
const FSYMS   = COINS.map(c => EXCHANGE_SYMBOLS[c.id].ccSymbol).join(',')

export const cryptoCompareProvider: DataProvider = {
  id:          'cryptocompare',
  name:        'CryptoCompare',
  description: 'Агрегированные данные от множества бирж. Free: 100k req/мес без ключа.',

  async fetch(): Promise<ProviderResult> {
    const [pricesRes, ...histResults] = await Promise.all([
      fetch(`${BASE}/pricemultifull?fsyms=${FSYMS}&tsyms=USD`),
      ...COINS.map(c =>
        fetch(`${BASE}/v2/histoday?fsym=${EXCHANGE_SYMBOLS[c.id].ccSymbol}&tsym=USD&limit=30`)
      ),
    ])

    if (!pricesRes.ok) throw new Error(`CryptoCompare prices: ${pricesRes.status}`)

    type CCRaw = { RAW: Record<string, { USD: { PRICE: number; CHANGEPCT24HOUR: number } }> }
    const priceData: CCRaw = await pricesRes.json()

    const prices: PriceMap = {}
    for (const coin of COINS) {
      const sym  = EXCHANGE_SYMBOLS[coin.id].ccSymbol
      const raw  = priceData.RAW?.[sym]?.USD
      if (raw) {
        prices[coin.id] = { usd: raw.PRICE, usd_24h_change: raw.CHANGEPCT24HOUR }
      }
    }

    const candles: Record<string, Candle[]> = {}
    for (let i = 0; i < COINS.length; i++) {
      const r = histResults[i]
      if (r.ok) {
        type CCOhlc = { time: number; open: number; high: number; low: number; close: number }
        const hist: { Data: { Data: CCOhlc[] } } = await r.json()
        candles[COINS[i].id] = (hist.Data?.Data ?? []).map(d => ({
          time: d.time, open: d.open, high: d.high, low: d.low, close: d.close,
        }))
      } else {
        candles[COINS[i].id] = []
      }
    }

    return { prices, candles }
  },
}
