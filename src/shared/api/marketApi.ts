import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { COINS } from '@/shared/config/coins'
import { computeIndicators, generateSignal } from '@/entities/coin/model/indicators'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import { setActiveSource } from '@/features/data-source/model/dataSourceSlice'

import { FALLBACK_ORDER, PROVIDERS } from './providers'
import type { CandleMap, PriceMap, SourceId } from './providers'

// ─── Сборка CoinAnalysis ─────────────────────────────────────────────────

function buildAnalyses(prices: PriceMap, candleMap: CandleMap): CoinAnalysis[] {
  return COINS.map(coin => {
    const price     = prices[coin.id]?.usd ?? 0
    const change24h = prices[coin.id]?.usd_24h_change ?? 0
    const candles   = candleMap[coin.id] ?? []
    const fallback  = { rsi: 50, macd: 0, macdSignal: 0, macdHistogram: 0, bbUpper: price * 1.02, bbMiddle: price, bbLower: price * 0.98 }
    const indicators = computeIndicators(candles) ?? fallback
    const { signal, reasons } = generateSignal(indicators, price)
    return { id: coin.id, symbol: coin.symbol, name: coin.name, price, change24h, signal, signalReasons: reasons, indicators, candles }
  })
}

// ─── RTK Query API ────────────────────────────────────────────────────────

export const marketApi = createApi({
  reducerPath:        'marketApi',
  baseQuery:          fetchBaseQuery({ baseUrl: '' }),
  keepUnusedDataFor:  300,

  endpoints: builder => ({

    getMarketAnalysis: builder.query<CoinAnalysis[], SourceId>({
      queryFn: async (preferredSource, thunkApi) => {
        // Строим порядок: сначала предпочтительный, затем остальные по порядку
        const order = [
          preferredSource,
          ...FALLBACK_ORDER.filter(id => id !== preferredSource),
        ]

        for (const sourceId of order) {
          try {
            const result = await PROVIDERS[sourceId].fetch()
            thunkApi.dispatch(setActiveSource(sourceId))
            return { data: buildAnalyses(result.prices, result.candles) }
          } catch (e) {
            console.warn(`[${sourceId}] failed:`, e)
            // Продолжаем к следующему провайдеру
          }
        }

        return { error: { status: 'CUSTOM_ERROR', error: 'Все источники данных недоступны' } }
      },
    }),

  }),
})

export const { useGetMarketAnalysisQuery } = marketApi
