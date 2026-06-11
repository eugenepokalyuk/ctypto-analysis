import { motion } from 'framer-motion'

import type { Signal } from '@/shared/model/types'

import classes from './SignalBadge.module.scss'

const CLASS_MAP: Record<Signal, string> = {
  STRONG_BUY:  classes.strongBuy,
  BUY:         classes.buy,
  HOLD:        classes.hold,
  SELL:        classes.sell,
  STRONG_SELL: classes.strongSell,
}

const LABEL: Record<Signal, string> = {
  STRONG_BUY:  'STRONG BUY',
  BUY:         'BUY',
  HOLD:        'HOLD',
  SELL:        'SELL',
  STRONG_SELL: 'STRONG SELL',
}

const PULSE_SIGNALS = new Set<Signal>(['STRONG_BUY', 'STRONG_SELL'])

export function SignalBadge({ signal }: { signal: Signal }) {
  return (
    <motion.span
      initial={{ scale: 0.75, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
      className={`${classes.badge} ${CLASS_MAP[signal]}`}
    >
      {PULSE_SIGNALS.has(signal) && (
        <motion.span
          className={classes.pulse}
          animate={{ scale: [1, 1.6], opacity: [0.5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
        />
      )}
      {LABEL[signal]}
    </motion.span>
  )
}
