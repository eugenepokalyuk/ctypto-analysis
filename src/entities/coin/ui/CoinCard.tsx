import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'

import { FavoriteButton } from '@/features/favorites/ui/FavoriteButton'
import { selectIsFavorite } from '@/features/favorites/model/selectors'
import { SignalBadge } from '@/shared/ui/SignalBadge'

import type { CoinAnalysis } from '../model/types'
import classes from './CoinCard.module.scss'

interface Props {
  coin: CoinAnalysis
  selected?: boolean
  index?: number
  onClick: () => void
}

function fmtPrice(n: number) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1)    return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

const GLOW: Record<string, string> = {
  STRONG_BUY:  classes.glowBuy,
  STRONG_SELL: classes.glowSell,
}

export function CoinCard({ coin, selected = false, index = 0, onClick }: Props) {
  const isFav    = useSelector(selectIsFavorite(coin.id))
  const up       = coin.change24h >= 0
  const bullMacd = coin.indicators.macd > coin.indicators.macdSignal
  const rsiClass = coin.indicators.rsi < 40 ? classes.low : coin.indicators.rsi > 60 ? classes.high : classes.mid
  const glowClass = GLOW[coin.signal] ?? ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 320, damping: 28 }}
      className={[classes.card, selected ? classes.selected : '', glowClass, isFav ? classes.favActive : ''].join(' ')}
    >
      {/* Кликабельная область — занимает весь блок кроме кнопки звезды */}
      <button className={classes.clickArea} onClick={onClick} aria-label={`Открыть ${coin.name}`}>
        <div className={classes.header}>
          <div className={classes.titleGroup}>
            <p className={classes.symbol}>{coin.symbol}</p>
            <p className={classes.name}>{coin.name}</p>
          </div>
          <div className={classes.headerRight}>
            <SignalBadge signal={coin.signal} />
            <FavoriteButton coinId={coin.id} />
          </div>
        </div>

        <p className={classes.price}>${fmtPrice(coin.price)}</p>

        <div className={classes.meta}>
          <span className={`${classes.change} ${up ? classes.up : classes.down}`}>
            {up ? '+' : ''}{coin.change24h.toFixed(2)}%
          </span>
          <span className={`${classes.macd} ${bullMacd ? classes.bull : classes.bear}`}>
            {bullMacd ? '▲' : '▼'} MACD
          </span>
        </div>

        <div className={classes.rsiBar}>
          <motion.div
            className={`${classes.rsiFill} ${rsiClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${coin.indicators.rsi}%` }}
            transition={{ delay: index * 0.03 + 0.25, duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className={classes.rsiLabel}>RSI {coin.indicators.rsi.toFixed(0)}</p>
      </button>
    </motion.div>
  )
}
