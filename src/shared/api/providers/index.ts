import { staticProvider }        from './staticProvider'
import { coinGeckoProvider }     from './coinGeckoProvider'
import { binanceProvider }       from './binanceProvider'
import { cryptoCompareProvider } from './cryptoCompareProvider'
import { coinCapProvider }       from './coinCapProvider'
import type { DataProvider, SourceId } from './types'

export type { SourceId, DataProvider, ProviderResult, PriceMap, CandleMap } from './types'

export const PROVIDERS: Record<SourceId, DataProvider> = {
  static:         staticProvider,
  coingecko:      coinGeckoProvider,
  binance:        binanceProvider,
  cryptocompare:  cryptoCompareProvider,
  coincap:        coinCapProvider,
}

// Порядок для автоматического failover
export const FALLBACK_ORDER: SourceId[] = [
  'static',
  'coingecko',
  'binance',
  'cryptocompare',
  'coincap',
]
