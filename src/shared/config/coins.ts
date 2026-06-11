export const COINS = [
  { id: 'bitcoin',     symbol: 'BTC',  name: 'Bitcoin' },
  { id: 'ethereum',    symbol: 'ETH',  name: 'Ethereum' },
  { id: 'binancecoin', symbol: 'BNB',  name: 'BNB' },
  { id: 'solana',      symbol: 'SOL',  name: 'Solana' },
  { id: 'ripple',      symbol: 'XRP',  name: 'XRP' },
  { id: 'cardano',     symbol: 'ADA',  name: 'Cardano' },
  { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche' },
  { id: 'polkadot',    symbol: 'DOT',  name: 'Polkadot' },
  { id: 'chainlink',   symbol: 'LINK', name: 'Chainlink' },
  { id: 'uniswap',     symbol: 'UNI',  name: 'Uniswap' },
  { id: 'dash',        symbol: 'DASH', name: 'Dash' },
  { id: 'zcash',       symbol: 'ZEC',  name: 'Zcash' },
] as const

export type CoinId = typeof COINS[number]['id']
