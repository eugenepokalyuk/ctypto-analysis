import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { SignalBadge } from '@/shared/ui/SignalBadge'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import { FavoriteButton } from '@/features/favorites/ui/FavoriteButton'
import { selectFavoriteIds } from '@/features/favorites/model/selectors'

import classes from './CoinList.module.scss'

interface Props {
  coins:      CoinAnalysis[]
  selectedId: string | null
  onSelect:   (id: string) => void
}

function fmtPrice(n: number) {
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
  if (n >= 1)    return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 4 })}`
}

export function CoinList({ coins, selectedId, onSelect }: Props) {
  const favoriteIds = useSelector(selectFavoriteIds)
  const sorted = [
    ...coins.filter(c => favoriteIds.includes(c.id)),
    ...coins.filter(c => !favoriteIds.includes(c.id)),
  ]

  return (
    <div className={classes.list}>
      {sorted.map((coin, i) => {
        const up = coin.change24h >= 0
        return (
          <motion.div
            key={coin.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02, type: 'spring', stiffness: 340, damping: 28 }}
            className={`${classes.row} ${coin.id === selectedId ? classes.active : ''}`}
            onClick={() => onSelect(coin.id)}
          >
            <span className={classes.star} onClick={e => e.stopPropagation()}>
              <FavoriteButton coinId={coin.id} />
            </span>
            <span className={classes.symbol}>{coin.symbol}</span>
            <span className={classes.name}>{coin.name}</span>
            <span className={classes.price}>{fmtPrice(coin.price)}</span>
            <span className={`${classes.change} ${up ? classes.up : classes.down}`}>
              {up ? '+' : ''}{coin.change24h.toFixed(2)}%
            </span>
            <span className={classes.rsi}>RSI {coin.indicators.rsi.toFixed(0)}</span>
            <span className={classes.badge}><SignalBadge signal={coin.signal} /></span>
          </motion.div>
        )
      })}
    </div>
  )
}
