import React from 'react'

import { COINS } from '@/shared/config/coins'

import classes from './AddPositionForm.module.scss'

interface Props {
  onAdd: (coinId: string, amount: number, buyPrice: number) => void
}

export function AddPositionForm({ onAdd }: Props) {
  const [coinId, setCoinId] = React.useState<string>(COINS[0].id)
  const [amount, setAmount] = React.useState('')
  const [buyPrice, setBuyPrice] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const n = parseFloat(amount)
    const p = parseFloat(buyPrice)
    if (!n || !p || n <= 0 || p <= 0) return
    onAdd(coinId, n, p)
    setAmount('')
    setBuyPrice('')
  }

  return (
    <form className={classes.form} onSubmit={handleSubmit}>
      <span className={classes.label}>Добавить позицию</span>
      <select
        className={classes.select}
        value={coinId}
        onChange={e => setCoinId(e.target.value)}
      >
        {COINS.map(c => (
          <option key={c.id} value={c.id}>{c.symbol} — {c.name}</option>
        ))}
      </select>
      <div className={classes.grid}>
        <input
          className={classes.input}
          type="number"
          placeholder="Количество"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="any"
        />
        <input
          className={classes.input}
          type="number"
          placeholder="Цена входа $"
          value={buyPrice}
          onChange={e => setBuyPrice(e.target.value)}
          min="0"
          step="any"
        />
      </div>
      <button type="submit" className={classes.btn}>Добавить</button>
    </form>
  )
}
