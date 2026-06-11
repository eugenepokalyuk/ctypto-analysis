import { useSelector } from 'react-redux'

import { selectFavoriteIds } from '@/features/favorites/model/selectors'
import { CoinCard } from '@/entities/coin/ui/CoinCard'
import { CoinCardSkeleton } from '@/shared/ui/Skeleton'
import type { CoinAnalysis } from '@/entities/coin/model/types'

import classes from './CoinGrid.module.scss'

interface Props {
  coins: CoinAnalysis[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CoinGrid({ coins, loading, selectedId, onSelect }: Props) {
  const favoriteIds = useSelector(selectFavoriteIds)

  if (loading) {
    return (
      <div className={classes.grid}>
        {Array.from({ length: 12 }).map((_, i) => <CoinCardSkeleton key={i} />)}
      </div>
    )
  }

  const favorites = coins.filter(c => favoriteIds.includes(c.id))
  const rest      = coins.filter(c => !favoriteIds.includes(c.id))

  return (
    <div>
      {favorites.length > 0 && (
        <>
          <p className={classes.sectionLabel}>★ Избранное</p>
          <div className={classes.grid}>
            {favorites.map((coin, i) => (
              <CoinCard
                key={coin.id}
                coin={coin}
                index={i}
                selected={coin.id === selectedId}
                onClick={() => onSelect(coin.id)}
              />
            ))}
          </div>
          <p className={classes.sectionLabel}>Все монеты</p>
        </>
      )}

      <div className={classes.grid}>
        {rest.map((coin, i) => (
          <CoinCard
            key={coin.id}
            coin={coin}
            index={favorites.length + i}
            selected={coin.id === selectedId}
            onClick={() => onSelect(coin.id)}
          />
        ))}
      </div>
    </div>
  )
}
