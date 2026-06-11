// Маппинг CoinGecko ID → символы на разных платформах
export const EXCHANGE_SYMBOLS: Record<string, {
  binance: string       // BTCUSDT формат
  ccSymbol: string      // CryptoCompare: BTC
  coincapId: string     // CoinCap: bitcoin
}> = {
  'bitcoin':     { binance: 'BTCUSDT',  ccSymbol: 'BTC',  coincapId: 'bitcoin' },
  'ethereum':    { binance: 'ETHUSDT',  ccSymbol: 'ETH',  coincapId: 'ethereum' },
  'binancecoin': { binance: 'BNBUSDT',  ccSymbol: 'BNB',  coincapId: 'binance-coin' },
  'solana':      { binance: 'SOLUSDT',  ccSymbol: 'SOL',  coincapId: 'solana' },
  'ripple':      { binance: 'XRPUSDT',  ccSymbol: 'XRP',  coincapId: 'ripple' },
  'cardano':     { binance: 'ADAUSDT',  ccSymbol: 'ADA',  coincapId: 'cardano' },
  'avalanche-2': { binance: 'AVAXUSDT', ccSymbol: 'AVAX', coincapId: 'avalanche' },
  'polkadot':    { binance: 'DOTUSDT',  ccSymbol: 'DOT',  coincapId: 'polkadot' },
  'chainlink':   { binance: 'LINKUSDT', ccSymbol: 'LINK', coincapId: 'chainlink' },
  'uniswap':     { binance: 'UNIUSDT',  ccSymbol: 'UNI',  coincapId: 'uniswap' },
  'dash':        { binance: 'DASHUSDT', ccSymbol: 'DASH', coincapId: 'dash' },
  'zcash':       { binance: 'ZECUSDT',  ccSymbol: 'ZEC',  coincapId: 'zcash' },
}
