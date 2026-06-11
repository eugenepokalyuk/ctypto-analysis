import { AnimatePresence, motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'

import { SignalBadge } from '@/shared/ui/SignalBadge'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import { removeEntry, upsertEntry } from '@/entities/portfolio/model/portfolioSlice'
import { selectPortfolioRows, selectPortfolioTotals } from '@/entities/portfolio/model/selectors'
import { AddPositionForm } from '@/features/manage-portfolio/ui/AddPositionForm'

import classes from './PortfolioPanel.module.scss'

const fmtUsd = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

interface Props { marketData: CoinAnalysis[] }

export function PortfolioPanel({ marketData }: Props) {
  const dispatch = useDispatch()
  const rows     = useSelector(selectPortfolioRows(marketData))
  const totals   = useSelector(selectPortfolioTotals(marketData))

  return (
    <div className={classes.wrap}>
      <div className={classes.summary}>
        <p className={classes.summaryTitle}>Мой портфель</p>

        {rows.length > 0 && (
          <div className={classes.summaryGrid}>
            <div className={classes.statCard}>
              <p className={classes.statLabel}>Стоимость</p>
              <p className={classes.statValue}>{fmtUsd(totals.totalValue)}</p>
            </div>
            <div className={classes.statCard}>
              <p className={classes.statLabel}>P&L</p>
              <p className={`${classes.statValue} ${totals.totalPnl >= 0 ? classes.positive : classes.negative}`}>
                {totals.totalPnl >= 0 ? '+' : ''}{fmtUsd(totals.totalPnl)}
              </p>
            </div>
          </div>
        )}

        {rows.length === 0 && (
          <p className={classes.empty}>Добавь позиции для анализа</p>
        )}

        <AnimatePresence initial={false}>
          <div className={classes.rows}>
            {rows.map(row => (
              <motion.div
                key={row.coinId}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 35 }}
                className={classes.row}
              >
                <div className={classes.rowLeft}>
                  <div className={classes.rowSymbol}>
                    {row.symbol}
                    <SignalBadge signal={row.signal} />
                  </div>
                  <p className={classes.rowSub}>
                    {row.amount} × ${row.currentPrice.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </p>
                </div>
                <div className={classes.rowRight}>
                  <p className={classes.rowValue}>{fmtUsd(row.currentValue)}</p>
                  <p className={`${classes.rowPnl} ${row.pnl >= 0 ? classes.pos : classes.neg}`}>
                    {row.pnl >= 0 ? '+' : ''}{row.pnlPct.toFixed(1)}%
                  </p>
                </div>
                <button
                  className={classes.removeBtn}
                  onClick={() => dispatch(removeEntry(row.coinId))}
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>

      <div className={classes.formCard}>
        <AddPositionForm
          onAdd={(coinId, amount, buyPrice) =>
            dispatch(upsertEntry({ coinId, amount, buyPrice }))
          }
        />
      </div>
    </div>
  )
}
