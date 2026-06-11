import React from 'react'
import { motion } from 'framer-motion'
import { ColorType, createChart } from 'lightweight-charts'

import { SignalBadge } from '@/shared/ui/SignalBadge'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import type { SignalReason } from '@/shared/model/types'

import classes from './CoinDetail.module.scss'

interface Props {
  coin: CoinAnalysis
}

function fmtPrice(n: number) {
  if (n >= 1000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1)    return n.toLocaleString('en-US', { maximumFractionDigits: 2 })
  return n.toLocaleString('en-US', { maximumFractionDigits: 4 })
}

const SENTIMENT_ICON: Record<SignalReason['sentiment'], string> = {
  bullish: '↑',
  bearish: '↓',
  neutral: '—',
}

const listVariants = {
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const itemVariants = {
  hidden:  { opacity: 0, x: -14 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring' as const, stiffness: 420, damping: 32 } },
}

function useChart(coin: CoinAnalysis) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!ref.current || !coin.candles.length) return

    const chart = createChart(ref.current, {
      layout: { background: { type: ColorType.Solid, color: '#161922' }, textColor: '#8b92a8' },
      grid:   { vertLines: { color: '#252836' }, horzLines: { color: '#252836' } },
      crosshair:       { mode: 1 },
      rightPriceScale: { borderColor: '#252836' },
      timeScale:       { borderColor: '#252836', timeVisible: true },
      width:  ref.current.clientWidth,
      height: 280,
    })

    const candles = chart.addCandlestickSeries({
      upColor:        '#22c55e', downColor:        '#ef4444',
      borderUpColor:  '#22c55e', borderDownColor:  '#ef4444',
      wickUpColor:    '#22c55e', wickDownColor:    '#ef4444',
    })

    candles.setData(
      coin.candles.map(c => ({
        time: c.time as unknown as string,
        open: c.open, high: c.high, low: c.low, close: c.close,
      }))
    )

    const last = coin.candles.at(-1)
    if (last) {
      const t = last.time as unknown as string
      chart.addLineSeries({ color: '#6366f1', lineWidth: 1, title: 'Mid' })
        .setData([{ time: t, value: coin.indicators.bbMiddle }])
      chart.addLineSeries({ color: 'rgba(99,102,241,0.35)', lineWidth: 1, lineStyle: 2 })
        .setData([{ time: t, value: coin.indicators.bbUpper }])
      chart.addLineSeries({ color: 'rgba(99,102,241,0.35)', lineWidth: 1, lineStyle: 2 })
        .setData([{ time: t, value: coin.indicators.bbLower }])
    }

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: ref.current!.clientWidth })
    })
    ro.observe(ref.current)

    return () => { chart.remove(); ro.disconnect() }
  }, [coin])

  return ref
}

export function CoinDetail({ coin }: Props) {
  const chartRef = useChart(coin)
  const up       = coin.change24h >= 0
  const rsiClass = coin.indicators.rsi < 40 ? classes.buy : coin.indicators.rsi > 60 ? classes.sell : classes.hold
  const macdBull = coin.indicators.macdHistogram > 0
  const bbPct    = ((coin.price - coin.indicators.bbLower) / (coin.indicators.bbUpper - coin.indicators.bbLower)) * 100

  return (
    <div className={classes.wrap}>
      <div className={classes.header}>
        <div className={classes.titleGroup}>
          <h2 className={classes.title}>{coin.symbol}/USDT</h2>
          <p className={classes.subtitle}>{coin.name} · 30 дней</p>
        </div>
        <div className={classes.priceGroup}>
          <p className={classes.price}>${fmtPrice(coin.price)}</p>
          <p className={`${classes.change} ${up ? classes.up : classes.down}`}>
            {up ? '+' : ''}{coin.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <SignalBadge signal={coin.signal} />
      </div>

      <div className={classes.chartBox} ref={chartRef} />

      <div className={classes.indicators}>
        <div className={classes.indicatorCard}>
          <p className={classes.indicatorLabel}>RSI (14)</p>
          <p className={`${classes.indicatorValue} ${rsiClass}`}>{coin.indicators.rsi.toFixed(1)}</p>
        </div>
        <div className={classes.indicatorCard}>
          <p className={classes.indicatorLabel}>MACD</p>
          <p className={`${classes.indicatorValue} ${macdBull ? classes.buy : classes.sell}`}>
            {macdBull ? '▲ Бычий' : '▼ Медвежий'}
          </p>
        </div>
        <div className={classes.indicatorCard}>
          <p className={classes.indicatorLabel}>BB %B</p>
          <p className={`${classes.indicatorValue} ${classes.neutral}`}>{bbPct.toFixed(0)}%</p>
        </div>
      </div>

      <div className={classes.reasons}>
        <p className={classes.reasonsTitle}>Причины сигнала</p>
        <motion.ul
          className={classes.reasonsList}
          initial="hidden"
          animate="visible"
          key={coin.id}
          variants={listVariants}
        >
          {coin.signalReasons.map((r, i) => (
            <motion.li
              key={i}
              className={`${classes.reasonCard} ${classes[r.sentiment]}`}
              variants={itemVariants}
            >
              <span className={classes.reasonBadge}>{r.indicator}</span>
              <div className={classes.reasonBody}>
                <span className={classes.reasonLabel}>{r.label}</span>
                <span className={classes.reasonDesc}>{r.description}</span>
              </div>
              <span className={classes.reasonIcon}>{SENTIMENT_ICON[r.sentiment]}</span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  )
}
