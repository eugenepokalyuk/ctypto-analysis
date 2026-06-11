import React from 'react'

import { useSelector } from 'react-redux'

import { SignalBadge } from '@/shared/ui/SignalBadge'
import type { CoinAnalysis } from '@/entities/coin/model/types'
import { FavoriteButton } from '@/features/favorites/ui/FavoriteButton'
import { selectFavoriteIds } from '@/features/favorites/model/selectors'

import classes from './CoinTable.module.scss'

type SortKey = 'symbol' | 'price' | 'change24h' | 'rsi' | 'bb'

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

function bbPct(coin: CoinAnalysis) {
  const range = coin.indicators.bbUpper - coin.indicators.bbLower
  if (range === 0) return 50
  return ((coin.price - coin.indicators.bbLower) / range) * 100
}

export function CoinTable({ coins, selectedId, onSelect }: Props) {
  const favoriteIds = useSelector(selectFavoriteIds)
  const [sortKey, setSortKey]   = React.useState<SortKey>('symbol')
  const [sortAsc, setSortAsc]   = React.useState(true)

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(v => !v)
    else { setSortKey(key); setSortAsc(key === 'symbol') }
  }

  const sorted = [...coins].sort((a, b) => {
    const favA = favoriteIds.includes(a.id) ? -1 : 0
    const favB = favoriteIds.includes(b.id) ? -1 : 0
    if (favA !== favB) return favA - favB

    let va: number | string, vb: number | string
    switch (sortKey) {
      case 'symbol':   va = a.symbol;              vb = b.symbol;              break
      case 'price':    va = a.price;               vb = b.price;               break
      case 'change24h':va = a.change24h;            vb = b.change24h;           break
      case 'rsi':      va = a.indicators.rsi;       vb = b.indicators.rsi;      break
      case 'bb':       va = bbPct(a);               vb = bbPct(b);              break
      default:         va = 0; vb = 0
    }
    const cmp = va < vb ? -1 : va > vb ? 1 : 0
    return sortAsc ? cmp : -cmp
  })

  function Th({ k, label, right }: { k: SortKey; label: string; right?: boolean }) {
    const active = sortKey === k
    return (
      <th
        className={`${classes.th} ${active ? classes.sorted : ''} ${right ? classes.right : ''}`}
        onClick={() => handleSort(k)}
      >
        {label}
        {active && <span className={classes.sortArrow}>{sortAsc ? '↑' : '↓'}</span>}
      </th>
    )
  }

  return (
    <div className={classes.wrap}>
      <table className={classes.table}>
        <thead>
          <tr>
            <th className={classes.th}>#</th>
            <Th k="symbol"    label="Монета" />
            <Th k="price"     label="Цена"    right />
            <Th k="change24h" label="24h"     right />
            <Th k="rsi"       label="RSI"     right />
            <th className={`${classes.th} ${classes.right}`}>MACD</th>
            <Th k="bb"        label="BB%"     right />
            <th className={classes.th}>Сигнал</th>
            <th className={classes.th}>★</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((coin, i) => {
            const up      = coin.change24h >= 0
            const bull    = coin.indicators.macd > coin.indicators.macdSignal
            const rsi     = coin.indicators.rsi
            const rsiCls  = rsi < 40 ? classes.low : rsi > 60 ? classes.high : classes.mid
            const bb      = bbPct(coin).toFixed(0)

            return (
              <tr
                key={coin.id}
                className={`${classes.tr} ${coin.id === selectedId ? classes.active : ''}`}
                onClick={() => onSelect(coin.id)}
              >
                <td className={`${classes.td} ${classes.num}`}>{i + 1}</td>
                <td className={classes.td}>
                  <span className={classes.sym}>{coin.symbol}</span>
                  <br />
                  <span className={classes.name}>{coin.name}</span>
                </td>
                <td className={`${classes.td} ${classes.right} ${classes.price}`}>{fmtPrice(coin.price)}</td>
                <td className={`${classes.td} ${classes.right} ${classes.change} ${up ? classes.up : classes.down}`}>
                  {up ? '+' : ''}{coin.change24h.toFixed(2)}%
                </td>
                <td className={`${classes.td} ${classes.right} ${classes.rsi} ${rsiCls}`}>
                  {rsi.toFixed(1)}
                </td>
                <td className={`${classes.td} ${classes.right} ${classes.macd} ${bull ? classes.bull : classes.bear}`}>
                  {bull ? '▲ Бычий' : '▼ Медвежий'}
                </td>
                <td className={`${classes.td} ${classes.right} ${classes.bb}`}>{bb}%</td>
                <td className={classes.td}><SignalBadge signal={coin.signal} /></td>
                <td className={classes.td} onClick={e => e.stopPropagation()}>
                  <FavoriteButton coinId={coin.id} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
