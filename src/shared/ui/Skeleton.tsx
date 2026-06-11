import { motion } from 'framer-motion'

import classes from './Skeleton.module.scss'

const pulse = {
  animate: { opacity: [0.3, 0.7, 0.3] },
  transition: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' as const },
}

export function Skeleton({ style, className }: { style?: React.CSSProperties; className?: string }) {
  return <motion.div className={`${classes.base}${className ? ` ${className}` : ''}`} style={style} {...pulse} />
}

export function CoinCardSkeleton() {
  return (
    <div className={classes.cardWrap}>
      <div className={classes.skHeader}>
        <div>
          <Skeleton style={{ width: 38, height: 13 }} />
          <Skeleton style={{ width: 54, height: 10, marginTop: 1 }} />
        </div>
        <Skeleton style={{ width: 62, height: 18, borderRadius: 100 }} />
      </div>

      <Skeleton style={{ width: 80, height: 14 }} />

      <div className={classes.skMeta}>
        <Skeleton style={{ width: 44, height: 11 }} />
        <Skeleton style={{ width: 48, height: 10 }} />
      </div>

      <Skeleton className={classes.skRsiBar} style={{ width: '100%', height: 2 }} />
      <Skeleton className={classes.skRsiLabel} style={{ width: 32, height: 9 }} />
    </div>
  )
}
